import test from 'node:test';
import assert from 'node:assert/strict';
import { numara, clasament, lipsesc } from '../js/lib/voturi.js';
import { TOTI } from '../js/date/grup.js';

const vot = (persoana, propunere, valoare) => ({ persoana, propunere, valoare, sters: false });

test('numărătoarea simplă', () => {
  const r = numara([
    vot('marian', 'balos', 'da'),
    vot('bengi', 'balos', 'da'),
    vot('diana', 'balos', 'poate'),
    vot('sara', 'balos', 'nu'),
  ], 'balos');
  assert.equal(r.da, 2);
  assert.equal(r.poate, 1);
  assert.equal(r.nu, 1);
  assert.equal(r.votanti, 4);
  assert.equal(r.scor, 2 * 2 + 1 - 2);
});

test('re-votul aceleiași persoane înlocuiește, nu se adună', () => {
  const r = numara([
    vot('marian', 'balos', 'nu'),
    vot('marian', 'balos', 'da'),
  ], 'balos');
  assert.equal(r.votanti, 1, 'un om, un vot');
  assert.equal(r.da, 1);
  assert.equal(r.nu, 0);
  assert.equal(r.peOm.marian, 'da', 'ultimul vot câștigă');
});

test('voturile altor propuneri nu se amestecă', () => {
  const voturi = [vot('marian', 'balos', 'da'), vot('marian', 'elafonisi', 'nu')];
  assert.equal(numara(voturi, 'balos').da, 1);
  assert.equal(numara(voturi, 'elafonisi').nu, 1);
  assert.equal(numara(voturi, 'elafonisi').da, 0);
});

test('voturile șterse și valorile inventate sunt ignorate', () => {
  const r = numara([
    { persoana: 'marian', propunere: 'x', valoare: 'da', sters: true },
    { persoana: 'sara', propunere: 'x', valoare: 'poate-cumva' },
    vot('bengi', 'x', 'da'),
  ], 'x');
  assert.equal(r.votanti, 1);
  assert.equal(r.da, 1);
});

test('clasamentul pune în față ce vrea grupul', () => {
  const propuneri = [
    { id: 'balos', nume: 'Balos' },
    { id: 'elafonisi', nume: 'Elafonisi' },
    { id: 'falassarna', nume: 'Falassarna' },
  ];
  const voturi = [
    vot('marian', 'balos', 'da'), vot('bengi', 'balos', 'da'), vot('sara', 'balos', 'da'),
    vot('marian', 'elafonisi', 'poate'),
    vot('marian', 'falassarna', 'nu'), vot('bengi', 'falassarna', 'nu'),
  ];
  const c = clasament(voturi, propuneri);
  assert.deepEqual(c.map((x) => x.propunere.id), ['balos', 'elafonisi', 'falassarna']);
  assert.equal(c[0].rezultat.scor, 6);
  assert.equal(c[2].rezultat.scor, -4);
});

test('la egalitate de scor decid „da"-urile, apoi alfabetul românesc', () => {
  const propuneri = [{ id: 'b', nume: 'Șinca' }, { id: 'a', nume: 'Aradul' }];
  const c = clasament([], propuneri);
  assert.deepEqual(c.map((x) => x.propunere.nume), ['Aradul', 'Șinca']);
});

test('vedem cine n-a votat', () => {
  const l = lipsesc([vot('marian', 'balos', 'da'), vot('bengi', 'balos', 'nu')], 'balos', TOTI);
  assert.equal(l.length, 5);
  assert.ok(!l.includes('marian'));
  assert.ok(l.includes('adina'));
});

test('propunere fără niciun vot are scor zero, nu explodează', () => {
  const r = numara([], 'nimic');
  assert.deepEqual({ da: r.da, poate: r.poate, nu: r.nu, votanti: r.votanti, scor: r.scor },
    { da: 0, poate: 0, nu: 0, votanti: 0, scor: 0 });
});
