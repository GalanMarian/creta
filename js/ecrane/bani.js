// Banii. Cheltuieli comune împărțite pe cap de om (Marian 1/7, fiecare cuplu
// 2/7), cheltuieli individuale care nu se împart, bife de achitare per
// gospodărie și decontarea „cine dă cui".

import {
  el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra,
  confirma, randDate, gol, textAldin,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import {
  PERSOANE, GOSPODARII, TOTI, gospodarie, gospodariaLui, numePersoana, numeGospodarie, PLATITORI, persoana,
} from '../date/grup.js';
import { CATEGORII, categorie, CATEGORIE_COMBUSTIBIL } from '../date/categorii.js';
import { MASINA } from '../date/masina-date.js';
import {
  sumar, balante, decontare, totaluri, datoriiPeGospodarie, stadiuAchitare, esteComuna,
} from '../lib/split.js';
import { euro, centiDinText, dataScurta, persoane as textPersoane } from '../lib/format.js';

let vedere = 'comune';

function cheltuieli() {
  return stare.toate('cheltuiala').filter((c) => !c.sters);
}

// ─────────────────────────────── formular ───────────────────────────────

function formularCheltuiala(existenta) {
  const eu = cineSunt();
  const c = existenta || {};

  const suma = el('input', {
    type: 'text', inputmode: 'decimal', value: c.sumaCenti ? (c.sumaCenti / 100).toFixed(2).replace('.', ',') : '',
    attrs: { placeholder: '0,00', autocomplete: 'off' },
  });
  const descriere = el('input', {
    type: 'text', value: c.descriere || '',
    attrs: { placeholder: 'Ex. Plinul de la Rethymno' },
  });
  const catSelect = el('select', {},
    ...CATEGORII.map((k) => el('option', { value: k.id, selected: (c.categorie || 'Altele') === k.id }, `${k.emoji} ${k.eticheta}`)),
  );
  const platitor = el('select', {},
    ...PLATITORI.map((id) => el('option', {
      value: id,
      selected: (c.platitDe || (PLATITORI.includes(eu) ? eu : PLATITORI[0])) === id,
    }, numePersoana(id))),
  );
  const litri = el('input', {
    type: 'text', inputmode: 'decimal', value: c.litri || '',
    attrs: { placeholder: 'Ex. 42,5' },
  });
  const campLitri = el('label', {
    class: 'camp', hidden: (c.categorie || 'Altele') !== CATEGORIE_COMBUSTIBIL,
  },
    el('span', { class: 'camp-eticheta' }, 'Litri alimentați (opțional)'),
    litri,
    el('span', { class: 'camp-nota' }, 'Cu litri, secțiunea Mașina poate calcula consumul în l/100 km.'),
  );
  catSelect.addEventListener('change', () => {
    campLitri.hidden = catSelect.value !== CATEGORIE_COMBUSTIBIL;
  });

  const esteComunaBifa = el('input', { type: 'checkbox', checked: c.comuna !== false });
  const participanti = new Set(c.participanti || TOTI);

  const grilaParticipanti = el('div', { class: 'grila grila-2', style: 'margin-top:7px' },
    ...PERSOANE.map((p) => {
      const intrare = el('input', {
        type: 'checkbox', checked: participanti.has(p.id),
        on: {
          change: (e) => {
            if (e.target.checked) participanti.add(p.id);
            else participanti.delete(p.id);
          },
        },
      });
      return el('label', { class: 'bifa', style: 'padding:9px 10px' },
        intrare, el('span', { class: 'bifa-corp' }, el('span', { class: 'bifa-text' }, p.nume)));
    }),
  );

  const zonaParticipanti = el('div', { hidden: c.comuna === false },
    el('span', { class: 'camp-eticheta', style: 'margin-top:4px' }, 'Pentru cine a fost'),
    el('div', { class: 'butoane', style: 'margin-bottom:4px' },
      el('button', {
        class: 'buton buton-fantoma buton-mic', type: 'button',
        on: {
          click: () => {
            TOTI.forEach((id) => participanti.add(id));
            grilaParticipanti.querySelectorAll('input').forEach((i) => { i.checked = true; });
          },
        },
      }, 'Toți 7'),
    ),
    grilaParticipanti,
  );
  esteComunaBifa.addEventListener('change', () => {
    zonaParticipanti.hidden = !esteComunaBifa.checked;
  });

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        const centi = centiDinText(suma.value);
        if (!Number.isFinite(centi) || centi <= 0) { paine('Scrie o sumă validă.', true); return; }
        if (!descriere.value.trim()) { paine('Scrie pentru ce a fost.', true); return; }
        if (esteComunaBifa.checked && participanti.size === 0) { paine('Alege cel puțin o persoană.', true); return; }

        const date = {
          sumaCenti: centi,
          descriere: descriere.value.trim(),
          categorie: catSelect.value,
          platitDe: platitor.value,
          comuna: esteComunaBifa.checked,
          participanti: esteComunaBifa.checked ? [...participanti] : [],
          litri: catSelect.value === CATEGORIE_COMBUSTIBIL ? (centiDinText(litri.value) / 100 || null) : null,
          data: c.data || new Date().toISOString().slice(0, 10),
          achitat: c.achitat || {},
          adaugatDe: c.adaugatDe || cineSunt(),
        };

        if (existenta) stare.modifica(existenta.id, date);
        else stare.adauga('cheltuiala', date);

        inchideFereastra();
        paine(existenta ? 'Modificat' : `Adăugat: ${euro(centi)}`);
      },
    },
  },
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Sumă în euro'), suma),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Pentru ce'), descriere),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Categorie'), catSelect),
    campLitri,
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Cine a plătit'), platitor),
    el('label', { class: 'bifa', style: 'margin-bottom:11px' },
      esteComunaBifa,
      el('span', { class: 'bifa-corp' },
        el('span', { class: 'bifa-text' }, 'Se împarte în grup'),
        el('span', { class: 'bifa-nota' }, 'Debifat, rămâne cheltuială personală și nu intră în decontare.'),
      ),
    ),
    zonaParticipanti,
    el('button', { class: 'buton buton-lat', type: 'submit', style: 'margin-top:14px' },
      existenta ? 'Salvează' : 'Adaugă cheltuiala'),
  );
}

// ─────────────────────────────── rândul unei cheltuieli ───────────────────────────────

function detaliiCheltuiala(c) {
  const datorii = datoriiPeGospodarie(c);
  const gospPlatitor = gospodariaLui(c.platitDe);
  const st = stadiuAchitare(c);

  return frag(
    el('div', { class: 'date-lista' },
      randDate('Sumă', euro(c.sumaCenti)),
      randDate('Categorie', `${categorie(c.categorie).emoji} ${c.categorie}`),
      randDate('Plătit de', numePersoana(c.platitDe)),
      randDate('Se împarte', esteComuna(c) ? textPersoane((c.participanti || TOTI).length) : 'Nu — personală'),
      c.litri ? randDate('Litri', String(c.litri).replace('.', ',')) : null,
      c.data ? randDate('Data', dataScurta(c.data)) : null,
    ),

    esteComuna(c) ? el('div', { style: 'margin-top:15px' },
      el('h4', { style: 'font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-slab);margin-bottom:8px' },
        'Cine cât datorează'),
      ...GOSPODARII.filter((g) => datorii[g.id] > 0).map((g) => {
        const esteEl = g.id === gospPlatitor;
        const achitat = !!(c.achitat || {})[g.id];
        if (esteEl) {
          return el('div', { class: 'card card-strans', style: 'margin-bottom:7px;background:var(--verde-slab);border-color:transparent' },
            el('div', { style: 'display:flex;justify-content:space-between;gap:9px' },
              el('span', {}, `${g.nume} — partea proprie`),
              el('span', { class: 'suma' }, euro(datorii[g.id])),
            ),
          );
        }
        return el('label', { class: 'bifa', dataset: { bifat: achitat ? '1' : '0' } },
          el('input', {
            type: 'checkbox', checked: achitat,
            on: {
              change: (e) => {
                const nou = { ...(c.achitat || {}) };
                if (e.target.checked) nou[g.id] = true;
                else delete nou[g.id];
                stare.modifica(c.id, { achitat: nou });
                inchideFereastra();
                paine(e.target.checked ? `${g.nume} a achitat` : `${g.nume}: bifă scoasă`);
              },
            },
          }),
          el('span', { class: 'bifa-corp' },
            el('span', { class: 'bifa-text' }, g.nume),
            el('span', { class: 'bifa-nota' }, achitat ? 'A achitat' : 'Are de dat'),
          ),
          el('span', { class: 'suma', style: 'flex:none' }, euro(datorii[g.id])),
        );
      }),
      el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-slab)' },
        st.gata ? '✅ Toți au achitat.' : `${st.achitati} din ${st.datori} au achitat.`),
    ) : null,

    el('div', { class: 'butoane', style: 'margin-top:18px' },
      el('button', {
        class: 'buton buton-slab', type: 'button',
        on: { click: () => deschideFereastra('Modifică cheltuiala', formularCheltuiala(c)) },
      }, 'Modifică'),
      el('button', {
        class: 'buton buton-rosu', type: 'button',
        on: {
          click: async () => {
            inchideFereastra();
            if (await confirma('Ștergi cheltuiala?', `„${c.descriere}", ${euro(c.sumaCenti)}. Rămâne în baza de date ca ștearsă, dar nu mai apare nicăieri.`, { periculos: true, daText: 'Șterge' })) {
              stare.sterge(c.id);
              paine('Șters');
            }
          },
        },
      }, 'Șterge'),
    ),
  );
}

function randCheltuiala(c) {
  const st = stadiuAchitare(c);
  return el('button', {
    class: 'rand-card', type: 'button',
    on: { click: () => deschideFereastra(c.descriere, detaliiCheltuiala(c)) },
  },
    el('span', { style: 'font-size:19px;flex:none' }, categorie(c.categorie).emoji),
    el('span', { class: 'rand-card-corp' },
      el('span', { class: 'rand-card-titlu' }, c.descriere),
      el('span', { class: 'rand-card-sub' },
        `${numePersoana(c.platitDe)}${esteComuna(c) ? ` · ${(c.participanti || TOTI).length}/7` : ' · personală'}${c.data ? ` · ${dataScurta(c.data)}` : ''}`),
    ),
    el('span', { class: 'rand-card-dreapta' },
      el('span', { class: 'suma' }, euro(c.sumaCenti)),
      esteComuna(c)
        ? el('span', { style: 'display:block;font-size:11px;color:var(--text-stins)' },
          st.gata ? '✅ achitat' : `${st.achitati}/${st.datori}`)
        : null,
    ),
  );
}

// ─────────────────────────────── decontare ───────────────────────────────

function panouDecontare() {
  const lista = cheltuieli();
  const bal = balante(lista);
  const transferuri = decontare(bal);
  const s = sumar(lista);

  return el('section', { class: 'sectiune' },
    capSectiune('Cine dă cui'),
    transferuri.length
      ? el('div', {},
        ...transferuri.map((t) => el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
          el('div', { style: 'display:flex;align-items:center;gap:9px' },
            el('span', { style: 'font-weight:650' }, numeGospodarie(t.deLa)),
            el('span', { style: 'color:var(--text-stins)' }, '→'),
            el('span', { style: 'font-weight:650' }, numeGospodarie(t.catre)),
            el('span', { style: 'flex:1' }),
            el('span', { class: 'suma', style: 'font-size:16px' }, euro(t.centi)),
          ),
        )),
      )
      : el('div', { class: 'card card-strans', style: 'background:var(--verde-slab);border-color:transparent' },
        el('p', { style: 'font-size:14px' }, lista.length ? '✅ Toate socotelile sunt închise.' : 'Încă nu e nimic de împărțit.')),

    el('div', { class: 'card', style: 'margin-top:11px' },
      el('h3', { style: 'font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-slab);margin-bottom:10px' },
        'Situația fiecăruia'),
      ...GOSPODARII.map((g) => {
        const d = s[g.id];
        return el('div', { style: 'padding:9px 0;border-bottom:1px solid var(--chenar)' },
          el('div', { style: 'display:flex;justify-content:space-between;gap:9px' },
            el('span', { style: 'font-weight:620' }, g.nume),
            el('span', {
              class: `suma ${d.balanta > 0 ? 'suma-pozitiv' : d.balanta < 0 ? 'suma-negativ' : ''}`,
            }, d.balanta === 0 ? '—' : `${d.balanta > 0 ? 'primește ' : 'dă '}${euro(Math.abs(d.balanta))}`),
          ),
          el('div', { style: 'font-size:12px;color:var(--text-slab);margin-top:2px' },
            `a plătit ${euro(d.platit)} · îi revine ${euro(d.parteaLor)}${d.individual ? ` · personal ${euro(d.individual)}` : ''}`),
        );
      }),
    ),
  );
}

// ─────────────────────────────── semințe ───────────────────────────────

function butonSeminte() {
  const exista = stare.toate('cheltuiala').some((c) => c.dinRezervare);
  if (exista) return null;

  return el('div', { class: 'card', style: 'border-color:var(--accent);margin-bottom:11px' },
    el('h3', { class: 'card-titlu' }, 'Pornim de la mașină?'),
    el('p', { class: 'card-sub', style: 'margin-top:5px' },
      `Avansul de ${euro(MASINA.tarif.avansCenti)} plătit deja de Bengi, și restul de ${euro(MASINA.tarif.restNumerarCenti)} în numerar. Le adaug ca cheltuieli comune, împărțite la 7.`),
    el('button', {
      class: 'buton buton-lat', type: 'button', style: 'margin-top:11px',
      on: {
        click: () => {
          stare.adauga('cheltuiala', {
            sumaCenti: MASINA.tarif.avansCenti,
            descriere: 'Avans mașină (deja plătit)',
            categorie: 'Mașină',
            platitDe: 'bengi',
            comuna: true,
            participanti: TOTI,
            data: '2026-09-17',
            achitat: {},
            dinRezervare: true,
          });
          stare.adauga('cheltuiala', {
            sumaCenti: MASINA.tarif.restNumerarCenti,
            descriere: 'Rest plată mașină (numerar, la predare)',
            categorie: 'Mașină',
            platitDe: 'bengi',
            comuna: true,
            participanti: TOTI,
            data: '2026-09-24',
            achitat: {},
            dinRezervare: true,
          });
          paine('Adăugate. Bifați pe fiecare cine a achitat.');
        },
      },
    }, 'Adaugă cele două cheltuieli'),
  );
}

// ─────────────────────────────── ecranul ───────────────────────────────

/** Cât am eu de dat sau de primit — prima întrebare a oricui deschide ecranul. */
function panouPersonal(lista) {
  const eu = cineSunt();
  const gospMea = eu ? gospodariaLui(eu) : null;
  if (!gospMea) return null;

  const bal = balante(lista);
  const transferuri = decontare(bal);
  const alMeu = bal[gospMea] || 0;

  const deDat = transferuri.filter((t) => t.deLa === gospMea);
  const dePrimit = transferuri.filter((t) => t.catre === gospMea);

  const culoare = alMeu > 0 ? 'verde' : alMeu < 0 ? 'rosu' : 'accent';
  const titlu = alMeu > 0 ? 'Ai de primit' : alMeu < 0 ? 'Ai de dat' : 'Ești la zi';

  return el('div', {
    class: 'card',
    style: `border-color:var(--${culoare});border-width:1.5px;background:var(--${culoare}-slab)`,
  },
    el('p', { style: 'font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;opacity:.75' },
      `${numeGospodarie(gospMea)} · ${titlu}`),
    el('div', { style: `font-size:30px;font-weight:750;margin-top:4px;color:var(--${culoare})` },
      alMeu === 0 ? '—' : euro(Math.abs(alMeu))),

    deDat.length ? el('div', { style: 'margin-top:11px' },
      ...deDat.map((t) => el('div', { style: 'font-size:14px;padding:3px 0' },
        '→ dai ', el('strong', {}, euro(t.centi)), ' lui ', el('strong', {}, numeGospodarie(t.catre)))),
    ) : null,
    dePrimit.length ? el('div', { style: 'margin-top:11px' },
      ...dePrimit.map((t) => el('div', { style: 'font-size:14px;padding:3px 0' },
        '← primești ', el('strong', {}, euro(t.centi)), ' de la ', el('strong', {}, numeGospodarie(t.deLa)))),
    ) : null,
    (!deDat.length && !dePrimit.length)
      ? el('p', { style: 'margin-top:8px;font-size:13.5px' },
        lista.length ? 'Nu datorezi nimic și nu ai de primit nimic.' : 'Încă n-a cheltuit nimeni nimic.')
      : null,
  );
}

/** Cele trei cifre de sus, explicate în cuvinte, nu doar în cifre. */
function panouTotaluri(lista) {
  const t = totaluri(lista);
  const pePersoana = Math.round(t.comun / 7);

  return el('div', { class: 'grila grila-3' },
    el('div', { class: 'card card-strans' },
      el('div', { style: 'font-size:17px;font-weight:700' }, euro(t.comun, { scurt: true })),
      el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, 'cheltuit în comun'),
    ),
    el('div', { class: 'card card-strans' },
      el('div', { style: 'font-size:17px;font-weight:700' }, euro(pePersoana, { scurt: true })),
      el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, 'revine unui om'),
    ),
    el('div', { class: 'card card-strans' },
      el('div', { style: 'font-size:17px;font-weight:700' }, euro(t.individual, { scurt: true })),
      el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, 'cheltuieli personale'),
    ),
  );
}

export default function ecranBani() {
  const lista = cheltuieli();
  const comune = lista.filter(esteComuna);
  const individuale = lista.filter((c) => !esteComuna(c));
  const neachitate = comune.filter((c) => !stadiuAchitare(c).gata);

  const alese = vedere === 'comune' ? comune : individuale;
  const ordonate = [...alese].sort((a, b) => String(b.data || '').localeCompare(String(a.data || ''))
    || String(b.creatLa || '').localeCompare(String(a.creatLa || '')));

  return frag(
    // 1. „Cât am eu de dat?" — înaintea oricărei cifre generale
    el('section', { class: 'sectiune' }, panouPersonal(lista)),

    // 2. butonul mare, imediat sub
    el('section', { class: 'sectiune' },
      butonSeminte(),
      el('button', {
        class: 'buton buton-lat', type: 'button', style: 'min-height:52px;font-size:15.5px',
        on: { click: () => deschideFereastra('Cheltuială nouă', formularCheltuiala()) },
      }, '+ Am plătit ceva'),
      neachitate.length
        ? el('p', { style: 'margin-top:8px;font-size:12.5px;color:var(--text-slab);text-align:center' },
          `${neachitate.length} ${neachitate.length === 1 ? 'cheltuială are' : 'cheltuieli au'} bife de achitare neterminate`)
        : null,
    ),

    // 3. totalurile
    el('section', { class: 'sectiune' }, panouTotaluri(lista)),

    // 4. lista
    el('section', { class: 'sectiune' },
      el('div', { class: 'segmente', style: 'margin-bottom:11px' },
        el('button', {
          class: 'segment', type: 'button', attrs: { 'aria-pressed': String(vedere === 'comune') },
          on: { click: () => { vedere = 'comune'; location.hash = '#/bani'; } },
        }, `Împărțite (${comune.length})`),
        el('button', {
          class: 'segment', type: 'button', attrs: { 'aria-pressed': String(vedere === 'individuale') },
          on: { click: () => { vedere = 'individuale'; location.hash = '#/bani'; } },
        }, `Personale (${individuale.length})`),
      ),
      ...(ordonate.length
        ? ordonate.map(randCheltuiala)
        : [gol('💸', vedere === 'comune'
          ? 'Nicio cheltuială împărțită încă. Prima e probabil plinul de la aeroport.'
          : 'Nicio cheltuială personală. Aici intră ce plătești doar pentru tine.')]),
    ),

    // 5. decontarea completă, pentru cine vrea tot tabloul
    panouDecontare(),

    el('section', { class: 'sectiune' },
      el('details', { class: 'card', style: 'padding:0' },
        el('summary', { class: 'sumar-card' }, 'Cum se împart banii'),
        el('div', { style: 'padding:0 14px 14px;font-size:13px;color:var(--text-slab)' },
          el('p', {}, textAldin('O cheltuială **împărțită** se sparge **pe cap de om**, la câți au fost. Soțul achită partea lui și a soției — deci Marian acoperă 1/7, iar fiecare cuplu 2/7.')),
          el('p', { style: 'margin-top:7px' }, textAldin('O cheltuială **personală** nu se împarte cu nimeni. Se trece doar ca să știi cât ai cheltuit tu.')),
          el('p', { style: 'margin-top:7px' }, textAldin('**Bifa de achitare**, din fiecare cheltuială, înseamnă „i-am dat deja banii". Când o pui, datoria dispare din decontare — la ambele capete.')),
          el('p', { style: 'margin-top:7px' }, 'Socoteala se face în cenți întregi, deci sumele adună exact, fără cenți pierduți la rotunjire.'),
        ),
      ),
    ),
  );
}
