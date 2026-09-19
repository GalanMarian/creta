// Itinerariul pe zile. Ce are oră e cronologie; ce se decide la fața locului
// trimite la vot.

import { el, frag, capSectiune, eticheta, textAldin, harta } from '../ui.js';
import { ZILE } from '../date/itinerariu.js';
import { cazarea } from '../date/cazare.js';
import { locul } from '../date/locuri.js';
import { ziuaCurenta, ceUrmeaza, moment, oraDin, minute } from '../lib/itinerar.js';
import { numeZi, dataLunga, km, durata } from '../lib/format.js';
import { esteRezolvat } from '../fapte.js';

function pas(ev, esteUrmatorul) {
  const peste24 = minute(ev.ora) >= 1440;
  return el('div', {
    class: 'crono-pas',
    dataset: {
      fix: ev.fix ? '1' : '0',
      atentie: ev.atentie ? '1' : '0',
      acum: esteUrmatorul ? '1' : '0',
    },
  },
    el('div', { class: 'crono-ora' }, peste24 ? oraDin(minute(ev.ora)) : ev.ora),
    el('div', { class: 'crono-bulina' }),
    el('div', {},
      el('div', { class: 'crono-text' },
        ev.text,
        ev.cine === 'uk' ? el('span', { class: 'crono-cine' }, 'Bengi + Diana') : null,
        ev.cine === 'ro' ? el('span', { class: 'crono-cine' }, 'grupul RO') : null,
        peste24 ? el('span', { class: 'crono-cine' }, 'după miezul nopții') : null,
      ),
      ev.detaliu ? el('div', { class: 'crono-detaliu' }, textAldin(ev.detaliu)) : null,
      ev.atentie
        ? (ev.faptCareOStinge && esteRezolvat(ev.faptCareOStinge)
          ? el('div', { class: 'crono-rezolvat' }, '✅ Rezolvat')
          : el('div', { class: 'crono-atentie' }, textAldin(ev.atentie)))
        : null,
    ),
  );
}

function cardZi(zi, azi, urmatorul) {
  const esteAzi = zi.id === azi?.id;
  const caz = zi.dormim ? cazarea(zi.dormim) : null;

  const corp = el('div', {});

  if (zi.rezumatLung) {
    corp.append(el('p', { style: 'font-size:14px;margin-bottom:14px' }, zi.rezumatLung));
  }

  if (zi.program?.length) {
    corp.append(el('div', { class: 'crono' },
      ...zi.program.map((ev) => pas(ev, urmatorul && urmatorul.zi === zi.data && urmatorul.ora === ev.ora)),
    ));
  }

  if (zi.propuneri?.length) {
    const locuri = zi.propuneri.map(locul).filter(Boolean);
    corp.append(el('div', { style: 'margin-top:16px' },
      el('div', { style: 'font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-slab);margin-bottom:8px' },
        'De votat pentru ziua asta'),
      el('div', { class: 'etichete' },
        ...locuri.map((l) => el('a', {
          href: '#/vot', class: 'eticheta eticheta-accent', style: 'text-decoration:none',
        }, `${l.nume}`)),
      ),
      el('a', { href: '#/vot', class: 'buton buton-slab buton-mic', style: 'margin-top:10px' }, 'Votează →'),
    ));
  }

  if (zi.deFacut?.length) {
    corp.append(el('details', { class: 'desfa', style: 'margin-top:14px' },
      el('summary', {}, `De ținut minte (${zi.deFacut.length})`),
      el('ul', { class: 'desfa-corp' }, ...zi.deFacut.map((t) => el('li', {}, textAldin(t)))),
    ));
  }

  if (zi.atentie) {
    const stinsa = zi.faptCareOStinge && esteRezolvat(zi.faptCareOStinge);
    corp.append(el('div', {
      class: `alerta alerta-${stinsa ? 'info' : 'atentie'}`, style: 'margin-top:14px',
    },
      el('div', { class: 'alerta-corp' },
        stinsa ? '✅ Masa e mutată la 15:00, deci lanțul zilei încape.' : textAldin(zi.atentie))));
  }

  return el('section', { class: 'card', style: esteAzi ? 'border-color:var(--verde);border-width:1.5px' : '' },
    el('div', { style: 'display:flex;align-items:flex-start;gap:12px;margin-bottom:12px' },
      el('span', {
        class: 'poarta-nume-cerc', style: esteAzi ? 'background:var(--verde-slab);color:var(--verde)' : '',
      }, String(zi.numar)),
      el('div', { style: 'flex:1;min-width:0' },
        el('h2', { class: 'card-titlu' }, zi.titlu),
        el('p', { class: 'card-sub' }, dataLunga(zi.data)),
      ),
      esteAzi ? eticheta('Azi', 'verde') : null,
    ),
    el('p', { style: 'font-size:14px;color:var(--text-slab);margin-bottom:14px' }, zi.rezumat),
    el('div', { class: 'etichete', style: 'margin-bottom:14px' },
      caz ? eticheta(`🛏️ ${caz.localitate}`) : eticheta('✈️ plecăm', 'teracota'),
      zi.conduce ? eticheta(`🚗 ${km(zi.conduce)}`) : null,
    ),
    corp,
  );
}

export default function ecranItinerar() {
  const acum = new Date();
  const azi = ziuaCurenta(ZILE, acum);
  const urmatorul = ceUrmeaza(ZILE, acum);

  return frag(
    el('section', { class: 'sectiune' },
      el('p', { style: 'font-size:14px;color:var(--text-slab)' },
        'Orele fixe vin din rezervări. Restul se decide dimineața, la cafea — de aceea zilele din mijloc au variante, nu program.'),
    ),
    el('section', { class: 'sectiune' },
      el('div', { class: 'grila', style: 'gap:12px' },
        ...ZILE.map((z) => cardZi(z, azi, urmatorul)),
      ),
    ),
  );
}
