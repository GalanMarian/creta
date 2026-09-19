// Cele două cazări. Vest trei nopți, est două nopți.

export const CAZARI = [
  {
    id: 'aegean',
    nume: 'Aegean Breeze Luxury Apartments',
    subtitlu: 'Lângă mare, vila N8',
    localitate: 'Maleme',
    zona: 'vest',
    adresa: 'Maleme 73014, Chania, Creta',
    dataIntrare: '2026-09-19',
    dataIesire: '2026-09-22',
    nopti: 3,
    titular: 'marian',
    gazda: 'Konstantina',
    harta: 'https://www.google.com/maps/search/?api=1&query=Aegean+Breeze+Luxury+Apartments+Maleme+Crete',
    secrete: [
      { eticheta: 'Cod PIN', cale: 'cazare.aegean.pin' },
      { eticheta: 'Contact gazdă', cale: 'cazare.aegean.telefon' },
    ],
    checkin: {
      titlu: 'Intrare pe cont propriu — nu e recepție la sosire',
      pasi: [
        'Vila voastră e **N8**. Semnul de pe hartă și pozele de mai jos arată exact traseul.',
        'Pe ușa principală a vilei atârnă un semn **„Do not disturb"**. Cheia e într-o punguță de iută, **în spatele cardului**.',
        'Parcarea e la capătul hotelului, locurile **P1–P10**. Nu blocați intrarea în garajul privat.',
      ],
      poze: [
        { fisier: 'assets/checkin-hotel.jpeg', descriere: 'Hotelul — urmați săgeata roșie' },
        { fisier: 'assets/checkin-vila-a.jpeg', descriere: 'Vila N8, de la intrare' },
        { fisier: 'assets/checkin-vila-b.jpeg', descriere: 'Vila N8, a doua vedere' },
        { fisier: 'assets/checkin-parcare.jpeg', descriere: 'Parcarea, la capătul hotelului' },
        { fisier: 'assets/checkin-cheie.jpeg', descriere: 'Cheia, în punga din spatele semnului' },
      ],
      atentie: 'Ajungeți pe la 02:15 noaptea. Citiți pașii ăștia ÎNAINTE de a pleca din aeroport, cât mai aveți net.',
    },
    dinPartea_gazdei: [
      'La capătul hotelului, la dreapta, 7 minute pe jos — o plajă foarte bună.',
      'La stânga e restaurantul-bar **Wave**, unde avem **șezlonguri și umbrele gratuite**.',
      'Elafonisi la 1 h, Falassarna la 40 min, Kolymbari la 10 min.',
      'Balos și Gramvousa — numai cu barca.',
    ],
  },
  {
    id: 'poppy',
    nume: 'Poppy Villas',
    subtitlu: 'Două vile cu câte 2 dormitoare',
    localitate: 'Amoudara, Agios Nikolaos',
    zona: 'est',
    adresa: 'Amoudara, Agios Nikolaos 72100, Creta',
    dataIntrare: '2026-09-22',
    dataIesire: '2026-09-24',
    nopti: 2,
    titular: 'marian',
    harta: 'https://www.google.com/maps/search/?api=1&query=Poppy+Villas+Amoudara+Agios+Nikolaos+Crete',
    secrete: [
      { eticheta: 'Cod de confirmare', cale: 'cazare.poppy.cod' },
      { eticheta: 'Cod PIN', cale: 'cazare.poppy.pin' },
    ],
    checkin: {
      titlu: 'Intrarea se face de la ora 14:00',
      pasi: [
        'Vilele se eliberează la 12:00 și se curăță, deci **nu se poate intra mai devreme de 14:00**.',
        'Două vile, 7 adulți: **Apartament 1** pe numele lui Marian, **Apartament 2** de completat.',
        'Fiecare vilă are maximum 5 adulți — șapte oameni încap fără pat suplimentar.',
      ],
      atentie: 'Rezervarea s-a făcut pe 3 + 4 adulți. Tarifele suplimentare (10 €/persoană/noapte pentru pat în plus) nu sunt incluse în total și se plătesc la fața locului — de confirmat la sosire că sunteți 7 fără costuri în plus.',
    },
    facilitati: [
      'Bucătărie și chicinetă, frigider, fierbător, articole de bucătărie',
      'Aer condiționat, balcon cu vedere, intrare privată',
      'Baie privată, cadă sau duș, seif',
      'TV cu ecran plat, canale prin satelit',
    ],
    politici: [
      'Anularea, modificarea sau neprezentarea costă întregul preț al rezervării.',
      'Discount Genius de 12% aplicat înainte de taxe.',
      'Copiii de 11 ani și peste plătesc tarif de adult.',
    ],
  },
];

export function cazarea(id) {
  return CAZARI.find((c) => c.id === id) || null;
}

/** Unde dormim în noaptea care începe la data dată. */
export function cazareaLaData(dataIso) {
  return CAZARI.find((c) => dataIso >= c.dataIntrare && dataIso < c.dataIesire) || null;
}
