import test from 'node:test';
import assert from 'node:assert/strict';
import { statistici, citiriOrdonate, alimentari } from '../js/lib/masina.js';

const ch = (o) => ({ id: o.id, sumaCenti: o.sumaCenti, categorie: o.categorie, litri: o.litri, sters: !!o.sters, data: o.data || '' });

test('fără nicio citire, totul e null — nu zero', () => {
  const s = statistici({});
  assert.equal(s.kmStart, null);
  assert.equal(s.kmParcursi, null);
  assert.equal(s.consum100, null, 'un 0 l/100 km ar fi o minciună, nu o lipsă de date');
  assert.equal(s.cost100Centi, null);
});

test('o singură citire dă kilometrajul de start, dar nu parcursul', () => {
  const s = statistici({ citiri: [{ km: 84500, cand: '2026-09-19T22:10' }] });
  assert.equal(s.kmStart, 84500);
  assert.equal(s.kmUltim, 84500);
  assert.equal(s.kmParcursi, null);
});

test('km parcurși, consum și cost pe 100 km', () => {
  const s = statistici({
    citiri: [
      { km: 84500, cand: '2026-09-19T22:10' },
      { km: 85500, cand: '2026-09-24T17:40' },
    ],
    cheltuieli: [
      ch({ id: 'a', sumaCenti: 6000, categorie: 'Combustibil', litri: 35 }),
      ch({ id: 'b', sumaCenti: 4000, categorie: 'Combustibil', litri: 25 }),
      ch({ id: 'c', sumaCenti: 9000, categorie: 'Restaurant' }),
    ],
  });
  assert.equal(s.kmParcursi, 1000);
  assert.equal(s.litri, 60);
  assert.equal(s.costCombustibilCenti, 10000, 'doar combustibilul, nu restaurantul');
  assert.equal(s.consum100, 6, '60 l pe 1000 km = 6 l/100 km');
  assert.equal(s.cost100Centi, 1000, '100 € pe 1000 km = 10 €/100 km');
  assert.equal(s.numarAlimentari, 2);
});

test('fără litri declarați, costul pe 100 km se calculează oricum', () => {
  const s = statistici({
    citiri: [{ km: 1000, cand: 'a' }, { km: 1500, cand: 'b' }],
    cheltuieli: [ch({ id: 'a', sumaCenti: 5000, categorie: 'Combustibil' })],
  });
  assert.equal(s.litri, null, 'nu inventăm litri');
  assert.equal(s.consum100, null);
  assert.equal(s.cost100Centi, 1000, 'dar €/100 km nu depinde de litri');
});

test('cheltuielile șterse nu intră în combustibil', () => {
  const s = statistici({
    cheltuieli: [
      ch({ id: 'a', sumaCenti: 6000, categorie: 'Combustibil', litri: 30 }),
      ch({ id: 'b', sumaCenti: 9999, categorie: 'Combustibil', litri: 99, sters: true }),
    ],
  });
  assert.equal(s.costCombustibilCenti, 6000);
  assert.equal(s.litri, 30);
});

test('costul total al mașinii adună închirierea și combustibilul', () => {
  const s = statistici({
    cheltuieli: [
      ch({ id: 'a', sumaCenti: 30000, categorie: 'Mașină' }),
      ch({ id: 'b', sumaCenti: 5400, categorie: 'Mașină' }),
      ch({ id: 'c', sumaCenti: 10000, categorie: 'Combustibil', litri: 60 }),
      ch({ id: 'd', sumaCenti: 7000, categorie: 'Restaurant' }),
    ],
  });
  assert.equal(s.costMasinaCenti, 45400, '300 + 54 + 100 €, fără restaurant');
});

test('citirile se ordonează cronologic, oricum sunt introduse', () => {
  const o = citiriOrdonate([
    { km: 85500, cand: '2026-09-24T17:40' },
    { km: 84500, cand: '2026-09-19T22:10' },
    { km: 85000, cand: '2026-09-22T09:00' },
  ]);
  assert.deepEqual(o.map((c) => c.km), [84500, 85000, 85500]);
});

test('citirile fără număr valid sunt ignorate', () => {
  const o = citiriOrdonate([{ km: 'abc', cand: 'a' }, { km: 100, cand: 'b' }, { km: null, cand: 'c' }]);
  assert.equal(o.length, 1);
});

test('litrii zero sau negativi nu se iau în seamă', () => {
  const a = alimentari([
    { id: '1', sumaCenti: 1000, categorie: 'Combustibil', litri: 0 },
    { id: '2', sumaCenti: 1000, categorie: 'Combustibil', litri: -5 },
  ]);
  assert.equal(a[0].litri, null);
  assert.equal(a[1].litri, null);
});

test('kilometraj care merge în jos nu produce parcurs negativ absurd', () => {
  // dacă cineva greșește o cifră, vrem să se vadă, nu să se ascundă
  const s = statistici({ citiri: [{ km: 85000, cand: 'a' }, { km: 84000, cand: 'b' }] });
  assert.equal(s.kmParcursi, -1000, 'se vede că e o greșeală de introducere');
  assert.equal(s.consum100, null, 'dar nu calculăm consum pe km negativi');
});

test('citirea golită nu devine „0 km" — altfel parcursul ar sări la 85.000', () => {
  const s = statistici({
    citiri: [{ km: '', cand: 'a' }, { km: 84500, cand: 'b' }, { km: 84900, cand: 'c' }],
  });
  assert.equal(s.kmStart, 84500, 'citirea goală e ignorată, nu tratată ca zero');
  assert.equal(s.kmParcursi, 400);
});
