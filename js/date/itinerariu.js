// Cele șase zile. Ce e fix (zboruri, cazări, mașină, masa de joi) e în
// `program`, cu oră. Ce se decide la fața locului e în `propuneri` și se
// votează — de asta zilele din mijloc au program subțire și multe variante.
//
// Orele peste 24:00 (ex. '26:15') înseamnă „după miezul nopții, în noaptea
// zilei ăsteia" — vezi `lib/itinerar.js`.

export const ZILE = [
  {
    id: 'zi1',
    data: '2026-09-19',
    numar: 1,
    titlu: 'Sosirea',
    zona: 'vest',
    dormim: 'aegean',
    rezumat: 'Cinci ore de condus până la aeroport, două zboruri, apoi încă 154 km prin noapte. Ziua asta nu are activități — are logistică.',
    conduce: 616,
    rezumatLung: 'De la Suceava la Otopeni sunt 462 km și cinci ore. Apoi zborul, apoi încă 154 km de la Heraklion la Maleme, ajunși pe la 02:15. În total, aproape șaptesprezece ore de la plecarea din Suceava până la cheia din punga de iută. Împărțiți volanul și dormiți în avion.',
    program: [
      { ora: '13:00', text: 'Plecare din Suceava spre Otopeni', detaliu: '462 km pe DN2/E85, cinci ore de mers. Mașina lui Andrei.', cine: 'ro', atentie: 'Cu două opriri și o oră de marjă pentru intrarea în București după-amiaza.' },
      { ora: '15:40', text: 'Bengi și Diana decolează din Londra Stansted', detaliu: 'LS1469', cine: 'uk', fix: true },
      { ora: '18:45', text: 'Mașina rămâne în parcarea din Otopeni', detaliu: 'Calea Bucureștilor 255, la ~1 km de terminal. Microbuz gratuit, 6 minute până la plecări. ~130 lei pentru toată perioada.', cine: 'ro' },
      { ora: '19:20', text: 'Grupul din România, la aeroport', detaliu: 'Cu două ore înainte de decolare.', cine: 'ro' },
      { ora: '21:20', text: 'Marian, Andrei, Demian, Adina și Sara decolează din Otopeni', detaliu: 'W43055', cine: 'ro', fix: true },
      { ora: '21:45', text: 'Bengi și Diana aterizează la Heraklion', detaliu: 'LS1469', cine: 'uk', fix: true },
      { ora: '22:00', text: 'Bengi ridică mașina de la Eurocars', detaliu: 'Parcarea lor, ~150 m de ieșirea din sosiri, în spatele parcării publice. Plata restului în numerar aduce discount.', cine: 'uk', atentie: 'După 22:00 se percepe taxa de noapte de 25 €. Anunțați-i ora reală de aterizare.' },
      { ora: '23:20', text: 'Grupul din România aterizează la Heraklion', detaliu: 'W43055', cine: 'ro', fix: true },
      { ora: '23:50', text: 'Plecare spre Maleme, toți șapte', detaliu: '154 km pe drumul național, ~2 h 15 min. O oprire de cafea la Rethymno, la jumătate.' },
      { ora: '26:15', text: 'Sosire la Aegean Breeze, vila N8', detaliu: 'Cheia e în punga de iută, în spatele semnului „Do not disturb". Parcare P1–P10.', atentie: 'Citiți instrucțiunile de intrare cât mai aveți net, la aeroport.' },
    ],
    deFacut: [
      'Andrei: rezervă din timp locul de parcare la Otopeni — se face online sau la 0765 53 00 53.',
      'Plecare din Suceava la 13:00. Cu întârziere, se pierde marja de la intrarea în București.',
      'Cumpărați apă și ceva de mâncare la aeroport — la 02:15 nu e nimic deschis în Maleme.',
      'Notați kilometrajul mașinii în secțiunea Mașina, chiar în parcare.',
      'Filmați mașina pe tot exteriorul înainte de a pleca.',
    ],
  },

  {
    id: 'zi2',
    data: '2026-09-20',
    numar: 2,
    titlu: 'Vestul, ziua întâi',
    zona: 'vest',
    dormim: 'aegean',
    rezumat: 'Prima zi întreagă. După noaptea de dinainte, e bine să nu fie și cea mai ambițioasă — dar dacă iese Balos la vot, plecarea e la 09:30 fix.',
    program: [
      { ora: '09:00', text: 'Mic dejun în vilă sau la Mylos, în Kolymbari', detaliu: 'Ambele cazări au bucătărie.' },
      { ora: '20:30', text: 'Cina — după cum iese votul' },
    ],
    propuneri: ['balos', 'falassarna', 'elafonisi', 'plaja-hotel', 'seitan', 'stavros', 'agia-triada'],
    propuneriRestaurante: ['wave', 'nymfi', 'tamam', 'to-maridaki', 'gramvoussa-taverna'],
    deFacut: [
      'Dacă iese Balos: biletele se iau la port, plecarea e la 10:35 din Kissamos (40 min de la cazare) — deci plecați la 09:30.',
      'Dacă iese Elafonisi: plecați dimineața, drumul e de două ore pe serpentine.',
    ],
  },

  {
    id: 'zi3',
    data: '2026-09-21',
    numar: 3,
    titlu: 'Muntele',
    zona: 'vest',
    dormim: 'aegean',
    rezumat: 'Traseul montan cerut. Imbros e varianta care încape într-o zi și se face în adidași; Samaria e cealaltă discuție.',
    rezumatLung: 'Varianta cea mai bună a zilei: coborâți cheile Imbros dimineața (2–3 h, fără dificultăți), ieșiți la Komitades, ajungeți în Chora Sfakion și prindeți feribotul de 13:00 spre Loutro — un sat fără nicio mașină, la care se ajunge doar pe mare. Mâncați deasupra apei, vă întoarceți spre seară. E ziua cu cel mai mult conținut din toată excursia, dar și cea mai lungă.',
    program: [
      { ora: '08:00', text: 'Plecare devreme, dacă se merge în chei', detaliu: 'La Imbros se ajunge în ~1 h, prin Vrisses.' },
      { ora: '20:30', text: 'Cina în Chania, orașul vechi' },
    ],
    propuneri: ['imbros', 'loutro', 'therisos', 'samaria', 'chania'],
    propuneriRestaurante: ['tamam', 'to-maridaki', 'chrisostomos', 'diktinna'],
    deFacut: [
      'Cheile Imbros se parcurg într-o singură direcție — stabiliți întoarcerea ÎNAINTE de a porni (taxi ~15–20 € de la Komitades).',
      'Dacă mergeți și la Loutro: verificați orarul feribotului din Chora Sfakion chiar în dimineața aceea, se schimbă după vânt. Întoarcerea vă aduce în Maleme pe la 20:00.',
      'Minimum 1,5 l de apă de om. Pe traseu nu se găsește nimic.',
      'Seara în Chania: parcați în afara orașului vechi, înăuntru nu se intră cu mașina.',
    ],
  },

  {
    id: 'zi4',
    data: '2026-09-22',
    numar: 4,
    titlu: 'Traversarea insulei',
    zona: 'tranzit',
    dormim: 'poppy',
    rezumat: 'De la un capăt la altul: 220 km, peste trei ore de condus. O oprire bună, nu trei.',
    rezumatLung: 'Patru lucruri stau chiar pe drumul ăsta, iar în mod normal treci pe lângă toate fără să știi: Aptera, cu cisternele romane, la 400 m de șosea, în prima jumătate de oră; lacul Kournas la jumătate; mănăstirea Arkadi, la 50 de minute abatere dus-întors, dar e locul care înseamnă cel mai mult pentru cretani; și palatul minoic Malia, la 400 m de șosea, chiar înainte de a intra în est. Alegeți DOUĂ, nu patru.',
    conduce: 220,
    program: [
      { ora: '10:00', text: 'Ieșirea din Aegean Breeze', detaliu: 'Cu cât plecați mai devreme, cu atât oprirea de pe drum poate fi mai lungă.' },
      { ora: '12:00', text: 'Oprirea de pe drum — după cum iese votul', detaliu: 'Kournas cade exact la jumătate.' },
      { ora: '15:30', text: 'Sosire la Poppy Villas, Amoudara', detaliu: 'Intrarea e de la 14:00. Două vile cu câte 2 dormitoare.', atentie: 'Confirmați la sosire că sunteți 7 în două vile fără costuri suplimentare.' },
      { ora: '20:30', text: 'Prima seară în Agios Nikolaos' },
    ],
    propuneri: ['aptera', 'kournas', 'arkadi', 'rethymno', 'argiroupoli', 'malia', 'agios-nikolaos'],
    propuneriRestaurante: ['karnagio', 'migomis'],
    deFacut: [
      'Faceți plinul înainte de drum — e mai ieftin în afara aeroporturilor.',
      'Aptera se închide la 20:00, Malia la 19:00 după 16 septembrie, Arkadi mai devreme. Dacă vreți Arkadi, plecați din Maleme până la 09:30.',
      'Cumpărați pentru micul dejun în est, pe drum: în Amoudara ajungeți după-amiază.',
    ],
  },

  {
    id: 'zi5',
    data: '2026-09-23',
    numar: 5,
    titlu: 'Estul, ziua mare',
    zona: 'est',
    dormim: 'poppy',
    rezumat: 'Singura zi întreagă în est, și singura în care încap amândouă plajele cerute plus plimbarea cu barca.',
    rezumatLung: 'Varianta care le prinde pe toate: dimineața Voulisma (20 min) și Kamini (încă 10 min), amândouă cerute; după-amiaza barca la Spinalonga din Plaka, care ține 3–4 ore cu tot cu insula; seara masa în Plaka, cu insula în față. Alternativa de munte e platoul Lasithi, dar atunci plajele rămân pentru joi dimineață.',
    program: [
      { ora: '09:00', text: 'Plecare spre plajele din est', detaliu: 'Voulisma la 20 min, Kamini la 30 min.' },
      { ora: '14:30', text: 'Barca la Spinalonga, din Plaka', detaliu: 'Traversare 10 min, 1 h 30 min – 2 h pe insulă. 12 € barca + 20 € intrarea. Ultimele bărci pleacă spre 17:00–18:00.' },
      { ora: '20:00', text: 'Cina în Plaka sau Elounda' },
    ],
    propuneri: ['voulisma', 'kamini', 'spinalonga', 'lasithi', 'chrissi', 'kritsa', 'richtis', 'mochlos', 'vai'],
    propuneriRestaurante: ['paliria', 'ergospasio', 'karnagio', 'mochlos-taverne'],
    deFacut: [
      'La Kamini nu e nimic: apă, umbrelă și papuci de apă din mașină.',
      'Intrarea pe Spinalonga (20 €) se plătește separat de barcă — pregătiți numerar.',
      'Mâncați în Plaka DUPĂ barcă, nu înainte.',
      'Insula Chrissi e cealaltă variantă de barcă, dar mănâncă ziua întreagă (vaporul pleacă din Ierapetra pe la 11:00 și vă întoarceți după 6 ore) — atunci plajele rămân pentru joi dimineață.',
    ],
  },

  {
    id: 'zi6',
    data: '2026-09-24',
    numar: 6,
    titlu: 'Knossos, Peskesi, plecarea',
    zona: 'centru',
    dormim: null,
    rezumat: 'Ziua cu cel mai strâns program din toată excursia. Construită pe masa mutată la 15:00.',
    conduce: 80,
    program: [
      { ora: '08:30', text: 'Ieșirea din Poppy Villas', detaliu: 'Bagajele în mașină, tot.' },
      { ora: '09:00', text: 'Plecare spre Heraklion', detaliu: '~65 km, o oră.' },
      { ora: '10:00', text: 'Palatul Knossos', detaliu: '20 €/adult. Deschis 08:00–20:00. 1 h 30 min – 2 h. Zero umbră — pălărie și apă.' },
      { ora: '12:30', text: 'Plinul de combustibil', detaliu: 'Politica e plin la plin. Faceți-l acum, nu în drum spre predare.' },
      { ora: '13:00', text: 'Centrul vechi din Heraklion, pe picioare', detaliu: 'Fortul Koules, fântâna cu lei, zidurile. Sau Muzeul Arheologic, dacă e prea cald.' },
      { ora: '15:00', text: 'Masa la Peskesi', detaliu: 'Kapetan Charalampi 6–8. Două ore. Începeți cu degustarea de uleiuri.', atentie: 'Rezervarea inițială era la 17:00 — la ora aceea lanțul nu mai încăpea.', faptCareOStinge: 'peskesi-mutat' },
      { ora: '17:15', text: 'Plecare spre aeroport', detaliu: '~13 km, 20 de minute.' },
      { ora: '17:45', text: 'Predarea mașinii la Eurocars', detaliu: 'Rezervarea scrie 19:00 — sunați să confirmați predarea mai devreme. Restul în numerar: 300 € în loc de 306 €.' },
      { ora: '18:15', text: 'Bengi și Diana la bag-drop', detaliu: 'Jet2 închide la 19:15. Marjă: o oră.', cine: 'uk' },
      { ora: '19:55', text: 'Decolează LS1454 spre Londra', detaliu: 'Aterizare la Stansted 22:10, ora Angliei.', cine: 'uk', fix: true },
      { ora: '23:15', text: 'Decolează W43056 spre București', detaliu: 'Aterizare la Otopeni vineri, 25 septembrie, 01:10.', cine: 'ro', fix: true },
      { ora: '25:20', text: 'Sunați la parcare după ce luați bagajele', detaliu: '0765 53 00 53. Microbuzul vine în 10–15 minute. La 02:00 aeroportul e gol — e normal.', cine: 'ro' },
    ],
    deFacut: [
      'Grupul din România are ~5 ore de așteptare în aeroport după plecarea lui Bengi. Dacă s-a rezolvat un al doilea șofer pe contract, mașina poate rămâne până spre 21:30 și seara se petrece în Heraklion.',
      'Dacă ați ratat marți palatul Malia, e chiar pe drumul de joi spre Heraklion, la 35 de minute de Amoudara.',
      'Suvenirurile se cumpără în centru, nu în terminal.',
      'Verificați vilele de obiecte uitate — încărcătoare, costume puse la uscat pe balcon.',
    ],
    atentie: 'Lanțul zilei e verificat în aplicație: masă la 15:00 → gata la 17:55, cu 1 h 20 min marjă înainte de închiderea bag-drop-ului. Cu masa la 17:00, marja era minus 40 de minute.',
    faptCareOStinge: 'peskesi-mutat',
  },
];

export function ziua(id) {
  return ZILE.find((z) => z.id === id) || null;
}

export function ziuaDupaData(dataIso) {
  return ZILE.find((z) => z.data === dataIso) || null;
}

/** Toate propunerile supuse la vot, cu ziua din care vin. */
export function propuneriPeZi() {
  return ZILE
    .filter((z) => (z.propuneri || []).length || (z.propuneriRestaurante || []).length)
    .map((z) => ({
      zi: z,
      locuri: z.propuneri || [],
      restaurante: z.propuneriRestaurante || [],
    }));
}

export const KM_TOTAL_ESTIMAT = ZILE.reduce((s, z) => s + (z.conduce || 0), 0);
