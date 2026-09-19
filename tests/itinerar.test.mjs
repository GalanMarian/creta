import test from 'node:test';
import assert from 'node:assert/strict';
import {
  minute, oraDin, moment, lant, lantJoi, ziuaCurenta, ceUrmeaza, acumSeIntampla, evenimente,
} from '../js/lib/itinerar.js';

test('ore în minute și înapoi', () => {
  assert.equal(minute('17:05'), 1025);
  assert.equal(minute('00:00'), 0);
  assert.equal(minute('23:59'), 1439);
  assert.ok(Number.isNaN(minute('abc')));
  assert.ok(Number.isNaN(minute('25:99')));
  assert.equal(oraDin(1025), '17:05');
  assert.equal(oraDin(1500), '01:00', 'trece peste miezul nopții');
  assert.equal(oraDin(0), '00:00');
});

test('momentul absolut ține cont de fusul Cretei (UTC+3)', () => {
  const m = moment('2026-09-19', '22:00');
  assert.equal(m.toISOString(), '2026-09-19T19:00:00.000Z');
});

test('sosirea la 02:15 se poate exprima ca 26:15 în ziua precedentă', () => {
  const m = moment('2026-09-19', '26:15');
  assert.equal(m.toISOString(), '2026-09-19T23:15:00.000Z', '02:15 noaptea de 20 sept');
});

// ─────────────────────────────────────────────────────────────────────────────
// Lanțul de joi 24 — motivul pentru care masa s-a mutat de la 17:00 la 15:00.
// Zborul lui Bengi (LS1454) decolează la 19:55, iar Jet2 închide bag-drop-ul
// 40 de minute înainte, la 19:15.
// ─────────────────────────────────────────────────────────────────────────────

test('masa la 17:00 rata bag-drop-ul — conflictul care a pornit tot', () => {
  const r = lantJoi('17:00');
  assert.equal(r.final, '19:55', 'ajung la terminal exact când decolează avionul');
  assert.equal(r.ok, false);
  assert.equal(r.marjaMinute, -40, '40 de minute peste ora limită');
});

test('masa la 15:00 rezolvă lanțul, cu o oră și 20 de minute marjă', () => {
  const r = lantJoi('15:00');
  assert.equal(r.final, '17:55');
  assert.equal(r.ok, true);
  assert.equal(r.marjaMinute, 80);
});

test('chiar și o masă scurtă la 17:00 rămâne pe muchie', () => {
  const r = lantJoi('17:00', { durataMasa: 75 });
  assert.equal(r.final, '19:10');
  assert.equal(r.marjaMinute, 5, 'cinci minute nu sunt o marjă, sunt un pariu');
});

test('ora limită a mutării: pe la 15:35 marja scade sub jumătate de oră', () => {
  assert.ok(lantJoi('15:30').marjaMinute >= 30);
  assert.ok(lantJoi('16:00').marjaMinute < 30);
});

test('pașii lanțului primesc ore în cascadă', () => {
  const r = lantJoi('15:00');
  assert.deepEqual(r.pasi.map((p) => `${p.start}–${p.sfarsit}`), [
    '15:00–17:00', '17:00–17:20', '17:20–17:45', '17:45–17:55',
  ]);
  assert.equal(r.pasi[2].eticheta, 'Predarea mașinii la Eurocars');
});

test('lanț fără limită nu inventează o marjă', () => {
  const r = lant({ start: '09:00', pasi: [{ eticheta: 'x', durataMin: 60 }] });
  assert.equal(r.final, '10:00');
  assert.equal(r.marjaMinute, null);
  assert.equal(r.ok, true);
});

test('lanț cu oră de start invalidă se plânge imediat', () => {
  assert.throws(() => lant({ start: 'mai târziu', pasi: [] }), /invalidă/);
});

// ─────────────────────────────────────────────────────────────────────────────

const ZILE = [
  { data: '2026-09-19', titlu: 'Sosire', program: [{ ora: '21:20', text: 'Decolare Otopeni' }, { ora: '23:20', text: 'Aterizare Heraklion' }] },
  { data: '2026-09-20', titlu: 'Vest', program: [{ ora: '09:00', text: 'Plecare la plajă' }] },
  { data: '2026-09-24', titlu: 'Plecare', program: [{ ora: '15:00', text: 'Peskesi' }] },
];

test('ziua curentă se potrivește după data din Creta', () => {
  assert.equal(ziuaCurenta(ZILE, new Date('2026-09-20T06:00:00Z')).titlu, 'Vest');
  assert.equal(ziuaCurenta(ZILE, new Date('2026-09-21T10:00:00Z')), null, 'zi fără program');
});

test('o zi se termină la miezul nopții din Creta, nu din UTC', () => {
  // 2026-09-19T22:00Z este deja 20 septembrie, 01:00, în Creta
  assert.equal(ziuaCurenta(ZILE, new Date('2026-09-19T22:00:00Z')).titlu, 'Vest');
  assert.equal(ziuaCurenta(ZILE, new Date('2026-09-19T20:00:00Z')).titlu, 'Sosire');
});

test('„ce urmează" sare peste ce a trecut', () => {
  const urm = ceUrmeaza(ZILE, new Date('2026-09-19T19:00:00Z')); // 22:00 în Creta
  assert.equal(urm.text, 'Aterizare Heraklion');
});

test('„ce urmează" trece în ziua următoare când s-a terminat programul', () => {
  const urm = ceUrmeaza(ZILE, new Date('2026-09-19T21:00:00Z')); // 00:00 în Creta
  assert.equal(urm.text, 'Plecare la plajă');
  assert.equal(urm.zi, '2026-09-20');
});

test('după ultimul eveniment nu mai urmează nimic', () => {
  assert.equal(ceUrmeaza(ZILE, new Date('2026-10-01T00:00:00Z')), null);
});

test('„acum se întâmplă" arată ultimul eveniment început', () => {
  const ev = acumSeIntampla(ZILE, new Date('2026-09-20T07:00:00Z')); // 10:00 în Creta
  assert.equal(ev.text, 'Plecare la plajă');
  assert.equal(acumSeIntampla(ZILE, new Date('2026-09-01T00:00:00Z')), null, 'înainte de plecare');
});

test('evenimentele ies în ordine cronologică peste toate zilele', () => {
  const toate = evenimente(ZILE);
  assert.equal(toate.length, 4);
  for (let i = 1; i < toate.length; i += 1) {
    assert.ok(toate[i].moment >= toate[i - 1].moment, 'ordine cronologică');
  }
});

test('evenimentele fără oră sunt sărite, nu aruncate ca erori', () => {
  const toate = evenimente([{ data: '2026-09-19', program: [{ text: 'toată ziua' }, { ora: '09:00', text: 'cu oră' }] }]);
  assert.equal(toate.length, 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// Votul se uită mereu la ziua următoare, nu la cea curentă.
// ─────────────────────────────────────────────────────────────────────────────

import { ziuaDePregatit, bazaZilei } from '../js/lib/itinerar.js';

const ZILE_VOT = [
  { data: '2026-09-19', numar: 1, zona: 'vest', propuneri: [] },
  { data: '2026-09-20', numar: 2, zona: 'vest', propuneri: ['balos'] },
  { data: '2026-09-21', numar: 3, zona: 'vest', propuneri: ['imbros'] },
  { data: '2026-09-22', numar: 4, zona: 'tranzit', propuneri: ['kournas'] },
  { data: '2026-09-23', numar: 5, zona: 'est', propuneri: ['voulisma'] },
  { data: '2026-09-24', numar: 6, zona: 'centru', propuneri: [] },
];

test('înainte de plecare, se pregătește prima zi cu ceva de decis', () => {
  // 18 septembrie: ziua 1 n-are ce vota (zbor și drum), deci sărim la ziua 2
  assert.equal(ziuaDePregatit(ZILE_VOT, new Date('2026-09-18T09:00:00Z')).numar, 2);
});

test('în timpul excursiei, se pregătește ziua de mâine, nu cea de azi', () => {
  // suntem în ziua 2; votul trebuie să fie despre ziua 3
  assert.equal(ziuaDePregatit(ZILE_VOT, new Date('2026-09-20T09:00:00Z')).numar, 3);
  assert.equal(ziuaDePregatit(ZILE_VOT, new Date('2026-09-22T18:00:00Z')).numar, 5);
});

test('după miezul nopții în Creta se trece deja la ziua următoare', () => {
  // 2026-09-20T22:00Z = 21 septembrie, 01:00 în Creta → pregătim ziua 4
  assert.equal(ziuaDePregatit(ZILE_VOT, new Date('2026-09-20T22:00:00Z')).numar, 4);
});

test('la finalul excursiei rămâne ultima zi cu propuneri, nu null', () => {
  assert.equal(ziuaDePregatit(ZILE_VOT, new Date('2026-10-01T00:00:00Z')).numar, 5);
});

test('listă goală nu dărâmă nimic', () => {
  assert.equal(ziuaDePregatit([], new Date()), null);
  assert.equal(ziuaDePregatit(undefined, new Date()), null);
});

test('baza zilei: ziua de tranzit pleacă din vest, ziua din centru pleacă din est', () => {
  assert.equal(bazaZilei(ZILE_VOT[3]), 'vest', 'marți dimineață încă suntem în Maleme');
  assert.equal(bazaZilei(ZILE_VOT[4]), 'est');
  assert.equal(bazaZilei(ZILE_VOT[5]), 'est', 'joi pornim din Amoudara');
  assert.equal(bazaZilei(null), 'vest');
});
