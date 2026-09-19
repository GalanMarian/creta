// Ajutoare de interfață. Fără bibliotecă: `el` acoperă tot ce ne trebuie, iar
// textul trece prin `textContent`, deci nu există cale de injectare prin ce
// scriu oamenii în cheltuieli sau amintiri.

/**
 * el('div', { class: 'card' }, 'text', el('b', {}, 'aldin'))
 * Proprietăți speciale: `class`, `dataset`, `on` (evenimente), `html` (doar
 * pentru șabloane scrise de noi), `attrs`.
 */
export function el(tag, props = {}, ...copii) {
  const n = document.createElement(tag);

  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k === 'on') for (const [ev, fn] of Object.entries(v)) n.addEventListener(ev, fn);
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'attrs') for (const [a, av] of Object.entries(v)) { if (av !== null && av !== false) n.setAttribute(a, av); }
    else if (k in n) n[k] = v;
    else n.setAttribute(k, v);
  }

  adauga(n, copii);
  return n;
}

function adauga(parinte, copii) {
  for (const c of copii.flat(4)) {
    if (c === null || c === undefined || c === false || c === '') continue;
    parinte.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function frag(...copii) {
  const f = document.createDocumentFragment();
  adauga(f, copii);
  return f;
}

/** Text cu **aldine** — singurul marcaj pe care îl acceptăm în datele noastre. */
export function textAldin(sursa) {
  const f = document.createDocumentFragment();
  const bucati = String(sursa).split(/\*\*(.+?)\*\*/g);
  bucati.forEach((b, i) => {
    if (!b) return;
    f.append(i % 2 ? el('strong', {}, b) : document.createTextNode(b));
  });
  return f;
}

/**
 * Înlocuiește copiii unui nod, filtrând null-urile.
 * `Node.replaceChildren` le-ar transforma în textul „null" — a fost un bug real
 * pe ecranul de locuri.
 */
export function pune(nod, ...copii) {
  nod.replaceChildren(frag(...copii));
  return nod;
}

export function goleste(nod) {
  while (nod.firstChild) nod.removeChild(nod.firstChild);
  return nod;
}

// ─────────────────────────────── fereastră ───────────────────────────────

let inchideCurenta = null;

export function deschideFereastra(titlu, corp, opt = {}) {
  const gazda = document.getElementById('fereastra');
  const carte = document.getElementById('fereastra-carte');
  goleste(carte);

  carte.append(
    el('div', { class: 'fereastra-cap' },
      el('h2', { class: 'fereastra-titlu' }, titlu),
      el('button', {
        class: 'fereastra-inchide', type: 'button',
        attrs: { 'aria-label': 'Închide' },
        on: { click: inchideFereastra },
      }, '✕'),
    ),
    corp,
  );

  gazda.hidden = false;
  document.body.style.overflow = 'hidden';
  inchideCurenta = opt.laInchidere || null;

  // Întotdeauna de sus: altfel nu se vede nici titlul, nici ✕, nici fotografia.
  carte.scrollTop = 0;

  // Focalizăm doar în formulare, unde omul oricum vrea să scrie. Într-o fișă de
  // citit, focalizarea pe primul buton derula foaia până jos și ascundea tot.
  const primulCamp = carte.querySelector('input:not([type=checkbox]), select, textarea');
  if (primulCamp && !opt.faraFocus) {
    setTimeout(() => { primulCamp.focus({ preventScroll: true }); carte.scrollTop = 0; }, 60);
  }
}

export function inchideFereastra() {
  const gazda = document.getElementById('fereastra');
  if (gazda.hidden) return;
  gazda.hidden = true;
  document.body.style.overflow = '';
  if (inchideCurenta) { const f = inchideCurenta; inchideCurenta = null; f(); }
  // Cât timp fereastra e deschisă, ecranul de dedesubt NU se redesenează — altfel
  // i-ar dispărea de sub degete. Dar dacă între timp s-a schimbat ceva (o bifă
  // „am fost", o cheltuială), lista rămâne veche. Anunțăm, ca să se recupereze.
  document.dispatchEvent(new CustomEvent('fereastra-inchisa'));
}

/** Confirmare cu două butoane. Rezolvă cu true/false. */
export function confirma(titlu, mesaj, opt = {}) {
  return new Promise((resolve) => {
    let raspuns = false;
    deschideFereastra(titlu, frag(
      el('p', { style: 'font-size:14.5px' }, mesaj),
      el('div', { class: 'butoane', style: 'margin-top:18px' },
        el('button', {
          class: `buton ${opt.periculos ? 'buton-rosu' : ''}`, type: 'button',
          on: { click: () => { raspuns = true; inchideFereastra(); } },
        }, opt.daText || 'Da'),
        el('button', {
          class: 'buton buton-slab', type: 'button',
          on: { click: () => inchideFereastra() },
        }, opt.nuText || 'Renunță'),
      ),
    ), { laInchidere: () => resolve(raspuns), faraFocus: true });
  });
}

// ─────────────────────────────── pâine prăjită ───────────────────────────────

export function paine(mesaj, rau = false) {
  const gazda = document.getElementById('paine');
  const felie = el('div', { class: `felie ${rau ? 'felie-rau' : ''}` }, mesaj);
  gazda.append(felie);
  setTimeout(() => {
    felie.style.transition = 'opacity .25s';
    felie.style.opacity = '0';
    setTimeout(() => felie.remove(), 260);
  }, rau ? 4200 : 2600);
}

// ─────────────────────────────── bucăți refolosite ───────────────────────────────

export function eticheta(text, fel) {
  return el('span', { class: `eticheta ${fel ? `eticheta-${fel}` : ''}` }, text);
}

export function randDate(cheie, valoare) {
  return el('div', { class: 'date-rand' },
    el('span', { class: 'date-cheie' }, cheie),
    el('span', { class: 'date-val' }, valoare),
  );
}

export function capSectiune(titlu, dreapta) {
  return el('div', { class: 'sectiune-cap' },
    el('h2', { class: 'sectiune-titlu' }, titlu),
    dreapta || null,
  );
}

export function gol(ico, mesaj) {
  return el('div', { class: 'gol' }, el('span', { class: 'gol-ico' }, ico), mesaj);
}

export function avatar(persoana, gol = false) {
  return el('span', {
    class: `avatar ${gol ? 'avatar-gol' : ''}`,
    attrs: { title: persoana?.nume || '' },
  }, persoana?.initiale || '?');
}

/** Legătură de telefon, gata de apăsat. */
export function telefon(numar, text) {
  return el('a', { href: `tel:${String(numar).replace(/\s/g, '')}` }, text || numar);
}

export function harta(url, text = 'Deschide în hartă') {
  return el('a', { href: url, target: '_blank', rel: 'noopener' }, `${text} ↗`);
}

export function bifa(textEticheta, bifat, laSchimbare, opt = {}) {
  const intrare = el('input', {
    type: 'checkbox', checked: !!bifat,
    on: { change: (e) => laSchimbare(e.target.checked) },
  });
  const rand = el('label', {
    class: `bifa ${opt.critic ? 'bifa-critic' : ''}`,
    dataset: { bifat: bifat ? '1' : '0' },
  },
    intrare,
    el('span', { class: 'bifa-corp' },
      el('span', { class: 'bifa-text' }, textAldin(textEticheta)),
      opt.nota ? el('span', { class: 'bifa-nota' }, textAldin(opt.nota)) : null,
    ),
  );
  return rand;
}
