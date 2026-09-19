// Întrebări pentru grup. Ce se răspunde se salvează, și intră în rezumatul de
// la final — de asta secțiunea nu e doar o listă, ci un jurnal.

import {
  el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra, gol, avatar,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import { persoana, numePersoana, PERSOANE } from '../date/grup.js';
import { INTREBARI, TEME, intrebariPeTema, intrebarea, trageUna } from '../date/intrebari.js';
import { dataScurta } from '../lib/format.js';

let temaDeschisa = null;
let trasa = null;

function raspunsuri(idIntrebare) {
  return stare.toate('raspuns').filter((r) => !r.sters && r.intrebare === idIntrebare);
}

function pusa(idIntrebare) {
  const inr = stare.una(`pusa_${idIntrebare}`);
  return !!(inr && inr.pusa && !inr.sters);
}

function marcheazaPusa(idIntrebare, valoare) {
  stare.seteaza(`pusa_${idIntrebare}`, 'pusa', { intrebare: idIntrebare, pusa: valoare });
}

function formularRaspuns(idIntrebare) {
  const q = intrebarea(idIntrebare);
  const text = el('textarea', {
    attrs: { placeholder: 'Ce a povestit cineva, sau ce ai răspuns tu…' },
  });
  const cine = el('select', {},
    ...PERSOANE.map((p) => el('option', { value: p.id, selected: p.id === cineSunt() }, p.nume)),
  );

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!text.value.trim()) { paine('Scrie ceva.', true); return; }
        stare.adauga('raspuns', {
          intrebare: idIntrebare,
          despre: cine.value,
          text: text.value.trim(),
          notatDe: cineSunt(),
          data: new Date().toISOString().slice(0, 10),
        });
        marcheazaPusa(idIntrebare, true);
        inchideFereastra();
        paine('Notat. Intră în rezumatul de la final.');
      },
    },
  },
    el('p', { style: 'font-size:14.5px;font-weight:600;margin-bottom:13px' }, q.text),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Despre cine'), cine),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Răspunsul'), text),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Salvează'),
  );
}

function cardIntrebare(q, compact) {
  const rasp = raspunsuri(q.id);
  const estePusa = pusa(q.id);
  const t = TEME.find((x) => x.id === q.tema);

  return el('div', {
    class: 'card',
    style: `margin-bottom:8px;${estePusa ? 'background:var(--fundal-pata)' : ''}`,
  },
    el('div', { style: 'display:flex;gap:9px;align-items:flex-start' },
      el('span', { style: 'font-size:18px;flex:none' }, t?.emoji || '💬'),
      el('p', { style: `flex:1;font-size:14.5px;${estePusa ? 'color:var(--text-slab)' : 'font-weight:520'}` }, q.text),
    ),

    rasp.length ? el('div', { style: 'margin-top:11px;padding-left:27px' },
      ...rasp.map((r) => el('div', { style: 'padding:8px 0;border-top:1px solid var(--chenar)' },
        el('div', { style: 'display:flex;gap:7px;align-items:center;margin-bottom:3px' },
          avatar(persoana(r.despre)),
          el('span', { style: 'font-size:12px;font-weight:620' }, numePersoana(r.despre)),
          el('span', { style: 'font-size:11px;color:var(--text-stins)' }, r.data ? dataScurta(r.data) : ''),
        ),
        el('p', { style: 'font-size:13.5px' }, r.text),
      )),
    ) : null,

    el('div', { class: 'butoane', style: 'margin-top:11px' },
      el('button', {
        class: 'buton buton-slab buton-mic', type: 'button',
        on: { click: () => deschideFereastra('Notează un răspuns', formularRaspuns(q.id)) },
      }, rasp.length ? '+ Încă un răspuns' : 'Notează un răspuns'),
      el('button', {
        class: 'buton buton-fantoma buton-mic', type: 'button',
        on: {
          click: () => {
            marcheazaPusa(q.id, !estePusa);
            paine(estePusa ? 'Readusă în listă' : 'Bifată ca pusă');
          },
        },
      }, estePusa ? '↩ N-a fost pusă' : '✓ A fost pusă'),
    ),
  );
}

export default function ecranIntrebari() {
  const totPuse = INTREBARI.filter((q) => pusa(q.id));
  const totRasp = stare.toate('raspuns').filter((r) => !r.sters);

  const zonaTrasa = el('div', {});

  function trage() {
    trasa = trageUna(totPuse.map((q) => q.id));
    zonaTrasa.replaceChildren(
      trasa ? cardIntrebare(trasa) : gol('🎉', 'Toate întrebările au fost puse.'),
    );
  }

  return frag(
    el('section', { class: 'sectiune' },
      el('div', { class: 'card' },
        el('h2', { class: 'card-titlu' }, 'Întrebări care scot povești'),
        el('p', { class: 'card-sub', style: 'margin-top:5px' },
          `${INTREBARI.length} de întrebări pentru un grup care se cunoaște de mici. Niciuna nu se poate răspunde cu „da" sau „nu" — toate cer un moment anume.`),
        el('div', { class: 'grila grila-2', style: 'margin-top:12px' },
          el('div', { class: 'card card-strans' },
            el('div', { style: 'font-size:17px;font-weight:700' }, `${totPuse.length}/${INTREBARI.length}`),
            el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, 'puse'),
          ),
          el('div', { class: 'card card-strans' },
            el('div', { style: 'font-size:17px;font-weight:700' }, String(totRasp.length)),
            el('div', { style: 'font-size:11.5px;color:var(--text-slab)' }, 'răspunsuri notate'),
          ),
        ),
        el('button', {
          class: 'buton buton-lat', type: 'button', style: 'margin-top:12px',
          on: { click: trage },
        }, '🎲 Trage o întrebare'),
      ),
    ),

    el('section', { class: 'sectiune' }, zonaTrasa),

    el('section', { class: 'sectiune' },
      capSectiune('Pe teme'),
      ...TEME.map((t) => {
        const ale = intrebariPeTema(t.id);
        const puseAici = ale.filter((q) => pusa(q.id)).length;
        return el('details', {
          class: 'card', style: 'margin-bottom:8px;padding:0',
          attrs: temaDeschisa === t.id ? { open: 'open' } : {},
          on: { toggle: (e) => { if (e.target.open) temaDeschisa = t.id; } },
        },
          el('summary', { style: 'cursor:pointer;padding:14px 15px;list-style:none;display:flex;align-items:center;gap:10px' },
            el('span', { style: 'font-size:20px' }, t.emoji),
            el('span', { style: 'flex:1;font-weight:620;font-size:15px' }, t.titlu),
            eticheta(`${puseAici}/${ale.length}`, puseAici === ale.length ? 'verde' : null),
          ),
          el('div', { style: 'padding:0 12px 12px' }, ...ale.map((q) => cardIntrebare(q))),
        );
      }),
    ),
  );
}
