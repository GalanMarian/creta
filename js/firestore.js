// Vorbim cu Firestore prin API-ul REST, nu prin SDK.
//
// De ce: SDK-ul e ~300 KB și își aduce propriul strat de persistență, care se
// bate cu service worker-ul nostru. Nouă ne trebuie o colecție mică, citită
// întreagă la deschidere și scrisă document cu document. Cu fetch, tot stratul
// ăsta are 120 de linii, se cachează simplu și se înțelege dintr-o citire.
//
// Fiecare înregistrare stă într-un document din colecția `creta`, cu:
//   tip          — discriminatorul (cheltuiala, vot, pachet, km, amintire…)
//   actualizatLa — ca să se vadă în consolă ce s-a mișcat ultima dată
//   d            — înregistrarea întreagă, ca JSON
//
// JSON într-un câmp, în loc de câmpuri tipizate, fiindcă Firestore nu ține
// tablouri în tablouri, iar noi avem `participanti` și `achitat`. Așa dispar
// și conversiile de tip, cu tot cu greșelile lor.

export const CONFIG = {
  proiect: 'creta-2c92e',
  colectie: 'creta',
  cheie: 'AIzaSyAO3-zvTHMs_O5aD8Q74YfFhuElIYmU90k',
};

const BAZA = `https://firestore.googleapis.com/v1/projects/${CONFIG.proiect}/databases/(default)/documents`;

/** Numele documentului → id-ul nostru. */
function idDinNume(nume) {
  return String(nume || '').split('/').pop();
}

function documentInInregistrare(doc) {
  const brut = doc?.fields?.d?.stringValue;
  if (!brut) return null;
  try {
    const inr = JSON.parse(brut);
    return { ...inr, id: inr.id || idDinNume(doc.name) };
  } catch {
    return null; // un document stricat nu trebuie să dărâme sincronizarea
  }
}

function inregistrareInDocument(inr) {
  return {
    fields: {
      tip: { stringValue: String(inr.tip || '') },
      actualizatLa: { stringValue: new Date().toISOString() },
      d: { stringValue: JSON.stringify(inr) },
    },
  };
}

/** Citește toată colecția. Paginează singură, dacă apucă să crească. */
export async function citesteTot(semnal) {
  const tot = [];
  let token = '';
  do {
    const url = new URL(`${BAZA}/${CONFIG.colectie}`);
    url.searchParams.set('key', CONFIG.cheie);
    url.searchParams.set('pageSize', '300');
    if (token) url.searchParams.set('pageToken', token);

    const r = await fetch(url, { signal: semnal });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      throw new EroareFirestore(r.status, text);
    }
    const date = await r.json();
    for (const doc of date.documents || []) {
      const inr = documentInInregistrare(doc);
      if (inr) tot.push(inr);
    }
    token = date.nextPageToken || '';
  } while (token);

  return tot;
}

/** Scrie (sau suprascrie) un document. PATCH creează documentul dacă lipsește. */
export async function scrie(inregistrare) {
  if (!inregistrare?.id) throw new Error('Înregistrarea nu are id.');
  const url = new URL(`${BAZA}/${CONFIG.colectie}/${encodeURIComponent(inregistrare.id)}`);
  url.searchParams.set('key', CONFIG.cheie);

  const r = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inregistrareInDocument(inregistrare)),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new EroareFirestore(r.status, text);
  }
  return true;
}

export class EroareFirestore extends Error {
  constructor(stare, text) {
    super(`Firestore a răspuns ${stare}`);
    this.stare = stare;
    this.detaliu = text;
    this.esteRegula = stare === 403 || stare === 401;
  }

  get explicatie() {
    if (this.esteRegula) {
      return 'Regulile bazei de date nu permit accesul. Trebuie lipit conținutul din firestore.rules în consola Firebase.';
    }
    if (this.stare === 404) return 'Proiectul sau colecția nu există.';
    if (this.stare >= 500) return 'Firebase are o problemă de partea lor. Se reîncearcă singur.';
    return 'Cerere respinsă de Firestore.';
  }
}

/** Id nou, scurt și fără coliziuni practice. */
export function idNou(prefix = 'x') {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${t}${r}`;
}
