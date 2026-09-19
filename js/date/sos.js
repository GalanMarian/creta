// Numere de urgență. Verificate, nu presupuse — un număr greșit aici e mai rău
// decât lipsa lui. Secțiunea trebuie să funcționeze fără internet, deci totul
// e text simplu, fără nimic criptat și fără nicio cerere în rețea.

export const URGENTE = [
  {
    numar: '112',
    eticheta: '112 — urgențe, orice fel',
    detaliu: 'Funcționează în toată Uniunea Europeană, în engleză. Ambulanță, poliție, pompieri. De la orice telefon, chiar și fără cartelă.',
    prioritar: true,
  },
  { numar: '166', eticheta: '166 — ambulanță (EKAB)', detaliu: 'Linia directă a serviciului medical de urgență.' },
  { numar: '100', eticheta: '100 — poliție', detaliu: 'Linia directă a poliției elene.' },
  { numar: '199', eticheta: '199 — pompieri', detaliu: 'Include incendiile de vegetație, frecvente în septembrie.' },
  {
    numar: '171',
    eticheta: '171 — poliția turistică',
    detaliu: 'Pentru probleme de turist: neînțelegeri cu o firmă, furt, îndrumare. Vorbesc engleză. (Nu 1571 — ăsta nu există.)',
  },
];

export const SPITALE = [
  {
    nume: 'Spitalul General Chania „Agios Georgios"',
    zona: 'vest',
    numar: '+302821022000',
    afisat: '+30 28210 22000',
    detaliu: 'Mournies, Chania — cel mai apropiat spital mare de Maleme, ~30 min. Are urgențe non-stop și terapie intensivă.',
    harta: 'https://www.google.com/maps/search/?api=1&query=General+Hospital+of+Chania+Agios+Georgios+Mournies',
  },
  {
    nume: 'Spitalul General Agios Nikolaos',
    zona: 'est',
    numar: '+302841343000',
    afisat: '+30 2841 343000',
    detaliu: 'Urgențele se intră pe strada Paleologou. ~10 min din Amoudara.',
    harta: 'https://www.google.com/maps/search/?api=1&query=General+Hospital+of+Agios+Nikolaos+Crete',
  },
  {
    nume: 'Farmacie de gardă',
    zona: 'ambele',
    detaliu: 'În Grecia farmaciile („ΦΑΡΜΑΚΕΙΟ", cruce verde) au rotație de gardă afișată pe ușă. Multe medicamente banale se dau fără rețetă.',
  },
];

export const CONSULAR = [
  {
    nume: 'Ambasada României la Atena',
    numere: [
      { numar: '+302106728875', afisat: '+30 210 6728875' },
      { numar: '+302106728879', afisat: '+30 210 6728879' },
    ],
    email: 'atena.consul@mae.ro',
    detaliu: 'Emmanouil Benaki 7, Paleo Psychiko, Atena. Pentru buletin sau pașaport pierdut, accidente grave, probleme cu autoritățile.',
    web: 'https://atena.mae.ro',
  },
  {
    nume: 'Consulatul britanic (pentru Bengi și Diana, dacă circulă pe documente britanice)',
    numere: [{ numar: '+302107272600', afisat: '+30 210 7272600' }],
    detaliu: 'Ambasada Marii Britanii la Atena. Dacă circulați pe pașaport românesc, mergeți la ambasada română.',
  },
];

export const ASIGURARE = [
  'Cardul European de Asigurări de Sănătate (CEASS/EHIC) dă acces la sistemul public grec în aceleași condiții ca un grec. Se cere la ghișeu — luați-l cu voi.',
  'Nu acoperă repatrierea și nici clinicile private. O asigurare de călătorie separată acoperă.',
  'Pentru Bengi și Diana: cardul GHIC britanic ține locul EHIC în Grecia.',
];

/** Lucruri de știut înainte să sune cineva. */
export const CUM_SUNAM = [
  'Prefixul Greciei e **+30**. Numerele din site sunt scrise complet, gata de apelat.',
  'De pe un telefon românesc, apelurile în UE intră în roaming-ul normal (fără taxe suplimentare).',
  'Pentru Bengi și Diana, cu cartelă britanică: după Brexit, roamingul în UE poate fi taxat — verificați înainte de plecare.',
  '**112 nu costă niciodată** și merge chiar și fără semnal de la operatorul vostru, dacă există orice alt operator în zonă.',
];
