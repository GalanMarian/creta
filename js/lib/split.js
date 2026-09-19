// Motorul de bani. Funcții pure, fără DOM și fără Firestore — ca să poată fi
// testate cu `node --test`.
//
// TOTUL SE CALCULEAZĂ ÎN CENȚI ÎNTREGI. Împărțirea a 100 € la 7 dă 14,2857…,
// iar dacă rotunjim fiecare cotă separat suma iese 99,99 sau 100,03. De aceea
// lucrăm în întregi și distribuim restul explicit: suma cotelor e mereu, exact,
// suma cheltuielii.

import { GOSPODARII, TOTI, gospodariaLui, ordoneazaPersoane } from '../date/grup.js';

/**
 * Împarte o sumă între participanți, pe cap de om.
 * Restul (0…n-1 cenți) se dă cîte un cent primilor participanți în ordinea
 * canonică a grupului — determinist, ca să nu se schimbe cifrele la fiecare
 * randare.
 * @returns {Map<string, number>} id persoană → cenți
 */
export function coteEgale(sumaCenti, participanti) {
  const suma = Math.round(Number(sumaCenti) || 0);
  const oameni = ordoneazaPersoane(
    (participanti && participanti.length ? participanti : TOTI).filter((id) => TOTI.includes(id)),
  );
  const cote = new Map();
  if (oameni.length === 0) return cote;

  const negativ = suma < 0;
  const abs = Math.abs(suma);
  const baza = Math.floor(abs / oameni.length);
  let rest = abs - baza * oameni.length;

  for (const id of oameni) {
    let val = baza;
    if (rest > 0) {
      val += 1;
      rest -= 1;
    }
    cote.set(id, negativ ? -val : val);
  }
  return cote;
}

/** O cheltuială e „comună" dacă se împarte. Cele individuale nu intră în decontare. */
export function esteComuna(cheltuiala) {
  return !cheltuiala.sters && cheltuiala.comuna !== false;
}

/**
 * Cât datorează fiecare gospodărie pentru o singură cheltuială — inclusiv
 * gospodăria care a plătit (partea ei proprie).
 * @returns {Object<string, number>} id gospodărie → cenți
 */
export function datoriiPeGospodarie(cheltuiala, gospodarii = GOSPODARII) {
  const cote = coteEgale(cheltuiala.sumaCenti, cheltuiala.participanti);
  const peGosp = {};
  for (const g of gospodarii) peGosp[g.id] = 0;
  for (const [idPersoana, centi] of cote) {
    const idGosp = gospodariaLui(idPersoana);
    if (idGosp in peGosp) peGosp[idGosp] += centi;
  }
  return peGosp;
}

/**
 * Balanța netă a fiecărei gospodării peste toate cheltuielile comune.
 * Pozitiv = are de primit. Negativ = are de dat.
 *
 * O bifă de achitare (`achitat[idGospodarie] === true`) înseamnă că gospodăria
 * i-a dat deja banii plătitorului: datoria ei dispare ȘI creditul
 * plătitorului scade cu aceeași sumă. Altfel banii s-ar număra de două ori.
 */
export function balante(cheltuieli, gospodarii = GOSPODARII) {
  const bal = {};
  for (const g of gospodarii) bal[g.id] = 0;

  for (const ch of cheltuieli) {
    if (!esteComuna(ch)) continue;
    const gospPlatitor = gospodariaLui(ch.platitDe);
    if (!(gospPlatitor in bal)) continue;

    const datorii = datoriiPeGospodarie(ch, gospodarii);
    const achitat = ch.achitat || {};

    for (const [idGosp, centi] of Object.entries(datorii)) {
      if (idGosp === gospPlatitor) continue; // partea proprie nu se mișcă
      if (centi === 0) continue;
      if (achitat[idGosp]) continue;         // deja dați din mână în mână
      bal[idGosp] -= centi;
      bal[gospPlatitor] += centi;
    }
  }
  return bal;
}

/**
 * Transferuri care aduc toate balanțele la zero, cât mai puține la număr.
 * Potrivire lacomă: cel mai datornic cu cel mai creditor. Pentru patru
 * portofele iese mereu în cel mult trei transferuri.
 * @returns {Array<{deLa: string, catre: string, centi: number}>}
 */
export function decontare(bal) {
  const datornici = [];
  const creditori = [];
  for (const [id, centi] of Object.entries(bal)) {
    if (centi < 0) datornici.push({ id, centi: -centi });
    else if (centi > 0) creditori.push({ id, centi });
  }
  // stabil: sumă descrescătoare, apoi id alfabetic
  const cmp = (a, b) => b.centi - a.centi || a.id.localeCompare(b.id);
  datornici.sort(cmp);
  creditori.sort(cmp);

  const transferuri = [];
  let i = 0;
  let j = 0;
  while (i < datornici.length && j < creditori.length) {
    const suma = Math.min(datornici[i].centi, creditori[j].centi);
    if (suma > 0) {
      transferuri.push({ deLa: datornici[i].id, catre: creditori[j].id, centi: suma });
      datornici[i].centi -= suma;
      creditori[j].centi -= suma;
    }
    if (datornici[i].centi === 0) i += 1;
    if (creditori[j].centi === 0) j += 1;
  }
  return transferuri;
}

/**
 * Tabloul complet, per gospodărie:
 *  - `platit`      cât a scos efectiv din buzunar (comune + individuale)
 *  - `platitComun` cât a scos pentru cheltuieli comune
 *  - `parteaLor`   cât le revine din cheltuielile comune
 *  - `individual`  cheltuieli proprii, care nu se împart
 *  - `balanta`     net: pozitiv = are de primit
 */
export function sumar(cheltuieli, gospodarii = GOSPODARII) {
  const pe = {};
  for (const g of gospodarii) {
    pe[g.id] = { platit: 0, platitComun: 0, parteaLor: 0, individual: 0, balanta: 0 };
  }

  for (const ch of cheltuieli) {
    if (ch.sters) continue;
    const gosp = gospodariaLui(ch.platitDe);
    if (!(gosp in pe)) continue;
    const suma = Math.round(Number(ch.sumaCenti) || 0);

    pe[gosp].platit += suma;

    if (esteComuna(ch)) {
      pe[gosp].platitComun += suma;
      const datorii = datoriiPeGospodarie(ch, gospodarii);
      for (const [idGosp, centi] of Object.entries(datorii)) {
        pe[idGosp].parteaLor += centi;
      }
    } else {
      pe[gosp].individual += suma;
    }
  }

  const bal = balante(cheltuieli, gospodarii);
  for (const id of Object.keys(pe)) pe[id].balanta = bal[id];
  return pe;
}

/** Totalurile excursiei. */
export function totaluri(cheltuieli) {
  let comun = 0;
  let individual = 0;
  for (const ch of cheltuieli) {
    if (ch.sters) continue;
    const suma = Math.round(Number(ch.sumaCenti) || 0);
    if (esteComuna(ch)) comun += suma;
    else individual += suma;
  }
  return { comun, individual, tot: comun + individual };
}

/**
 * Câte gospodării mai au de achitat o cheltuială anume (fără plătitor).
 * Folosit pentru bifele din listă.
 */
export function stadiuAchitare(cheltuiala, gospodarii = GOSPODARII) {
  if (!esteComuna(cheltuiala)) return { datori: 0, achitati: 0, gata: true };
  const gospPlatitor = gospodariaLui(cheltuiala.platitDe);
  const datorii = datoriiPeGospodarie(cheltuiala, gospodarii);
  const achitat = cheltuiala.achitat || {};
  let datori = 0;
  let achitati = 0;
  for (const [idGosp, centi] of Object.entries(datorii)) {
    if (idGosp === gospPlatitor || centi === 0) continue;
    datori += 1;
    if (achitat[idGosp]) achitati += 1;
  }
  return { datori, achitati, gata: datori > 0 && datori === achitati };
}
