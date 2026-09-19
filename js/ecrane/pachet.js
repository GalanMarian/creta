// Pachetul. Fiecare bifează pe telefonul lui; obiectele comune arată cine le
// aduce, ca să nu vină patru prelungitoare și niciun adaptor.

import {
  el, frag, capSectiune, eticheta, paine, textAldin, avatar,
  deschideFereastra, inchideFereastra, confirma,
} from '../ui.js';
import * as stare from '../stare.js';
import { cineSunt, euPersoana } from '../identitate.js';
import { PERSOANE, persoana, numePersoana } from '../date/grup.js';
import { GRUPE, pentruPersoana } from '../date/pachet.js';
import { obiecteProprii, adaugaObiect, stergeObiect } from '../amfost.js';
import { esteRezolvat, rezolva } from '../fapte.js';

function idBifa(om, obiect) {
  return `pachet_${om}_${obiect}`;
}

function esteBifat(om, obiect) {
  const inr = stare.una(idBifa(om, obiect));
  return !!(inr && inr.bifat && !inr.sters);
}

function comuta(om, obiect, valoare) {
  stare.seteaza(idBifa(om, obiect), 'pachet', { persoana: om, obiect, bifat: valoare });
}

/** Cine aduce un obiect comun. Id determinist ca să nu se dubleze. */
function aducator(obiect) {
  const inr = stare.una(`aduce_${obiect}`);
  return inr && !inr.sters ? inr.persoana : null;
}

function seteazaAducator(obiect, om) {
  stare.seteaza(`aduce_${obiect}`, 'aduce', { obiect, persoana: om });
}

/** Formularul scurt pentru un obiect adăugat de noi. */
function formularObiect(dupaSalvare) {
  const text = el('input', {
    type: 'text',
    attrs: { placeholder: 'Ex. Placă de întins părul', maxlength: '90' },
  });
  let pentruGrup = false;

  const comutator = el('div', { class: 'segmente', style: 'margin-bottom:13px' },
    ...[[false, 'Doar pentru mine'], [true, 'Pentru tot grupul']].map(([v, et]) => el('button', {
      class: 'segment', type: 'button',
      attrs: { 'aria-pressed': String(pentruGrup === v) },
      on: {
        click: (e) => {
          pentruGrup = v;
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
        const t = text.value.trim();
        if (!t) { paine('Scrie ceva.', true); return; }
        adaugaObiect(t, pentruGrup);
        inchideFereastra();
        paine(pentruGrup ? 'Adăugat pe lista tuturor' : 'Adăugat pe lista ta');
        if (dupaSalvare) dupaSalvare();
      },
    },
  },
    el('p', { style: 'font-size:13px;color:var(--text-slab);margin-bottom:12px' },
      'Un singur rând. „Pentru tot grupul" îl pune pe lista fiecăruia.'),
    comutator,
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Ce mai trebuie luat'), text),
    el('button', { class: 'buton buton-lat', type: 'submit' }, 'Adaugă'),
  );
}

export default function ecranPachet() {
  const eu = cineSunt();
  const euP = euPersoana();
  const gazda = el('div', {});

  if (!eu) {
    return el('div', { class: 'gol' }, 'Alege-ți numele din Setări ca să-ți poți bifa pachetul.');
  }

  /**
   * Redesenăm DOAR bucățile care se schimbă la o bifă — bara de progres și
   * rândul de sus. O randare completă a ecranului ar readuce pagina în vârf,
   * iar bifatul a treizeci de lucruri ar deveni un chin.
   */
  let actualizeazaSumar = () => {};

  function obiecteleMele() {
    return [
      ...pentruPersoana(eu).flatMap((g) => g.obiecte.map((o) => o.id)),
      ...obiecteProprii(eu).map((o) => o.id),
    ];
  }

  function randObiect(o, ecran) {
    // Obiectele legate de un „fapt" (sună la Peskesi, întreabă Eurocars) nu sunt
    // lucruri de pus în rucsac, ci sarcini ale grupului — bifa lor e comună.
    const bifat = o.fapt ? esteRezolvat(o.fapt) : esteBifat(eu, o.id);
    const intrare = el('input', {
      type: 'checkbox', checked: bifat,
      on: {
        change: (e) => {
          if (o.fapt) {
            rezolva(o.fapt, e.target.checked);
            paine(e.target.checked ? 'Bifat peste tot' : 'Readus în listă, peste tot');
          } else {
            comuta(eu, o.id, e.target.checked);
          }
          rand.dataset.bifat = e.target.checked ? '1' : '0';
          actualizeazaSumar();
        },
      },
    });
    const rand = el('label', {
      class: `bifa ${o.critic ? 'bifa-critic' : ''}`,
      dataset: { bifat: bifat ? '1' : '0' },
    },
      intrare,
      el('span', { class: 'bifa-corp' },
        el('span', { class: 'bifa-text' }, textAldin(o.text)),
        o.nota ? el('span', { class: 'bifa-nota' }, textAldin(o.nota)) : null,
        o.doar ? el('span', { class: 'bifa-nota', style: 'color:var(--teracota)' },
          `Doar pentru: ${o.doar.map(numePersoana).join(', ')}`) : null,
        o.alNostru ? el('span', { class: 'bifa-nota' },
          o.pentruGrup ? `Pentru tot grupul · pus de ${numePersoana(o.persoana)}` : 'Doar pe lista ta') : null,
        o.fapt ? el('span', { class: 'bifa-nota', style: 'color:var(--accent)' },
          'Sarcină a grupului — bifa se vede la toți') : null,
      ),
      o.critic ? eticheta('important', 'teracota') : null,
      o.alNostru ? el('button', {
        class: 'buton-x', type: 'button', attrs: { 'aria-label': 'Șterge' },
        on: {
          click: async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (await confirma('Ștergi obiectul?', `„${o.text}"`, { periculos: true, daText: 'Șterge' })) {
              stergeObiect(o.id);
              paine('Șters');
              ecran();
            }
          },
        },
      }, '✕') : null,
    );
    return rand;
  }

  function deseneaza() {
    const grupe = pentruPersoana(eu);
    const aleNoastre = obiecteProprii(eu).map((o) => ({ ...o, alNostru: true }));
    const toate = [...grupe.flatMap((g) => g.obiecte), ...aleNoastre];
    const bifat1 = (o) => (o.fapt ? esteRezolvat(o.fapt) : esteBifat(eu, o.id));
    const bifate = () => toate.filter(bifat1).length;
    const procent = () => (toate.length ? Math.round((bifate() / toate.length) * 100) : 0);

    const cifra = el('span', { style: 'font-size:19px;font-weight:700' }, `${procent()}%`);
    const bara = el('div', { class: 'bara-progres-umplut', style: `width:${procent()}%` });
    const text = el('p', { style: 'margin-top:8px;font-size:12.5px;color:var(--text-slab)' },
      `${bifate()} din ${toate.length} bifate. Bifele sunt doar ale tale.`);
    const zonaCritice = el('div', {});

    function deseneazaCritice() {
      const critice = toate.filter((o) => o.critic && !bifat1(o));
      zonaCritice.replaceChildren(critice.length
        ? el('div', { class: 'alerta alerta-atentie', style: 'margin-top:12px' },
          el('div', { class: 'alerta-titlu' }, `${critice.length} lucruri pe care nu le poți cumpăra acolo`),
          el('div', { class: 'alerta-corp' }, critice.map((o) => o.text).join(' · ')))
        : el('div', { class: 'alerta alerta-info', style: 'margin-top:12px' },
          el('div', { class: 'alerta-corp' }, '✅ Toate lucrurile importante sunt bifate.')));
    }
    deseneazaCritice();

    actualizeazaSumar = () => {
      cifra.textContent = `${procent()}%`;
      bara.style.width = `${procent()}%`;
      text.textContent = `${bifate()} din ${toate.length} bifate. Bifele sunt doar ale tale.`;
      deseneazaCritice();
    };

    gazda.replaceChildren(frag(
      el('section', { class: 'sectiune' },
        el('div', { class: 'card' },
          el('div', { style: 'display:flex;justify-content:space-between;align-items:baseline;gap:10px' },
            el('h2', { class: 'card-titlu' }, `Pachetul lui ${euP.nume}`),
            cifra,
          ),
          el('div', { class: 'bara-progres', style: 'margin-top:9px' }, bara),
          text,
          zonaCritice,
        ),
      ),

      el('section', { class: 'sectiune' },
        el('button', {
          class: 'buton buton-lat buton-slab', type: 'button',
          on: { click: () => deschideFereastra('Mai adaug ceva', formularObiect(deseneaza)) },
        }, '+ Adaugă pe listă'),
      ),

      aleNoastre.length ? el('section', { class: 'sectiune' },
        capSectiune('Adăugate de noi'),
        ...aleNoastre.map((o) => randObiect(o, deseneaza)),
      ) : null,

      ...grupe.map((g) => el('section', { class: 'sectiune' },
        capSectiune(g.titlu),
        g.nota ? el('p', { style: 'font-size:12.5px;color:var(--text-slab);margin-bottom:9px' }, g.nota) : null,
        ...g.obiecte.map((o) => {
          const rand = randObiect(o, deseneaza);
          if (!o.comun) return rand;
          const cine = aducator(o.id);
          return el('div', { style: 'margin-bottom:7px' },
            rand,
            el('div', { style: 'padding:0 12px' },
              el('select', {
                style: 'min-height:38px;font-size:14px;margin-top:6px',
                on: {
                  change: (e) => {
                    seteazaAducator(o.id, e.target.value || null);
                    paine(e.target.value ? `${numePersoana(e.target.value)} aduce: ${o.text}` : 'Nimeni asignat');
                  },
                },
              },
                el('option', { value: '', selected: !cine }, '— cine aduce? —'),
                ...PERSOANE.map((pp) => el('option', { value: pp.id, selected: cine === pp.id }, pp.nume)),
              )),
          );
        }),
      )),

      el('section', { class: 'sectiune' },
        capSectiune('Cum merge grupul'),
        el('div', { class: 'card card-strans' },
          ...PERSOANE.map((pp) => {
            const ale = [
              ...pentruPersoana(pp.id).flatMap((g) => g.obiecte),
              ...obiecteProprii(pp.id),
            ];
            const n = ale.filter((o) => esteBifat(pp.id, o.id)).length;
            const proc = ale.length ? Math.round((n / ale.length) * 100) : 0;
            return el('div', { style: 'display:flex;align-items:center;gap:10px;padding:5px 0' },
              avatar(pp, proc === 0),
              el('span', { style: 'flex:none;width:58px;font-size:13px' }, pp.nume),
              el('span', { style: 'flex:1' },
                el('span', { class: 'bara-progres' },
                  el('span', { class: 'bara-progres-umplut', style: `width:${proc}%;display:block` }))),
              el('span', { style: 'flex:none;font-size:12px;color:var(--text-slab);width:34px;text-align:right' }, `${proc}%`),
            );
          }),
        ),
      ),
    ));
  }

  deseneaza();
  return gazda;
}
