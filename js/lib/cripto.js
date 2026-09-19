// Criptarea datelor sensibile: coduri de rezervare, PIN-uri, telefoane.
//
// Depozitul e public (GitHub Pages pe plan gratuit), deci blocul cu coduri stă
// criptat în `js/date/secret.json`. Fără parola grupului, fișierul e zgomot.
//
// Același modul rulează în Node (pentru `tools/cripteaza.mjs` și pentru teste)
// și în browser — WebCrypto există în ambele ca `globalThis.crypto`.

export const ITERATII = 210000; // PBKDF2-SHA256; ~0,3 s pe un telefon modern
const LUNGIME_SALT = 16;
const LUNGIME_IV = 12; // AES-GCM cere 96 de biți

const cr = () => {
  const c = globalThis.crypto;
  if (!c || !c.subtle) {
    throw new Error('WebCrypto lipsește. Pagina trebuie servită pe https:// sau localhost.');
  }
  return c;
};

function inB64(bytes) {
  let s = '';
  const octeti = new Uint8Array(bytes);
  for (let i = 0; i < octeti.length; i += 1) s += String.fromCharCode(octeti[i]);
  return btoa(s);
}

function dinB64(text) {
  const s = atob(text);
  const octeti = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i += 1) octeti[i] = s.charCodeAt(i);
  return octeti;
}

async function cheieDinParola(parola, salt, iteratii) {
  const material = await cr().subtle.importKey(
    'raw', new TextEncoder().encode(parola), 'PBKDF2', false, ['deriveKey'],
  );
  return cr().subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: iteratii, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Obiect + parolă → blocul care se pune în repo. */
export async function cripteaza(obiect, parola) {
  if (!parola) throw new Error('Parola lipsește.');
  const salt = cr().getRandomValues(new Uint8Array(LUNGIME_SALT));
  const iv = cr().getRandomValues(new Uint8Array(LUNGIME_IV));
  const cheie = await cheieDinParola(parola, salt, ITERATII);
  const text = new TextEncoder().encode(JSON.stringify(obiect));
  const ct = await cr().subtle.encrypt({ name: 'AES-GCM', iv }, cheie, text);

  return {
    v: 1,
    algoritm: 'AES-GCM-256/PBKDF2-SHA256',
    iteratii: ITERATII,
    salt: inB64(salt),
    iv: inB64(iv),
    ct: inB64(ct),
  };
}

/**
 * Blocul + parolă → obiectul original.
 * Parola greșită sau fișierul modificat aruncă `EROARE_PAROLA` — AES-GCM
 * verifică integritatea, deci nu putem primi date false fără să știm.
 */
export async function decripteaza(blob, parola) {
  if (!blob || !blob.ct) throw new Error('Blocul criptat lipsește sau e stricat.');
  if (!parola) throw new Error('Parola lipsește.');

  const cheie = await cheieDinParola(
    parola, dinB64(blob.salt), blob.iteratii || ITERATII,
  );
  let text;
  try {
    text = await cr().subtle.decrypt(
      { name: 'AES-GCM', iv: dinB64(blob.iv) }, cheie, dinB64(blob.ct),
    );
  } catch {
    const e = new Error('Parolă greșită.');
    e.cod = 'EROARE_PAROLA';
    throw e;
  }
  return JSON.parse(new TextDecoder().decode(text));
}

/** Amprenta parolei, ca să putem spune „parolă greșită" fără s-o stocăm. */
export async function amprenta(parola) {
  const h = await cr().subtle.digest('SHA-256', new TextEncoder().encode(parola));
  return inB64(h).slice(0, 12);
}
