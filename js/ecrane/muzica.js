// Playlistul comun. Fiecare adaugă piese, toți le văd.
//
// Nu încercăm să redăm nimic în pagină — drepturile de autor nu ne lasă, iar
// un player prost e mai rău decât niciunul. Ținem lista, iar ascultatul se face
// unde îl face grupul oricum: un playlist pe Spotify sau YouTube, legat aici.

import {
  el, frag, capSectiune, eticheta, paine, deschideFereastra, inchideFereastra,
  confirma, gol, avatar,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt } from '../identitate.js';
import { PERSOANE, persoana, numePersoana } from '../date/grup.js';
import { dataScurta } from '../lib/format.js';

function piese() {
  return stare.toate('piesa').filter((p) => !p.sters);
}

function idVotPiesa(idPiesa, om) {
  return `plus_${idPiesa}_${om}`;
}

function amPus(idPiesa, om) {
  const inr = stare.una(idVotPiesa(idPiesa, om));
  return !!(inr && inr.plus && !inr.sters);
}

function plusuri(idPiesa) {
  return PERSOANE.filter((p) => amPus(idPiesa, p.id));
}

function comutaPlus(idPiesa) {
  const eu = cineSunt();
  if (!eu) { paine('Alege-ți numele din Setări.', true); return; }
  const acum = amPus(idPiesa, eu);
  stare.seteaza(idVotPiesa(idPiesa, eu), 'plus', { piesa: idPiesa, persoana: eu, plus: !acum });
}

function formularPiesa(dupaSalvare) {
  const titlu = el('input', { type: 'text', attrs: { placeholder: 'Ex. Zorba the Greek', maxlength: '120' } });
  const artist = el('input', { type: 'text', attrs: { placeholder: 'Cine o cântă', maxlength: '80' } });
  const link = el('input', {
    type: 'text',
    attrs: { placeholder: 'Link Spotify / YouTube (opțional)', autocapitalize: 'none', spellcheck: 'false' },
  });
  const deCe = el('input', { type: 'text', attrs: { placeholder: 'De ce asta? (opțional)', maxlength: '120' } });

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        if (!titlu.value.trim()) { paine('Scrie măcar titlul.', true); return; }
        if (link.value.trim() && !/^https?:\/\//i.test(link.value.trim())) {
          paine('Linkul trebuie să înceapă cu https://', true); return;
        }
        stare.adauga('piesa', {
          titlu: titlu.value.trim(),
          artist: artist.value.trim(),
          link: link.value.trim(),
          deCe: deCe.value.trim(),
          pusaDe: cineSunt(),
        });
        inchideFereastra();
        paine('Adăugată. O văd toți.');
        if (dupaSalvare) dupaSalvare();
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:13px' },
      'Orice se potrivește cu mașina, cu plaja sau cu serile pe balcon.'),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Piesa'), titlu),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Artist'), artist),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Link (opțional)'), link),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'De ce (opțional)'), deCe),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Adaugă la playlist'),
  );
}

function formularPlaylist() {
  const setare = stare.una('setare_playlist');
  const intrare = el('input', {
    type: 'text', value: setare && !setare.sters ? setare.url : '',
    attrs: { placeholder: 'https://open.spotify.com/playlist/…', autocapitalize: 'none', spellcheck: 'false' },
  });

  return el('form', {
    on: {
      submit: (e) => {
        e.preventDefault();
        const v = intrare.value.trim();
        if (!/^https?:\/\//i.test(v)) { paine('Lipește o adresă care începe cu https://', true); return; }
        stare.seteaza('setare_playlist', 'setare', { url: v, pusDe: cineSunt(), sters: false });
        inchideFereastra();
        paine('Salvat. Îl văd toți.');
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--key);margin-bottom:12px;color:var(--text-slab)' },
      'Faceți un playlist colaborativ în Spotify (Playlist nou → cele trei puncte → „Invită colaboratori") sau în YouTube Music, și lipiți aici linkul. Lista de mai jos rămâne locul unde se propun piesele.'),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Adresa playlistului'), intrare),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Salvează'),
  );
}

function randPiesa(p, redeseneaza) {
  const cei = plusuri(p.id);
  const eu = cineSunt();
  const alMeu = eu ? amPus(p.id, eu) : false;

  return el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
    el('div', { style: 'display:flex;gap:11px;align-items:flex-start' },
      el('span', { style: 'font-size:19px;flex:none' }, '♪'),
      el('div', { style: 'flex:1;min-width:0' },
        el('div', { style: 'font-weight:620;font-size:14.5px' }, p.titlu),
        p.artist ? el('div', { style: 'font-size:12.5px;color:var(--text-slab)' }, p.artist) : null,
        p.deCe ? el('div', { style: 'font-size:12.5px;color:var(--text-stins);margin-top:3px' }, `„${p.deCe}"` ) : null,
        el('div', { style: 'font-size:11.5px;color:var(--text-stins);margin-top:4px' },
          `pusă de ${numePersoana(p.pusaDe) || 'cineva'}${p.creatLa ? ` · ${dataScurta(p.creatLa)}` : ''}`),
      ),
      el('button', {
        class: `buton buton-mic ${alMeu ? '' : 'buton-slab'}`, type: 'button',
        style: 'flex:none',
        attrs: { 'aria-pressed': String(alMeu) },
        on: { click: () => { comutaPlus(p.id); redeseneaza(); } },
      }, `👍 ${cei.length}`),
    ),

    (p.link || cei.length || p.pusaDe === eu) ? el('div', {
      style: 'display:flex;gap:8px;align-items:center;margin-top:9px;flex-wrap:wrap',
    },
      p.link ? el('a', {
        href: p.link, target: '_blank', rel: 'noopener', class: 'buton buton-slab buton-mic',
      }, 'Ascultă ↗') : null,
      cei.length ? el('span', { class: 'avatare' }, ...cei.map((om) => avatar(om))) : null,
      el('span', { style: 'flex:1' }),
      p.pusaDe === eu ? el('button', {
        class: 'buton-x', type: 'button', attrs: { 'aria-label': 'Șterge piesa' },
        on: {
          click: async () => {
            if (await confirma('Scoți piesa?', `„${p.titlu}"`, { periculos: true, daText: 'Scoate' })) {
              stare.sterge(p.id);
              paine('Scoasă');
              redeseneaza();
            }
          },
        },
      }, '✕') : null,
    ) : null,
  );
}

export default function ecranMuzica() {
  const gazda = el('div', {});

  function deseneaza() {
    const lista = piese();
    const setare = stare.una('setare_playlist');
    const url = setare && !setare.sters ? setare.url : null;

    // cele mai plăcute sus, apoi cele noi
    const ordonate = [...lista].sort((a, b) => plusuri(b.id).length - plusuri(a.id).length
      || String(b.creatLa || '').localeCompare(String(a.creatLa || '')));

    const peOm = PERSOANE.map((om) => ({
      om, n: lista.filter((p) => p.pusaDe === om.id).length,
    }));

    gazda.replaceChildren(frag(
      el('section', { class: 'sectiune' },
        el('div', { class: 'card' },
          el('h2', { class: 'card-titlu' }, 'Muzica drumului'),
          el('p', { class: 'card-sub', style: 'margin-top:5px' },
            lista.length
              ? `${lista.length} ${lista.length === 1 ? 'piesă' : 'piese'} până acum. Pune 👍 la ce-ți place — cele cu cele mai multe urcă sus.`
              : 'Nicio piesă încă. 154 de kilometri în noaptea asta, apoi încă vreo cinci sute — merită un playlist.'),
          url
            ? el('a', { href: url, target: '_blank', rel: 'noopener', class: 'buton buton-lat', style: 'margin-top:12px' },
              '▶ Deschide playlistul comun ↗')
            : el('button', {
              class: 'buton buton-slab buton-lat', type: 'button', style: 'margin-top:12px',
              on: { click: () => deschideFereastra('Leagă un playlist', formularPlaylist()) },
            }, '🎧 Leagă un playlist Spotify sau YouTube'),
          url ? el('button', {
            class: 'buton buton-fantoma buton-mic', type: 'button', style: 'margin-top:5px',
            on: { click: () => deschideFereastra('Schimbă playlistul', formularPlaylist()) },
          }, 'Schimbă legătura') : null,
        ),
      ),

      el('section', { class: 'sectiune' },
        el('button', {
          class: 'buton buton-lat', type: 'button',
          on: { click: () => deschideFereastra('Adaugă o piesă', formularPiesa(deseneaza)) },
        }, '+ Adaugă o piesă'),
      ),

      el('section', { class: 'sectiune' },
        ordonate.length
          ? frag(...ordonate.map((p) => randPiesa(p, deseneaza)))
          : gol('🎵', 'Primul care pune o piesă dă tonul pentru tot drumul.'),
      ),

      lista.length ? el('section', { class: 'sectiune' },
        capSectiune('Cine a pus câte'),
        el('div', { class: 'card card-strans' },
          ...peOm.map(({ om, n }) => el('div', {
            style: 'display:flex;align-items:center;gap:10px;padding:4px 0',
          },
            avatar(om, n === 0),
            el('span', { style: 'flex:1;font-size:13.5px' }, om.nume),
            el('span', { style: 'font-size:13px;color:var(--text-slab)' }, String(n)),
          )),
        ),
      ) : null,
    ));
  }

  deseneaza();
  return gazda;
}
