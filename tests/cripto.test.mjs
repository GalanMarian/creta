import test from 'node:test';
import assert from 'node:assert/strict';
import { cripteaza, decripteaza, amprenta } from '../js/lib/cripto.js';

const PAROLA = 'creta-2026-șapte-prieteni';

test('dus-întors: ce criptăm se decriptează identic', async () => {
  const original = {
    zbor: { cod: 'XJ9ETL', numar: 'W43055' },
    cazare: [{ nume: 'Aegean Breeze', pin: '3932' }, { nume: 'Poppy Villas', pin: '0006' }],
    telefoane: ['+30 2831 071053', '+30 6970 017115'],
  };
  const blob = await cripteaza(original, PAROLA);
  assert.equal(blob.v, 1);
  assert.ok(blob.salt && blob.iv && blob.ct);
  assert.deepEqual(await decripteaza(blob, PAROLA), original);
});

test('diacriticele supraviețuiesc criptării', async () => {
  const text = { nota: 'Înțelegere: șapte oameni, țară străină, mașină închiriată. Ș Ț Ă Â Î' };
  const blob = await cripteaza(text, PAROLA);
  assert.deepEqual(await decripteaza(blob, PAROLA), text);
});

test('parola greșită eșuează curat, nu cu zgomot', async () => {
  const blob = await cripteaza({ a: 1 }, PAROLA);
  await assert.rejects(
    () => decripteaza(blob, 'altceva'),
    (e) => e.cod === 'EROARE_PAROLA' && /Parolă greșită/.test(e.message),
  );
});

test('textul modificat e respins — GCM verifică integritatea', async () => {
  const blob = await cripteaza({ pin: '3932' }, PAROLA);
  const octeti = atob(blob.ct).split('');
  octeti[5] = octeti[5] === 'A' ? 'B' : 'A';
  const stricat = { ...blob, ct: btoa(octeti.join('')) };
  await assert.rejects(() => decripteaza(stricat, PAROLA), (e) => e.cod === 'EROARE_PAROLA');
});

test('fiecare criptare are salt și iv proprii', async () => {
  const a = await cripteaza({ x: 1 }, PAROLA);
  const b = await cripteaza({ x: 1 }, PAROLA);
  assert.notEqual(a.salt, b.salt, 'salt refolosit ar slăbi derivarea cheii');
  assert.notEqual(a.iv, b.iv, 'iv refolosit cu aceeași cheie e o greșeală gravă la GCM');
  assert.notEqual(a.ct, b.ct);
});

test('blocul lipsă sau parola lipsă dau erori vorbitoare', async () => {
  await assert.rejects(() => decripteaza(null, PAROLA), /lipsește/);
  await assert.rejects(() => decripteaza({ ct: 'x', iv: 'x', salt: 'x' }, ''), /Parola lipsește/);
  await assert.rejects(() => cripteaza({}, ''), /Parola lipsește/);
});

test('amprenta e stabilă și scurtă', async () => {
  assert.equal(await amprenta(PAROLA), await amprenta(PAROLA));
  assert.notEqual(await amprenta(PAROLA), await amprenta('altceva'));
  assert.equal((await amprenta(PAROLA)).length, 12);
});
