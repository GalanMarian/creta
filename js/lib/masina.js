// Mașina: kilometri, combustibil, consum. Funcții pure.
//
// Combustibilul nu se introduce separat: se ia din cheltuielile cu categoria
// `Combustibil`, exact cum a cerut grupul. Citirile de kilometraj se adaugă de
// mână (prima dată în parcarea de la Heraklion).

import { CATEGORIE_COMBUSTIBIL } from '../date/categorii.js';

/**
 * Un kilometraj valid. Atenție: `Number(null)` și `Number('')` dau 0, nu NaN —
 * o citire golită ar intra ca „0 km" și ar face parcursul să pară 85.000 km.
 */
function kmValid(v) {
  if (v === null || v === undefined || v === '') return false;
  return Number.isFinite(Number(v));
}

/** Citirile de kilometraj, în ordine cronologică, fără cele șterse. */
export function citiriOrdonate(citiri) {
  return (citiri || [])
    .filter((c) => !c.sters && kmValid(c.km))
    .map((c) => ({ ...c, km: Number(c.km) }))
    .sort((a, b) => String(a.cand || '').localeCompare(String(b.cand || '')) || a.km - b.km);
}

/** Cheltuielile de combustibil, cu litrii declarați (dacă s-au declarat). */
export function alimentari(cheltuieli) {
  return (cheltuieli || [])
    .filter((ch) => !ch.sters && ch.categorie === CATEGORIE_COMBUSTIBIL)
    .map((ch) => ({
      id: ch.id,
      centi: Math.round(Number(ch.sumaCenti) || 0),
      litri: kmValid(ch.litri) && Number(ch.litri) > 0 ? Number(ch.litri) : null,
      data: ch.data || '',
      descriere: ch.descriere || '',
    }));
}

/**
 * Tabloul mașinii.
 * Ce nu se poate calcula rămâne `null` — mai bine o liniuță în interfață decât
 * un zero care arată ca un consum de 0 l/100 km.
 */
export function statistici({ cheltuieli = [], citiri = [] } = {}) {
  const ordonate = citiriOrdonate(citiri);
  const alim = alimentari(cheltuieli);

  const kmStart = ordonate.length ? ordonate[0].km : null;
  const kmUltim = ordonate.length ? ordonate[ordonate.length - 1].km : null;
  const kmParcursi = ordonate.length >= 2 ? kmUltim - kmStart : null;

  const costCombustibilCenti = alim.reduce((s, a) => s + a.centi, 0);
  const litriDeclarati = alim.reduce((s, a) => s + (a.litri || 0), 0);
  const litri = litriDeclarati > 0 ? litriDeclarati : null;

  const consum100 = kmParcursi && kmParcursi > 0 && litri
    ? (litri / kmParcursi) * 100 : null;
  const cost100Centi = kmParcursi && kmParcursi > 0 && costCombustibilCenti > 0
    ? Math.round((costCombustibilCenti / kmParcursi) * 100) : null;

  const costMasinaCenti = (cheltuieli || [])
    .filter((ch) => !ch.sters && (ch.categorie === 'Mașină' || ch.categorie === CATEGORIE_COMBUSTIBIL))
    .reduce((s, ch) => s + Math.round(Number(ch.sumaCenti) || 0), 0);

  return {
    kmStart,
    kmUltim,
    kmParcursi,
    numarCitiri: ordonate.length,
    numarAlimentari: alim.length,
    costCombustibilCenti,
    litri,
    consum100,
    cost100Centi,
    costMasinaCenti,
    citiri: ordonate,
    alimentari: alim,
  };
}
