// Prima pagină răspunde la o singură întrebare: ce urmează acum.
// Înainte de plecare, numărătoarea inversă și avertismentele nerezolvate.
// În timpul excursiei, ziua de azi și următorul lucru cu oră.

import { el, frag, capSectiune, eticheta, textAldin, paine } from '../ui.js';
import * as stare from '../stare.js';
import { euPersoana } from '../identitate.js';
import { numePersoana } from '../date/grup.js';
import { esteDeblocat } from '../secrete.js';
import { ZILE, KM_TOTAL_ESTIMAT } from '../date/itinerariu.js';
import { PLECARE } from '../date/zbor.js';
import { avertismenteOrdonate, numaraNerezolvate, SEVERITATI } from '../date/avertismente.js';
import { rezervariDin } from '../date/rezervari-necesare.js';
import { esteRezolvat, rezolva, cineLAFacut } from '../fapte.js';
import { cazareaLaData } from '../date/cazare.js';
import { ziuaCurenta, ceUrmeaza, acumSeIntampla, moment, lantJoi } from '../lib/itinerar.js';
import { raspas, numeZi, dataLunga, durata, euro, km } from '../lib/format.js';
import { totaluri } from '../lib/split.js';

const ID_SETARE = 'setare_avertismente';

function rezolvate() {
  return stare.una(ID_SETARE)?.rezolvate || {};
}

/**
 * Un avertisment legat de un „fapt" (masa mutată, al doilea șofer) folosește
 * bifa comună — aceeași care apare în „De rezervat" și în pachet. Restul au
 * bifa lor locală.
 */
function avertismentRezolvat(a) {
  return a.fapt ? esteRezolvat(a.fapt) : !!rezolvate()[a.id];
}

function comutaRezolvat(a, valoare) {
  if (a.fapt) {
    rezolva(a.fapt, valoare);
    paine(valoare ? 'Bifat peste tot: și în „De rezervat", și în pachet' : 'Readus în listă, peste tot');
    return;
  }
  const acum = { ...rezolvate() };
  if (valoare) acum[a.id] = true;
  else delete acum[a.id];
  stare.seteaza(ID_SETARE, 'setare', { rezolvate: acum });
  paine(valoare ? 'Bifat ca rezolvat' : 'Readus în listă');
}

// ─────────────────────────────── eroul ───────────────────────────────

function ceas() {
  const plecare = moment(PLECARE.data, PLECARE.ora);
  const parti = [
    ['zile', 'zile'], ['ore', 'ore'], ['minute', 'min'], ['secunde', 'sec'],
  ];
  const noduri = {};

  const cutie = el('div', {
    class: 'ceas', dataset: { ceas: '1' },
    on: {
      tic: () => {
        const r = raspas(plecare - new Date());
        for (const [cheie] of parti) {
          noduri[cheie].textContent = String(r[cheie]).padStart(2, '0');
        }
      },
    },
  });

  const r = raspas(plecare - new Date());
  for (const [cheie, et] of parti) {
    noduri[cheie] = el('div', { class: 'ceas-nr' }, String(r[cheie]).padStart(2, '0'));
    cutie.append(el('div', { class: 'ceas-parte' }, noduri[cheie], el('div', { class: 'ceas-et' }, et)));
  }
  return cutie;
}

function erou() {
  const acum = new Date();
  const zi = ziuaCurenta(ZILE, acum);
  const eu = euPersoana();
  const salut = eu ? `Salut, ${eu.nume}` : 'Creta';

  if (zi) {
    const cazare = cazareaLaData(zi.data);
    const urmeaza = ceUrmeaza(ZILE, acum);
    return el('div', { class: 'erou' },
      el('p', { class: 'erou-supra' }, `${salut} · ziua ${zi.numar} din 6`),
      el('h2', { class: 'erou-titlu' }, zi.titlu),
      el('p', { class: 'erou-sub' }, zi.rezumat),
      urmeaza ? el('div', { style: 'margin-top:16px;padding:12px 13px;background:rgba(255,255,255,.16);border-radius:11px' },
        el('div', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:.07em;opacity:.82;font-weight:650' }, 'Urmează'),
        el('div', { style: 'margin-top:3px;font-size:15px;font-weight:620' }, `${urmeaza.ora} — ${urmeaza.text}`),
        urmeaza.detaliu ? el('div', { style: 'margin-top:2px;font-size:13px;opacity:.9' }, urmeaza.detaliu) : null,
      ) : null,
      cazare ? el('p', { style: 'margin-top:12px;font-size:13px;opacity:.88' }, `Dormim la ${cazare.nume}, ${cazare.localitate}`) : null,
    );
  }

  const plecare = moment(PLECARE.data, PLECARE.ora);
  if (acum < plecare) {
    return el('div', { class: 'erou' },
      el('p', { class: 'erou-supra' }, salut),
      el('h2', { class: 'erou-titlu' }, 'Creta, în câteva zile'),
      el('p', { class: 'erou-sub' }, 'Șapte prieteni, șase zile, două capete de insulă. Plecăm sâmbătă, 19 septembrie, la 21:20.'),
      ceas(),
    );
  }

  return el('div', { class: 'erou' },
    el('p', { class: 'erou-supra' }, salut),
    el('h2', { class: 'erou-titlu' }, 'Am fost în Creta'),
    el('p', { class: 'erou-sub' }, '19–24 septembrie 2026. Rezumatul e în secțiunea Amintiri.'),
  );
}

// ─────────────────────────────── avertismente ───────────────────────────────

function cardAvertisment(a) {
  const corp = el('div', { class: 'alerta-corp' },
    el('p', {}, textAldin(a.problema)),
    a.solutie ? el('p', {}, textAldin(a.solutie)) : null,
  );

  if (a.calcul === 'joi') {
    const cu17 = lantJoi('17:00');
    const cu15 = lantJoi('15:00');
    corp.append(el('div', { class: 'alerta-fapt' },
      el('div', { style: 'font-weight:650;margin-bottom:5px' }, 'Calculul, minut cu minut'),
      el('div', {}, `Masă la 17:00 → la terminal ${cu17.final}. Bag-drop închis 19:15. Marjă: ${cu17.marjaMinute} min.`),
      el('div', { style: 'margin-top:3px' }, `Masă la 15:00 → la terminal ${cu15.final}. Marjă: +${cu15.marjaMinute} min.`),
    ));
  }

  if (a.deFacut) {
    corp.append(el('div', { class: 'alerta-fapt' },
      el('div', { style: 'font-weight:650;margin-bottom:4px' }, 'De făcut'),
      textAldin(a.deFacut),
    ));
  }

  const cine = a.fapt ? cineLAFacut(a.fapt) : null;
  corp.append(el('label', {
    class: 'bifa', style: 'margin-top:11px;background:transparent',
    dataset: { bifat: a.rezolvat ? '1' : '0' },
  },
    el('input', {
      type: 'checkbox', checked: a.rezolvat,
      on: { change: (e) => comutaRezolvat(a, e.target.checked) },
    }),
    el('span', { class: 'bifa-corp' },
      el('span', { class: 'bifa-text' }, a.rezolvat ? 'Rezolvat' : 'Bifează când e rezolvat'),
      a.fapt
        ? el('span', { class: 'bifa-nota' },
          a.rezolvat && cine?.facutDe
            ? `Rezolvat de ${numePersoana(cine.facutDe)} · dispare și din „De rezervat" și din pachet`
            : 'Bifa asta e comună — dispare din toate ecranele deodată')
        : null,
    ),
  ));

  return el('details', {
    class: `alerta alerta-${a.rezolvat ? 'rezolvat' : a.severitate}`,
    attrs: a.rezolvat ? {} : { open: a.severitate === 'critic' ? 'open' : null },
  },
    el('summary', { class: 'alerta-cap', style: 'cursor:pointer;list-style:none' },
      el('span', { class: 'alerta-titlu' }, a.titlu),
      eticheta(a.rezolvat ? 'Rezolvat' : SEVERITATI[a.severitate].eticheta,
        a.rezolvat ? 'verde' : a.severitate === 'critic' ? 'rosu' : a.severitate === 'atentie' ? 'galben' : 'accent'),
    ),
    corp,
  );
}

function panouAvertismente() {
  const stareBife = {};
  for (const a of avertismenteOrdonate({})) stareBife[a.id] = avertismentRezolvat(a);
  // Ce s-a rezolvat dispare de aici. Se poate readuce din ⚙️ Setări, dar prima
  // pagină arată doar ce mai e de făcut.
  const active = avertismenteOrdonate(stareBife).filter((a) => !a.rezolvat);

  if (!active.length) {
    return el('section', { class: 'sectiune' },
      el('div', { class: 'card card-strans', style: 'background:var(--verde-slab);border-color:transparent' },
        el('p', { style: 'font-size:14px' }, '✅ Nu mai e nimic de rezolvat înainte de plecare.')),
    );
  }

  return el('section', { class: 'sectiune' },
    capSectiune('Înainte să plecăm', eticheta(`${active.length} de rezolvat`, 'rosu')),
    el('p', { style: 'font-size:13.5px;color:var(--text-slab);margin-bottom:11px' },
      'Lucruri care ies din rezervări citite una lângă alta. Câteva cer un telefon.'),
    ...active.map(cardAvertisment),
  );
}

/** Ce mai e de rezolvat înainte de plecare — cu legătura spre lista completă. */
function panouDeRezervat() {
  const ale = rezervariDin('acum');
  const facute = ale.filter((r) => {
    // cele legate de un fapt comun se citesc de acolo, nu din bifa lor veche
    if (r.fapt) return esteRezolvat(r.fapt);
    const inr = stare.una(`rezervat_${r.id}`);
    return inr && inr.facut && !inr.sters;
  }).length;
  const ramase = ale.length - facute;

  return el('section', { class: 'sectiune' },
    el('a', {
      href: '#/de-rezervat',
      class: 'card',
      style: `display:block;text-decoration:none;${ramase ? 'border-color:var(--rosu)' : ''}`,
    },
      el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:center' },
        el('div', {},
          el('h3', { class: 'card-titlu' },
            ramase ? `${ramase} de rezervat înainte de plecare` : '✅ Rezervările dinainte sunt făcute'),
          el('p', { class: 'card-sub', style: 'margin-top:3px' },
            'Plus ce se rezervă de acolo, cu o zi înainte.'),
        ),
        el('span', { style: 'font-size:20px;color:var(--text-stins)' }, '›'),
      ),
    ),
  );
}

function scurtaturi() {
  const chelt = stare.toate('cheltuiala');
  const t = totaluri(chelt);
  const voturi = stare.toate('vot').filter((v) => !v.sters).length;

  const cifre = [
    { et: 'Zile', val: '6', unde: '#/itinerar' },
    { et: 'Km de transfer', val: km(KM_TOTAL_ESTIMAT), unde: '#/masina' },
    { et: 'Cheltuit', val: euro(t.tot, { scurt: true }), unde: '#/bani' },
    { et: 'Voturi date', val: String(voturi), unde: '#/vot' },
  ];

  return el('section', { class: 'sectiune' },
    capSectiune('Pe scurt'),
    el('div', { class: 'grila grila-2' },
      ...cifre.map((c) => el('a', { href: c.unde, class: 'card card-strans', style: 'text-decoration:none' },
        el('div', { style: 'font-size:20px;font-weight:700' }, c.val),
        el('div', { style: 'font-size:12px;color:var(--text-slab)' }, c.et),
      )),
    ),
  );
}

function notaSecrete() {
  if (esteDeblocat()) return null;
  return el('section', { class: 'sectiune' },
    el('div', { class: 'card', style: 'border-color:var(--accent)' },
      el('h3', { class: 'card-titlu' }, '🔒 Codurile sunt încuiate'),
      el('p', { class: 'card-sub', style: 'margin-top:5px' },
        'PIN-urile cazărilor și codurile de rezervare stau criptate, fiindcă site-ul e public. Deblochează-le o dată, cu parola grupului, și rămân în telefon — inclusiv fără internet.'),
      el('a', { href: '#/rezervari', class: 'buton buton-lat', style: 'margin-top:12px' }, 'Deblochează'),
    ),
  );
}

function zileScurt() {
  const acum = new Date();
  const azi = ziuaCurenta(ZILE, acum);

  return el('section', { class: 'sectiune' },
    capSectiune('Cele șase zile', el('a', { href: '#/itinerar', class: 'buton-fantoma buton' }, 'Tot itinerariul')),
    ...ZILE.map((z) => el('a', {
      href: `#/itinerar`, class: 'rand-card', style: 'text-decoration:none',
      dataset: z.id === azi?.id ? { azi: '1' } : {},
    },
      el('span', {
        class: 'poarta-nume-cerc',
        style: z.id === azi?.id ? 'background:var(--verde-slab);color:var(--verde)' : '',
      }, String(z.numar)),
      el('span', { class: 'rand-card-corp' },
        el('span', { class: 'rand-card-titlu' }, z.titlu),
        el('span', { class: 'rand-card-sub' }, `${numeZi(z.data)}, ${dataLunga(z.data).split(', ')[1]}${z.conduce ? ` · ${km(z.conduce)}` : ''}`),
      ),
      z.id === azi?.id ? eticheta('Azi', 'verde') : null,
    )),
  );
}

export default function ecranAcasa() {
  const acum = new Date();
  const inCurs = acumSeIntampla(ZILE, acum);

  return frag(
    el('section', { class: 'sectiune' }, erou()),
    notaSecrete(),
    panouDeRezervat(),
    panouAvertismente(),
    zileScurt(),
    scurtaturi(),
    el('p', { style: 'margin-top:22px;font-size:12px;color:var(--text-stins);text-align:center' },
      inCurs ? `Ultimul pas trecut: ${inCurs.ora} — ${inCurs.text}` : 'Marian, Demian, Adina, Andrei, Sara, Bengi, Diana'),
  );
}
