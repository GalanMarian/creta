// Mâncarea: unde, și ce se cere când ajungi la masă.

import { el, frag, capSectiune, eticheta, textAldin, harta, telefon, randDate } from '../ui.js';
import {
  RESTAURANTE, DE_MANCAT, OBICEIURI, REZERVARE_PESKESI, restaurantePeZona, linkRecenzii,
} from '../date/mancare.js';
import { pozaMancare } from '../date/poze-mancare.js';
import { amFost, comutaFost, cineABifat } from '../amfost.js';
import { esteRezolvat } from '../fapte.js';
import { numePersoana } from '../date/grup.js';
import { dataLunga } from '../lib/format.js';
import { paine } from '../ui.js';

/** Steluțele notei — rotunjite la jumătate. */
function stele(nota) {
  const pline = Math.floor(nota);
  const jumatate = nota - pline >= 0.25 && nota - pline < 0.75;
  const aproapePlina = nota - pline >= 0.75;
  let text = '★'.repeat(pline + (aproapePlina ? 1 : 0));
  if (jumatate) text += '⯪';
  return text.padEnd(5, '☆').slice(0, 5);
}

function cardRestaurant(r) {
  const fost = amFost(r.id);
  const cine = cineABifat(r.id);

  return el('div', { class: `card ${fost ? 'rand-fost' : ''}`, style: 'margin-bottom:9px' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { style: 'font-size:15.5px;font-weight:650' },
          r.nume,
          fost ? el('span', { class: 'semn-fost' }, '✓ am mâncat') : null),
        el('p', { style: 'font-size:12.5px;color:var(--text-slab)' }, `${r.tip} · ${r.localitate}`),
      ),
      el('div', { class: 'etichete', style: 'justify-content:flex-end' },
        r.recomandatTop ? eticheta('★ Top', 'teracota') : null,
        r.dinParteaGazdei ? eticheta('De la gazdă', 'verde') : null,
      ),
    ),

    r.nota
      ? el('div', { class: 'nota-rand' },
        el('span', { class: 'nota-stele' }, stele(r.nota)),
        el('span', { class: 'nota-cifra' }, String(r.nota).replace('.', ',')),
        el('span', { class: 'nota-detalii' },
          `din ${r.recenzii.toLocaleString('ro-RO')} recenzii`),
      )
      : null,
    r.sursaNota ? el('p', { class: 'nota-sursa' }, r.sursaNota) : null,

    el('p', { style: 'margin-top:9px;font-size:13.5px' }, r.deCe),
    r.cePuneLumea
      ? el('p', { class: 'ce-spune' }, el('strong', {}, 'Ce spune lumea: '), r.cePuneLumea)
      : null,
    r.potrivitPentru ? el('p', { style: 'margin-top:7px;font-size:12.5px;color:var(--text-slab)' },
      `Potrivit pentru: ${r.potrivitPentru}`) : null,

    el('div', { style: 'display:flex;gap:9px;align-items:center;margin-top:11px;flex-wrap:wrap' },
      el('a', {
        href: linkRecenzii(r), target: '_blank', rel: 'noopener',
        class: 'buton buton-slab buton-mic',
      }, r.nota ? 'Toate recenziile ↗' : 'Vezi recenziile ↗'),
      el('label', {
        class: 'bifa', style: 'flex:1;min-width:150px;padding:8px 10px;margin:0',
        dataset: { bifat: fost ? '1' : '0' },
      },
        el('input', {
          type: 'checkbox', checked: fost,
          on: {
            change: (e) => {
              comutaFost(r.id, e.target.checked);
              paine(e.target.checked ? `Bifat: am mâncat la ${r.nume}` : 'Bifă scoasă');
            },
          },
        }),
        el('span', { class: 'bifa-corp' },
          el('span', { class: 'bifa-text', style: 'font-size:13px' }, 'Am mâncat aici'),
          fost && cine ? el('span', { class: 'bifa-nota' }, `bifat de ${numePersoana(cine)}`) : null,
        ),
      ),
    ),
  );
}

export default function ecranMancare() {
  const p = REZERVARE_PESKESI;

  return frag(
    el('section', { class: 'sectiune' },
      capSectiune('Masa rezervată'),
      el('div', { class: 'card', style: 'border-color:var(--teracota)' },
        el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
          el('div', {},
            el('h3', { class: 'card-titlu' }, p.nume),
            el('p', { class: 'card-sub' }, `${dataLunga(p.data)} · 7 persoane`),
          ),
          eticheta('Ultima masă', 'teracota'),
        ),
        p.nota ? el('div', { class: 'nota-rand' },
          el('span', { class: 'nota-stele' }, stele(p.nota)),
          el('span', { class: 'nota-cifra' }, String(p.nota).replace('.', ',')),
          el('span', { class: 'nota-detalii' }, `din ${p.recenzii.toLocaleString('ro-RO')} recenzii`),
        ) : null,
        p.sursaNota ? el('p', { class: 'nota-sursa' }, p.sursaNota) : null,
        el('p', { style: 'margin-top:11px;font-size:13.5px' }, p.deCe),
        esteRezolvat('peskesi-mutat')
          ? el('div', { class: 'alerta alerta-info', style: 'margin-top:12px' },
            el('div', { class: 'alerta-corp' },
              textAldin(`✅ Masa e mutată la **${p.oraRecomandata}**. Lanțul de joi încape, cu 1 h 20 min marjă.`)))
          : el('div', { class: 'alerta alerta-critic', style: 'margin-top:12px' },
            el('div', { class: 'alerta-corp' }, textAldin(p.atentie))),
        el('h4', { style: 'margin-top:15px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-slab)' },
          'Ce merită cerut'),
        el('div', { style: 'margin-top:8px' },
          ...p.deCerut.map((d) => el('div', { style: 'padding:7px 0;border-bottom:1px solid var(--chenar)' },
            el('div', { style: 'font-weight:600;font-size:14px' }, d.fel),
            el('div', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:1px' }, d.nota),
          )),
        ),
        el('ul', { style: 'margin-top:12px;font-size:13px;color:var(--text-slab)' },
          ...p.note.map((n) => el('li', {}, n))),
        el('div', { class: 'date-lista', style: 'margin-top:12px' },
          randDate('Adresă', harta(p.harta, 'Kapetan Charalampi 6–8')),
          randDate('Telefon', telefon(p.telefon, p.telefonAfisat)),
          randDate('Program', p.program),
        ),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Vest — lângă Maleme și în Chania'),
      ...restaurantePeZona('vest').map(cardRestaurant),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Est — Agios Nikolaos, Plaka, Elounda'),
      ...restaurantePeZona('est').map(cardRestaurant),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Centru — Heraklion'),
      ...restaurantePeZona('centru').map(cardRestaurant),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Ce se mănâncă în Creta'),
      el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:10px' },
        'Ca să nu comandați souvlaki cinci zile. Aproape toate se găsesc în orice tavernă de sat.'),
      el('div', { class: 'grila grila-2-lat', style: 'gap:9px' },
        ...DE_MANCAT.map((d) => {
          const pm = d.poza ? pozaMancare(d.poza) : null;
          return el('div', { class: 'card card-strans' },
            pm ? el('figure', { class: 'foto foto-mica' },
              el('img', {
                src: pm.fisier, alt: d.nume,
                loading: 'lazy', decoding: 'async', width: 520, height: 390,
              }),
              el('figcaption', {},
                el('span', { class: 'foto-credit' },
                  `${pm.autor} · ${pm.licenta} · `,
                  el('a', { href: pm.sursa, target: '_blank', rel: 'noopener' }, 'Wikimedia'))),
            ) : null,
            el('div', { style: 'display:flex;justify-content:space-between;gap:9px;align-items:baseline;margin-top:' + (pm ? '9px' : '0') },
              el('span', { style: 'font-weight:650;font-size:14.5px' }, d.nume),
              el('span', { style: 'font-size:11px;color:var(--text-stins);flex:none' }, d.unde),
            ),
            el('p', { style: 'font-size:13px;color:var(--text-slab);margin-top:3px' }, d.ce),
          );
        }),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Cum se mănâncă aici'),
      el('div', { class: 'card' },
        el('ul', { style: 'font-size:13.5px' }, ...OBICEIURI.map((o) => el('li', {}, o))),
      ),
    ),

    el('section', { class: 'sectiune' },
      el('a', { href: '#/vot', class: 'buton buton-lat buton-slab' }, 'Votați unde mâncăm →'),
    ),
  );
}
