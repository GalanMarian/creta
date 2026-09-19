// Service worker. Rostul lui: după prima deschidere, site-ul merge fără
// internet — în chei, pe drumul de munte, sau cu roamingul britanic închis.
//
// Strategie: cache-first pentru shell (HTML, CSS, JS, poze, blocul criptat),
// cu reîmprospătare în fundal. Cererile către Firestore NU se cachează
// niciodată — datele vin din localStorage când nu e rețea, iar un răspuns
// vechi de la Firestore ar fi mai rău decât niciunul.

const VERSIUNE = 'creta-v24';

const DE_CACHED = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/main.js',
  'js/ui.js',
  'js/stare.js',
  'js/firestore.js',
  'js/identitate.js',
  'js/secrete.js',
  'js/amfost.js',
  'js/fapte.js',
  'js/lib/format.js',
  'js/lib/split.js',
  'js/lib/masina.js',
  'js/lib/cripto.js',
  'js/lib/voturi.js',
  'js/lib/itinerar.js',
  'js/date/grup.js',
  'js/date/zbor.js',
  'js/date/cazare.js',
  'js/date/masina-date.js',
  'js/date/avertismente.js',
  'js/date/itinerariu.js',
  'js/date/locuri.js',
  'js/date/mancare.js',
  'js/date/pachet.js',
  'js/date/intrebari.js',
  'js/date/sos.js',
  'js/date/categorii.js',
  'js/date/poze-locuri.js',
  'js/date/poze-mancare.js',
  'js/date/activitati.js',
  'js/date/parcare.js',
  'js/date/coordonate.js',
  'js/date/rezervari-necesare.js',
  'js/date/secret.json',
  'js/ecrane/acasa.js',
  'js/ecrane/itinerar.js',
  'js/ecrane/locuri.js',
  'js/ecrane/harta.js',
  'js/ecrane/muzica.js',
  'js/ecrane/rezervari-necesare.js',
  'js/ecrane/vot.js',
  'js/ecrane/mancare.js',
  'js/ecrane/pachet.js',
  'js/ecrane/bani.js',
  'js/ecrane/masina.js',
  'js/ecrane/rezervari.js',
  'js/ecrane/sos.js',
  'js/ecrane/intrebari.js',
  'js/ecrane/amintiri.js',
  'js/ecrane/setari.js',
  'assets/checkin-hotel.jpeg',
  'assets/checkin-vila-a.jpeg',
  'assets/checkin-vila-b.jpeg',
  'assets/checkin-parcare.jpeg',
  'assets/checkin-cheie.jpeg',

  // fotografiile locurilor — 1,8 MB în total, micșorate la 640 px
  'assets/locuri/agia-triada.jpg',
  'assets/locuri/agios-nikolaos.jpg',
  'assets/locuri/amoudara-plaja.jpg',
  'assets/locuri/aptera.jpg',
  'assets/locuri/argiroupoli.jpg',
  'assets/locuri/arkadi.jpg',
  'assets/locuri/balos.jpg',
  'assets/locuri/chania.jpg',
  'assets/locuri/chrissi.jpg',
  'assets/locuri/elafonisi.jpg',
  'assets/locuri/falassarna.jpg',
  'assets/locuri/georgioupolis.jpg',
  'assets/locuri/heraklion-centru.jpg',
  'assets/locuri/imbros.jpg',
  'assets/locuri/kalypso.jpg',
  'assets/locuri/kamini.jpg',
  'assets/locuri/knossos.jpg',
  'assets/locuri/kolymbari.jpg',
  'assets/locuri/kournas.jpg',
  'assets/locuri/kourtaliotiko.jpg',
  'assets/locuri/kritsa.jpg',
  'assets/locuri/lasithi.jpg',
  'assets/locuri/loutro.jpg',
  'assets/locuri/malia.jpg',
  'assets/locuri/margarites.jpg',
  'assets/locuri/melidoni.jpg',
  'assets/locuri/mochlos.jpg',
  'assets/locuri/muzeul-heraklion.jpg',
  'assets/locuri/muzeul-muzical.jpg',
  'assets/locuri/plaja-hotel.jpg',
  'assets/locuri/plaka-elounda.jpg',
  'assets/locuri/preveli.jpg',
  'assets/locuri/rethymno.jpg',
  'assets/locuri/richtis.jpg',
  'assets/locuri/samaria.jpg',
  'assets/locuri/seitan.jpg',
  'assets/locuri/spinalonga.jpg',
  'assets/locuri/stavros.jpg',
  'assets/locuri/therisos.jpg',
  'assets/locuri/triopetra.jpg',
  'assets/locuri/vai.jpg',
  'assets/locuri/voulisma.jpg',
  'assets/locuri/zeus.jpg',

  // fotografii pentru felurile cretane
  'assets/mancare/antikristo.jpg',
  'assets/mancare/bougatsa.jpg',
  'assets/mancare/dakos.jpg',
  'assets/mancare/graviera.jpg',
  'assets/mancare/raki.jpg',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil((async () => {
    const cache = await caches.open(VERSIUNE);
    // Două detalii care contează:
    //  1. `addAll` cade întreagă dacă un singur fișier lipsește — punem pe rând.
    //  2. `cache: 'reload'` ocolește cache-ul HTTP al browserului. Fără el, la
    //     o publicare nouă am putea băga în cache exact fișierele vechi pe care
    //     încercăm să le înlocuim.
    await Promise.all(DE_CACHED.map(async (u) => {
      try {
        const r = await fetch(new Request(u, { cache: 'reload' }));
        if (r.ok) await cache.put(u, r);
      } catch { /* offline la instalare: se ia la prima cerere */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil((async () => {
    for (const nume of await caches.keys()) {
      if (nume !== VERSIUNE) await caches.delete(nume);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (ev) => {
  const cerere = ev.request;
  if (cerere.method !== 'GET') return;

  const url = new URL(cerere.url);

  // Firestore: direct din rețea, niciodată din cache.
  if (url.hostname.endsWith('googleapis.com')) return;

  // Alte origini (hărți, link-uri externe): nu ne băgăm.
  if (url.origin !== location.origin) return;

  ev.respondWith((async () => {
    const cache = await caches.open(VERSIUNE);
    const dinCache = await cache.match(cerere, { ignoreSearch: false });

    if (dinCache) {
      // reîmprospătăm în fundal, fără să blocăm răspunsul
      fetch(cerere).then((r) => { if (r.ok) cache.put(cerere, r.clone()); }).catch(() => {});
      return dinCache;
    }

    try {
      const dinRetea = await fetch(cerere);
      if (dinRetea.ok) cache.put(cerere, dinRetea.clone());
      return dinRetea;
    } catch {
      // navigare fără rețea și fără cache: dăm pagina principală
      if (cerere.mode === 'navigate') {
        const acasa = await cache.match('index.html');
        if (acasa) return acasa;
      }
      return new Response('Offline și fără copie locală.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  })());
});
