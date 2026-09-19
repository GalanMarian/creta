// Urgențe. Ecranul care trebuie să funcționeze fără internet, cu o mână, cu
// bateria pe roșu. De asta: numerele mari, apelabile dintr-o atingere, fără
// nimic criptat și fără nicio cerere în rețea.

import { el, frag, capSectiune, eticheta, textAldin, telefon, harta } from '../ui.js';
import { URGENTE, SPITALE, CONSULAR, ASIGURARE, CUM_SUNAM } from '../date/sos.js';
import { MASINA } from '../date/masina-date.js';
import { CAZARI } from '../date/cazare.js';
import * as secrete from '../secrete.js';
import { ziuaCurenta } from '../lib/itinerar.js';
import { ZILE } from '../date/itinerariu.js';

function butonApel(numar, titlu, detaliu, prioritar) {
  return el('a', {
    href: `tel:${String(numar).replace(/\s/g, '')}`,
    class: 'rand-card',
    style: `text-decoration:none;${prioritar ? 'border-color:var(--rosu);border-width:1.5px;background:var(--rosu-slab)' : ''}`,
  },
    el('span', {
      style: `font-size:${prioritar ? '26px' : '19px'};font-weight:700;flex:none;${prioritar ? 'color:var(--rosu)' : ''}`,
    }, '📞'),
    el('span', { class: 'rand-card-corp' },
      el('span', {
        class: 'rand-card-titlu',
        style: prioritar ? 'font-size:18px;color:var(--rosu)' : '',
      }, titlu),
      detaliu ? el('span', { class: 'rand-card-sub' }, detaliu) : null,
    ),
    el('span', { class: 'rand-card-dreapta', style: 'color:var(--accent);font-weight:650' }, 'Sună'),
  );
}

function zonaAcum() {
  const zi = ziuaCurenta(ZILE, new Date());
  if (!zi) return null;
  if (zi.zona === 'vest') return 'vest';
  if (zi.zona === 'est') return 'est';
  return null;
}

export default function ecranSos() {
  const zona = zonaAcum();
  const spitale = zona
    ? [...SPITALE.filter((s) => s.zona === zona || s.zona === 'ambele'),
      ...SPITALE.filter((s) => s.zona !== zona && s.zona !== 'ambele')]
    : SPITALE;

  return frag(
    el('section', { class: 'sectiune' },
      el('div', { class: 'alerta alerta-critic' },
        el('div', { class: 'alerta-titlu' }, 'Dacă e o urgență, sună 112'),
        el('div', { class: 'alerta-corp' },
          'Merge în toată Uniunea Europeană, în engleză, de la orice telefon — chiar și fără cartelă și fără semnal de la operatorul tău, dacă există orice alt operator în zonă. Nu costă niciodată.'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Numere de urgență'),
      ...URGENTE.map((u) => butonApel(u.numar, u.eticheta, u.detaliu, u.prioritar)),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Spitale', zona ? eticheta(zona === 'vest' ? 'Ești în vest' : 'Ești în est', 'accent') : null),
      ...spitale.map((s) => (s.numar
        ? el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
          butonApel(s.numar, s.nume, s.afisat),
          el('p', { style: 'margin-top:7px;font-size:12.5px;color:var(--text-slab)' }, s.detaliu),
          s.harta ? el('p', { style: 'margin-top:5px;font-size:12.5px' }, harta(s.harta, 'Arată pe hartă')) : null,
        )
        : el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
          el('div', { class: 'rand-card-titlu' }, s.nume),
          el('p', { style: 'margin-top:4px;font-size:12.5px;color:var(--text-slab)' }, s.detaliu),
        ))),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Firma de mașini'),
      el('div', { class: 'card card-strans' },
        el('div', { class: 'rand-card-titlu', style: 'margin-bottom:9px' }, MASINA.firma),
        ...MASINA.contact.map((c) => butonApel(c.numar, c.afisat, c.eticheta)),
        secrete.esteDeblocat()
          ? el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-slab)' },
            `Număr rezervare: ${secrete.valoare('masina.rezervare') || '—'}`)
          : el('p', { style: 'margin-top:9px;font-size:12.5px;color:var(--text-stins)' },
            'Numărul rezervării e în secțiunea Rezervări, după deblocare.'),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Cazări'),
      ...CAZARI.map((c) => {
        const tel = (c.secrete || []).find((s) => s.eticheta.toLowerCase().includes('contact'));
        const numar = tel ? secrete.valoare(tel.cale) : null;
        return el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
          el('div', { class: 'rand-card-titlu' }, c.nume),
          el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-top:2px' }, c.adresa),
          numar
            ? el('p', { style: 'margin-top:7px;font-size:14px' }, 'Gazdă: ', telefon(numar, numar))
            : (tel ? el('p', { style: 'margin-top:7px;font-size:12.5px;color:var(--text-stins)' },
              'Contactul gazdei e în Rezervări, după deblocare.') : null),
          el('p', { style: 'margin-top:5px;font-size:12.5px' }, harta(c.harta, 'Arată pe hartă')),
        );
      }),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Ambasadă și consulat'),
      ...CONSULAR.map((c) => el('div', { class: 'card card-strans', style: 'margin-bottom:8px' },
        el('div', { class: 'rand-card-titlu' }, c.nume),
        el('p', { style: 'margin-top:4px;font-size:12.5px;color:var(--text-slab)' }, c.detaliu),
        el('div', { style: 'margin-top:9px' },
          ...c.numere.map((n) => butonApel(n.numar, n.afisat, null)),
        ),
        c.email ? el('p', { style: 'margin-top:7px;font-size:13px' },
          el('a', { href: `mailto:${c.email}` }, c.email)) : null,
      )),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Asigurare de sănătate'),
      el('div', { class: 'card' },
        el('ul', { style: 'font-size:13.5px' }, ...ASIGURARE.map((t) => el('li', {}, t))),
      ),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Cum sunăm din Grecia'),
      el('div', { class: 'card' },
        el('ul', { style: 'font-size:13.5px' }, ...CUM_SUNAM.map((t) => el('li', {}, textAldin(t)))),
      ),
    ),

    el('p', { style: 'margin-top:20px;font-size:12px;color:var(--text-stins);text-align:center' },
      'Ecranul ăsta e salvat în telefon și funcționează fără internet.'),
  );
}
