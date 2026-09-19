// Cine merge și cine plătește.
//
// Regula de bani, stabilită de grup: o cheltuială comună se împarte PE CAP DE
// OM, iar soțul achită partea lui și a soției. Deci Marian acoperă 1/7, iar
// fiecare cuplu 2/7. De aici cele două structuri: `PERSOANE` (7 oameni, ei sunt
// unitatea de împărțire) și `GOSPODARII` (4 portofele, ele sunt unitatea de
// plată și de decontare).

export const PERSOANE = [
  { id: 'marian', nume: 'Marian', numeComplet: 'Marian Galan', gospodarie: 'marian', initiale: 'M' },
  { id: 'demian', nume: 'Demian', numeComplet: 'Demian Iacob', gospodarie: 'demian', initiale: 'D' },
  { id: 'adina', nume: 'Adina', numeComplet: 'Adina Iacob', gospodarie: 'demian', initiale: 'A' },
  { id: 'andrei', nume: 'Andrei', numeComplet: 'Andrei Galan', gospodarie: 'andrei', initiale: 'An' },
  { id: 'sara', nume: 'Sara', numeComplet: 'Sara Galan', gospodarie: 'andrei', initiale: 'S' },
  { id: 'bengi', nume: 'Bengi', numeComplet: 'Beniamin Ionuț Luculescu', gospodarie: 'bengi', initiale: 'B' },
  { id: 'diana', nume: 'Diana', numeComplet: 'Diana Luculescu', gospodarie: 'bengi', initiale: 'Di' },
];

export const GOSPODARII = [
  { id: 'marian', nume: 'Marian', membri: ['marian'], plateste: 'marian' },
  { id: 'demian', nume: 'Demian + Adina', membri: ['demian', 'adina'], plateste: 'demian' },
  { id: 'andrei', nume: 'Andrei + Sara', membri: ['andrei', 'sara'], plateste: 'andrei' },
  { id: 'bengi', nume: 'Bengi + Diana', membri: ['bengi', 'diana'], plateste: 'bengi' },
];

/** Cei care scot banii din buzunar — ei apar în „cine a plătit". */
export const PLATITORI = GOSPODARII.map((g) => g.plateste);

export const TOTI = PERSOANE.map((p) => p.id);

const DUPA_ID = new Map(PERSOANE.map((p) => [p.id, p]));
const GOSP_DUPA_ID = new Map(GOSPODARII.map((g) => [g.id, g]));

export function persoana(id) {
  return DUPA_ID.get(id) || null;
}

export function gospodarie(id) {
  return GOSP_DUPA_ID.get(id) || null;
}

/** Gospodăria din care face parte o persoană. */
export function gospodariaLui(idPersoana) {
  const p = DUPA_ID.get(idPersoana);
  return p ? p.gospodarie : null;
}

export function numePersoana(id) {
  const p = DUPA_ID.get(id);
  return p ? p.nume : id;
}

export function numeGospodarie(id) {
  const g = GOSP_DUPA_ID.get(id);
  return g ? g.nume : id;
}

/** Ordinea canonică a persoanelor — o folosim ca restul de cenți să cadă mereu la fel. */
export function ordoneazaPersoane(iduri) {
  const rang = new Map(TOTI.map((id, i) => [id, i]));
  return [...iduri].sort((a, b) => (rang.get(a) ?? 99) - (rang.get(b) ?? 99));
}

// Detalii care nu țin de bani, dar sunt bune de avut lângă nume.
export const ROLURI = {
  bengi: 'Șofer principal în Creta — singurul pe contractul de închiriere',
  marian: 'Titular cazări și rezervarea de la Peskesi',
  andrei: 'Mașina Suceava → Otopeni',
};

/** Cei doi care vin din Anglia — au alt zbor și alte prize. */
export const DIN_ANGLIA = ['bengi', 'diana'];
export const DIN_ROMANIA = ['marian', 'demian', 'adina', 'andrei', 'sara'];
