// Unde lăsăm mașina personală la Otopeni.
//
// Grupul din România pleacă cu o mașină la aeroport și o lasă acolo șase zile.
// Detaliile sunt luate de pe site-ul parcării, în septembrie 2026 — prețurile
// se pot schimba, de asta e și legătura alături.

/**
 * Drumul până la aeroport. Mașina e a lui Andrei și pleacă din Suceava — 462 km
 * pe DN2/E85, făcuți în cinci ore. Estimările online dau șapte; cinci e timpul
 * real al celui care a condus drumul ăsta, deci ăla contează.
 *
 * Asta e partea din ziua 1 care se uită cel mai ușor: până să înceapă
 * excursia, e deja o zi întreagă de condus.
 */
export const DRUM_SPRE_AEROPORT = {
  deLa: 'Suceava',
  panaLa: 'Parcarea din Otopeni',
  soferul: 'andrei',
  km: 462,
  minute: 300,
  traseu: 'DN2 / E85, prin Roman, Bacău, Focșani, Buzău',
  plecareRecomandata: '13:00',
  explicatie: 'Cinci ore de mers, plus două opriri de câte 20 de minute și o marjă de o oră pentru intrarea în București. Ca să fiți la parcare la 18:45, plecarea e la 13:00.',
  opriri: [
    'Bacău sau Roman, pe la jumătate — masă și schimb la volan.',
    'Buzău sau Urziceni, ultima oprire înainte de București.',
  ],
  atentie: 'Intrarea în București pe DN2 se blochează după-amiaza. O oră de marjă nu e exagerare.',
};

/**
 * Atenție la socoteală: parcările numără zile ÎNCEPUTE, nu nopți.
 * Mașina intră sâmbătă 19 pe la 18:45 și iese vineri 25 pe la 02:00 — adică
 * șase zile și șapte ore. A șaptea zi e începută, deci se plătește.
 */
export const DURATA = {
  intrare: { data: '2026-09-19', ora: '18:45', nota: 'cu ~2 h înainte de decolare' },
  iesire: { data: '2026-09-25', ora: '02:00', nota: 'după aterizarea la 01:10 și bagaje' },
  zileIncepute: 7,
  explicatie: 'Șase zile și șapte ore. A șaptea zi e începută, deci intră la plată — socotiți 7 zile, nu 6.',
};

export const PARCARE_ALEASA = {
  id: 'parcareinotopeni',
  nume: 'Parcare în Otopeni',
  web: 'https://parcareinotopeni.ro/',
  tarife: 'https://parcareinotopeni.ro/tarife-parcare',
  telefon: '+40765530053',
  telefonAfisat: '0765 53 00 53',
  adresa: 'Calea Bucureștilor nr. 255, Otopeni',
  harta: 'https://www.google.com/maps/search/?api=1&query=Calea+Bucurestilor+255+Otopeni+parcare',
  distanta: '~1 km de terminal',
  transfer: 'Gratuit, inclus în preț. Non-stop, fără orar fix. Drumul ține ~6 minute.',
  asteptare: 'La întoarcere, 10–15 minute de așteptare, în medie.',
  paza: 'Păzită și supravegheată video 24/7, cu personal non-stop și iluminat noaptea.',

  // prețurile de pe pagina lor, septembrie 2026, TVA inclus
  preturi: [
    { zile: 1, lei: 30 },
    { zile: 2, lei: 50 },
    { zile: 3, lei: 70 },
    { zile: 4, lei: 90 },
    { zile: 5, lei: 110 },
    { zile: 6, lei: 120 },
    { zile: 7, lei: 130, alNostru: true },
    { zile: 8, lei: 140 },
    { zile: 14, lei: 200 },
  ],
  pesteOptZile: 'Peste 8 zile, fiecare zi în plus costă încă 10 lei.',
  actualizatLa: 'septembrie 2026',
};

export const CUM_MERGE = [
  {
    titlu: 'Înainte de plecare',
    pasi: [
      'Rezervați locul online, pe **parcareinotopeni.ro**, sau la telefon. Pentru 19–25 septembrie merită făcut din timp.',
      'Ajungeți la parcare cu **30–45 de minute înainte** de ora la care vreți să fiți în aeroport — ăsta e sfatul lor, și acoperă predarea mașinii plus transferul.',
    ],
  },
  {
    titlu: 'La sosire, în parcare',
    pasi: [
      'Predați mașina și cheile la personal.',
      'Microbuzul vă duce la terminal în vreo 6 minute. Merge non-stop, fără orar.',
      'Verificați că n-ați lăsat nimic în mașină — mai ales actele și încărcătoarele.',
    ],
  },
  {
    titlu: 'La întoarcere, vineri la 01:10',
    pasi: [
      'Sunați la **0765 53 00 53 imediat ce v-ați luat bagajele**, nu înainte.',
      'Microbuzul vine în 10–15 minute. La 02:00 noaptea, aeroportul e gol — nu vă alarmați dacă pare că nu vine nimeni.',
      'Plata se face la ridicare, dacă n-ați plătit online.',
    ],
  },
];

export const ALTE_VARIANTE = [
  {
    nume: 'Parcarea oficială a aeroportului',
    detaliu: 'Cea mai apropiată, se merge pe jos până în terminal. Dar e gândită pentru ore, nu pentru zile: 10 lei la 30 de minute, 20 lei pe oră în P2. Pentru șase zile iese de câteva ori mai scump decât o parcare privată.',
    cand: 'Merită doar dacă lăsați pe cineva și plecați în aceeași oră.',
  },
  {
    nume: 'Alte parcări private cu transfer',
    detaliu: 'Sunt mai multe pe Calea Bucureștilor, toate cu microbuz gratuit și prețuri apropiate (18–30 lei/zi). Diferența o fac paza, iluminatul și cât de repede vine microbuzul noaptea.',
    cand: 'Dacă cea aleasă e plină în perioada aceea.',
  },
  {
    nume: 'Vă duce cineva cu mașina',
    detaliu: 'Cel mai ieftin, dar cineva trebuie să fie treaz vineri la 02:00 ca să vă ia. Șapte oameni și bagajele nu încap într-o singură mașină la întoarcere.',
    cand: 'Dacă aveți pe cine ruga și nu vă deranjează ora.',
  },
];

export const DE_STIUT = [
  'Prețul e pentru mașină, nu de persoană — se împarte între cei cinci care vin din Suceava.',
  'Mașina e a lui Andrei, deci tot el face rezervarea.',
  'Faceți poze mașinii la predare, ca la orice parcare: e aceeași plasă de siguranță ca la mașina din Creta.',
  'Lăsați rezervorul măcar pe jumătate. La 02:00 noaptea, pe 25 septembrie, nu vă trebuie o oprire la benzinărie.',
  'Prețurile de aici sunt de pe site-ul lor, verificate în septembrie 2026. Confirmați-le la rezervare.',
];

/**
 * Prețul pentru un număr de zile. Tabelul lor are găuri (sare de la 8 la 14),
 * așa că pentru zilele dintre pornim de la ultima treaptă cunoscută și adăugăm
 * 10 lei pe zi, cum scrie la ei.
 */
export function pretPentruZile(zile) {
  const n = Math.max(1, Math.round(Number(zile) || 0));
  const exact = PARCARE_ALEASA.preturi.find((p) => p.zile === n);
  if (exact) return exact.lei;

  const trepte = [...PARCARE_ALEASA.preturi].sort((a, b) => a.zile - b.zile);
  const subNoi = trepte.filter((p) => p.zile < n).pop();
  if (!subNoi) return trepte[0].lei;
  return subNoi.lei + (n - subNoi.zile) * 10;
}

export const PRET_ESTIMAT_LEI = pretPentruZile(DURATA.zileIncepute);
