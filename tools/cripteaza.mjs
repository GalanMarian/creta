#!/usr/bin/env node
// Ia `secrete.local.json` (care nu intră în git) și scrie `js/date/secret.json`
// criptat cu parola grupului.
//
//   node tools/cripteaza.mjs
//   node tools/cripteaza.mjs --parola "..."     (pentru automatizări)
//
// Parola nu se scrie niciodată pe disc și nu intră în istoricul git. Dacă o
// pierdeți, se rulează scriptul din nou cu alta — sursa e tot pe calculator.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cripteaza, decripteaza } from '../js/lib/cripto.js';

const rad = join(dirname(fileURLToPath(import.meta.url)), '..');
const SURSA = join(rad, 'secrete.local.json');
const DESTINATIE = join(rad, 'js/date/secret.json');

function intreabaParola(mesaj) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    // ascundem ce se tastează
    const scrieOriginal = rl._writeToOutput?.bind(rl);
    rl._writeToOutput = function (s) {
      if (s.includes(mesaj)) return scrieOriginal(s);
      return scrieOriginal('');
    };
    rl.question(mesaj, (rasp) => {
      rl.close();
      process.stdout.write('\n');
      resolve(rasp);
    });
  });
}

const arg = process.argv.indexOf('--parola');
let parola = arg > -1 ? process.argv[arg + 1] : null;

if (!existsSync(SURSA)) {
  console.error(`✖ Lipsește ${SURSA}`);
  console.error('  Creează-l după modelul din README și rulează din nou.');
  process.exit(1);
}

const sursa = JSON.parse(readFileSync(SURSA, 'utf8'));
delete sursa['_citeste-ma'];

if (!parola) {
  parola = await intreabaParola('Parola grupului: ');
  const confirmare = await intreabaParola('Încă o dată:     ');
  if (parola !== confirmare) {
    console.error('✖ Parolele nu coincid.');
    process.exit(1);
  }
}

if (!parola || parola.length < 6) {
  console.error('✖ Parola trebuie să aibă minimum 6 caractere.');
  process.exit(1);
}

const blob = await cripteaza(sursa, parola);

// verificăm pe loc că se poate decripta — mai bine acum decât în Creta
const verificare = await decripteaza(blob, parola);
if (JSON.stringify(verificare) !== JSON.stringify(sursa)) {
  console.error('✖ Verificarea a eșuat: ce s-a criptat nu se decriptează identic.');
  process.exit(1);
}

writeFileSync(DESTINATIE, `${JSON.stringify(blob, null, 2)}\n`, 'utf8');

const marime = JSON.stringify(blob).length;
console.log('✔ Scris js/date/secret.json');
console.log(`  ${marime} octeți, ${blob.iteratii.toLocaleString('ro-RO')} iterații PBKDF2`);
console.log('  Verificat: se decriptează corect cu parola dată.');
console.log('');
console.log('  Parola NU e salvată nicăieri. Trimite-o grupului pe un canal separat');
console.log('  de adresa site-ului (nu în același mesaj).');
