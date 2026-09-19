// Numărătoarea voturilor. Fiecare dintre cei 7 dă Da / Poate / Nu pe fiecare
// propunere; documentul din Firestore are id determinist (`vot_<loc>_<om>`),
// deci re-votul suprascrie în loc să dubleze.

export const VALORI = ['da', 'poate', 'nu'];

export const PUNCTE = { da: 2, poate: 1, nu: -2 };

export const ETICHETE = {
  da: 'Da, vreau',
  poate: 'Nu mă supăr',
  nu: 'Mai bine nu',
};

/**
 * Situația unei propuneri.
 * `scor` e doar pentru ordonare; în interfață se arată numărătoarea, ca să nu
 * pară o cifră scoasă din pălărie.
 */
export function numara(voturi, idPropunere) {
  const aleSale = (voturi || []).filter((v) => !v.sters && v.propunere === idPropunere);
  const peOm = {};
  const total = { da: 0, poate: 0, nu: 0 };

  for (const v of aleSale) {
    if (!VALORI.includes(v.valoare)) continue;
    peOm[v.persoana] = v.valoare;
  }
  for (const valoare of Object.values(peOm)) total[valoare] += 1;

  const votanti = Object.keys(peOm).length;
  const scor = total.da * PUNCTE.da + total.poate * PUNCTE.poate + total.nu * PUNCTE.nu;

  return { ...total, votanti, scor, peOm };
}

/** Clasamentul propunerilor: scor, apoi mai multe „da", apoi alfabetic. */
export function clasament(voturi, propuneri) {
  return (propuneri || [])
    .map((p) => ({ propunere: p, rezultat: numara(voturi, p.id) }))
    .sort((a, b) => b.rezultat.scor - a.rezultat.scor
      || b.rezultat.da - a.rezultat.da
      || String(a.propunere.nume || '').localeCompare(String(b.propunere.nume || ''), 'ro'));
}

/** Cine dintre cei 7 n-a votat încă — ca să știm pe cine mai împingem. */
export function lipsesc(voturi, idPropunere, toti) {
  const { peOm } = numara(voturi, idPropunere);
  return (toti || []).filter((id) => !(id in peOm));
}
