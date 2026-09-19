// „Unde mai trebuie rezervări?" — răspunsul, pe trei rafturi.
//
// Bifele se țin în Firestore, ca să vadă toți ce s-a rezolvat deja și să nu
// sune trei oameni la același restaurant.

import {
  el, frag, capSectiune, eticheta, paine, textAldin, telefon,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import { numePersoana } from '../date/grup.js';
import { REZERVARI, GRUPE_REZERVARI, rezervariDin } from '../date/rezervari-necesare.js';
import { dataScurta } from '../lib/format.js';
import { esteRezolvat, rezolva, cineLAFacut } from '../fapte.js';

function idBifa(id) {
  return `rezervat_${id}`;
}

/**
 * Unele rezervări sunt același lucru cu un avertisment de pe prima pagină
 * (masa mutată, al doilea șofer, parcarea). Alea folosesc bifa comună; restul
 * au bifa lor.
 */
function esteFacut(r) {
  if (r.fapt) return esteRezolvat(r.fapt);
  const inr = stare.una(idBifa(r.id));
  return !!(inr && inr.facut && !inr.sters);
}

function cineAFacut(r) {
  if (r.fapt) return cineLAFacut(r.fapt);
  const inr = stare.una(idBifa(r.id));
  return inr && inr.facut && !inr.sters ? inr : null;
}

function comuta(r, valoare) {
  if (r.fapt) {
    rezolva(r.fapt, valoare);
    return;
  }
  stare.seteaza(idBifa(r.id), 'rezervat', {
    obiect: r.id,
    facut: !!valoare,
    facutDe: cineSunt(),
    cand: valoare ? new Date().toISOString().slice(0, 10) : null,
  });
}

/** Textul poate avea liste pe rânduri; le desfacem ca să se citească. */
function corp(text) {
  const randuri = String(text).split('\n').filter(Boolean);
  if (randuri.length === 1) return el('p', { style: 'font-size:13.5px' }, textAldin(text));
  return el('div', { style: 'font-size:13.5px' },
    ...randuri.map((r) => el('p', { style: 'margin-top:5px' }, textAldin(r))));
}

function cardRezervare(r) {
  const facut = esteFacut(r);
  const cine = cineAFacut(r);
  const seBifeaza = r.cand !== 'pe-loc';

  return el('div', {
    class: `card ${facut ? 'rand-fost' : ''}`,
    style: `margin-bottom:9px;${r.critic && !facut ? 'border-color:var(--rosu)' : ''}`,
  },
    el('div', { style: 'display:flex;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { style: `font-size:15px;font-weight:650;${facut ? 'color:var(--text-slab)' : ''}` }, r.titlu),
      ),
      el('div', { class: 'etichete', style: 'justify-content:flex-end' },
        r.doar ? eticheta(r.doar.map(numePersoana).join(', '), 'accent') : null,
        r.critic && !facut ? eticheta('Urgent', 'rosu') : null,
        r.capcana ? eticheta('⚠ Capcană', 'galben') : null,
        facut ? eticheta('✓ Făcut', 'verde') : null,
      ),
    ),

    el('div', { style: 'margin-top:8px' }, corp(r.ce)),
    r.cum ? el('div', { class: 'ce-spune', style: 'margin-top:9px' }, corp(r.cum)) : null,
    r.atentie ? el('div', { class: 'alerta alerta-atentie', style: 'margin-top:9px' },
      el('div', { class: 'alerta-corp' }, textAldin(r.atentie))) : null,

    seBifeaza ? el('label', {
      class: 'bifa', style: 'margin-top:11px',
      dataset: { bifat: facut ? '1' : '0' },
    },
      el('input', {
        type: 'checkbox', checked: facut,
        on: {
          change: (e) => {
            comuta(r, e.target.checked);
            paine(e.target.checked
              ? (r.fapt ? 'Bifat peste tot — dispare și de pe prima pagină' : 'Bifat ca rezolvat')
              : 'Readus în listă');
          },
        },
      }),
      el('span', { class: 'bifa-corp' },
        el('span', { class: 'bifa-text' }, facut ? 'Rezolvat' : 'Bifează când e rezolvat'),
        facut && cine?.facutDe
          ? el('span', { class: 'bifa-nota' },
            `${numePersoana(cine.facutDe)}${cine.cand ? ` · ${dataScurta(cine.cand)}` : ''}`)
          : (r.fapt ? el('span', { class: 'bifa-nota' }, 'Bifă comună cu prima pagină și cu pachetul') : null),
      ),
    ) : null,
  );
}

export default function ecranRezervariNecesare() {
  const eu = cineSunt();
  const aleMele = rezervariDin('acum').filter((r) => !r.doar || (eu && r.doar.includes(eu)));
  const deFacutAcum = aleMele.filter((r) => !esteFacut(r)).length;

  return frag(
    el('section', { class: 'sectiune' },
      el('div', { class: `card ${deFacutAcum ? '' : 'card-strans'}`, style: deFacutAcum ? 'border-color:var(--rosu)' : '' },
        el('h2', { class: 'card-titlu' },
          deFacutAcum
            ? `${deFacutAcum} ${deFacutAcum === 1 ? 'lucru' : 'lucruri'} de rezolvat înainte de plecare`
            : '✅ Tot ce ține de tine e făcut'),
        el('p', { class: 'card-sub', style: 'margin-top:5px' },
          'Vestea bună: în Creta aproape nimic nu cere rezervare din timp. Excepțiile sunt bărcile pentru un grup de șapte, activitățile cu ghid și restaurantele bune seara — și toate se fac cu o zi înainte, de acolo.'),
      ),
    ),

    ...GRUPE_REZERVARI.map((g) => {
      const ale = rezervariDin(g.id);
      const facute = ale.filter((r) => esteFacut(r)).length;
      return el('section', { class: 'sectiune' },
        capSectiune(g.titlu,
          g.id !== 'pe-loc' ? eticheta(`${facute}/${ale.length}`, facute === ale.length ? 'verde' : null) : null),
        el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-bottom:10px' }, g.nota),
        ...ale.map(cardRezervare),
      );
    }),

    el('section', { class: 'sectiune' },
      el('div', { class: 'card card-strans' },
        el('p', { style: 'font-size:12.5px;color:var(--text-slab)' },
          textAldin('Regula generală pentru Creta: **plajele, cheile, peșterile și mănăstirile nu se rezervă niciodată** — se plătesc la intrare, adesea doar cu numerar. Se rezervă doar ce are locuri limitate: bărci, ghizi și mese.')),
      ),
    ),
  );
}
