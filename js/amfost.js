// „Am fost acolo" și propunerile adăugate de grup.
//
// Bifa e a GRUPULUI, nu a fiecăruia: dacă am fost la Balos, am fost toți. De
// aceea id-ul documentului e doar `fost_<obiect>`, fără numele omului — al
// doilea care bifează suprascrie, nu dublează.

import * as stare from './stare.js';
import { cineSunt } from './identitate.js';

export function idFost(obiect) {
  return `fost_${obiect}`;
}

export function amFost(obiect) {
  const inr = stare.una(idFost(obiect));
  return !!(inr && inr.fost && !inr.sters);
}

export function cineABifat(obiect) {
  const inr = stare.una(idFost(obiect));
  return inr && inr.fost && !inr.sters ? inr.bifatDe : null;
}

export function candAmFost(obiect) {
  const inr = stare.una(idFost(obiect));
  return inr && inr.fost && !inr.sters ? inr.cand : null;
}

export function comutaFost(obiect, valoare) {
  stare.seteaza(idFost(obiect), 'fost', {
    obiect,
    fost: !!valoare,
    bifatDe: cineSunt(),
    cand: valoare ? new Date().toISOString().slice(0, 10) : null,
  });
  return !!valoare;
}

/** Câte dintr-o listă de id-uri sunt bifate. */
export function numaraFost(iduri) {
  return (iduri || []).filter(amFost).length;
}

// ─────────────────────── propuneri adăugate de noi ───────────────────────

/**
 * Un loc sau o activitate găsită de cineva din grup. Are aceeași formă ca
 * intrările din `date/`, ca să poată intra în aceleași liste și în același vot.
 */
export function propuneriProprii(fel) {
  const toate = stare.toate('propriu').filter((p) => !p.sters);
  return fel ? toate.filter((p) => p.fel === fel) : toate;
}

export function adaugaPropriu(date) {
  return stare.adauga('propriu', {
    fel: date.fel || 'loc',
    nume: date.nume,
    subtitlu: date.subtitlu || '',
    zona: date.zona || 'ambele',
    zi: date.zi || null,
    durata: date.durata || '',
    costText: date.costText || '',
    deCe: date.deCe || '',
    link: date.link || '',
    propusDe: cineSunt(),
  });
}

export function stergePropriu(id) {
  return stare.sterge(id);
}

/** Îl aducem la forma cu care lucrează ecranele de locuri și de vot. */
export function caLoc(p) {
  return {
    id: p.id,
    fel: p.fel,
    nume: p.nume,
    subtitlu: p.subtitlu || (p.fel === 'activitate' ? 'Activitate propusă de noi' : 'Propus de noi'),
    zona: p.zona,
    tip: p.fel === 'activitate' ? 'activitate' : 'propriu',
    durata: p.durata || '—',
    costText: p.costText || '—',
    deCe: p.deCe || '',
    link: p.link || '',
    propusDe: p.propusDe,
    alNostru: true,
    dinVest: null,
    dinEst: null,
  };
}

// ─────────────────── obiecte de bagaj adăugate de noi ───────────────────

/**
 * Un obiect pus de cineva din grup. `pentruGrup` îl face vizibil la toți; altfel
 * e doar pe lista celui care l-a scris.
 */
export function obiecteProprii(idPersoana) {
  return stare.toate('obiect')
    .filter((o) => !o.sters)
    .filter((o) => o.pentruGrup || o.persoana === idPersoana);
}

export function adaugaObiect(text, pentruGrup) {
  return stare.adauga('obiect', {
    text: String(text).trim(),
    pentruGrup: !!pentruGrup,
    persoana: cineSunt(),
  });
}

export function stergeObiect(id) {
  return stare.sterge(id);
}
