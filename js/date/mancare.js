// Mâncarea. Restaurantele pe zone, plus ce se mănâncă în Creta — fiindcă o
// listă de nume nu ajută dacă nu știi ce să ceri când ajungi la masă.

export const REZERVARE_PESKESI = {
  id: 'peskesi',
  nume: 'Peskesi',
  data: '2026-09-24',
  oraRezervata: '17:00',
  oraRecomandata: '15:00',
  persoane: 7,
  titular: 'marian',
  adresa: 'Kapetan Charalampi 6–8, Heraklion 712 02',
  telefon: '+302810288887',
  telefonAfisat: '+30 2810 288887',
  program: 'Zilnic 13:00 – 02:00',
  nota: 4.7,
  recenzii: 6023,
  sursaNota: 'TripAdvisor, septembrie 2026 — locul 20 din 646 în Heraklion',
  harta: 'https://www.google.com/maps/search/?api=1&query=Peskesi+Heraklion',
  web: 'https://peskesicrete.gr',
  deCe: 'Nu e un restaurant oarecare pentru ultima masă. Funcționează din 2014 într-o casă boierească restaurată din centrul Heraklionului și gătește bucătărie cretană veche — rețete pe care le-au căutat în sate și le-au adus înapoi. Legumele, carnea și uleiul vin de la ferma lor de șase hectare din Harasso. A luat locul 1 la categoria bucătărie grecească și regională la Restaurant100 în 2019.',
  deCerut: [
    { fel: 'Degustare de uleiuri de măsline', nota: 'Se aduce cu pâine și e recomandarea casei — începeți cu asta.' },
    { fel: 'Miel gătit încet cu iaurt și brânză', nota: 'Felul pentru care se întoarce lumea.' },
    { fel: 'Porc cu miere și cimbru, sau porc afumat (apaki)', nota: 'Afumatul se face tradițional, cu ierburi de munte.' },
    { fel: 'Flori de dovlecel în aluat', nota: 'De sezon, ușor, bun de împărțit.' },
    { fel: 'Chochlioi boubouristi — melci', nota: 'Fel cretan clasic. Curajoșii îl comandă, ceilalți gustă.' },
    { fel: 'Capră sau porc la proțap, gătit lent', nota: 'Bucată mare, de împărțit între doi-trei.' },
  ],
  note: [
    'Vegetarienii și veganii au felurile marcate clar în meniu.',
    'Locul e mereu plin în sezon — rezervarea e obligatorie, și o aveți.',
    'De la Peskesi până la aeroport sunt ~15 minute cu mașina.',
  ],
  atentie: 'Rezervarea e la 17:00, dar lanțul de joi nu încape: masă + predarea mașinii + bag-drop-ul lui Bengi la 19:15. Mutați-o la 15:00.',
};

export const RESTAURANTE = [
  // ── Vest, aproape de Maleme ──
  {
    id: 'wave',
    cautare: 'Wave beach bar Maleme Crete',
    nume: 'Wave',
    zona: 'vest',
    localitate: 'Lângă hotel, 5 min',
    tip: 'Bar-restaurant pe plajă',
    dinParteaGazdei: true,
    deCe: 'Recomandarea Konstantinei, și cea mai practică: la stânga de hotel, pe plajă. Hotelul are acolo șezlonguri cu umbrele gratuite pentru voi — te așezi, stai toată ziua, mănânci pe loc.',
    potrivitPentru: 'Prima zi, când nimeni nu mai vrea să conducă.',
  },
  {
    id: 'nymfi',
    cautare: 'Nymfi taverna Agia Marina Chania',
    nume: 'Nymfi',
    zona: 'vest',
    localitate: 'Agia Marina, 15 min',
    tip: 'Tavernă',
    dinParteaGazdei: true,
    recomandatTop: true,
    deCe: 'Gazda o pune la categoria „top". La 15 minute de cazare, într-un sat de coastă.',
    potrivitPentru: 'O cină fără drum lung.',
  },
  {
    id: 'gramvoussa-taverna',
    cautare: 'Gramvoussa taverna Kissamos Crete',
    nume: 'Gramvoussa',
    zona: 'vest',
    localitate: '40 min spre nord-vest',
    tip: 'Tavernă',
    dinParteaGazdei: true,
    recomandatTop: true,
    deCe: 'Cealaltă recomandare „top" a gazdei. Se potrivește în ziua în care mergeți spre Kissamos sau Falassarna.',
    potrivitPentru: 'Ziua cu Balos sau Falassarna.',
  },
  {
    id: 'mylos-kolymbari',
    cautare: 'Mylos Kolymbari Crete',
    nume: 'Mylos',
    zona: 'vest',
    localitate: 'Kolymbari, 10 min',
    tip: 'Cafenea-restaurant-bar',
    dinParteaGazdei: true,
    deCe: 'Recomandarea gazdei în satul de lângă voi. Bun și pentru o cafea de dimineață, nu doar pentru cină.',
    potrivitPentru: 'Micul dejun sau o seară scurtă.',
  },
  {
    id: 'drossostalia',
    cautare: 'Drossostalia Armeni Chania Crete',
    nume: 'Drossostalia',
    zona: 'vest',
    localitate: 'Satul Armeni, 30 min',
    tip: 'Tavernă de sat',
    dinParteaGazdei: true,
    deCe: 'Recomandarea gazdei într-un sat din interior — genul de loc unde se mănâncă ce s-a gătit în ziua aceea.',
    potrivitPentru: 'O seară în afara coastei.',
  },
  {
    id: 'salis',
    cautare: 'Salis restaurant Chania old venetian harbour',
    nume: 'Salis',
    zona: 'vest',
    localitate: 'Portul vechi, Chania',
    nota: 4.4,
    recenzii: 2125,
    sursaNota: 'TripAdvisor, septembrie 2026',
    cePuneLumea: 'Mâncare inventivă și pește foarte bun. Singurul reproș constant e prețul — unii zic că merită, alții nu.',
    tip: 'Bucătărie mediteraneană modernă',
    recomandatTop: true,
    deCe: 'În inima portului venețian, cu bucătărie construită pe produse locale de sezon. **Taramosalata lor e felul pentru care merită venit** — apare în recenzii mai des decât orice altceva. Bune și vinetele cu miere, lavrakul la grătar și caracatița.',
    potrivitPentru: 'Seara în care vreți ceva mai aranjat decât o tavernă.',
  },
  {
    id: 'kavouras',
    cautare: 'Taverna Kavouras Chania old town',
    nume: 'Taverna Kavouras',
    zona: 'vest',
    localitate: 'Orașul vechi, Chania',
    nota: 4.4,
    recenzii: 822,
    sursaNota: 'TripAdvisor, septembrie 2026',
    cePuneLumea: 'Oameni foarte calzi și primitori — apare în aproape fiecare recenzie, înaintea mâncării.',
    tip: 'Tavernă cretană',
    deCe: 'Tavernă adevărată în orașul vechi, cu atmosferă caldă și personal despre care lumea scrie mai mult decât despre feluri. De cerut: melci, hamsii prăjite și calamar umplut.',
    potrivitPentru: 'Seara în Chania, dacă Salis vi se pare scump.',
  },
  {
    id: 'cavo',
    cautare: 'Cavo restaurant Rethymno seaside Fortezza',
    nume: 'Cavo',
    zona: 'vest',
    localitate: 'Rethymno, pe faleză',
    nota: 4.3,
    recenzii: 633,
    sursaNota: 'TripAdvisor, septembrie 2026',
    cePuneLumea: 'Apusul și locul, înainte de mâncare. Se laudă sushi-ul, risotto și caracatița; porțiile sunt generoase.',
    tip: 'Mediteranean, pe malul mării',
    deCe: 'La marginea orașului, cu fortăreața Fortezza într-o parte și marea în cealaltă. E genul de loc unde se stă la apus. De cerut: sushi, risotto, cotlete de miel, file de lavrak.',
    potrivitPentru: 'Marți, dacă opriți în Rethymno pe drumul spre est.',
  },
  {
    id: 'tamam',
    cautare: 'Tamam Restaurant Chania old town',
    nume: 'Tamam',
    zona: 'vest',
    localitate: 'Orașul vechi, Chania',
    nota: 4.3, recenzii: 5407, sursaNota: 'TripAdvisor, septembrie 2026',
    cePuneLumea: 'Lumea revine pentru atmosferă și pentru amestecul cretan-oriental. Reproșul cel mai des: e mic și se așteaptă.',
    tip: 'Bucătărie cretană',
    recomandatTop: true,
    deCe: 'Într-o fostă baie turcească din orașul vechi — tavan boltit, mese strânse, bucătărie cretană cu influențe din Orient. Unul dintre locurile cele mai iubite din Chania, de decenii.',
    potrivitPentru: 'Seara în Chania. Nu ia rezervări pentru grupuri mari — veniți devreme.',
  },
  {
    id: 'to-maridaki',
    cautare: 'To Maridaki Splantzia Chania',
    nume: 'To Maridaki',
    zona: 'vest',
    localitate: 'Splantzia, Chania',
    cePuneLumea: 'Pește proaspăt și porții generoase la preț bun. Serviciul poate fi lent când e plin.',
    tip: 'Tavernă',
    deCe: 'Mâncare cretană gătită zilnic, în cartierul Splantzia — acolo mănâncă localnicii, la o stradă de cheiul turistic. Porții mari, prețuri normale.',
    potrivitPentru: 'Cina de grup în Chania, fără să plătiți priveliștea.',
  },
  {
    id: 'chrisostomos',
    cautare: 'Chrisostomos Chania Crete',
    nume: 'Chrisostomos',
    zona: 'vest',
    localitate: 'Capătul estic al portului vechi, Chania',
    tip: 'Tavernă tradițională',
    deCe: 'La capătul mai liniștit al portului vechi. Bucătărie cretană clasică, cu carne la grătar și cuptor.',
    potrivitPentru: 'Seara în Chania, cu vedere la port.',
  },
  {
    id: 'diktinna',
    cautare: 'Diktinna taverna Kolymbari Crete',
    nume: 'Diktinna',
    zona: 'vest',
    localitate: 'Kolymbari, 10 min',
    tip: 'Tavernă de pește',
    deCe: 'Pe strada principală din Kolymbari, cu pește proaspăt și vedere la mare. La zece minute de cazare.',
    potrivitPentru: 'O seară cu pește, aproape de casă.',
  },

  // ── Est, aproape de Amoudara ──
  {
    id: 'paliria',
    cautare: 'Paliria Plaka Elounda Crete',
    nume: 'Paliria',
    zona: 'est',
    localitate: 'Plaka, 30 min',
    nota: 4.5, recenzii: 846, sursaNota: 'TripAdvisor, septembrie 2026',
    cePuneLumea: 'Peștele la grătar și priveliștea spre Spinalonga. Vreo 50 € pentru doi, cu vin.',
    tip: 'Tavernă de pește',
    recomandatTop: true,
    deCe: 'Mesele sunt pe malul mării, cu insula Spinalonga chiar în față. Specialitatea e peștele la grătar — doradă în primul rând. Se mănâncă bine, cu vin, pe la 25 €/persoană.',
    potrivitPentru: 'Exact după barca la Spinalonga. Cel mai bun final de zi din est.',
  },
  {
    id: 'karnagio',
    cautare: 'Karnagio Agios Nikolaos Crete',
    nume: 'Karnagio',
    zona: 'est',
    localitate: 'Agios Nikolaos, 10 min',
    nota: 4.5, recenzii: 2713, sursaNota: 'TripAdvisor, septembrie 2026 — locul 20 din 202 în Agios Nikolaos',
    cePuneLumea: 'Porții mari și bucătărie cretană autentică. Se aglomerează după 21:00, deci veniți mai devreme sau așteptați.',
    tip: 'Tavernă',
    recomandatTop: true,
    deCe: 'Pe malul portului din Agios Nikolaos, cu mâncare grecească clasică bine făcută — musacaua și pastitsio sunt cele pentru care merită.',
    potrivitPentru: 'Prima seară în est, fără drum lung.',
  },
  {
    id: 'migomis',
    cautare: 'Migomis Agios Nikolaos Crete',
    nume: 'Migomis',
    zona: 'est',
    localitate: 'Agios Nikolaos, 10 min',
    tip: 'Restaurant cu pian',
    deCe: 'Stă pe stânca de deasupra lacului Voulismeni — cea mai bună priveliște din oraș, de sus. Mai scump și mai aranjat decât o tavernă.',
    potrivitPentru: 'O seară mai specială, dacă vreți una.',
  },
  {
    id: 'ergospasio',
    cautare: 'Ergospasio Elounda Crete',
    nume: 'Ergospasio',
    zona: 'est',
    localitate: 'Elounda, 30 min',
    tip: 'Mediteranean',
    deCe: 'Într-o fostă fabrică de pe malul mării, deasupra apei. Produse grecești bune și pește proaspăt, într-un loc cu caracter.',
    potrivitPentru: 'Seara în Elounda, combinată cu Plaka.',
  },
  {
    id: 'mochlos-taverne',
    cautare: 'taverna Mochlos Crete',
    nume: 'Tavernele din Mochlos',
    zona: 'est',
    localitate: 'Mochlos, 55 min',
    tip: 'Taverne de pescari',
    deCe: 'Patru taverne cu mesele direct pe plaja satului, cu insulița minoică în față. Pește cât s-a prins în ziua aceea.',
    potrivitPentru: 'O zi în estul adânc, dacă mergeți spre Richtis.',
  },

  // ── Centru ──
  {
    id: 'bougatsa-heraklion',
    cautare: 'bougatsa Heraklion Crete',
    nume: 'O patiserie cu bougatsa, în Heraklion',
    zona: 'centru',
    localitate: 'Centrul Heraklionului',
    tip: 'Patiserie',
    deCe: 'Bougatsa e plăcinta de dimineață a Cretei: foi subțiri cu brânză proaspătă sau cremă, scorțișoară și zahăr pudră deasupra, tăiată cu foarfeca. Se mănâncă în picioare, cu cafea.',
    potrivitPentru: 'Joi dimineață, înainte de Knossos.',
  },
];

// Ce se mănâncă în Creta — ca să nu comandați souvlaki cinci zile.
export const DE_MANCAT = [
  { nume: 'Dakos', ce: 'Pesmet de orz înmuiat, roșii rase, brânză mizithra, măsline, oregano. Aperitivul cretan prin definiție.', unde: 'Peste tot' , poza: 'dakos' },
  { nume: 'Antikristo (ofto)', ce: 'Miel înfipt în țepușe în cerc, în jurul focului, gătit de căldura jarului, nu deasupra lui. Ore de răbdare, și se simte.', unde: 'Taverne de munte' , poza: 'antikristo' },
  { nume: 'Apaki', ce: 'Porc marinat în oțet și afumat cu ierburi de munte. Se mănâncă subțire, ca mezel.', unde: 'Peskesi, taverne cretane' },
  { nume: 'Staka', ce: 'Grăsime din smântână de lapte de oaie, gătită până se leagă. Se pune peste pilaf sau pe pâine. Nu e dietetic și nu se pretinde.', unde: 'Taverne tradiționale' },
  { nume: 'Gamopilafo', ce: 'Orezul de nuntă: fiert în zeamă de carne până devine cremos, cu staka. Se face la ocazii.', unde: 'Taverne de sat, la ocazii' },
  { nume: 'Graviera cretană', ce: 'Brânză tare de oaie, dulce și cu gust de nuci. Se dă și prăjită, ca saganaki.', unde: 'Peste tot' , poza: 'graviera' },
  { nume: 'Bougatsa', ce: 'Plăcinta de dimineață, cu brânză proaspătă sau cremă, tăiată cu foarfeca.', unde: 'Patiserii, dimineața' , poza: 'bougatsa' },
  { nume: 'Raki / tsikoudia', ce: 'Rachiul de tescovină. Se aduce gratis la sfârșitul mesei, în aproape orice tavernă. A-l refuza e nepoliticos; a bea tot ce se aduce e o greșeală.', unde: 'La sfârșitul fiecărei mese' , poza: 'raki' },
  { nume: 'Kalitsounia', ce: 'Plăcințele cretane, sărate cu brânză și verdețuri, sau dulci cu miere.', unde: 'Patiserii, taverne de sat' },
  { nume: 'Sfakianopita', ce: 'Clătită subțire din Sfakia, umplută cu mizithra proaspătă și stropită cu miere. Se face la comandă, în tigaie.', unde: 'Sfakia, Chora Sfakion, Loutro', poza: null },
  { nume: 'Chochlioi boubouristi', ce: 'Melci prăjiți cu făină, oțet și rozmarin, întorși cu gura în jos în tigaie. Fel cretan serios.', unde: 'Peskesi, Kavouras' },
  { nume: 'Taramosalata', ce: 'Pastă din icre, ulei de măsline și lămâie. La Salis, în Chania, e felul pentru care vine lumea.', unde: 'Salis, taverne de pește' },
  { nume: 'Marathopita', ce: 'Plăcintă cu fenicul sălbatic, prăjită în ulei de măsline. Verde pe dinăuntru, crocantă pe dinafară.', unde: 'Taverne de sat, vestul insulei' },
  { nume: 'Kakavia', ce: 'Ciorba pescarilor: peștele prins în ziua aia, fiert simplu cu ceapă, cartofi și mult ulei de măsline.', unde: 'Taverne de pescari — Mochlos, Plaka' },
  { nume: 'Xerotigana', ce: 'Panglici de aluat prăjite, răsucite în spirală, cu miere și susan. Se fac la nunți.', unde: 'Patiserii' },
  { nume: 'Mizithra', ce: 'Brânză proaspătă de oaie, dulceagă. Se mănâncă simplă cu miere, sau intră în kalitsounia.', unde: 'Peste tot' },
  { nume: 'Rakomelo', ce: 'Raki încălzit cu miere, scorțișoară și cuișoare. Se bea seara, când se răcorește.', unde: 'Seara, în taverne' },
];

export const OBICEIURI = [
  'Cina grecească începe târziu: la 20:00 tavernele sunt goale, la 21:30 sunt pline.',
  'Aperitivele (mezedes) se comandă la mijloc de masă și se împart — e mai bun decât un fel principal fiecare.',
  'La final se aduce, de obicei gratis, rachiu și ceva dulce. Nu e o greșeală la notă.',
  'Bacșișul nu e obligatoriu; se rotunjește nota sau se lasă 5–10% dacă a fost bine.',
  'Apa de la robinet în Creta nu se bea; apa plată la masă costă foarte puțin.',
  'În tavernele de sat, întrebați ce s-a gătit azi („ti magirevete simera?") — de obicei e mai bun decât meniul.',
];

export function restaurantePeZona(zona) {
  return RESTAURANTE.filter((r) => r.zona === zona);
}

/**
 * Legătura spre recenzii. O generăm din nume + localitate în loc s-o scriem de
 * mână, pentru că o căutare pe hartă e mereu la zi — spre deosebire de o notă
 * scrisă în cod, care îmbătrânește din prima zi.
 */
export function linkRecenzii(r) {
  // `localitate` e scrisă pentru oameni („Lângă hotel, 5 min"), deci nu e bună
  // de căutat. Fiecare restaurant are un `cautare` curat.
  const q = encodeURIComponent(r.cautare || `${r.nume} ${r.localitate} Crete`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function linkRecenziiNume(nume, unde = 'Crete') {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nume} ${unde}`)}`;
}
