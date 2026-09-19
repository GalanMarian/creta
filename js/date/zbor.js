// Zborurile. Două grupuri, două companii, aceeași destinație.
//
// De ce „4 h 05" la Jet2 pe un ecran care arată 15:40 → 21:45: Anglia e la
// UTC+1 în septembrie, Creta la UTC+3. Orele afișate sunt locale fiecărui
// aeroport, deci diferența de ceas nu e durata zborului. La zborurile
// românilor ceasul nu se schimbă — România și Grecia sunt amândouă la UTC+3.

export const ZBORURI = [
  {
    id: 'ro-dus',
    grup: 'ro',
    companie: 'Wizz Air',
    numar: 'W43055',
    pasageri: ['marian', 'andrei', 'demian', 'adina', 'sara'],
    deLa: { cod: 'OTP', oras: 'București', aeroport: 'Otopeni' },
    catre: { cod: 'HER', oras: 'Heraklion', aeroport: 'Creta' },
    data: '2026-09-19',
    plecare: '21:20',
    sosire: '23:20',
    sosireData: '2026-09-19',
    durataMin: 120,
    secret: 'zboruri.ro.cod',
    secretEticheta: 'Cod de confirmare',
  },
  {
    id: 'uk-dus',
    grup: 'uk',
    companie: 'Jet2',
    numar: 'LS1469',
    pasageri: ['bengi', 'diana'],
    deLa: { cod: 'STN', oras: 'Londra', aeroport: 'Stansted' },
    catre: { cod: 'HER', oras: 'Heraklion', aeroport: 'Creta' },
    data: '2026-09-19',
    plecare: '15:40',
    sosire: '21:45',
    sosireData: '2026-09-19',
    durataMin: 245,
    nota: 'Aterizează cu 1 h 35 min înaintea grupului din România. Bengi ridică mașina în intervalul ăsta.',
  },
  {
    id: 'uk-intors',
    grup: 'uk',
    companie: 'Jet2',
    numar: 'LS1454',
    pasageri: ['bengi', 'diana'],
    deLa: { cod: 'HER', oras: 'Heraklion', aeroport: 'Creta' },
    catre: { cod: 'STN', oras: 'Londra', aeroport: 'Stansted' },
    data: '2026-09-24',
    plecare: '19:55',
    sosire: '22:10',
    sosireData: '2026-09-24',
    durataMin: 255,
    nota: 'Jet2 închide bag-drop-ul 40 de minute înainte, la 19:15. De aici toată aritmetica zilei de joi.',
  },
  {
    id: 'ro-intors',
    grup: 'ro',
    companie: 'Wizz Air',
    numar: 'W43056',
    pasageri: ['marian', 'andrei', 'demian', 'adina', 'sara'],
    deLa: { cod: 'HER', oras: 'Heraklion', aeroport: 'Creta' },
    catre: { cod: 'OTP', oras: 'București', aeroport: 'Otopeni' },
    data: '2026-09-24',
    plecare: '23:15',
    sosire: '01:10',
    sosireData: '2026-09-25',
    durataMin: 115,
    secret: 'zboruri.ro.cod',
    secretEticheta: 'Cod de confirmare',
    nota: 'Aterizează la Otopeni vineri, 25 septembrie, la 01:10.',
  },
];

export function zborurile(grup) {
  return ZBORURI.filter((z) => z.grup === grup);
}

export function zborulLui(idPersoana) {
  return ZBORURI.filter((z) => z.pasageri.includes(idPersoana));
}

/** Momentul plecării din România — de aici pornește numărătoarea inversă. */
export const PLECARE = { data: '2026-09-19', ora: '21:20' };
export const INTOARCERE = { data: '2026-09-25', ora: '01:10' };
