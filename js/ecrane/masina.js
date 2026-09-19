// Mașina: kilometrajul se introduce de mână, combustibilul vine singur din
// cheltuielile cu categoria Combustibil.

import {
  el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra,
  randDate, gol, confirma, textAldin,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';

import { MASINA, CARBURANT_NOTE } from '../date/masina-date.js';
import { statistici } from '../lib/masina.js';
import { CATEGORIE_COMBUSTIBIL } from '../date/categorii.js';
import { TOTI, PLATITORI, numePersoana } from '../date/grup.js';
import { stadiuAchitare } from '../lib/split.js';
import { euro, km as fkm, centiDinText, dataScurta, numeZi, plural } from '../lib/format.js';

function citiri() {
  return stare.toate('km').filter((c) => !c.sters);
}

function formularKm(existenta) {
  const c = existenta || {};
  const valoare = el('input', {
    type: 'text', inputmode: 'numeric', value: c.km ?? '',
    attrs: { placeholder: 'Ex. 84500', autocomplete: 'off' },
  });
  const nota = el('input', {
    type: 'text', value: c.nota || '',
    attrs: { placeholder: 'Ex. la ridicare, în parcarea de la Heraklion' },
  });
  const cand = el('input', {
    type: 'date', value: (c.cand || new Date().toISOString()).slice(0, 10),
  });

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        const n = Number(String(valoare.value).replace(/\s/g, ''));
        if (!Number.isFinite(n) || n <= 0) { paine('Scrie kilometrajul de pe bord.', true); return; }
        const date = { km: n, nota: nota.value.trim(), cand: cand.value, adaugatDe: cineSunt() };
        if (existenta) stare.modifica(existenta.id, date);
        else stare.adauga('km', date);
        inchideFereastra();
        paine(existenta ? 'Modificat' : `Notat: ${fkm(n)}`);
      },
    },
  },
    el('label', { class: 'camp' },
      el('span', { class: 'camp-eticheta' }, 'Kilometraj de pe bord'), valoare,
      el('span', { class: 'camp-nota' }, 'Numărul întreg, așa cum apare. Prima citire se face în parcare, la ridicare.'),
    ),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Când'), cand),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Notă (opțional)'), nota),
    el('button', { class: 'buton buton-lat', type: 'submit' }, existenta ? 'Salvează' : 'Notează'),
    existenta ? el('button', {
      class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:8px',
      on: {
        click: async () => {
          inchideFereastra();
          if (await confirma('Ștergi citirea?', `${fkm(existenta.km)}`, { periculos: true, daText: 'Șterge' })) {
            stare.sterge(existenta.id);
            paine('Șters');
          }
        },
      },
    }, 'Șterge citirea') : null,
  );
}

/**
 * Alimentare: o singură fereastră care scrie și cheltuiala, și litrii, și
 * kilometrajul. Altfel ar trebui completate în două ecrane diferite, la pompă,
 * cu cardul în cealaltă mână.
 */
function formularAlimentare(dupaSalvare) {
  const suma = el('input', {
    type: 'text', inputmode: 'decimal',
    attrs: { placeholder: '0,00', autocomplete: 'off' },
  });
  const litri = el('input', {
    type: 'text', inputmode: 'decimal',
    attrs: { placeholder: 'Ex. 42,5', autocomplete: 'off' },
  });
  const kmAcum = el('input', {
    type: 'text', inputmode: 'numeric',
    attrs: { placeholder: 'De pe bord, dacă te uiți', autocomplete: 'off' },
  });
  const unde = el('input', {
    type: 'text', attrs: { placeholder: 'Ex. benzinăria de la Rethymno' },
  });
  const cand = el('input', { type: 'date', value: new Date().toISOString().slice(0, 10) });
  const platitor = el('select', {},
    ...PLATITORI.map((id) => el('option', {
      value: id, selected: (PLATITORI.includes(cineSunt()) ? cineSunt() : PLATITORI[0]) === id,
    }, numePersoana(id))),
  );

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        const centi = centiDinText(suma.value);
        if (!Number.isFinite(centi) || centi <= 0) { paine('Scrie cât ai plătit.', true); return; }

        const l = centiDinText(litri.value);
        const litriNum = Number.isFinite(l) && l > 0 ? l / 100 : null;

        stare.adauga('cheltuiala', {
          sumaCenti: centi,
          descriere: unde.value.trim() || 'Alimentare',
          categorie: CATEGORIE_COMBUSTIBIL,
          platitDe: platitor.value,
          comuna: true,
          participanti: TOTI,
          litri: litriNum,
          data: cand.value,
          achitat: {},
          adaugatDe: cineSunt(),
        });

        const kmNum = Number(String(kmAcum.value).replace(/\s/g, ''));
        if (Number.isFinite(kmNum) && kmNum > 0) {
          stare.adauga('km', {
            km: kmNum, cand: cand.value,
            nota: `la alimentare${unde.value.trim() ? ` — ${unde.value.trim()}` : ''}`,
            adaugatDe: cineSunt(),
          });
        }

        inchideFereastra();
        paine(`Notat: ${euro(centi)}${litriNum ? ` · ${String(litriNum).replace('.', ',')} l` : ''}`);
        if (dupaSalvare) dupaSalvare();
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:13px' },
      'Se scrie o singură dată, aici. Suma intră automat la cheltuieli comune, împărțită la 7.'),
    el('div', { class: 'grila grila-2' },
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Cât ai plătit (€)'), suma),
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Litri'), litri),
    ),
    el('label', { class: 'camp' },
      el('span', { class: 'camp-eticheta' }, 'Kilometraj acum (opțional)'), kmAcum,
      el('span', { class: 'camp-nota' }, 'Cu el, aplicația poate calcula consumul real.'),
    ),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Unde'), unde),
    el('div', { class: 'grila grila-2' },
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Când'), cand),
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Cine a plătit'), platitor),
    ),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Notează alimentarea'),
  );
}

function cifra(valoare, eticheta_, nota) {
  return el('div', { class: 'card card-strans' },
    el('div', { style: 'font-size:18px;font-weight:700' }, valoare),
    el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, eticheta_),
    nota ? el('div', { style: 'font-size:10.5px;color:var(--text-stins);margin-top:2px' }, nota) : null,
  );
}

export default function ecranMasina() {
  const chelt = stare.toate('cheltuiala').filter((c) => !c.sters);
  const s = statistici({ cheltuieli: chelt, citiri: citiri() });

  const restPlata = chelt.find((c) => c.dinRezervare && /rest/i.test(c.descriere || ''));
  const stadiu = restPlata ? stadiuAchitare(restPlata) : null;

  return frag(
    el('section', { class: 'sectiune' },
      el('div', { class: 'card' },
        el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
          el('div', {},
            el('h2', { class: 'card-titlu' }, MASINA.model),
            el('p', { class: 'card-sub' }, `${MASINA.firma} · 7 locuri · automată`),
          ),
          eticheta(`Șofer: ${numePersoana(MASINA.sofer)}`, 'accent'),
        ),
        el('div', { class: 'date-lista', style: 'margin-top:12px' },
          randDate('Ridicare', `${numeZi(MASINA.ridicare.data)} ${MASINA.ridicare.ora}`),
          randDate('Predare', `${numeZi(MASINA.predare.data)} ${MASINA.predare.ora}`),
          randDate('Zile', String(MASINA.zile)),
        ),
      ),
    ),

    el('section', { class: 'sectiune' },
      el('div', { class: 'grila grila-2' },
        el('button', {
          class: 'buton buton-lat', type: 'button',
          on: { click: () => deschideFereastra('Alimentare', formularAlimentare()) },
        }, '⛽ Alimentare'),
        el('button', {
          class: 'buton buton-slab buton-lat', type: 'button',
          on: { click: () => deschideFereastra('Notează kilometrajul', formularKm()) },
        }, '🔢 Kilometraj'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Cifre'),
      el('div', { class: 'grila grila-2' },
        cifra(s.kmParcursi !== null ? fkm(s.kmParcursi) : '—', 'Km parcurși',
          s.kmStart !== null ? `de la ${fkm(s.kmStart)}` : 'nicio citire încă'),
        cifra(s.costCombustibilCenti ? euro(s.costCombustibilCenti, { scurt: true }) : '—', 'Combustibil',
          s.numarAlimentari
            ? `${s.numarAlimentari} ${plural(s.numarAlimentari, 'alimentare', 'alimentări', 'de alimentări')}`
            : 'din cheltuieli'),
        cifra(s.consum100 !== null ? `${s.consum100.toFixed(1).replace('.', ',')} l` : '—', 'Consum / 100 km',
          s.litri !== null ? `${String(s.litri).replace('.', ',')} l în total` : 'trebuie litrii'),
        cifra(s.cost100Centi !== null ? euro(s.cost100Centi) : '—', 'Cost / 100 km', 'doar combustibil'),
      ),
      el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-slab)' },
        textAldin('Combustibilul **nu se introduce aici**: se adună singur din cheltuielile cu categoria Combustibil. Adaugă litrii la cheltuială și apare și consumul.')),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Citiri de kilometraj',
        el('button', {
          class: 'buton buton-fantoma', type: 'button',
          on: { click: () => deschideFereastra('Notează kilometrajul', formularKm()) },
        }, '+ Notează'),
      ),
      s.citiri.length
        ? el('div', {}, ...[...s.citiri].reverse().map((c, i, tot) => {
          const anterior = tot[i + 1];
          const delta = anterior ? c.km - anterior.km : null;
          return el('button', {
            class: 'rand-card', type: 'button',
            on: { click: () => deschideFereastra('Modifică citirea', formularKm(c)) },
          },
            el('span', { class: 'rand-card-corp' },
              el('span', { class: 'rand-card-titlu' }, fkm(c.km)),
              el('span', { class: 'rand-card-sub' },
                `${c.cand ? dataScurta(c.cand) : ''}${c.nota ? ` · ${c.nota}` : ''}`),
            ),
            delta !== null ? el('span', { class: 'rand-card-dreapta' },
              el('span', { style: `color:var(--${delta < 0 ? 'rosu' : 'text-slab'})` }, `${delta >= 0 ? '+' : ''}${fkm(delta)}`)) : null,
          );
        }))
        : gol('🚗', 'Nicio citire. Prima se face în parcarea de la Heraklion, imediat ce luați mașina.'),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Alimentări',
        el('button', {
          class: 'buton buton-fantoma', type: 'button',
          on: { click: () => deschideFereastra('Alimentare', formularAlimentare()) },
        }, '+ Alimentare')),
      s.alimentari.length
        ? el('div', {}, ...s.alimentari.map((a) => el('div', { class: 'rand-card', style: 'cursor:default' },
          el('span', { style: 'font-size:19px;flex:none' }, '⛽'),
          el('span', { class: 'rand-card-corp' },
            el('span', { class: 'rand-card-titlu' }, a.descriere || 'Combustibil'),
            el('span', { class: 'rand-card-sub' },
              `${a.data ? dataScurta(a.data) : ''}${a.litri ? ` · ${String(a.litri).replace('.', ',')} l` : ' · fără litri'}`),
          ),
          el('span', { class: 'rand-card-dreapta' }, el('span', { class: 'suma' }, euro(a.centi))),
        )))
        : gol('⛽', 'Nicio alimentare. Se adaugă din secțiunea Bani, cu categoria Combustibil.'),
      el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-slab)' }, CARBURANT_NOTE),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Plata închirierii'),
      el('div', { class: 'card' },
        el('div', { class: 'date-lista' },
          randDate('Tarif final', euro(MASINA.tarif.finalCenti)),
          randDate('Avans încasat', euro(-MASINA.tarif.avansCenti)),
          randDate('Rest în numerar', el('span', { class: 'suma suma-pozitiv' }, euro(MASINA.tarif.restNumerarCenti))),
          randDate('Rest pe card', euro(MASINA.tarif.restCardCenti)),
          s.costMasinaCenti ? randDate('Total mașină până acum', euro(s.costMasinaCenti)) : null,
        ),
        stadiu
          ? el('div', { style: 'margin-top:12px' },
            el('div', { class: 'bara-progres' },
              el('div', {
                class: 'bara-progres-umplut',
                style: `width:${stadiu.datori ? (stadiu.achitati / stadiu.datori) * 100 : 0}%`,
              })),
            el('p', { style: 'margin-top:7px;font-size:12.5px;color:var(--text-slab)' },
              `Restul de plată: ${stadiu.achitati} din ${stadiu.datori} gospodării au achitat. Bifele se pun în secțiunea Bani.`),
          )
          : el('div', { class: 'alerta alerta-info', style: 'margin-top:11px' },
            el('div', { class: 'alerta-corp' },
              'Restul de plată nu e încă pe lista de cheltuieli. Din secțiunea Bani îl poți adăuga cu un buton, împărțit la 7.')),
      ),
    ),
  );
}
