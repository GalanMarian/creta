import test from 'node:test';
import assert from 'node:assert/strict';

import {
  coteEgale, datoriiPeGospodarie, balante, decontare, sumar, totaluri, stadiuAchitare,
} from '../js/lib/split.js';
import { TOTI } from '../js/date/grup.js';

const cheltuiala = (o) => ({
  id: o.id || 'x', sumaCenti: o.sumaCenti, platitDe: o.platitDe,
  participanti: o.participanti || TOTI, comuna: o.comuna !== false,
  achitat: o.achitat || {}, sters: !!o.sters, categorie: o.categorie || 'Altele',
  descriere: o.descriere || '',
});

test('exemplul din cerință: 70 € plătiți de Bengi', () => {
  const ch = cheltuiala({ sumaCenti: 7000, platitDe: 'bengi' });
  const datorii = datoriiPeGospodarie(ch);

  assert.equal(datorii.marian, 1000, 'Marian, un om, datorează 1/7');
  assert.equal(datorii.demian, 2000, 'cuplul datorează 2/7');
  assert.equal(datorii.andrei, 2000);
  assert.equal(datorii.bengi, 2000, 'partea proprie a plătitorului');

  const bal = balante([ch]);
  assert.equal(bal.bengi, 5000, 'Bengi are de primit 70 − 20 = 50 €');
  assert.equal(bal.marian, -1000);
  assert.equal(bal.demian, -2000);
  assert.equal(bal.andrei, -2000);

  const suma = Object.values(bal).reduce((a, b) => a + b, 0);
  assert.equal(suma, 0, 'balanțele se anulează între ele');
});

test('restul de cenți se distribuie: cotele însumează exact suma', () => {
  for (const total of [10000, 1, 7, 99, 12345, 999999, 3]) {
    const cote = coteEgale(total, TOTI);
    const suma = [...cote.values()].reduce((a, b) => a + b, 0);
    assert.equal(suma, total, `${total} cenți la 7 oameni trebuie să însumeze ${total}`);
  }
});

test('100 € la 7: nimeni nu pierde și nimeni nu câștigă mai mult de un cent', () => {
  const cote = coteEgale(10000, TOTI);
  const valori = [...cote.values()];
  assert.equal(valori.reduce((a, b) => a + b, 0), 10000);
  assert.equal(Math.min(...valori), 1428);
  assert.equal(Math.max(...valori), 1429);
  // primii din ordinea canonică iau centul în plus, determinist
  assert.equal(cote.get('marian'), 1429);
  assert.equal(cote.get('diana'), 1428);
});

test('împărțirea e determinista la apeluri repetate', () => {
  const a = [...coteEgale(10000, TOTI).entries()];
  const b = [...coteEgale(10000, TOTI).entries()];
  assert.deepEqual(a, b);
});

test('participanți parțiali: barca la care merg doar patru', () => {
  const ch = cheltuiala({
    sumaCenti: 8000, platitDe: 'marian',
    participanti: ['marian', 'bengi', 'diana', 'andrei'],
  });
  const datorii = datoriiPeGospodarie(ch);
  assert.equal(datorii.marian, 2000);
  assert.equal(datorii.bengi, 4000, 'Bengi + Diana, doi participanți');
  assert.equal(datorii.andrei, 2000);
  assert.equal(datorii.demian, 0, 'Demian și Adina n-au fost, nu datorează');

  const bal = balante([ch]);
  assert.equal(bal.marian, 6000);
  assert.equal(bal.demian, 0);
});

test('bifa de achitare scoate datoria din decontare, pe ambele capete', () => {
  const ch = cheltuiala({ sumaCenti: 7000, platitDe: 'bengi', achitat: { marian: true } });
  const bal = balante([ch]);
  assert.equal(bal.marian, 0, 'Marian a dat banii, nu mai datorează');
  assert.equal(bal.bengi, 4000, 'creditul lui Bengi scade cu cei 10 € primiți');
  assert.equal(Object.values(bal).reduce((a, b) => a + b, 0), 0);
});

test('cheltuiala ștearsă și cea individuală nu intră în decontare', () => {
  const lista = [
    cheltuiala({ id: 'a', sumaCenti: 7000, platitDe: 'bengi', sters: true }),
    cheltuiala({ id: 'b', sumaCenti: 5000, platitDe: 'andrei', comuna: false }),
  ];
  const bal = balante(lista);
  assert.deepEqual(bal, { marian: 0, demian: 0, andrei: 0, bengi: 0 });

  const t = totaluri(lista);
  assert.equal(t.comun, 0);
  assert.equal(t.individual, 5000);
});

test('mai multe cheltuieli se compensează între ele', () => {
  const lista = [
    cheltuiala({ id: 'a', sumaCenti: 7000, platitDe: 'bengi' }),
    cheltuiala({ id: 'b', sumaCenti: 7000, platitDe: 'marian' }),
  ];
  const bal = balante(lista);
  // fiecare a plătit 70; fiecare datorează pentru ambele: Marian 20, cuplurile 40
  assert.equal(bal.marian, 7000 - 2000, 'a plătit 70, îi revin 20 din total');
  assert.equal(bal.bengi, 7000 - 4000);
  assert.equal(bal.demian, -4000);
  assert.equal(bal.andrei, -4000);
  assert.equal(Object.values(bal).reduce((a, b) => a + b, 0), 0);
});

test('decontarea aduce toate balanțele la zero', () => {
  const lista = [
    cheltuiala({ id: 'a', sumaCenti: 7000, platitDe: 'bengi' }),
    cheltuiala({ id: 'b', sumaCenti: 12345, platitDe: 'marian' }),
    cheltuiala({ id: 'c', sumaCenti: 5000, platitDe: 'andrei', participanti: ['andrei', 'sara', 'marian'] }),
  ];
  const bal = balante(lista);
  const transferuri = decontare(bal);

  const dupa = { ...bal };
  for (const t of transferuri) {
    dupa[t.deLa] += t.centi;
    dupa[t.catre] -= t.centi;
  }
  for (const [id, centi] of Object.entries(dupa)) {
    assert.equal(centi, 0, `${id} trebuie să rămână pe zero după decontare`);
  }
  assert.ok(transferuri.length <= 3, 'cel mult 3 transferuri pentru 4 portofele');
  assert.ok(transferuri.every((t) => t.centi > 0), 'nu emitem transferuri de 0 €');
});

test('decontarea unei liste goale nu produce transferuri', () => {
  assert.deepEqual(decontare(balante([])), []);
});

test('sumar: cât a scos fiecare și cât îi revine', () => {
  const lista = [
    cheltuiala({ id: 'a', sumaCenti: 7000, platitDe: 'bengi' }),
    cheltuiala({ id: 'b', sumaCenti: 3000, platitDe: 'bengi', comuna: false }),
  ];
  const s = sumar(lista);
  assert.equal(s.bengi.platit, 10000, 'tot ce a scos din buzunar');
  assert.equal(s.bengi.platitComun, 7000);
  assert.equal(s.bengi.individual, 3000);
  assert.equal(s.bengi.parteaLor, 2000, 'partea lui din cheltuiala comună');
  assert.equal(s.bengi.balanta, 5000);
  assert.equal(s.marian.platit, 0);
  assert.equal(s.marian.parteaLor, 1000);
});

test('stadiul achitării numără doar datornicii, nu plătitorul', () => {
  const ch = cheltuiala({ sumaCenti: 7000, platitDe: 'bengi' });
  assert.deepEqual(stadiuAchitare(ch), { datori: 3, achitati: 0, gata: false });

  const parti = cheltuiala({ sumaCenti: 7000, platitDe: 'bengi', achitat: { marian: true } });
  assert.deepEqual(stadiuAchitare(parti), { datori: 3, achitati: 1, gata: false });

  const tot = cheltuiala({
    sumaCenti: 7000, platitDe: 'bengi',
    achitat: { marian: true, demian: true, andrei: true },
  });
  assert.equal(stadiuAchitare(tot).gata, true);
});

test('avansul mașinii: 54 € plătiți de Bengi', () => {
  const ch = cheltuiala({ sumaCenti: 5400, platitDe: 'bengi', descriere: 'Avans mașină' });
  const bal = balante([ch]);
  // 5400/7 = 771,43 -> Bengi are de primit 5400 - 2*772 sau 2*771, în funcție de rest
  const datorii = datoriiPeGospodarie(ch);
  assert.equal(Object.values(datorii).reduce((a, b) => a + b, 0), 5400);
  assert.equal(bal.bengi, 5400 - datorii.bengi);
  assert.ok(bal.bengi > 3800 && bal.bengi < 3900, `Bengi are de primit ~38,57 €, a ieșit ${bal.bengi}`);
});

test('restul de plată al mașinii, 300 € cash, împărțit la 7', () => {
  const ch = cheltuiala({ sumaCenti: 30000, platitDe: 'bengi', descriere: 'Rest mașină' });
  const datorii = datoriiPeGospodarie(ch);
  assert.equal(Object.values(datorii).reduce((a, b) => a + b, 0), 30000);
  // 30000/7 = 4285,71 -> baza 4285, rest 5 cenți la primii cinci din ordine
  assert.equal(datorii.marian, 4286);
  assert.equal(datorii.demian, 8572, 'Demian + Adina, ambii printre primii cinci');
  assert.equal(datorii.andrei, 8572);
  assert.equal(datorii.bengi, 8570, 'Bengi + Diana rămân la bază, 2 cenți mai puțin');
});

test('sume negative (o restituire) se împart la fel, cu semn', () => {
  const cote = coteEgale(-7000, TOTI);
  assert.equal([...cote.values()].reduce((a, b) => a + b, 0), -7000);
  assert.ok([...cote.values()].every((v) => v < 0));
});

test('participanți necunoscuți sunt ignorați, nu rup calculul', () => {
  const cote = coteEgale(1000, ['marian', 'cineva-strain']);
  assert.equal([...cote.values()].reduce((a, b) => a + b, 0), 1000);
  assert.equal(cote.get('marian'), 1000);
});

test('lista goală de participanți cade pe toți cei 7', () => {
  const ch = cheltuiala({ sumaCenti: 7000, platitDe: 'marian', participanti: [] });
  const datorii = datoriiPeGospodarie(ch);
  assert.equal(Object.values(datorii).reduce((a, b) => a + b, 0), 7000);
  assert.equal(datorii.marian, 1000);
});
