// Setări: cine sunt, codurile, copia de siguranță, starea sincronizării.

import {
  el, frag, capSectiune, eticheta, paine, randDate, confirma,
  deschideFereastra, inchideFereastra,
} from '../ui.js';
import * as stare from '../stare.js';
import * as identitate from '../identitate.js';
import * as secrete from '../secrete.js';
import { PERSOANE, ROLURI } from '../date/grup.js';
import { CONFIG } from '../firestore.js';
import { avertismenteOrdonate } from '../date/avertismente.js';
import { esteRezolvat, rezolva } from '../fapte.js';

function descarca(numeFisier, continut) {
  const blob = new Blob([continut], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = numeFisier;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ecranSetari() {
  const eu = identitate.euPersoana();
  const s = stare.stareSincronizare();
  const nrInregistrari = stare.toate().filter((i) => !i.sters).length;

  return frag(
    el('section', { class: 'sectiune' },
      capSectiune('Cine sunt'),
      el('div', { class: 'card' },
        eu
          ? frag(
            el('div', { style: 'display:flex;align-items:center;gap:12px' },
              el('span', { class: 'poarta-nume-cerc' }, eu.initiale),
              el('div', { style: 'flex:1' },
                el('div', { style: 'font-weight:650' }, eu.numeComplet),
                ROLURI[eu.id] ? el('div', { style: 'font-size:12.5px;color:var(--text-slab)' }, ROLURI[eu.id]) : null,
              ),
            ),
            el('p', { style: 'margin-top:10px;font-size:12.5px;color:var(--text-slab)' },
              'Numele se folosește la voturi, la pachet și la cheltuieli. E ținut minte doar pe telefonul ăsta.'),
            el('button', {
              class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:11px',
              on: {
                click: () => deschideFereastra('Schimbă numele', el('div', {},
                  ...PERSOANE.map((p) => el('button', {
                    class: 'poarta-nume', type: 'button', style: 'margin-bottom:7px',
                    on: {
                      click: () => {
                        identitate.alege(p.id);
                        inchideFereastra();
                        paine(`Acum ești ${p.nume}`);
                      },
                    },
                  },
                    el('span', { class: 'poarta-nume-cerc' }, p.initiale),
                    el('span', { class: 'poarta-nume-text' }, p.numeComplet),
                  )),
                )),
              },
            }, 'Schimbă'),
          )
          : el('p', {}, 'Nu ți-ai ales încă numele.'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Codurile și PIN-urile',
        eticheta(secrete.esteDeblocat() ? 'Deblocate' : 'Încuiate',
          secrete.esteDeblocat() ? 'verde' : null)),
      el('div', { class: 'card' },
        el('p', { style: 'font-size:13.5px' },
          secrete.esteDeblocat()
            ? 'Codurile de rezervare, PIN-urile cazărilor și contactul gazdei sunt vizibile pe telefonul ăsta și merg fără internet.'
            : 'Datele sensibile stau criptate în site, fiindcă adresa e publică. Se deblochează o singură dată, cu parola grupului.'),
        secrete.esteDeblocat()
          ? el('button', {
            class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:11px',
            on: {
              click: () => {
                secrete.blocheaza();
                paine('Încuiat pe telefonul ăsta.');
              },
            },
          }, 'Încuie din nou')
          : el('a', { href: '#/rezervari', class: 'buton buton-lat', style: 'margin-top:11px' }, 'Deblochează'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Sincronizare'),
      el('div', { class: 'card' },
        el('div', { class: 'date-lista' },
          randDate('Stare', s.stare === 'gata' ? 'La zi'
            : s.stare === 'offline' ? 'Fără internet'
              : s.stare === 'eroare' ? 'Eroare'
                : s.stare === 'citeste' ? 'Se citește…'
                  : s.stare === 'trimite' ? 'Se trimite…' : 'Pornire'),
          randDate('Ultima sincronizare', s.cand ? new Date(s.cand).toLocaleString('ro-RO') : '—'),
          randDate('În așteptare', String(s.inCoada)),
          randDate('Înregistrări', String(nrInregistrari)),
          randDate('Proiect', CONFIG.proiect),
        ),
        s.eroare ? el('div', { class: 'alerta alerta-atentie', style: 'margin-top:11px' },
          el('div', { class: 'alerta-corp' }, s.eroare)) : null,
        el('button', {
          class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:11px',
          on: {
            click: async () => {
              await stare.sincronizeaza();
              paine('Sincronizat');
            },
          },
        }, 'Sincronizează acum'),
        el('p', { style: 'margin-top:9px;font-size:12px;color:var(--text-slab)' },
          'Se face singură: la fiecare modificare, la deschiderea paginii, la revenirea în fereastră și o dată la cinci minute.'),
      ),
    ),

    (() => {
      // Avertismentele bifate nu se mai văd pe prima pagină. Dacă s-a bifat ceva
      // din greșeală, aici e singura cale înapoi.
      const setare = stare.una('setare_avertismente');
      const bife = (setare && !setare.sters && setare.rezolvate) || {};
      const ascunse = avertismenteOrdonate({}).filter((a) => (a.fapt ? esteRezolvat(a.fapt) : !!bife[a.id]));
      if (!ascunse.length) return null;

      return el('section', { class: 'sectiune' },
        capSectiune('Avertismente ascunse', eticheta(String(ascunse.length))),
        el('div', { class: 'card' },
          el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:11px' },
            'Bifate ca rezolvate, deci nu mai apar pe prima pagină. Readu-le dacă s-a bifat din greșeală.'),
          ...ascunse.map((a) => el('div', {
            style: 'display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid var(--chenar)',
          },
            el('span', { style: 'flex:1;font-size:13.5px;color:var(--text-slab)' }, a.titlu),
            el('button', {
              class: 'buton buton-fantoma buton-mic', type: 'button', style: 'flex:none',
              on: {
                click: () => {
                  if (a.fapt) {
                    rezolva(a.fapt, false);
                  } else {
                    const acum = { ...bife };
                    delete acum[a.id];
                    stare.seteaza('setare_avertismente', 'setare', { rezolvate: acum });
                  }
                  paine('Readus pe prima pagină');
                },
              },
            }, 'Readu'),
          )),
        ),
      );
    })(),

    el('section', { class: 'sectiune' },
      capSectiune('Copie de siguranță'),
      el('div', { class: 'card' },
        el('p', { style: 'font-size:13.5px' },
          'Planul gratuit Firebase nu face copii. Butonul de mai jos descarcă tot ce s-a strâns — cheltuieli, voturi, amintiri — într-un fișier.'),
        el('button', {
          class: 'buton buton-lat', type: 'button', style: 'margin-top:11px',
          on: {
            click: () => {
              const data = new Date().toISOString().slice(0, 10);
              descarca(`creta-copie-${data}.json`, JSON.stringify(stare.exporta(), null, 2));
              paine('Descărcat');
            },
          },
        }, '⬇ Descarcă tot'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Despre'),
      el('div', { class: 'card' },
        el('p', { style: 'font-size:13.5px' },
          'Creta, 19–24 septembrie 2026. Marian, Demian, Adina, Andrei, Sara, Bengi, Diana.'),
        el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-slab)' },
          'Site static, fără build. Datele stau în Firestore; codurile sensibile sunt criptate cu AES-GCM și o parolă pe care o știți doar voi. După prima deschidere, totul merge și fără internet.'),
      ),
    ),
  );
}
