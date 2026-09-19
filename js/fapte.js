// Fapte despre lume, nu bife despre ecrane.
//
// „Masa de la Peskesi a fost mutată" e UN singur lucru adevărat. Până acum avea
// patru bife separate — una în avertismente, una în „De rezervat", una în
// pachetul lui Marian, plus două locuri care o afișau fără nicio bifă. Bifai
// într-un loc și te certa în celelalte trei.
//
// Aici fiecare fapt are un singur document, `fapt_<id>`, iar toate ecranele
// citesc și scriu în el.

import * as stare from './stare.js';
import { cineSunt } from './identitate.js';

export const FAPTE = {
  'peskesi-mutat': {
    titlu: 'Masa de la Peskesi, mutată la 15:00',
    cumSeFace: 'Telefon la +30 2810 288887, deschis de la 13:00.',
  },
  'al-doilea-sofer': {
    titlu: 'Al doilea șofer, adăugat pe contract',
    cumSeFace: 'WhatsApp la Eurocars: +30 6970 017115.',
  },
  'balos-intrebat': {
    titlu: 'Întrebat dacă se poate merge la Balos cu mașina',
    cumSeFace: 'Aceeași conversație cu Eurocars.',
  },
  'parcare-rezervata': {
    titlu: 'Parcarea de la Otopeni, rezervată',
    cumSeFace: 'parcareinotopeni.ro sau 0765 53 00 53.',
  },
  'numerar-strans': {
    titlu: 'Strânse 300 € numerar pentru mașină',
    cumSeFace: 'Până joi dimineață.',
  },
};

/**
 * Bifele vechi, dinainte de unificare. Le citim ca să nu se piardă ce ați
 * bifat deja — un fapt marcat rezolvat în avertismente rămâne rezolvat.
 */
const VECHI_IN_AVERTISMENTE = {
  'peskesi-mutat': 'joi-lant',
  'al-doilea-sofer': 'al-doilea-sofer',
  'balos-intrebat': 'balos-intrebare',
  'numerar-strans': 'numerar',
};

function idFapt(id) {
  return `fapt_${id}`;
}

export function esteRezolvat(id) {
  const inr = stare.una(idFapt(id));
  if (inr && !inr.sters) return !!inr.rezolvat;

  // nu există încă documentul nou — ne uităm la bifa veche
  const cheieVeche = VECHI_IN_AVERTISMENTE[id];
  if (!cheieVeche) return false;
  const vechi = stare.una('setare_avertismente');
  return !!(vechi && !vechi.sters && vechi.rezolvate && vechi.rezolvate[cheieVeche]);
}

export function cineLAFacut(id) {
  const inr = stare.una(idFapt(id));
  return inr && !inr.sters && inr.rezolvat ? inr : null;
}

export function rezolva(id, valoare) {
  stare.seteaza(idFapt(id), 'fapt', {
    fapt: id,
    rezolvat: !!valoare,
    facutDe: cineSunt(),
    cand: valoare ? new Date().toISOString().slice(0, 10) : null,
  });

  // ținem și bifa veche la zi, ca ecranele nemigrate să nu se contrazică
  const cheieVeche = VECHI_IN_AVERTISMENTE[id];
  if (cheieVeche) {
    const vechi = stare.una('setare_avertismente');
    const rezolvate = { ...(vechi?.rezolvate || {}) };
    if (valoare) rezolvate[cheieVeche] = true;
    else delete rezolvate[cheieVeche];
    stare.seteaza('setare_avertismente', 'setare', { rezolvate });
  }
  return !!valoare;
}

export function faptul(id) {
  return FAPTE[id] || null;
}

/** Câte dintre faptele urmărite mai sunt de rezolvat. */
export function nerezolvate() {
  return Object.keys(FAPTE).filter((id) => !esteRezolvat(id));
}
