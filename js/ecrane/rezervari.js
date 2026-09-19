// Zboruri, cazări, mașină, restaurant. Aici stau codurile — încuiate până se
// dă parola grupului o dată pe telefon.

import { el, frag, capSectiune, eticheta, textAldin, randDate, harta, telefon, paine, deschideFereastra, inchideFereastra } from '../ui.js';
import * as secrete from '../secrete.js';
import { ZBORURI } from '../date/zbor.js';
import { CAZARI } from '../date/cazare.js';
import { MASINA, CARBURANT_NOTE } from '../date/masina-date.js';
import { REZERVARE_PESKESI } from '../date/mancare.js';
import {
  PARCARE_ALEASA, DURATA, CUM_MERGE, ALTE_VARIANTE, DE_STIUT, PRET_ESTIMAT_LEI,
  DRUM_SPRE_AEROPORT,
} from '../date/parcare.js';
import { numePersoana } from '../date/grup.js';
import { dataLunga, durata, euro, nopti, numeZi } from '../lib/format.js';

// ─────────────────────────────── deblocare ───────────────────────────────

function formularParola() {
  const intrare = el('input', {
    type: 'password', autocomplete: 'current-password',
    attrs: { placeholder: 'Parola grupului', autocapitalize: 'none', spellcheck: 'false' },
  });
  const eroare = el('p', { class: 'camp-nota', style: 'color:var(--rosu)' });
  const buton = el('button', { class: 'buton buton-lat', type: 'submit' }, 'Deblochează');

  const form = el('form', {
    on: {
      submit: async (e) => {
        e.preventDefault();
        eroare.textContent = '';
        buton.disabled = true;
        buton.textContent = 'Se verifică…';
        try {
          await secrete.deblocheaza(intrare.value);
          inchideFereastra();
          paine('Deblocat. Codurile sunt acum în telefon.');
        } catch (err) {
          eroare.textContent = err.cod === 'EROARE_PAROLA'
            ? 'Parolă greșită. Întreabă în grup.'
            : (err.message || 'Nu s-a putut debloca.');
          intrare.select();
        } finally {
          buton.disabled = false;
          buton.textContent = 'Deblochează';
        }
      },
    },
  },
    el('p', { style: 'font-size:14px;margin-bottom:14px' },
      'Site-ul e găzduit public, deci PIN-urile și codurile de rezervare stau criptate în el. Parola o știți doar voi șapte.'),
    el('label', { class: 'camp' }, el('span', { class: 'camp-eticheta' }, 'Parola grupului'), intrare),
    eroare,
    buton,
    el('p', { class: 'camp-nota', style: 'margin-top:12px' },
      'Se cere o singură dată pe fiecare telefon. După aceea codurile merg și fără internet.'),
  );
  return form;
}

function cerereDeblocare() {
  return el('div', { class: 'card', style: 'border-color:var(--accent)' },
    el('h3', { class: 'card-titlu' }, '🔒 Codurile sunt încuiate'),
    el('p', { class: 'card-sub', style: 'margin-top:5px' },
      'PIN-urile cazărilor, codurile de rezervare și numărul de la firma de mașini.'),
    el('button', {
      class: 'buton buton-lat', type: 'button', style: 'margin-top:12px',
      on: { click: () => deschideFereastra('Deblochează codurile', formularParola()) },
    }, 'Introdu parola grupului'),
  );
}

/** Un cod: ascuns cât timp blocul e încuiat, cu buton de copiere când e deschis. */
function cod(eticheta_, cale) {
  const val = secrete.valoare(cale);
  if (!val) {
    return el('div', { class: 'date-rand' },
      el('span', { class: 'date-cheie' }, eticheta_),
      el('span', { class: 'cod cod-ascuns' }, '••••••'),
    );
  }
  return el('div', { class: 'date-rand' },
    el('span', { class: 'date-cheie' }, eticheta_),
    el('button', {
      class: 'cod', type: 'button',
      style: 'border:0;cursor:pointer',
      attrs: { title: 'Apasă pentru a copia' },
      on: {
        click: async () => {
          try {
            await navigator.clipboard.writeText(val);
            paine(`Copiat: ${val}`);
          } catch {
            paine('Nu s-a putut copia. Notează-l manual.', true);
          }
        },
      },
    }, val),
  );
}

// ─────────────────────────────── zboruri ───────────────────────────────

function cardZbor(z) {
  return el('div', { class: 'card' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', {},
        el('h3', { class: 'card-titlu' }, `${z.deLa.cod} → ${z.catre.cod}`),
        el('p', { class: 'card-sub' }, `${z.companie} · ${z.numar}`),
      ),
      eticheta(z.grup === 'uk' ? 'Bengi + Diana' : 'Grupul RO', z.grup === 'uk' ? 'teracota' : 'accent'),
    ),
    el('div', { style: 'display:flex;align-items:center;gap:14px;margin:14px 0' },
      el('div', {},
        el('div', { style: 'font-size:22px;font-weight:700;font-variant-numeric:tabular-nums' }, z.plecare),
        el('div', { style: 'font-size:12px;color:var(--text-slab)' }, `${z.deLa.oras}, ${z.deLa.aeroport}`),
      ),
      el('div', { style: 'flex:1;text-align:center;color:var(--text-stins);font-size:11.5px' },
        el('div', {}, '────── ✈ ──────'),
        el('div', {}, durata(z.durataMin)),
      ),
      el('div', { style: 'text-align:right' },
        el('div', { style: 'font-size:22px;font-weight:700;font-variant-numeric:tabular-nums' }, z.sosire),
        el('div', { style: 'font-size:12px;color:var(--text-slab)' }, `${z.catre.oras}, ${z.catre.aeroport}`),
      ),
    ),
    el('div', { class: 'date-lista' },
      randDate('Data', dataLunga(z.data)),
      z.sosireData !== z.data ? randDate('Aterizare', dataLunga(z.sosireData)) : null,
      randDate('Pasageri', z.pasageri.map(numePersoana).join(', ')),
      z.secret ? cod(z.secretEticheta || 'Cod', z.secret) : null,
    ),
    z.nota ? el('p', { style: 'margin-top:11px;font-size:13px;color:var(--text-slab)' }, textAldin(z.nota)) : null,
  );
}

// ─────────────────────────────── cazări ───────────────────────────────

function cardCazare(c) {
  const corp = el('div', { class: 'card' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { class: 'card-titlu' }, c.nume),
        el('p', { class: 'card-sub' }, `${c.subtitlu} · ${c.localitate}`),
      ),
      eticheta(c.zona === 'vest' ? 'Vest' : 'Est', 'accent'),
    ),
    el('div', { class: 'date-lista', style: 'margin-top:13px' },
      randDate('Intrare', `${numeZi(c.dataIntrare)}, ${dataLunga(c.dataIntrare).split(', ')[1]}`),
      randDate('Ieșire', `${numeZi(c.dataIesire)}, ${dataLunga(c.dataIesire).split(', ')[1]}`),
      randDate('Nopți', nopti(c.nopti)),
      randDate('Pe numele', numePersoana(c.titular)),
      ...(c.secrete || []).map((s) => cod(s.eticheta, s.cale)),
    ),
    el('p', { style: 'margin-top:11px;font-size:13px' }, harta(c.harta, c.adresa)),
  );

  if (c.checkin) {
    const ck = el('details', { class: 'desfa', style: 'margin-top:12px' },
      el('summary', {}, c.checkin.titlu),
      el('div', { class: 'desfa-corp' },
        el('ol', {}, ...c.checkin.pasi.map((p) => el('li', {}, textAldin(p)))),
        c.checkin.atentie ? el('div', { class: 'alerta alerta-atentie', style: 'margin-top:11px' },
          el('div', { class: 'alerta-corp' }, textAldin(c.checkin.atentie))) : null,
        c.checkin.poze ? el('div', { class: 'poze', style: 'margin-top:13px' },
          ...c.checkin.poze.map((p) => el('figure', { class: 'poza' },
            el('img', { src: p.fisier, alt: p.descriere, loading: 'lazy', decoding: 'async' }),
            el('figcaption', {}, p.descriere),
          )),
        ) : null,
      ),
    );
    corp.append(ck);
  }

  if (c.dinPartea_gazdei) {
    corp.append(el('details', { class: 'desfa' },
      el('summary', {}, 'Ce zice gazda despre zonă'),
      el('ul', { class: 'desfa-corp' }, ...c.dinPartea_gazdei.map((t) => el('li', {}, textAldin(t)))),
    ));
  }

  if (c.facilitati) {
    corp.append(el('details', { class: 'desfa' },
      el('summary', {}, 'Ce are apartamentul'),
      el('ul', { class: 'desfa-corp' }, ...c.facilitati.map((t) => el('li', {}, t))),
    ));
  }

  if (c.politici) {
    corp.append(el('details', { class: 'desfa' },
      el('summary', {}, 'Politici'),
      el('ul', { class: 'desfa-corp' }, ...c.politici.map((t) => el('li', {}, t))),
    ));
  }

  return corp;
}

// ─────────────────────────────── mașina ───────────────────────────────

function cardMasina() {
  const t = MASINA.tarif;
  return el('div', { class: 'card' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { class: 'card-titlu' }, MASINA.firma),
        el('p', { class: 'card-sub' }, MASINA.grupa),
      ),
      eticheta('7 locuri', 'accent'),
    ),
    el('p', { style: 'margin-top:9px;font-size:13.5px;color:var(--text-slab)' }, `Model: ${MASINA.model}`),
    el('div', { class: 'date-lista', style: 'margin-top:13px' },
      randDate('Ridicare', `${numeZi(MASINA.ridicare.data)} ${MASINA.ridicare.ora} · ${MASINA.ridicare.aeroport}`),
      randDate('Predare', `${numeZi(MASINA.predare.data)} ${MASINA.predare.ora} · ${MASINA.predare.aeroport}`),
      randDate('Șofer', MASINA.soferNume),
      randDate('Zile', String(MASINA.zile)),
      ...(MASINA.secrete || []).map((s) => cod(s.eticheta, s.cale)),
    ),
    el('hr', { class: 'rupere' }),
    el('div', { class: 'date-lista' },
      randDate('Tarif inițial', euro(t.initialCenti)),
      randDate('Discount', euro(t.discountCenti)),
      randDate('Tarif final', euro(t.finalCenti)),
      randDate('Avans încasat', euro(-t.avansCenti)),
      randDate('Rest pe card', euro(t.restCardCenti)),
      randDate('Rest în numerar', el('span', { class: 'suma suma-pozitiv' }, euro(t.restNumerarCenti))),
    ),
    el('div', { class: 'alerta alerta-info', style: 'margin-top:12px' },
      el('div', { class: 'alerta-corp' },
        textAldin('Plata restului **în numerar** costă 300 € în loc de 306 €. Strângeți 300 € cash până joi.'))),
    ...(MASINA.taxeSuplimentare || []).map((tx) => el('div', { class: 'alerta alerta-atentie', style: 'margin-top:9px' },
      el('div', { class: 'alerta-titlu' }, `${tx.eticheta}: ${euro(tx.sumaCenti)}`),
      el('div', { class: 'alerta-corp' }, tx.explicatie),
    )),
    el('details', { class: 'desfa', style: 'margin-top:12px' },
      el('summary', {}, MASINA.undeGasim.titlu),
      el('div', { class: 'desfa-corp' },
        el('p', { style: 'margin-bottom:8px' }, MASINA.undeGasim.distanta),
        el('ol', {}, ...MASINA.undeGasim.pePicioare.map((p) => el('li', {}, p))),
        el('p', { style: 'margin-top:10px' }, harta(MASINA.undeGasim.harta, 'Parcarea Eurocars')),
      ),
    ),
    el('div', { class: 'alerta alerta-critic', style: 'margin-top:12px' },
      el('div', { class: 'alerta-titlu' }, 'De întrebat la Eurocars, înainte de orice'),
      el('div', { class: 'alerta-corp' },
        ...MASINA.deIntrebat.map((q) => el('div', { style: 'margin-top:9px' },
          el('div', { style: 'font-weight:650' }, q.intrebare),
          el('p', { style: 'margin-top:2px' }, q.deCe),
          el('p', { style: 'margin-top:4px;font-family:ui-monospace,monospace;font-size:12px;opacity:.8' },
            `„${q.inEngleza}"`),
        )),
        el('p', { style: 'margin-top:11px' },
          'WhatsApp: ', telefon('+306970017115', '+30 6970 017115')),
      ),
    ),

    el('details', { class: 'desfa' },
      el('summary', {}, 'De ținut minte la ridicare'),
      el('ul', { class: 'desfa-corp' }, ...MASINA.laRidicare.map((t2) => el('li', {}, textAldin(t2)))),
    ),
    el('details', { class: 'desfa' },
      el('summary', {}, 'Contact'),
      el('div', { class: 'desfa-corp' },
        ...MASINA.contact.map((c) => el('p', { style: 'margin-bottom:6px' },
          `${c.eticheta}: `, telefon(c.numar, c.afisat))),
        el('p', { style: 'margin-top:8px;color:var(--text-slab)' }, CARBURANT_NOTE),
      ),
    ),
  );
}

// ─────────────────────────────── restaurant ───────────────────────────────

function cardRestaurant() {
  const r = REZERVARE_PESKESI;
  return el('div', { class: 'card' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { class: 'card-titlu' }, r.nume),
        el('p', { class: 'card-sub' }, 'Ultima masă, înainte de aeroport'),
      ),
      eticheta('7 persoane', 'accent'),
    ),
    el('div', { class: 'date-lista', style: 'margin-top:13px' },
      randDate('Data', dataLunga(r.data)),
      randDate('Ora rezervată', r.oraRezervata),
      randDate('Ora recomandată', el('span', { class: 'suma suma-pozitiv' }, r.oraRecomandata)),
      randDate('Pe numele', 'Marian Galan'),
      randDate('Telefon', telefon(r.telefon, r.telefonAfisat)),
      randDate('Program', r.program),
    ),
    el('div', { class: 'alerta alerta-critic', style: 'margin-top:12px' },
      el('div', { class: 'alerta-corp' }, textAldin(r.atentie))),
    el('p', { style: 'margin-top:12px;font-size:13.5px' }, r.deCe),
    el('details', { class: 'desfa', style: 'margin-top:8px' },
      el('summary', {}, 'Ce merită cerut'),
      el('div', { class: 'desfa-corp' },
        ...r.deCerut.map((d) => el('p', { style: 'margin-bottom:8px' },
          el('strong', {}, d.fel), el('br'), el('span', { style: 'color:var(--text-slab)' }, d.nota))),
      ),
    ),
    el('p', { style: 'margin-top:8px;font-size:13px' }, harta(r.harta, r.adresa)),
  );
}

// ─────────────────────────── parcarea de la Otopeni ───────────────────────────

function cardDrum() {
  const d = DRUM_SPRE_AEROPORT;
  return el('div', { class: 'card', style: 'margin-bottom:10px' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { class: 'card-titlu' }, `${d.deLa} → Otopeni`),
        el('p', { class: 'card-sub' }, d.traseu),
      ),
      eticheta(`Mașina lui ${numePersoana(d.soferul)}`, 'accent'),
    ),
    el('div', { class: 'date-lista', style: 'margin-top:12px' },
      randDate('Distanță', `${d.km} km`),
      randDate('Timp de mers', durata(d.minute)),
      randDate('Plecare din Suceava', el('span', { class: 'suma suma-pozitiv' }, d.plecareRecomandata)),
      randDate('La parcare', DURATA.intrare.ora),
    ),
    el('p', { style: 'margin-top:10px;font-size:13.5px' }, d.explicatie),
    el('div', { class: 'alerta alerta-atentie', style: 'margin-top:11px' },
      el('div', { class: 'alerta-corp' }, d.atentie)),
    el('details', { class: 'desfa', style: 'margin-top:8px' },
      el('summary', {}, 'Unde se oprește'),
      el('ul', { class: 'desfa-corp' }, ...d.opriri.map((o) => el('li', {}, o))),
    ),
  );
}

function cardParcare() {
  const p = PARCARE_ALEASA;

  return el('div', { class: 'card' },
    el('div', { style: 'display:flex;justify-content:space-between;gap:10px;align-items:flex-start' },
      el('div', { style: 'flex:1;min-width:0' },
        el('h3', { class: 'card-titlu' }, p.nume),
        el('p', { class: 'card-sub' }, `${p.adresa} · ${p.distanta}`),
      ),
      eticheta('Grupul RO', 'accent'),
    ),

    el('div', { class: 'date-lista', style: 'margin-top:13px' },
      randDate('Mașina intră', `${numeZi(DURATA.intrare.data)} ${DURATA.intrare.ora}`),
      randDate('Mașina iese', `${numeZi(DURATA.iesire.data)} ${DURATA.iesire.ora}`),
      randDate('Zile de plată', `${DURATA.zileIncepute} zile începute`),
      randDate('Cost estimat', el('span', { class: 'suma' }, `${PRET_ESTIMAT_LEI} lei`)),
      randDate('Telefon', telefon(p.telefon, p.telefonAfisat)),
    ),

    el('div', { class: 'alerta alerta-atentie', style: 'margin-top:12px' },
      el('div', { class: 'alerta-titlu' }, 'Se plătesc 7 zile, nu 6' ),
      el('div', { class: 'alerta-corp' }, DURATA.explicatie),
    ),

    el('div', { class: 'etichete', style: 'margin-top:12px' },
      eticheta('🚐 Transfer gratuit'),
      eticheta('🕐 Non-stop'),
      eticheta('📹 Păzită 24/7'),
    ),
    el('p', { style: 'margin-top:9px;font-size:13px;color:var(--text-slab)' }, p.transfer),
    el('p', { style: 'margin-top:4px;font-size:13px;color:var(--text-slab)' }, p.paza),

    ...CUM_MERGE.map((grup) => el('details', { class: 'desfa', style: 'margin-top:8px' },
      el('summary', {}, grup.titlu),
      el('ul', { class: 'desfa-corp' }, ...grup.pasi.map((t) => el('li', {}, textAldin(t)))),
    )),

    el('details', { class: 'desfa' },
      el('summary', {}, 'Tot tabelul de prețuri'),
      el('div', { class: 'desfa-corp' },
        el('div', { class: 'date-lista' },
          ...p.preturi.map((t) => el('div', {
            class: 'date-rand',
            style: t.alNostru ? 'font-weight:650;color:var(--accent-tare)' : '',
          },
            el('span', { class: 'date-cheie' }, `${t.zile} ${t.zile === 1 ? 'zi' : 'zile'}${t.alNostru ? ' — cazul nostru' : ''}`),
            el('span', { class: 'date-val' }, `${t.lei} lei`),
          )),
        ),
        el('p', { style: 'margin-top:8px;color:var(--text-slab)' }, p.pesteOptZile),
        el('p', { style: 'margin-top:6px;font-size:11.5px;color:var(--text-stins)' },
          `Prețuri de pe site-ul lor, ${p.actualizatLa}. Confirmați-le la rezervare.`),
      ),
    ),

    el('details', { class: 'desfa' },
      el('summary', {}, 'Alte variante, și de ce nu le-am ales'),
      el('div', { class: 'desfa-corp' },
        ...ALTE_VARIANTE.map((v) => el('div', { style: 'margin-bottom:11px' },
          el('div', { style: 'font-weight:620' }, v.nume),
          el('p', { style: 'color:var(--text-slab);margin-top:2px' }, v.detaliu),
          el('p', { style: 'margin-top:2px' }, el('em', {}, v.cand)),
        )),
      ),
    ),

    el('details', { class: 'desfa' },
      el('summary', {}, 'De știut'),
      el('ul', { class: 'desfa-corp' }, ...DE_STIUT.map((t) => el('li', {}, t))),
    ),

    el('div', { class: 'butoane', style: 'margin-top:13px' },
      el('a', { href: p.web, target: '_blank', rel: 'noopener', class: 'buton' }, 'Rezervă locul ↗'),
      el('a', { href: p.harta, target: '_blank', rel: 'noopener', class: 'buton buton-slab' }, 'Arată pe hartă ↗'),
    ),
  );
}

export default function ecranRezervari() {
  return frag(
    !secrete.esteDeblocat()
      ? el('section', { class: 'sectiune' }, cerereDeblocare())
      : el('section', { class: 'sectiune' },
        el('div', { class: 'card card-strans', style: 'display:flex;align-items:center;gap:10px;justify-content:space-between' },
          el('span', { style: 'font-size:13.5px' }, '🔓 Codurile sunt vizibile pe telefonul ăsta'),
          el('button', {
            class: 'buton buton-slab buton-mic', type: 'button',
            on: {
              click: () => {
                secrete.blocheaza();
                paine('Încuiat. Se cere din nou parola.');
              },
            },
          }, 'Încuie'),
        ),
      ),

    el('section', { class: 'sectiune' },
      capSectiune('Zboruri'),
      el('div', { class: 'grila', style: 'gap:10px' }, ...ZBORURI.map(cardZbor)),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Mașina personală: Suceava → Otopeni'),
      cardDrum(),
      cardParcare(),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Cazări'),
      el('div', { class: 'grila', style: 'gap:10px' }, ...CAZARI.map(cardCazare)),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Mașina'),
      cardMasina(),
    ),

    el('section', { class: 'sectiune' },
      capSectiune('Restaurant'),
      cardRestaurant(),
    ),
  );
}
