// Starea aplicației: local întâi, rețeaua pe urmă.
//
// Pornim din localStorage, ca pagina să fie utilă instantaneu și fără semnal —
// în chei sau cu roaming britanic închis. Scrierile intră imediat în starea
// locală și pleacă spre Firestore printr-o coadă care se reia singură. Id-urile
// sunt deterministe (voturi, pachet) sau generate de noi (cheltuieli,
// amintiri), deci o reîncercare nu poate dubla nimic.

import { citesteTot, scrie, idNou, EroareFirestore } from './firestore.js';

const CHEIE_DATE = 'creta.date.v1';
const CHEIE_COADA = 'creta.coada.v1';

let inregistrari = new Map();
let coada = [];
let abonati = new Set();
let sincronizare = { stare: 'pornire', cand: null, eroare: null, inCoada: 0 };
let cronometru = null;

// ─────────────────────────────── local ───────────────────────────────

function citesteLocal(cheie, implicit) {
  try {
    const brut = localStorage.getItem(cheie);
    return brut ? JSON.parse(brut) : implicit;
  } catch {
    return implicit;
  }
}

function scrieLocal(cheie, valoare) {
  try {
    localStorage.setItem(cheie, JSON.stringify(valoare));
  } catch {
    // spațiu plin sau navigare privată — aplicația merge, doar nu ține minte
  }
}

function salveaza() {
  scrieLocal(CHEIE_DATE, [...inregistrari.values()]);
  scrieLocal(CHEIE_COADA, coada);
}

function anunta() {
  sincronizare.inCoada = coada.length;
  for (const fn of abonati) {
    try { fn(); } catch (e) { console.error('abonat picat', e); }
  }
}

// ─────────────────────────────── citire ───────────────────────────────

export function toate(tip) {
  const lista = [...inregistrari.values()];
  return tip ? lista.filter((i) => i.tip === tip) : lista;
}

export function una(id) {
  return inregistrari.get(id) || null;
}

export function stareSincronizare() {
  return { ...sincronizare };
}

export function laSchimbare(fn) {
  abonati.add(fn);
  return () => abonati.delete(fn);
}

// ─────────────────────────────── scriere ───────────────────────────────

function pune(inregistrare) {
  inregistrari.set(inregistrare.id, inregistrare);
  coada = coada.filter((c) => c.id !== inregistrare.id);
  coada.push(inregistrare);
  salveaza();
  anunta();
  goleseteCoada();
  return inregistrare;
}

/** Înregistrare nouă, cu id generat. */
export function adauga(tip, date) {
  return pune({
    ...date,
    id: idNou(tip),
    tip,
    creatLa: new Date().toISOString(),
  });
}

/** Înregistrare cu id fix — al doilea apel suprascrie primul (voturi, bife). */
export function seteaza(id, tip, date) {
  const veche = inregistrari.get(id);
  return pune({
    ...date,
    id,
    tip,
    creatLa: veche?.creatLa || new Date().toISOString(),
  });
}

export function modifica(id, schimbari) {
  const veche = inregistrari.get(id);
  if (!veche) return null;
  return pune({ ...veche, ...schimbari });
}

/** Ștergere logică. Regulile Firestore nu permit ștergerea adevărată. */
export function sterge(id) {
  return modifica(id, { sters: true });
}

// ────────────────────────────── rețeaua ──────────────────────────────

async function goleseteCoada() {
  if (!coada.length || !navigator.onLine) return;
  if (sincronizare.stare === 'trimite') return;

  sincronizare.stare = 'trimite';
  anunta();

  const deTrimis = [...coada];
  let eroare = null;

  for (const inr of deTrimis) {
    try {
      await scrie(inr);
      coada = coada.filter((c) => c.id !== inr.id);
      salveaza();
    } catch (e) {
      eroare = e;
      break; // dacă una cade, probabil cad toate — reîncercăm mai târziu
    }
  }

  sincronizare.stare = eroare ? 'eroare' : 'gata';
  sincronizare.eroare = eroare ? (eroare.explicatie || eroare.message) : null;
  if (!eroare) sincronizare.cand = new Date().toISOString();
  anunta();
}

/** Trage tot din Firestore și îmbină cu ce avem local. */
export async function sincronizeaza() {
  if (!navigator.onLine) {
    sincronizare.stare = 'offline';
    anunta();
    return;
  }

  sincronizare.stare = 'citeste';
  anunta();

  try {
    const dinRetea = await citesteTot();
    const inCoada = new Set(coada.map((c) => c.id));

    for (const inr of dinRetea) {
      // ce așteaptă să plece e mai nou decât ce vine din rețea
      if (inCoada.has(inr.id)) continue;
      inregistrari.set(inr.id, inr);
    }

    salveaza();
    sincronizare.stare = 'gata';
    sincronizare.cand = new Date().toISOString();
    sincronizare.eroare = null;
    anunta();

    await goleseteCoada();
  } catch (e) {
    sincronizare.stare = 'eroare';
    sincronizare.eroare = e instanceof EroareFirestore
      ? e.explicatie : 'Nu se poate ajunge la baza de date.';
    anunta();
  }
}

export function porneste() {
  for (const inr of citesteLocal(CHEIE_DATE, [])) {
    if (inr && inr.id) inregistrari.set(inr.id, inr);
  }
  coada = citesteLocal(CHEIE_COADA, []).filter((c) => c && c.id);
  sincronizare.inCoada = coada.length;

  sincronizeaza();

  // la revenirea în fereastră, la revenirea netului, și din cinci în cinci minute
  window.addEventListener('online', () => sincronizeaza());
  window.addEventListener('offline', () => {
    sincronizare.stare = 'offline';
    anunta();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sincronizeaza();
  });
  clearInterval(cronometru);
  cronometru = setInterval(() => {
    if (!document.hidden) sincronizeaza();
  }, 5 * 60 * 1000);
}

/** Tot ce s-a strâns, pentru butonul de copie de siguranță. */
export function exporta() {
  return {
    aplicatie: 'Creta 2026',
    exportatLa: new Date().toISOString(),
    inregistrari: [...inregistrari.values()],
  };
}

/** Doar pentru teste în browser. */
export function _reseteaza() {
  inregistrari = new Map();
  coada = [];
  sincronizare = { stare: 'pornire', cand: null, eroare: null, inCoada: 0 };
}
