// Deblocarea blocului criptat.
//
// După ce parola e corectă o dată, ținem obiectul DECRIPTAT în localStorage.
// Da, asta înseamnă că pe un telefon deblocat codurile stau în clar — dar e
// telefonul lor, iar alternativa (recerut parola la fiecare deschidere) ar face
// PIN-ul cazării inaccesibil exact în situația pentru care există: la 02:15
// noaptea, în fața unei uși, fără semnal.
//
// Butonul „Blochează" șterge copia locală.

import { decripteaza } from './lib/cripto.js';

const CHEIE = 'creta.deblocat.v1';
const CALE_BLOC = 'js/date/secret.json';

let deschis = null;
let bloc = null;
const abonati = new Set();

function anunta() {
  for (const fn of abonati) fn();
}

export function laSchimbare(fn) {
  abonati.add(fn);
  return () => abonati.delete(fn);
}

export function porneste() {
  try {
    const salvat = localStorage.getItem(CHEIE);
    if (salvat) deschis = JSON.parse(salvat);
  } catch {
    deschis = null;
  }
}

export function esteDeblocat() {
  return !!deschis;
}

/** Aduce blocul criptat. Service worker-ul îl ține în cache, deci merge offline. */
async function iaBloc() {
  if (bloc) return bloc;
  const r = await fetch(CALE_BLOC, { cache: 'no-cache' });
  if (!r.ok) throw new Error('Nu se găsește fișierul cu datele criptate.');
  bloc = await r.json();
  return bloc;
}

/** @returns {Promise<boolean>} true dacă parola a fost bună. */
export async function deblocheaza(parola) {
  const b = await iaBloc();
  const date = await decripteaza(b, parola); // aruncă EROARE_PAROLA dacă nu e bună
  deschis = date;
  try { localStorage.setItem(CHEIE, JSON.stringify(date)); } catch { /* navigare privată */ }
  anunta();
  return true;
}

export function blocheaza() {
  deschis = null;
  try { localStorage.removeItem(CHEIE); } catch { /* idem */ }
  anunta();
}

/**
 * Valoarea de la o cale ca „cazare.aegean.pin".
 * Întoarce null cât timp blocul e încuiat — interfața arată „••••".
 */
export function valoare(cale) {
  if (!deschis) return null;
  return String(cale).split('.').reduce((o, k) => (o == null ? null : o[k]), deschis) ?? null;
}

export function tot() {
  return deschis;
}
