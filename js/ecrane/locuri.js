// Locuri, activități și ce am adăugat noi.
//
// Trei categorii, nu una: „unde mergem" și „ce facem" sunt întrebări diferite,
// iar amestecate într-o singură listă se sufocă una pe alta.

import {
  el, frag, capSectiune, eticheta, textAldin, harta, deschideFereastra,
  inchideFereastra, gol, paine, confirma,
} from '../ui.js';
import { LOCURI, TIPURI, ZONE, drumDin, TOP_LOCURI } from '../date/locuri.js';
import { ACTIVITATI, CATEGORII_ACTIVITATI } from '../date/activitati.js';
import { poza } from '../date/poze-locuri.js';
import { ZILE } from '../date/itinerariu.js';
import { PERSOANE, numePersoana } from '../date/grup.js';
import { ziuaCurenta } from '../lib/itinerar.js';
import { durata, dataScurta } from '../lib/format.js';
import { amFost, comutaFost, cineABifat, candAmFost, propuneriProprii, adaugaPropriu, stergePropriu, caLoc } from '../amfost.js';
import { cineSunt } from '../identitate.js';

let vedere = 'locuri';      // locuri | activitati | ale-noastre
let filtruZona = null;
let filtruTip = null;
let filtruCategorie = null;
let ascundeVizitate = false;

function bazaAcum() {
  const zi = ziuaCurenta(ZILE, new Date());
  if (zi?.zona === 'vest' || zi?.zona === 'est') return zi.zona;
  return null;
}

/**
 * Timpul de drum, cu baza din care e socotit. Un loc din est văzut cât timp
 * dormim în vest n-are „—", are „50 min din Amoudara" — altfel pare de
 * neatins, când de fapt doar nu e rândul lui încă.
 */
function drumText(loc, baza) {
  const aici = drumDin(loc, baza);
  if (aici === 0) return { text: 'pe jos', nota: null };
  if (aici !== null && aici !== undefined) return { text: durata(aici), nota: null };

  const cealalta = baza === 'est' ? 'vest' : 'est';
  const acolo = drumDin(loc, cealalta);
  const undeva = cealalta === 'est' ? 'din Amoudara' : 'din Maleme';
  if (acolo === 0) return { text: 'pe jos', nota: undeva };
  if (acolo !== null && acolo !== undefined) return { text: durata(acolo), nota: undeva };
  return { text: '—', nota: null };
}

/** Fotografia, cu creditul cerut de licență. */
function fotografie(loc) {
  const p = poza(loc.id);
  if (!p) return null;
  return el('figure', { class: 'foto', style: 'margin-bottom:12px' },
    el('img', {
      src: p.fisier, alt: p.descriere || loc.nume,
      loading: 'lazy', decoding: 'async', width: 640, height: 480,
    }),
    el('figcaption', {},
      el('span', {}, p.descriere),
      el('span', { class: 'foto-credit' },
        `${p.autor} · ${p.licenta} · `,
        el('a', { href: p.sursa, target: '_blank', rel: 'noopener' }, 'Wikimedia'),
      ),
    ),
  );
}

/** Bifa „am fost" — a grupului, nu a fiecăruia. */
function bifaFost(obiectId, numeAfisat) {
  const fost = amFost(obiectId);
  const cine = cineABifat(obiectId);
  const cand = candAmFost(obiectId);

  return el('label', {
    class: 'bifa', style: 'margin-top:12px',
    dataset: { bifat: fost ? '1' : '0' },
  },
    el('input', {
      type: 'checkbox', checked: fost,
      on: {
        change: (e) => {
          comutaFost(obiectId, e.target.checked);
          paine(e.target.checked ? `Bifat: am fost la ${numeAfisat}` : 'Bifă scoasă');
        },
      },
    }),
    el('span', { class: 'bifa-corp' },
      el('span', { class: 'bifa-text' }, fost ? 'Am fost aici' : 'Bifează dacă am fost'),
      fost && cine
        ? el('span', { class: 'bifa-nota' },
          `Bifat de ${numePersoana(cine)}${cand ? ` · ${dataScurta(cand)}` : ''}`)
        : null,
    ),
  );
}

// ─────────────────────────────── fișe ───────────────────────────────

function fisaLoc(loc, baza) {
  const d = drumText(loc, baza);
  return frag(
    fotografie(loc),
    loc.rang ? el('div', { class: 'alerta alerta-info', style: 'margin-bottom:12px' },
      el('div', { class: 'alerta-titlu' }, `Locul ${loc.rang} în topul nostru`),
      el('div', { class: 'alerta-corp' }, loc.deCeInTop),
    ) : null,
    loc.deCeComoara ? el('div', { class: 'alerta alerta-info', style: 'margin-bottom:12px' },
      el('div', { class: 'alerta-titlu' }, 'Mai puțin știut'),
      el('div', { class: 'alerta-corp' }, loc.deCeComoara),
    ) : null,
    el('div', { class: 'etichete', style: 'margin-bottom:12px' },
      eticheta(`${TIPURI[loc.tip].emoji} ${TIPURI[loc.tip].eticheta}`),
      eticheta(ZONE[loc.zona].eticheta.split(' — ')[0]),
      loc.vedeta ? eticheta('★ De văzut', 'teracota') : null,
      loc.ascuns ? eticheta('Mai puțin știut', 'verde') : null,
      loc.cerut ? eticheta('Cerut de grup', 'accent') : null,
      loc.dinParteaGazdei ? eticheta('De la gazdă', 'verde') : null,
    ),
    el('div', { class: 'date-lista' },
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Drum'),
        el('span', { class: 'date-val' }, `${d.text}${d.nota ? ` (${d.nota})` : ''}`)),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cât ține'), el('span', { class: 'date-val' }, loc.durata)),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cost'), el('span', { class: 'date-val' }, loc.costText)),
    ),
    el('h4', { class: 'mic-titlu' }, 'De ce merită'),
    el('p', { style: 'margin-top:5px;font-size:14px' }, loc.deCe),
    el('h4', { class: 'mic-titlu' }, 'Cum ajungi'),
    el('p', { style: 'margin-top:5px;font-size:14px' }, textAldin(loc.cumAjungi)),
    el('div', { class: 'alerta alerta-atentie', style: 'margin-top:14px' },
      el('div', { class: 'alerta-titlu' }, 'Ce te încurcă'),
      el('div', { class: 'alerta-corp' }, loc.capcane),
    ),
    el('div', { class: 'alerta alerta-info', style: 'margin-top:9px' },
      el('div', { class: 'alerta-titlu' }, 'De luat / de ținut minte'),
      el('div', { class: 'alerta-corp' }, loc.deLuat),
    ),
    bifaFost(loc.id, loc.nume),
    el('div', { class: 'butoane', style: 'margin-top:14px' },
      loc.harta ? el('a', { href: loc.harta, target: '_blank', rel: 'noopener', class: 'buton buton-slab' }, 'Deschide în hartă ↗') : null,
      el('a', { href: '#/vot', class: 'buton buton-slab', on: { click: inchideFereastra } }, 'Votează'),
    ),
  );
}

function fisaActivitate(a) {
  const c = CATEGORII_ACTIVITATI[a.categorie];
  return frag(
    el('div', { class: 'etichete', style: 'margin-bottom:12px' },
      eticheta(`${c.emoji} ${c.eticheta}`, 'accent'),
      eticheta(a.zona === 'ambele' ? 'Oriunde' : a.zona === 'vest' ? 'Vest' : a.zona === 'est' ? 'Est' : 'Centru'),
    ),
    el('div', { class: 'date-lista' },
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cât ține'), el('span', { class: 'date-val' }, a.durata)),
      el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cost'), el('span', { class: 'date-val' }, a.costText)),
    ),
    el('h4', { class: 'mic-titlu' }, 'De ce merită'),
    el('p', { style: 'margin-top:5px;font-size:14px' }, textAldin(a.deCe)),
    el('h4', { class: 'mic-titlu' }, 'Cum se face'),
    el('p', { style: 'margin-top:5px;font-size:14px' }, textAldin(a.cumFaci)),
    el('div', { class: 'alerta alerta-atentie', style: 'margin-top:14px' },
      el('div', { class: 'alerta-titlu' }, 'Ce te încurcă'),
      el('div', { class: 'alerta-corp' }, a.capcane),
    ),
    el('div', { class: 'alerta alerta-info', style: 'margin-top:9px' },
      el('div', { class: 'alerta-titlu' }, 'De ținut minte'),
      el('div', { class: 'alerta-corp' }, a.deLuat),
    ),
    bifaFost(a.id, a.nume),
    el('div', { class: 'butoane', style: 'margin-top:14px' },
      el('a', { href: '#/vot', class: 'buton buton-slab', on: { click: inchideFereastra } }, 'Votează'),
    ),
  );
}

function fisaProprie(p, laStergere) {
  return frag(
    el('div', { class: 'etichete', style: 'margin-bottom:12px' },
      eticheta(p.fel === 'activitate' ? '🎯 Activitate' : '📍 Loc', 'accent'),
      eticheta(`Propus de ${numePersoana(p.propusDe) || 'cineva'}`),
    ),
    (p.durata || p.costText) ? el('div', { class: 'date-lista' },
      p.durata ? el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cât ține'), el('span', { class: 'date-val' }, p.durata)) : null,
      p.costText ? el('div', { class: 'date-rand' },
        el('span', { class: 'date-cheie' }, 'Cost'), el('span', { class: 'date-val' }, p.costText)) : null,
    ) : null,
    p.deCe ? el('p', { style: 'margin-top:12px;font-size:14px' }, p.deCe) : null,
    p.link ? el('p', { style: 'margin-top:11px;font-size:13.5px' },
      el('a', { href: p.link, target: '_blank', rel: 'noopener' }, 'Deschide legătura ↗')) : null,
    bifaFost(p.id, p.nume),
    el('div', { class: 'butoane', style: 'margin-top:14px' },
      el('a', { href: '#/vot', class: 'buton buton-slab', on: { click: inchideFereastra } }, 'Votează'),
      el('button', {
        class: 'buton buton-rosu buton-mic', type: 'button',
        on: {
          click: async () => {
            inchideFereastra();
            if (await confirma('Ștergi propunerea?', `„${p.nume}"`, { periculos: true, daText: 'Șterge' })) {
              stergePropriu(p.id);
              paine('Șters');
              if (laStergere) laStergere();
            }
          },
        },
      }, 'Șterge'),
    ),
  );
}

// ─────────────────────────── formularul de adăugare ───────────────────────────

function formularPropriu(felImplicit) {
  let fel = felImplicit || 'loc';

  const nume = el('input', { type: 'text', attrs: { placeholder: 'Ex. Plaja Stavros / Cursă cu ATV-uri' } });
  const subtitlu = el('input', { type: 'text', attrs: { placeholder: 'O propoziție scurtă' } });
  const deCe = el('textarea', { attrs: { placeholder: 'De ce merită, ce ai citit despre el…' } });
  const link = el('input', { type: 'text', attrs: { placeholder: 'https://… (hartă, articol, rezervare)', autocapitalize: 'none', spellcheck: 'false' } });
  const dur = el('input', { type: 'text', attrs: { placeholder: 'Ex. 2–3 h' } });
  const cost = el('input', { type: 'text', attrs: { placeholder: 'Ex. 15 €/persoană' } });

  const zona = el('select', {},
    el('option', { value: 'ambele' }, 'Oriunde / nu contează'),
    el('option', { value: 'vest' }, 'Vest — lângă Maleme'),
    el('option', { value: 'est' }, 'Est — lângă Amoudara'),
    el('option', { value: 'centru' }, 'Centru — Heraklion'),
  );
  const zi = el('select', {},
    el('option', { value: '' }, 'Orice zi'),
    ...ZILE.map((z) => el('option', { value: z.data }, `Ziua ${z.numar} — ${z.titlu}`)),
  );

  const butoaneFel = el('div', { class: 'segmente', style: 'margin-bottom:14px' },
    ...[['loc', '📍 Un loc'], ['activitate', '🎯 O activitate']].map(([id, et]) => el('button', {
      class: 'segment', type: 'button',
      attrs: { 'aria-pressed': String(fel === id) },
      on: {
        click: (e) => {
          fel = id;
          for (const b of e.target.parentElement.children) {
            b.setAttribute('aria-pressed', String(b === e.target));
          }
        },
      },
    }, et)),
  );

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!nume.value.trim()) { paine('Scrie un nume.', true); return; }
        if (link.value.trim() && !/^https?:\/\//i.test(link.value.trim())) {
          paine('Legătura trebuie să înceapă cu https://', true); return;
        }
        adaugaPropriu({
          fel,
          nume: nume.value.trim(),
          subtitlu: subtitlu.value.trim(),
          deCe: deCe.value.trim(),
          link: link.value.trim(),
          durata: dur.value.trim(),
          costText: cost.value.trim(),
          zona: zona.value,
          zi: zi.value || null,
        });
        inchideFereastra();
        paine('Adăugat. Îl văd toți și se poate vota.');
      },
    },
  },
    el('p', { style: 'font-size:13.5px;color:var(--text-slab);margin-bottom:13px' },
      'Ce adaugi aici apare la toți în listă și intră automat la vot.'),
    butoaneFel,
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Nume'), nume),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Pe scurt (opțional)'), subtitlu),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'De ce merită (opțional)'), deCe),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Legătură (opțional)'), link),
    el('div', { class: 'grila grila-2' },
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Cât ține'), dur),
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Cost'), cost),
    ),
    el('div', { class: 'grila grila-2' },
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Zonă'), zona),
      el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Pentru ziua'), zi),
    ),
    el('button', { class: 'buton buton-lat', type: 'submit', style: 'margin-top:6px' }, 'Adaugă'),
  );
}

// ─────────────────────────────── rânduri ───────────────────────────────

function randLoc(loc, baza) {
  const p = poza(loc.id);
  const d = drumText(loc, baza);
  const fost = amFost(loc.id);
  return el('button', {
    class: `rand-card ${fost ? 'rand-fost' : ''}`, type: 'button',
    on: { click: () => deschideFereastra(loc.nume, fisaLoc(loc, baza)) },
  },
    p
      ? el('img', { class: 'mini', src: p.fisier, alt: '', loading: 'lazy', decoding: 'async', width: 640, height: 480 })
      : el('span', { style: 'font-size:22px;flex:none' }, TIPURI[loc.tip].emoji),
    el('span', { class: 'rand-card-corp' },
      el('span', { class: 'rand-card-titlu' },
        loc.rang ? el('span', { class: 'rang' }, String(loc.rang)) : null,
        loc.nume,
        fost ? el('span', { class: 'semn-fost' }, '✓ am fost') : null,
        loc.cerut ? el('span', { class: 'crono-cine' }, 'cerut') : null,
      ),
      el('span', { class: 'rand-card-sub' }, loc.subtitlu),
    ),
    el('span', { class: 'rand-card-dreapta' },
      el('span', { style: 'color:var(--text-slab)' }, d.text),
      d.nota ? el('span', { style: 'display:block;font-size:10.5px;color:var(--text-stins)' }, d.nota) : null,
    ),
  );
}

function randActivitate(a) {
  const c = CATEGORII_ACTIVITATI[a.categorie];
  const fost = amFost(a.id);
  return el('button', {
    class: `rand-card ${fost ? 'rand-fost' : ''}`, type: 'button',
    on: { click: () => deschideFereastra(a.nume, fisaActivitate(a)) },
  },
    el('span', { style: 'font-size:22px;flex:none' }, c.emoji),
    el('span', { class: 'rand-card-corp' },
      el('span', { class: 'rand-card-titlu' },
        a.nume,
        fost ? el('span', { class: 'semn-fost' }, '✓ am făcut') : null,
      ),
      el('span', { class: 'rand-card-sub' }, a.subtitlu),
    ),
    el('span', { class: 'rand-card-dreapta' },
      el('span', { style: 'color:var(--text-slab)' }, a.durata),
    ),
  );
}

function randPropriu(p, laStergere) {
  const fost = amFost(p.id);
  return el('button', {
    class: `rand-card ${fost ? 'rand-fost' : ''}`, type: 'button',
    on: { click: () => deschideFereastra(p.nume, fisaProprie(p, laStergere)) },
  },
    el('span', { style: 'font-size:22px;flex:none' }, p.fel === 'activitate' ? '🎯' : '📍'),
    el('span', { class: 'rand-card-corp' },
      el('span', { class: 'rand-card-titlu' },
        p.nume,
        fost ? el('span', { class: 'semn-fost' }, '✓ am fost') : null,
      ),
      el('span', { class: 'rand-card-sub' },
        p.subtitlu || `Propus de ${numePersoana(p.propusDe) || 'cineva'}`),
    ),
  );
}

function randTop(loc, baza) {
  const p = poza(loc.id);
  const d = drumText(loc, baza);
  const fost = amFost(loc.id);
  return el('button', {
    class: `card card-top ${fost ? 'rand-fost' : ''}`, type: 'button',
    on: { click: () => deschideFereastra(loc.nume, fisaLoc(loc, baza)) },
  },
    el('div', { class: 'card-top-rand' },
      el('span', { class: 'rang rang-mare' }, String(loc.rang)),
      p ? el('img', { class: 'mini mini-mare', src: p.fisier, alt: '', loading: 'lazy', decoding: 'async', width: 640, height: 480 }) : null,
      el('span', { class: 'card-top-corp' },
        el('span', { class: 'rand-card-titlu' },
          loc.nume,
          fost ? el('span', { class: 'semn-fost' }, '✓ am fost') : null),
        el('span', { class: 'rand-card-sub' }, loc.subtitlu),
        el('span', { class: 'etichete', style: 'margin-top:6px' },
          eticheta(`🚗 ${d.text}${d.nota ? ` ${d.nota}` : ''}`),
          eticheta(`⏱ ${loc.durata}`),
        ),
      ),
    ),
    el('p', { class: 'card-top-motiv' }, loc.deCeInTop),
  );
}

// ─────────────────────────────── filtre ───────────────────────────────

function segmente(valori, activ, laClic, auto) {
  return el('div', { class: `segmente ${auto ? 'segmente-auto' : ''}` },
    ...valori.map((v) => el('button', {
      class: 'segment', type: 'button',
      attrs: { 'aria-pressed': String(activ === v.id) },
      on: { click: () => laClic(v.id) },
    }, v.eticheta)),
  );
}

const VEDERI = [
  { id: 'locuri', eticheta: '📍 Locuri' },
  { id: 'activitati', eticheta: '🎯 Activități' },
  { id: 'ale-noastre', eticheta: '✍️ Ale noastre' },
];

const ZONE_FILTRU = [
  { id: null, eticheta: 'Toate' },
  { id: 'vest', eticheta: 'Vest' },
  { id: 'est', eticheta: 'Est' },
  { id: 'centru', eticheta: 'Centru' },
];

const TIPURI_FILTRU = [
  { id: null, eticheta: 'Tot' },
  { id: 'top', eticheta: '🏆 Topul' },
  { id: 'vedete', eticheta: '★ De văzut' },
  { id: 'ascunse', eticheta: 'Ascunse' },
  { id: 'plaja', eticheta: '🏖️ Plaje' },
  { id: 'munte', eticheta: '⛰️ Munte' },
  { id: 'barca', eticheta: '⛵ Barcă' },
  { id: 'sat', eticheta: '🏘️ Sate' },
  { id: 'istorie', eticheta: '🏛️ Istorie' },
];

function filtreazaLocuri(baza) {
  let lista = LOCURI;
  if (filtruZona) lista = lista.filter((l) => l.zona === filtruZona);
  if (ascundeVizitate) lista = lista.filter((l) => !amFost(l.id));
  if (filtruTip === 'top') return lista.filter((l) => l.rang).sort((a, b) => a.rang - b.rang);
  if (filtruTip === 'vedete') lista = lista.filter((l) => l.vedeta);
  else if (filtruTip === 'ascunse') lista = lista.filter((l) => l.ascuns);
  else if (filtruTip) lista = lista.filter((l) => l.tip === filtruTip);

  return [...lista].sort((a, b) => {
    const da = drumDin(a, baza);
    const db = drumDin(b, baza);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });
}

// ─────────────────────────────── ecranul ───────────────────────────────

export default function ecranLocuri() {
  const baza = bazaAcum() || 'vest';
  const gazda = el('div', {});

  function deseneaza() {
    const bucati = [];

    bucati.push(el('section', { class: 'sectiune' },
      el('div', { style: 'display:grid;gap:8px' },
        segmente(VEDERI, vedere, (id) => {
          vedere = id;
          filtruTip = null;
          filtruCategorie = null;
          deseneaza();
        }, true),
        vedere === 'locuri' ? segmente(ZONE_FILTRU, filtruZona, (id) => { filtruZona = id; deseneaza(); }) : null,
        vedere === 'locuri' ? segmente(TIPURI_FILTRU, filtruTip, (id) => { filtruTip = id; deseneaza(); }, true) : null,
        vedere === 'activitati'
          ? segmente(
            [{ id: null, eticheta: 'Toate' },
              ...Object.entries(CATEGORII_ACTIVITATI).map(([id, c]) => ({ id, eticheta: `${c.emoji} ${c.eticheta}` }))],
            filtruCategorie, (id) => { filtruCategorie = id; deseneaza(); }, true)
          : null,
      ),
    ));

    bucati.push(el('section', { class: 'sectiune' },
      el('button', {
        class: 'buton buton-lat buton-slab', type: 'button',
        on: { click: () => deschideFereastra('Adaugă ce ai găsit', formularPropriu(vedere === 'activitati' ? 'activitate' : 'loc')) },
      }, '+ Adaugă un loc sau o activitate'),
    ));

    if (vedere === 'locuri') {
      const lista = filtreazaLocuri(baza);
      const vizitate = LOCURI.filter((l) => amFost(l.id)).length;

      if (filtruTip === 'top') {
        bucati.push(el('section', { class: 'sectiune' },
          el('div', { class: 'card card-strans' },
            el('p', { style: 'font-size:13.5px' },
              `${TOP_LOCURI.length} locuri, ordonate pentru excursia asta — nu pentru Creta în general. Unul care cere patru ore de condus dintr-o bază unde stăm două nopți pierde în fața altuia la fel de frumos, la douăzeci de minute.`),
          )));
      }

      bucati.push(el('section', { class: 'sectiune' },
        el('div', { class: 'rand-filtre' },
          el('p', { style: 'font-size:12.5px;color:var(--text-slab)' },
            `${lista.length} din ${LOCURI.length}${vizitate ? ` · ${vizitate} bifate` : ''} · drumul e socotit din ${baza === 'est' ? 'Amoudara' : 'Maleme'}`),
          el('div', { class: 'butoane' },
            el('button', {
              class: 'buton buton-fantoma buton-mic', type: 'button',
              attrs: { 'aria-pressed': String(ascundeVizitate) },
              style: ascundeVizitate ? 'background:var(--accent-slab)' : '',
              on: { click: () => { ascundeVizitate = !ascundeVizitate; deseneaza(); } },
            }, ascundeVizitate ? '✓ Ascunde vizitate' : 'Ascunde vizitate'),
            (filtruZona || filtruTip)
              ? el('button', {
                class: 'buton buton-fantoma buton-mic', type: 'button',
                on: { click: () => { filtruZona = null; filtruTip = null; deseneaza(); } },
              }, 'Șterge filtrele')
              : null,
          ),
        ),
        ...(lista.length
          ? lista.map((l) => (filtruTip === 'top' ? randTop(l, baza) : randLoc(l, baza)))
          : [gol('🔍', 'Niciun loc cu filtrele astea. Încearcă „Toate" și „Tot".')]),
      ));
    }

    if (vedere === 'activitati') {
      let lista = ACTIVITATI;
      if (filtruCategorie) lista = lista.filter((a) => a.categorie === filtruCategorie);
      if (ascundeVizitate) lista = lista.filter((a) => !amFost(a.id));
      const facute = ACTIVITATI.filter((a) => amFost(a.id)).length;

      bucati.push(el('section', { class: 'sectiune' },
        el('div', { class: 'rand-filtre' },
          el('p', { style: 'font-size:12.5px;color:var(--text-slab)' },
            `${lista.length} din ${ACTIVITATI.length}${facute ? ` · ${facute} bifate` : ''}`),
          el('button', {
            class: 'buton buton-fantoma buton-mic', type: 'button',
            style: ascundeVizitate ? 'background:var(--accent-slab)' : '',
            on: { click: () => { ascundeVizitate = !ascundeVizitate; deseneaza(); } },
          }, ascundeVizitate ? '✓ Ascunde făcute' : 'Ascunde făcute'),
        ),
        ...(lista.length ? lista.map(randActivitate) : [gol('🎯', 'Nicio activitate cu filtrul ăsta.')]),
      ));
    }

    if (vedere === 'ale-noastre') {
      const ale = propuneriProprii().map(caLoc);
      bucati.push(el('section', { class: 'sectiune' },
        el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:10px' },
          ale.length
            ? `${ale.length} adăugate de noi. Toate intră automat la vot.`
            : 'Nimic adăugat încă.'),
        ...(ale.length
          ? ale.map((p) => randPropriu(p, deseneaza))
          : [gol('✍️', 'Ce găsiți voi — o plajă, o tavernă, o idee — se adaugă cu butonul de sus și apare la toți.')]),
      ));
    }

    gazda.replaceChildren(frag(...bucati));
  }

  deseneaza();
  return gazda;
}
