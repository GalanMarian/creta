// Mașina închiriată, de la Eurocars. Rezervare confirmată, avansul luat.
//
// Numerele de telefon ale firmei sunt publice (stau pe site-ul lor) și trebuie
// să fie la îndemână într-o pană, deci NU le criptăm. Numărul rezervării, da.

export const MASINA = {
  firma: 'Eurocars Car Rental',
  grupa: 'F1 maxi — Mini van 7 locuri, cu portbagaj, automată',
  model: 'VW Caddy Maxi sau similar',
  specificatii: [
    '4/5 uși, 7 locuri',
    '6 bagaje declarate',
    'Aer condiționat',
    'Cutie automată',
  ],
  sofer: 'bengi',
  soferNume: 'Beniamin Ionuț Luculescu',
  persoane: 7,
  sejur: 'Circuit — Chania, Agios Nikolaos',
  secrete: [{ eticheta: 'Număr rezervare', cale: 'masina.rezervare' }],

  ridicare: {
    data: '2026-09-19',
    ora: '22:00',
    aeroport: 'HER Heraklion',
    zbor: 'LS1469',
    dinspre: 'London Stansted (STN)',
  },
  predare: {
    data: '2026-09-24',
    ora: '19:00',
    aeroport: 'HER Heraklion',
    zbor: 'LS1454',
    spre: 'London Stansted (STN)',
  },
  zile: 5,

  // Toate sumele în cenți, ca în restul aplicației.
  tarif: {
    initialCenti: 38730,
    discountCenti: -2730,
    finalCenti: 36000,
    avansCenti: 5400,
    restCardCenti: 30600,
    discountNumerarCenti: -600,
    restNumerarCenti: 30000,
  },

  taxeSuplimentare: [
    {
      eticheta: 'Predare după ora 22:00',
      sumaCenti: 2500,
      explicatie: 'Ridicarea e programată la 22:00 fix, iar zborul aterizează la 21:45. Orice întârziere aduce taxa.',
    },
  ],

  contact: [
    { eticheta: 'Sediu (zilnic 08:00–22:00)', numar: '+302831071053', afisat: '+30 2831 071053' },
    { eticheta: 'WhatsApp (zilnic 08:00–22:00)', numar: '+306970017115', afisat: '+30 6970 017115' },
    { eticheta: 'David — reprezentant aeroport', numar: '+306937132223', afisat: '+30 6937 132223' },
  ],

  undeGasim: {
    titlu: 'Unde e parcarea lor la Heraklion',
    pePicioare: [
      'La ieșirea din sosiri, luați ieșirea mică de pe partea dreaptă.',
      'Traversați șoseaua (Leoforos Ikarou) spre partea cu firmele de închirieri.',
      'La stânga și drept înainte până la sensul giratoriu (în fața Hertz).',
      'La dreapta, mai departe pe lângă Hertz — NU intrați în parcarea publică a aeroportului.',
      'După vreo 90 m, pe stânga, vedeți Surprise Car Rental. Faceți stânga acolo, încă 30 m, iar biroul lor e la capătul drumului.',
    ],
    distanta: '~150 m de la ieșirea din sosiri, în spatele parcării publice',
    harta: 'https://www.google.com/maps/search/?api=1&query=Eurocars+Heraklion+Airport',
  },

  deIntrebat: [
    {
      intrebare: 'Putem merge la Balos cu mașina asta?',
      deCe: 'Drumul e de pământ. Majoritatea firmelor din Creta îl interzic („No Balos") și anulează asigurarea pe neasfaltat — dar unele vând o acoperire separată pentru pietriș. Merită întrebat înainte, nu după.',
      inEngleza: 'Can I drive to Balos with this car? Is damage on the gravel road covered?',
    },
    {
      intrebare: 'Putem adăuga un al doilea șofer?',
      deCe: 'Acum Bengi e singurul pe contract. Cu încă unul, cineva îl poate schimba pe drumul de noapte, iar joi mașina poate rămâne până seara.',
      inEngleza: 'Can we add a second driver to the contract? What is the fee?',
    },
    {
      intrebare: 'Putem prelungi predarea până pe la 21:30, joi?',
      deCe: 'Predarea e la 19:00, dar zborul grupului din România e la 23:15 — altfel stau patru ore în aeroport.',
      inEngleza: 'Can we return the car later on Thursday, around 21:30 instead of 19:00?',
    },
  ],

  laRidicare: [
    'Permis de conducere valabil **și** pașaport sau buletin — pentru Bengi, obligatoriu.',
    'Plata restului **în numerar (EUR)** aduce discount: 300 € în loc de 306 €.',
    'Notați kilometrajul în secțiunea Mașina, chiar în parcare.',
    'Faceți un tur cu telefonul: filmați caroseria, jantele și parbrizul înainte de a pleca.',
    'Întrebați despre **al doilea șofer** — vezi avertismentul din prima pagină.',
  ],
};

export const CARBURANT_NOTE = 'Politica obișnuită în Creta: plin la plin. Faceți plinul înainte de predare, la o benzinărie de pe drumul spre aeroport.';
