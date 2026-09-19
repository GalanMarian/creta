// Lista de bagaj. Se bifează per persoană (fiecare pe telefonul lui), iar
// obiectele comune au „cine le aduce", ca să nu apară patru prize duble și
// niciun ibric.
//
// `doar`: obiectul apare numai pentru persoanele listate.

export const GRUPE = [
  {
    id: 'documente',
    titlu: 'Documente și bani',
    nota: 'Astea nu se pot cumpăra la fața locului. Verificați-le de două ori.',
    obiecte: [
      { id: 'buletin', text: 'Buletin sau pașaport valabil', critic: true },
      { id: 'permis', text: 'Permis de conducere', critic: true, doar: ['bengi'], nota: 'Obligatoriu la ridicarea mașinii, alături de un act de identitate. Fără el nu se dă mașina.' },
      { id: 'permis-rezerva', text: 'Permis de conducere (dacă te adaugi ca al doilea șofer)', doar: ['marian', 'andrei', 'demian'], nota: 'Vezi avertismentul cu al doilea șofer.' },
      { id: 'ghic', text: 'Card GHIC britanic', doar: ['bengi', 'diana'], nota: 'Ține locul cardului european pentru rezidenții din UK.' },
      { id: 'card-banca', text: 'Card bancar + unul de rezervă, în alt buzunar' },
      { id: 'numerar', text: 'Numerar în euro', nota: 'Grupul are nevoie de 300 € cash pentru restul de plată al mașinii — se economisesc 6 € față de card.' },
      { id: 'rezervari', text: 'Deschide site-ul o dată pe telefon, ca să meargă offline', nota: 'După prima deschidere, itinerariul, codurile și numerele de urgență rămân în telefon și fără internet.' },
      { id: 'asigurare', text: 'Poliță de călătorie (dacă ai)' },
    ],
  },
  {
    id: 'plaja',
    titlu: 'Plajă și apă',
    obiecte: [
      { id: 'costum', text: 'Costum de baie (două, ca unul să fie uscat)' },
      { id: 'prosop-plaja', text: 'Prosop de plajă' },
      { id: 'creme', text: 'Cremă de protecție solară', critic: true, nota: 'Soarele cretan în septembrie e încă tare. Factor mare.' },
      { id: 'papuci-apa', text: 'Papuci de apă sau sandale care se udă', critic: true, nota: 'Kamini, Seitan Limania și Kolymbari au pietre, nu nisip. Fără ei, nu se intră în apă.' },
      { id: 'ochelari-soare', text: 'Ochelari de soare' },
      { id: 'palarie', text: 'Pălărie sau șapcă', critic: true },
      { id: 'ochelari-innot', text: 'Ochelari de înot sau mască (opțional)', nota: 'Apa e limpede; la Kamini și Seitan merită.' },
      { id: 'sac-impermeabil', text: 'Săculeț impermeabil pentru telefon (pentru barcă)' },
    ],
  },
  {
    id: 'haine',
    titlu: 'Haine',
    nota: 'Septembrie în Creta: 26–29 °C ziua, 18–20 °C noaptea. Apa e la ~25 °C. Mergem toți cu rucsaci, fără valize mari — deci strângeți, nu împachetați de rezervă.',
    obiecte: [
      { id: 'tricouri', text: 'Tricouri și lucruri ușoare, pentru 6 zile' },
      { id: 'pantaloni-scurti', text: 'Pantaloni scurți' },
      { id: 'ceva-lung', text: 'O bluză cu mânecă lungă sau un hanorac subțire', critic: true, nota: 'Seara lângă mare se răcește, iar pe platoul Lasithi sunt 8–10 grade mai puțin.' },
      { id: 'haine-seara', text: 'O ținută mai aranjată, pentru Peskesi' },
      { id: 'adidasi', text: 'Adidași cu talpă bună', critic: true, nota: 'Pentru cheile Imbros sau Richtis. Nu se merge în șlapi.' },
      { id: 'slapi', text: 'Șlapi' },
      { id: 'pijama', text: 'Pijama' },
      { id: 'sapca-ploaie', text: 'O jachetă subțire de ploaie (mică șansă, dar e septembrie)' },
    ],
  },
  {
    id: 'farmacie',
    titlu: 'Farmacia de drum',
    nota: 'Farmaciile grecești dau multe fără rețetă, dar nu la 02:00 noaptea în Maleme.',
    obiecte: [
      { id: 'medicamente-proprii', text: 'Medicamentele tale, cu rețetă dacă e nevoie', critic: true },
      { id: 'antinevralgic', text: 'Analgezic / antitermic' },
      { id: 'rau-de-masina', text: 'Ceva pentru rău de mașină', nota: 'Drumul spre Elafonisi și urcarea la Lasithi sunt serpentine lungi.' },
      { id: 'stomac', text: 'Ceva pentru stomac (probiotic, cărbune)' },
      { id: 'plasturi', text: 'Plasturi, inclusiv pentru bătături' },
      { id: 'after-sun', text: 'Cremă după plajă / pentru arsuri' },
      { id: 'insecte', text: 'Spray de insecte' },
      { id: 'dezinfectant', text: 'Dezinfectant și comprese' },
    ],
  },
  {
    id: 'electronice',
    titlu: 'Electronice',
    obiecte: [
      { id: 'incarcator', text: 'Încărcător de telefon + cablu' },
      { id: 'adaptor-uk', text: 'Adaptor UK → Europa', critic: true, doar: ['bengi', 'diana'], nota: 'Grecia are prize tip C/F, ca România. Priza britanică nu intră.' },
      { id: 'powerbank', text: 'Baterie externă', nota: 'Ziua cu barca și ziua din chei sunt lungi, iar navigația mâncă bateria.' },
      { id: 'suport-telefon', text: 'Suport de telefon pentru mașină', comun: true, nota: 'Unul e destul pentru toată mașina.' },
      { id: 'incarcator-auto', text: 'Încărcător de brichetă cu mai multe porturi', comun: true },
      { id: 'casti', text: 'Căști' },
    ],
  },
  {
    id: 'comune',
    titlu: 'De grup — unul singur ajunge',
    nota: 'Alegeți aici cine aduce ce, ca să nu vină patru la fel.',
    obiecte: [
      { id: 'jocuri-masa', text: 'Jocuri de masă', comun: true, nota: 'Grupul din România are 5 ore de așteptare în aeroport joi seara, plus serile în vilă. Ceva compact: cărți, Dixit, Codenames.' },
      { id: 'boxa', text: 'Boxă mică bluetooth', comun: true },
    ],
  },
  {
    id: 'inainte-de-plecare',
    titlu: 'Înainte să ieși pe ușă',
    nota: 'Lucruri de făcut, nu de pus în valiză.',
    obiecte: [
      { id: 'checkin-online', text: 'Check-in online și cardul de îmbarcare salvat în telefon', critic: true },
      { id: 'bagaj-cantarit', text: 'Rucsacul cântărit și măsurat după regulile companiei', critic: true, nota: 'Wizz Air și Jet2 au limite diferite la bagajul de cabină. Verificați-le separat — un rucsac prea mare la poartă costă mai mult decât bagajul de cală.' },
      { id: 'roaming', text: 'Verifică pachetul de roaming', doar: ['bengi', 'diana'], nota: 'După Brexit, datele în UE pot fi taxate.' },
      { id: 'peskesi-mutat', fapt: 'peskesi-mutat', text: 'Sună la Peskesi și mută masa la 15:00', critic: true, doar: ['marian'], nota: '+30 2810 288887. Vezi avertismentul de pe prima pagină.' },
      { id: 'eurocars-sofer', fapt: 'al-doilea-sofer', text: 'Întreabă Eurocars de al doilea șofer', critic: true, doar: ['bengi'], nota: 'WhatsApp +30 6970 017115.' },
      { id: 'parcare-otopeni', fapt: 'parcare-rezervata', text: 'Rezervă locul de parcare la Otopeni', critic: true, doar: ['andrei'], nota: 'E mașina ta. parcareinotopeni.ro sau 0765 53 00 53. ~130 lei pentru cele 7 zile începute.' },
      { id: 'harti-offline', text: 'Descarcă harta Cretei offline în Google Maps', nota: 'Meniu → Hărți offline → selectează Creta. Merge fără semnal, în chei și pe drumuri de munte.' },
      { id: 'copii-documente', text: 'Fotografiază buletinul și permisul, ține copiile în telefon' },
      { id: 'plante-animale', text: 'Rezolvă ce rămâne acasă: plante, animale, chei la vecin' },
    ],
  },
];

/** Obiectele care i se arată unei anumite persoane. */
export function pentruPersoana(idPersoana) {
  return GRUPE.map((g) => ({
    ...g,
    obiecte: g.obiecte.filter((o) => !o.doar || o.doar.includes(idPersoana)),
  })).filter((g) => g.obiecte.length > 0);
}

export function toateObiectele() {
  return GRUPE.flatMap((g) => g.obiecte.map((o) => ({ ...o, grupa: g.id })));
}

export const OBIECTE_COMUNE = toateObiectele().filter((o) => o.comun);
