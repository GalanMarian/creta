// Ce am găsit citind rezervările una lângă alta. Nu sunt griji inventate:
// fiecare iese dintr-o ciocnire între două documente care au fost făcute
// separat. Ordinea e după cât costă dacă le ignori.
//
// `severitate`: 'critic' = poți pierde un zbor sau bani mulți
//               'atentie' = te încurcă rău dacă nu te pregătești
//               'info'    = bine de știut, nu doare

export const AVERTISMENTE = [
  {
    id: 'joi-lant',
    fapt: 'peskesi-mutat',
    severitate: 'critic',
    cand: '2026-09-24',
    titlu: 'Joi: masa, predarea mașinii și zborul lui Bengi nu încăpeau una după alta',
    problema: 'Masa era la 17:00, predarea mașinii la 19:00, iar LS1454 decolează la 19:55 — dar Jet2 închide bag-drop-ul la 19:15. Cu o masă normală de două ore, Bengi ajungea la terminal la 19:55, adică 40 de minute după ce se închidea ghișeul.',
    solutie: 'Masa se mută la 15:00. Atunci lanțul se termină la 17:55, cu 1 h 20 min marjă.',
    deFacut: 'Sună la Peskesi și mută rezervarea de la 17:00 la 15:00 (+30 2810 288887, deschis de la 13:00).',
    rezolvat: false,
    calcul: 'joi',
  },
  {
    id: 'al-doilea-sofer',
    fapt: 'al-doilea-sofer',
    severitate: 'critic',
    titlu: 'Bengi e singurul șofer pe contract',
    problema: 'Contractul Eurocars are un singur nume. Dacă altcineva conduce și se întâmplă orice — de la o zgârietură la un accident — asigurarea nu acoperă nimic. Iar Bengi conduce 154 km noaptea, după 20 de ore de drum, și e singurul care poate duce mașina la predare joi.',
    solutie: 'Un al doilea șofer pe contract rezolvă două probleme dintr-o dată: cineva îl poate schimba la volan pe drumul de noapte, și grupul din România poate ține mașina după plecarea lui Bengi.',
    deFacut: 'Sună sau scrie pe WhatsApp la Eurocars: +30 6970 017115. Întreabă de taxa pentru șofer suplimentar și de prelungirea predării până la ~21:30 joi.',
    rezolvat: false,
  },
  {
    id: 'ridicare-22',
    severitate: 'atentie',
    cand: '2026-09-19',
    titlu: 'Ridicarea e la 22:00 fix, iar avionul aterizează la 21:45',
    problema: 'Eurocars percepe 25 € taxă de noapte pentru ridicările după ora 22:00. Între aterizare și biroul lor sunt 15 minute optimiste: coborâre, bagaje, traversarea șoselei, 150 m pe jos.',
    solutie: 'Nu se poate evita complet, dar se poate anunța. Firma monitorizează zborul LS1469 și a cerut explicit să fie informată de întârzieri.',
    deFacut: 'Bengi: scrie-le pe WhatsApp ora reală de aterizare, imediat ce prinzi semnal. Dacă zborul întârzie, sună-i.',
    rezolvat: false,
  },
  {
    id: 'ziua-lunga',
    severitate: 'atentie',
    cand: '2026-09-19',
    titlu: 'Ziua 1 începe cu cinci ore de condus, nu cu zborul',
    problema: 'Mașina pleacă din Suceava: 462 km pe DN2/E85, cinci ore de mers. Apoi zborul de două ore, apoi încă 154 km de la Heraklion la Maleme. De la plecarea din Suceava până la ușa vilei trec aproape șaptesprezece ore, iar ultimele două ore și un sfert le conduce Bengi, care e treaz de și mai mult.',
    solutie: 'Plecare din Suceava la 13:00, ca să fiți la parcare la 18:45. Volanul se împarte pe drumul din țară, iar în avion se doarme.',
    deFacut: 'Andrei: verifică mașina înainte — presiune, ulei, plin. O pană pe DN2 la ora 16:00 înseamnă zbor pierdut.',
    rezolvat: false,
  },
  {
    id: 'drum-noapte',
    severitate: 'atentie',
    cand: '2026-09-19',
    titlu: 'Primul drum: 154 km, noaptea, după o zi întreagă de călătorie',
    problema: 'Grupul din România aterizează la 23:20. Cu bagaje, plecarea reală e pe la 23:50. Până la Maleme sunt 154 km pe drumul național, ~2 h 15 min — sosire pe la 02:15. Bengi va fi treaz de peste 20 de ore, și e singurul cu drept de a conduce.',
    solutie: 'O oprire de cafea la jumătatea drumului (Rethymno) și cineva treaz pe scaunul din dreapta, care vorbește.',
    deFacut: 'Cumpărați apă și ceva de mâncare la aeroport sau la primul market deschis — la 02:15 nu găsiți nimic în Maleme. Citiți instrucțiunile de intrare ÎNAINTE de a pleca din aeroport, cât aveți net.',
    rezolvat: false,
  },
  {
    id: 'balos-intrebare',
    fapt: 'balos-intrebat',
    severitate: 'critic',
    titlu: 'Întreabă Eurocars dacă poți merge la Balos cu mașina',
    problema: 'Drumul spre Balos e de pământ, iar contractele de închiriere din Creta îl interzic de obicei explicit („No Balos"). Pe drum neasfaltat, asigurarea nu acoperă nimic: o piatră în parbriz sau în baia de ulei se plătește integral. Dar condițiile diferă de la o firmă la alta, iar unele vând o asigurare separată „pentru pietriș".',
    solutie: 'O întrebare directă, înainte să porniți. Dacă răspunsul e nu — și probabil e — rămâne barca din Kissamos: 40 € plus 1 € taxă, plecare 10:35, întoarcere 17:45.',
    deFacut: 'Bengi: întreabă-i la ridicare, sau acum pe WhatsApp la **+30 6970 017115** — „Can I drive to Balos with this car? Is gravel road damage covered?" Notează răspunsul aici.',
    rezolvat: false,
  },
  {
    id: 'balos-drum',
    severitate: 'atentie',
    titlu: 'Barca spre Balos, dacă firma zice nu',
    problema: 'Drumul spre Balos e de pământ, cu pietre colțuroase și gropi. Contractele de închiriere din Creta îl interzic explicit („No Balos"), iar asigurarea nu acoperă nimic pe drumuri neasfaltate. O piatră în parbriz sau în baia de ulei se plătește integral.',
    solutie: 'Barca din portul Kissamos: plecare 10:35, întoarcere 17:45, 40 €/adult plus 1 € taxă de municipalitate. Include 2 h la Gramvousa și 2 h 30 min la Balos.',
    deFacut: 'Dacă iese la vot Balos, luați biletele de barcă. Nu porniți pe drumul de pământ, oricât de bine ar arăta la început.',
    rezolvat: false,
  },
  {
    id: 'transfer-marti',
    severitate: 'atentie',
    cand: '2026-09-22',
    titlu: 'Marți se traversează insula: 220 km, peste 3 ore',
    problema: 'De la Maleme la Amoudara sunt ~220 km și ~3 h 15 min de condus. Intrarea la Poppy Villas e de la 14:00, iar ieșirea din Maleme e dimineața. Ziua asta nu are loc și pentru o plajă și pentru opriri.',
    solutie: 'O singură oprire bună pe drum, nu trei. Lacul Kournas e la ~1 h de Maleme și e exact la jumătate.',
    deFacut: 'Plecați din Maleme până la 10:00 dacă vreți o oprire lungă. Cu o oprire de 2 ore, ajungeți în Amoudara pe la 15:30.',
    rezolvat: false,
  },
  {
    id: 'kamini',
    severitate: 'info',
    titlu: 'Kamini nu are absolut nimic',
    problema: 'Cele cinci plaje de la Kamini, lângă Gournia, sunt neamenajate: fără șezlonguri, fără umbrele, fără baie, fără apă, fără tavernă. Pietriș și stânci.',
    solutie: 'Se ia totul din mașină. E o plajă de o oră-două, nu de o zi întreagă.',
    deFacut: 'Apă, umbrelă sau prosop mare, papuci de apă pentru pietre, și ceva de mâncare. Combinați-o cu Voulisma, care e organizată și la 5 minute.',
    rezolvat: false,
  },
  {
    id: 'numerar',
    fapt: 'numerar-strans',
    severitate: 'info',
    titlu: '6 € economisiți dacă aveți numerar la predare',
    problema: 'Restul de plată al mașinii e 306 € pe card, dar 300 € în numerar. Diferența e mică, dar cere să existe 300 € cash în grup joi după-amiază.',
    solutie: 'Bancomatele grecești percep comisioane mari pentru cardurile străine. Mai bine schimbați sau scoateți numerar din primele zile, nu joi la aeroport.',
    deFacut: 'Strângeți 300 € numerar până joi dimineață.',
    rezolvat: false,
  },
  {
    id: 'poppy-7-adulti',
    severitate: 'info',
    cand: '2026-09-22',
    titlu: 'Poppy Villas: rezervarea e pe 3 + 4 adulți',
    problema: 'Prețul total s-a calculat pentru numărul de oaspeți rezervat. Proprietatea percepe 10 €/persoană/noapte pentru pat suplimentar, iar suplimentele „nu sunt calculate automat în prețul total și vor fi plătite separat în timpul sejurului".',
    solutie: 'Capacitatea maximă e 5 adulți per vilă, deci 3 + 4 intră fără pat suplimentar. Teoretic nu se percepe nimic.',
    deFacut: 'La check-in, confirmați că sunteți 7 în două vile fără costuri suplimentare, înainte să vă instalați.',
    rezolvat: false,
  },
  {
    id: 'roaming-uk',
    severitate: 'info',
    titlu: 'Bengi și Diana: roaming și priză',
    problema: 'După Brexit, cartelele britanice pot taxa datele în UE — nu mai e garantat gratuit. Și priza britanică nu intră în priza grecească.',
    solutie: 'Site-ul merge offline după prima deschidere, deci itinerariul, codurile și numerele de urgență sunt acolo și fără date.',
    deFacut: 'Verificați pachetul de roaming înainte de plecare. Luați **un adaptor UK → UE** — Grecia are prize tip C/F, identice cu România, deci restul grupului nu are nevoie de niciunul.',
    rezolvat: false,
  },
];

export const SEVERITATI = {
  critic: { eticheta: 'Critic', ordine: 0 },
  atentie: { eticheta: 'Atenție', ordine: 1 },
  info: { eticheta: 'Bine de știut', ordine: 2 },
};

export function avertismenteOrdonate(rezolvate = {}) {
  return [...AVERTISMENTE]
    .map((a) => ({ ...a, rezolvat: !!rezolvate[a.id] }))
    .sort((a, b) => Number(a.rezolvat) - Number(b.rezolvat)
      || SEVERITATI[a.severitate].ordine - SEVERITATI[b.severitate].ordine);
}

export function numaraNerezolvate(rezolvate = {}) {
  return AVERTISMENTE.filter((a) => !rezolvate[a.id]).length;
}
