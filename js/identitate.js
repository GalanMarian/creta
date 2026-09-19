// „Cine sunt". Nu există conturi și nici parole pentru asta: fiecare își alege
// numele o dată, pe telefonul lui, și rămâne ținut minte. Șapte oameni care se
// cunosc de mici nu au nevoie de autentificare ca să voteze unde se duc.
//
// Separat de asta, blocul cu coduri și PIN-uri e criptat — acolo chiar e nevoie
// de parolă, fiindcă depozitul e public.

import { PERSOANE, persoana } from './date/grup.js';

const CHEIE = 'creta.eu.v1';

let eu = null;
const abonati = new Set();

export function porneste() {
  const salvat = localStorage.getItem(CHEIE);
  if (salvat && persoana(salvat)) eu = salvat;
}

export function cineSunt() {
  return eu;
}

export function euPersoana() {
  return eu ? persoana(eu) : null;
}

export function amAles() {
  return !!eu;
}

export function alege(id) {
  if (!persoana(id)) return false;
  eu = id;
  try { localStorage.setItem(CHEIE, id); } catch { /* navigare privată */ }
  for (const fn of abonati) fn();
  return true;
}

export function uita() {
  eu = null;
  try { localStorage.removeItem(CHEIE); } catch { /* idem */ }
  for (const fn of abonati) fn();
}

export function laSchimbare(fn) {
  abonati.add(fn);
  return () => abonati.delete(fn);
}

export const CINE_POATE_FI = PERSOANE;
