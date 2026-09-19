// Amintirile și rezumatul de la final. Momentul zilei, per persoană, plus
// cifrele adunate singure din restul aplicației.

import {
  el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra,
  gol, avatar, confirma,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import { PERSOANE, persoana, numePersoana } from '../date/grup.js';
import { ZILE } from '../date/itinerariu.js';
import { LOCURI, locul } from '../date/locuri.js';
import { INTREBARI } from '../date/intrebari.js';
import { totaluri } from '../lib/split.js';
import { statistici } from '../lib/masina.js';
import { clasament, numara } from '../lib/voturi.js';
import { euro, km as fkm, numeZi, dataLunga, dataScurta } from '../lib/format.js';

function amintiri() {
  return stare.toate('amintire').filter((a) => !a.sters);
}

function formularAmintire(zi, existenta) {
  const a = existenta || {};
  const text = el('textarea', {
    value: a.text || '',
    attrs: { placeholder: 'Ce a fost cel mai bun azi? O scenă, o replică, un moment.' },
  });
  const cine = el('select', {},
    ...PERSOANE.map((p) => el('option', { value: p.id, selected: p.id === (a.persoana || cineSunt()) }, p.nume)),
  );

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!text.value.trim()) { paine('Scrie ceva.', true); return; }
        const date = { zi, persoana: cine.value, text: text.value.trim(), notatDe: cineSunt() };
        if (existenta) stare.modifica(existenta.id, date);
        else stare.adauga('amintire', date);
        inchideFereastra();
        paine('Salvat');
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:12px' }, dataLunga(zi)),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Al cui e momentul'), cine),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Momentul'), text),
    el('button', { class: 'buton buton-lat', type: 'submit' }, existenta ? 'Salvează' : 'Adaugă'),
    existenta ? el('button', {
      class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:8px',
      on: {
        click: async () => {
          inchideFereastra();
          if (await confirma('Ștergi amintirea?', existenta.text, { periculos: true, daText: 'Șterge' })) {
            stare.sterge(existenta.id);
            paine('Șters');
          }
        },
      },
    }, 'Șterge') : null,
  );
}

function rezumat() {
  const chelt = stare.toate('cheltuiala').filter((c) => !c.sters);
  const t = totaluri(chelt);
  const s = statistici({ cheltuieli: chelt, citiri: stare.toate('km').filter((c) => !c.sters) });
  const voturi = stare.toate('vot');
  const am = amintiri();
  const rasp = stare.toate('raspuns').filter((r) => !r.sters);
  const intrebariPuse = INTREBARI.filter((q) => {
    const inr = stare.una(`pusa_${q.id}`);
    return inr && inr.pusa && !inr.sters;
  }).length;

  const topLocuri = clasament(voturi, LOCURI)
    .filter((c) => c.rezultat.votanti > 0)
    .slice(0, 5);

  const cifre = [
    { val: '6', et: 'zile' },
    { val: '7', et: 'oameni' },
    { val: s.kmParcursi !== null ? fkm(s.kmParcursi) : '—', et: 'conduși' },
    { val: euro(t.tot, { scurt: true }), et: 'cheltuiți' },
    { val: euro(Math.round(t.comun / 7), { scurt: true }), et: 'pe om, comun' },
    { val: s.litri !== null ? `${String(s.litri).replace('.', ',')} l` : '—', et: 'combustibil' },
    { val: String(am.length), et: 'momente notate' },
    { val: `${intrebariPuse}`, et: 'întrebări puse' },
    { val: String(rasp.length), et: 'povești notate' },
  ];

  return el('section', { class: 'sectiune' },
    capSectiune('Rezumatul excursiei'),
    el('div', { class: 'erou' },
      el('p', { class: 'erou-supra' }, 'Creta · 19–24 septembrie 2026'),
      el('h2', { class: 'erou-titlu' }, 'Șapte prieteni, șase zile'),
      el('p', { class: 'erou-sub' }, 'Maleme și Amoudara, două capete de insulă, o mașină cu șapte locuri.'),
    ),
    el('div', { class: 'grila grila-3', style: 'margin-top:11px' },
      ...cifre.map((c) => el('div', { class: 'card card-strans' },
        el('div', { style: 'font-size:16px;font-weight:700' }, c.val),
        el('div', { style: 'font-size:11px;color:var(--text-slab)' }, c.et),
      )),
    ),

    topLocuri.length ? el('div', { class: 'card', style: 'margin-top:11px' },
      el('h3', { style: 'font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-slab);margin-bottom:9px' },
        'Ce a vrut grupul cel mai mult'),
      ...topLocuri.map(({ propunere, rezultat }, i) => el('div', {
        style: 'display:flex;gap:9px;align-items:center;padding:6px 0;border-bottom:1px solid var(--chenar)',
      },
        el('span', { style: 'font-size:13px;font-weight:700;color:var(--text-stins);width:18px' }, `${i + 1}.`),
        el('span', { style: 'flex:1;font-size:14px' }, propunere.nume),
        el('span', { style: 'font-size:12px;color:var(--text-slab)' }, `${rezultat.da} da`),
      )),
    ) : null,

    el('div', { class: 'card', style: 'margin-top:11px' },
      el('h3', { style: 'font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-slab);margin-bottom:9px' },
        'Cine a notat câte momente'),
      ...PERSOANE.map((p) => {
        const n = am.filter((a) => a.persoana === p.id).length;
        return el('div', { style: 'display:flex;gap:9px;align-items:center;padding:4px 0' },
          avatar(p, n === 0),
          el('span', { style: 'flex:1;font-size:13.5px' }, p.nume),
          el('span', { style: 'font-size:13px;color:var(--text-slab)' }, String(n)),
        );
      }),
    ),

    el('button', {
      class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:11px',
      on: {
        click: () => {
          const linii = [
            'CRETA · 19–24 SEPTEMBRIE 2026',
            'Marian, Demian, Adina, Andrei, Sara, Bengi, Diana',
            '',
            ...cifre.map((c) => `${c.et}: ${c.val}`),
            '',
            'MOMENTELE',
            ...ZILE.flatMap((z) => {
              const ale = am.filter((a) => a.zi === z.data);
              if (!ale.length) return [];
              return [`\n${numeZi(z.data)} — ${z.titlu}`,
                ...ale.map((a) => `  ${numePersoana(a.persoana)}: ${a.text}`)];
            }),
          ];
          const text = linii.join('\n');
          navigator.clipboard.writeText(text)
            .then(() => paine('Rezumatul e copiat. Lipește-l unde vrei.'))
            .catch(() => paine('Nu s-a putut copia.', true));
        },
      },
    }, '📋 Copiază rezumatul'),
  );
}

/**
 * Pozele nu intră în Firestore — un document are 1 MB și spațiul costă. În loc
 * de asta, ținem legătura către un album comun (Google Photos, iCloud), pe care
 * o pune oricine din grup.
 */
function album() {
  const setare = stare.una('setare_album');
  const url = setare && !setare.sters ? setare.url : null;

  const intrare = el('input', {
    type: 'text', value: url || '',
    attrs: { placeholder: 'https://photos.app.goo.gl/…', autocapitalize: 'none', spellcheck: 'false' },
  });

  return el('section', { class: 'sectiune' },
    capSectiune('Albumul de poze'),
    el('div', { class: 'card' },
      url
        ? frag(
          el('a', { href: url, target: '_blank', rel: 'noopener', class: 'buton buton-lat' },
            '📷 Deschide albumul comun ↗'),
          el('p', { style: 'margin-top:9px;font-size:12px;color:var(--text-slab);word-break:break-all' }, url),
          el('button', {
            class: 'buton buton-fantoma buton-mic', type: 'button', style: 'margin-top:5px',
            on: {
              click: () => {
                stare.sterge('setare_album');
                paine('Legătura a fost scoasă');
              },
            },
          }, 'Schimbă legătura'),
        )
        : frag(
          el('p', { style: 'font-size:13.5px' },
            'Pozele nu se încarcă în site — ar umple baza de date și ar costa. În schimb, faceți un album comun în Google Photos și lipiți aici legătura lui, ca s-o aibă toți la îndemână.'),

          el('details', { class: 'desfa', style: 'margin-top:4px' },
            el('summary', {}, 'Cum se face albumul, pas cu pas'),
            el('div', { class: 'desfa-corp' },
              el('ol', {},
                el('li', {}, 'Deschide aplicația ', el('strong', {}, 'Google Photos'), ' pe telefon.'),
                el('li', {}, 'Jos, ', el('strong', {}, 'Colecții'), ' → ', el('strong', {}, 'Album nou'), '. Pune-i un nume, de exemplu „Creta 2026".'),
                el('li', {}, 'Intră în album → ', el('strong', {}, 'Partajează'), ' → activează ', el('strong', {}, '„Partajare prin link"'), '.'),
                el('li', {}, 'Tot acolo, pornește ', el('strong', {}, '„Colaborare"'), ' — altfel ceilalți pot doar să privească, nu să adauge poze.'),
                el('li', {}, 'Apasă ', el('strong', {}, 'Copiază linkul'), ' și lipește-l în câmpul de mai jos.'),
              ),
              el('p', { style: 'margin-top:9px;color:var(--text-slab)' },
                'Linkul arată cam așa: photos.app.goo.gl/ceva. Funcționează la fel și cu un album partajat din iCloud, dacă sunteți mai mulți pe iPhone.'),
              el('p', { style: 'margin-top:7px;color:var(--text-slab)' },
                'Aici se salvează doar adresa, vreo șaizeci de caractere. Pozele rămân la Google, nu în baza noastră de date — de asta nu costă nimic.'),
            ),
          ),

          el('form', {
            style: 'margin-top:11px',
            on: {
              submit: (e) => {
                e.preventDefault();
                const v = intrare.value.trim();
                if (!/^https?:\/\//i.test(v)) { paine('Lipește o adresă care începe cu https://', true); return; }
                stare.seteaza('setare_album', 'setare', { url: v, pusDe: cineSunt(), sters: false });
                paine('Salvat. Îl văd toți.');
              },
            },
          },
            el('label', { class: 'camp' },
              el('span', { class: 'camp-eticheta' }, 'Lipește aici linkul albumului'), intrare),
            el('button', { class: 'buton buton-lat', type: 'submit' }, 'Salvează legătura'),
          ),
        ),
    ),
  );
}

export default function ecranAmintiri() {
  const am = amintiri();

  return frag(
    el('section', { class: 'sectiune' },
      el('p', { style: 'font-size:14px;color:var(--text-slab)' },
        'Câte un moment pe zi, de la fiecare. La final ies singure într-un rezumat.'),
    ),

    album(),

    ...ZILE.map((z) => {
      const ale = am.filter((a) => a.zi === z.data);
      return el('section', { class: 'sectiune' },
        capSectiune(`Ziua ${z.numar} · ${numeZi(z.data)} — ${z.titlu}`,
          el('button', {
            class: 'buton buton-fantoma', type: 'button',
            on: { click: () => deschideFereastra(`Momentul zilei ${z.numar}`, formularAmintire(z.data)) },
          }, '+ Adaugă'),
        ),
        ale.length
          ? el('div', {}, ...ale.map((a) => el('button', {
            class: 'rand-card', type: 'button',
            on: { click: () => deschideFereastra('Modifică momentul', formularAmintire(z.data, a)) },
          },
            avatar(persoana(a.persoana)),
            el('span', { class: 'rand-card-corp' },
              el('span', { class: 'rand-card-sub' }, numePersoana(a.persoana)),
              el('span', { style: 'font-size:14px;display:block;margin-top:2px' }, a.text),
            ),
          )))
          : el('div', { class: 'card card-strans', style: 'color:var(--text-stins);font-size:13px' },
            'Nimic notat pentru ziua asta.'),
      );
    }),

    rezumat(),
  );
}
