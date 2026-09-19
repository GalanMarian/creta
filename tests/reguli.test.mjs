// Regulile Firestore au o listă albă de tipuri. Dacă aplicația începe să scrie
// un tip care nu e acolo, Firestore răspunde 403 și funcția aceea merge doar
// local — se vede abia când cineva se plânge că nu-i apare nimic pe telefon.
//
// S-a întâmplat o dată, cu `fost` și `propriu`. Testul ăsta e ca să nu se mai
// întâmple.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAD = join(dirname(fileURLToPath(import.meta.url)), '..');

function fisiereJs() {
  const cai = [];
  for (const dir of ['js', 'js/ecrane', 'js/lib', 'js/date']) {
    for (const f of readdirSync(join(RAD, dir))) {
      if (f.endsWith('.js')) cai.push(join(RAD, dir, f));
    }
  }
  return cai;
}

/** Tipurile pe care aplicația chiar le scrie: `adauga(tip, …)` / `seteaza(id, tip, …)`. */
function tipuriScrise() {
  const gasite = new Map();
  for (const cale of fisiereJs()) {
    const sursa = readFileSync(cale, 'utf8');
    for (const m of sursa.matchAll(/\badauga\(\s*'([a-z]+)'/g)) gasite.set(m[1], cale);
    // primul argument poate fi el însuși un apel cu virgule — `idBifa(om, obiect)` —
    // deci sărim peste o pereche de paranteze, nu doar peste text fără virgule
    for (const m of sursa.matchAll(/\bseteaza\(\s*(?:[^,()]|\([^()]*\))*,\s*'([a-z]+)'/g)) gasite.set(m[1], cale);
  }
  return gasite;
}

function tipuriPermise() {
  const reguli = readFileSync(join(RAD, 'firestore.rules'), 'utf8');
  const bloc = reguli.match(/d\.tip in \[([\s\S]*?)\]/);
  assert.ok(bloc, 'firestore.rules trebuie să conțină lista albă `d.tip in [...]`');
  return new Set([...bloc[1].matchAll(/'([a-z]+)'/g)].map((m) => m[1]));
}

test('fiecare tip scris de aplicație e permis de reguli', () => {
  const scrise = tipuriScrise();
  const permise = tipuriPermise();

  assert.ok(scrise.size > 0, 'ar trebui să găsim tipuri scrise în cod');

  const lipsa = [...scrise.keys()].filter((t) => !permise.has(t));
  assert.deepEqual(
    lipsa, [],
    `Tipuri scrise de aplicație dar refuzate de firestore.rules: ${lipsa.join(', ')}.\n`
    + 'Adaugă-le în lista `d.tip in [...]` și republică regulile în consolă.',
  );
});

test('tipurile din reguli sunt scrise undeva în aplicație', () => {
  const scrise = tipuriScrise();
  const permise = tipuriPermise();
  // `propunere` a rămas din prima variantă a votului; îl tolerăm ca vechi
  const invechite = new Set(['propunere']);

  const nefolosite = [...permise].filter((t) => !scrise.has(t) && !invechite.has(t));
  assert.deepEqual(
    nefolosite, [],
    `Reguli mai largi decât e nevoie — tipuri permise dar nefolosite: ${nefolosite.join(', ')}`,
  );
});

test('regulile interzic ștergerea', () => {
  const reguli = readFileSync(join(RAD, 'firestore.rules'), 'utf8');
  assert.match(reguli, /allow delete:\s*if false/,
    'ștergerea trebuie să rămână interzisă — e singura plasă sub registrul de cheltuieli');
});

test('regulile deschid o singură colecție', () => {
  const reguli = readFileSync(join(RAD, 'firestore.rules'), 'utf8');
  const cai = [...reguli.matchAll(/^\s*match\s+(\S+)\s*\{/gm)].map((m) => m[1]);
  assert.deepEqual(cai, ['/databases/{database}/documents', '/creta/{id}'],
    'doar colecția `creta` are voie să fie deschisă');
});

test('toate fișierele din precache-ul service worker-ului există', () => {
  const sw = readFileSync(join(RAD, 'sw.js'), 'utf8');
  const lista = [...sw.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]).filter((c) => c !== './');
  assert.ok(lista.length > 40, 'precache-ul ar trebui să aibă zeci de fișiere');
  const lipsa = lista.filter((c) => {
    try { readFileSync(join(RAD, c)); return false; } catch { return true; }
  });
  assert.deepEqual(lipsa, [], `fișiere puse în cache dar inexistente: ${lipsa.join(', ')}`);
});
