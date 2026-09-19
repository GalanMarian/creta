// Formatare în română. Fără dependențe: numele de luni și de zile sunt scrise
// aici, ca să nu depindem de datele ICU ale browserului (pe unele telefoane
// vechi `Intl` cu 'ro-RO' cade pe engleză, iar un „Saturday" în mijlocul
// itinerariului arată prost).

export const ZILE = [
  'duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă',
];

export const ZILE_SCURT = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

export const LUNI = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
];

export const LUNI_SCURT = [
  'ian', 'feb', 'mar', 'apr', 'mai', 'iun',
  'iul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

/** Prima literă mare, restul neatins. */
export function majuscula(text) {
  if (!text) return '';
  return text.charAt(0).toLocaleUpperCase('ro-RO') + text.slice(1);
}

/**
 * Sumă în cenți → text cu virgulă zecimală și €.
 * Lucrăm mereu în cenți întregi, ca să nu apară 0,30000000000000004.
 */
export function euro(centi, opt = {}) {
  const n = Math.round(Number(centi) || 0);
  const negativ = n < 0;
  const abs = Math.abs(n);
  const intregi = Math.floor(abs / 100);
  const zecimale = abs % 100;

  // grupare pe mii cu spațiu îngust, ca să nu se lipească „1200€"
  const grupat = String(intregi).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  let text;
  if (opt.scurt && zecimale === 0) {
    text = `${grupat} €`;
  } else {
    text = `${grupat},${String(zecimale).padStart(2, '0')} €`;
  }
  return negativ ? `−${text}` : text;
}

/** Cenți → număr în euro, pentru locurile unde chiar vrem un număr. */
export function inEuro(centi) {
  return Math.round(Number(centi) || 0) / 100;
}

/** Text introdus de om („12,50", "12.5", " 12 ") → cenți. NaN dacă nu e număr. */
export function centiDinText(text) {
  if (text === null || text === undefined) return NaN;
  const curat = String(text).trim().replace(/\s/g, '').replace(',', '.');
  if (curat === '' || !/^-?\d*\.?\d*$/.test(curat)) return NaN;
  const n = Number(curat);
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 100);
}

/** Data ISO (YYYY-MM-DD) → părțile ei, fără fus orar. */
function parti(iso) {
  const [a, l, z] = String(iso).slice(0, 10).split('-').map(Number);
  return { an: a, luna: l, zi: z, data: new Date(Date.UTC(a, l - 1, z)) };
}

/** „sâmbătă, 19 septembrie" */
export function dataLunga(iso) {
  const p = parti(iso);
  return `${ZILE[p.data.getUTCDay()]}, ${p.zi} ${LUNI[p.luna - 1]}`;
}

/** „Sâm 19 sep" */
export function dataScurta(iso) {
  const p = parti(iso);
  return `${ZILE_SCURT[p.data.getUTCDay()]} ${p.zi} ${LUNI_SCURT[p.luna - 1]}`;
}

/** „19 septembrie 2026" */
export function dataCuAn(iso) {
  const p = parti(iso);
  return `${p.zi} ${LUNI[p.luna - 1]} ${p.an}`;
}

/** Numele zilei, cu majusculă: „Sâmbătă" */
export function numeZi(iso) {
  return majuscula(ZILE[parti(iso).data.getUTCDay()]);
}

/** Minute → „2 h 15 min", „45 min", „3 h" */
export function durata(minute) {
  const m = Math.max(0, Math.round(Number(minute) || 0));
  const ore = Math.floor(m / 60);
  const min = m % 60;
  if (ore === 0) return `${min} min`;
  if (min === 0) return `${ore} h`;
  return `${ore} h ${min} min`;
}

/** Diferență în milisecunde → „2 zile, 3 ore" pentru numărătoarea inversă. */
export function raspas(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const zile = Math.floor(total / 86400);
  const ore = Math.floor((total % 86400) / 3600);
  const minute = Math.floor((total % 3600) / 60);
  const secunde = total % 60;
  return { zile, ore, minute, secunde };
}

/** Acordul la plural, care în română are trei forme. */
export function plural(n, unu, putine, multe) {
  const abs = Math.abs(n);
  if (abs === 1) return unu;
  // 2–19 și orice număr al cărui rest la 100 e între 1 și 19 cer „de"
  const rest = abs % 100;
  if (abs === 0 || (rest >= 1 && rest <= 19)) return putine;
  return multe;
}

/** „7 persoane", „1 persoană" */
export function persoane(n) {
  return `${n} ${plural(n, 'persoană', 'persoane', 'de persoane')}`;
}

/** „3 nopți", „1 noapte" */
export function nopti(n) {
  return `${n} ${plural(n, 'noapte', 'nopți', 'de nopți')}`;
}

/** „5 km", „154 km" — distanțe */
export function km(valoare) {
  const n = Math.round(Number(valoare) || 0);
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km`;
}
