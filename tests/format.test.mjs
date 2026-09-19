import test from 'node:test';
import assert from 'node:assert/strict';
import {
  euro, inEuro, centiDinText, dataLunga, dataScurta, dataCuAn, numeZi,
  durata, raspas, plural, persoane, nopti, km, majuscula,
} from '../js/lib/format.js';

test('sume în euro, cu virgulă zecimală românească', () => {
  assert.equal(euro(0), '0,00 €');
  assert.equal(euro(1234), '12,34 €');
  assert.equal(euro(30000), '300,00 €');
  assert.equal(euro(30000, { scurt: true }), '300 €');
  assert.equal(euro(1234, { scurt: true }), '12,34 €', 'scurt doar când n-are cenți');
  // U+202F: spațiu îngust neseparator, ca „1 234" să nu se rupă pe două rânduri
  assert.equal(euro(123456), '1\u202F234,56 €', 'miile se grupează');
});

test('sumele negative folosesc semnul minus adevărat', () => {
  assert.equal(euro(-1000), '−10,00 €');
  assert.ok(euro(-1000).startsWith('−'), 'U+2212, nu cratimă');
});

test('valori lipsă nu produc NaN în interfață', () => {
  assert.equal(euro(null), '0,00 €');
  assert.equal(euro(undefined), '0,00 €');
  assert.equal(euro(NaN), '0,00 €');
});

test('text scris de om → cenți', () => {
  assert.equal(centiDinText('12,50'), 1250);
  assert.equal(centiDinText('12.50'), 1250);
  assert.equal(centiDinText(' 40 '), 4000);
  assert.equal(centiDinText('0,05'), 5);
  assert.ok(Number.isNaN(centiDinText('')));
  assert.ok(Number.isNaN(centiDinText('douăzeci')));
  assert.ok(Number.isNaN(centiDinText('12,5,3')));
});

test('rotunjirea nu pierde cenți la dus-întors', () => {
  for (const t of ['0,01', '99,99', '1234,56']) {
    const dusIntors = euro(centiDinText(t)).replace(' €', '').replace('\u202F', '');
    assert.equal(dusIntors, t);
  }
});

test('inEuro dă un număr, nu text', () => {
  assert.equal(inEuro(1250), 12.5);
  assert.equal(inEuro(0), 0);
});

test('datele excursiei, scrise în română', () => {
  assert.equal(dataLunga('2026-09-19'), 'sâmbătă, 19 septembrie');
  assert.equal(dataLunga('2026-09-24'), 'joi, 24 septembrie');
  assert.equal(dataScurta('2026-09-22'), 'Mar 22 sep');
  assert.equal(dataCuAn('2026-09-19'), '19 septembrie 2026');
  assert.equal(numeZi('2026-09-19'), 'Sâmbătă');
  assert.equal(numeZi('2026-09-20'), 'Duminică');
});

test('zilele săptămânii sunt corecte pentru toată excursia', () => {
  const asteptat = {
    '2026-09-19': 'Sâmbătă', '2026-09-20': 'Duminică', '2026-09-21': 'Luni',
    '2026-09-22': 'Marți', '2026-09-23': 'Miercuri', '2026-09-24': 'Joi',
  };
  for (const [iso, zi] of Object.entries(asteptat)) assert.equal(numeZi(iso), zi);
});

test('durate', () => {
  assert.equal(durata(135), '2 h 15 min');
  assert.equal(durata(45), '45 min');
  assert.equal(durata(180), '3 h');
  assert.equal(durata(0), '0 min');
});

test('numărătoarea inversă se desface în zile, ore, minute', () => {
  const r = raspas((2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000);
  assert.deepEqual(r, { zile: 2, ore: 3, minute: 4, secunde: 5 });
  assert.deepEqual(raspas(-5000), { zile: 0, ore: 0, minute: 0, secunde: 0 }, 'trecutul e zero');
});

test('pluralul românesc are trei forme', () => {
  assert.equal(plural(1, 'zi', 'zile', 'de zile'), 'zi');
  assert.equal(plural(3, 'zi', 'zile', 'de zile'), 'zile');
  assert.equal(plural(20, 'zi', 'zile', 'de zile'), 'de zile');
  assert.equal(plural(21, 'zi', 'zile', 'de zile'), 'de zile');
  assert.equal(plural(101, 'zi', 'zile', 'de zile'), 'zile', '101 zile, nu 101 de zile');
});

test('persoane și nopți', () => {
  assert.equal(persoane(7), '7 persoane');
  assert.equal(persoane(1), '1 persoană');
  assert.equal(nopti(3), '3 nopți');
  assert.equal(nopti(1), '1 noapte');
});

test('distanțe', () => {
  assert.equal(km(154), '154 km');
  assert.equal(km(1000), '1\u202F000 km');
});

test('majuscula respectă diacriticele', () => {
  assert.equal(majuscula('șapte'), 'Șapte');
  assert.equal(majuscula('înțelegere'), 'Înțelegere');
  assert.equal(majuscula(''), '');
});
