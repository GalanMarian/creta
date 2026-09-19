// Fotografii pentru felurile cretane, de pe Wikimedia Commons.
//
// Sunt doar cinci: kalitsounia, apaki, staka, gamopilafo și melcii nu au pe
// Commons nicio fotografie liber licențiată care să-i arate cu adevărat, iar o
// poză greșită e mai rea decât niciuna. Restul rămân doar cu descrierea.

export const POZE_MANCARE = {
  dakos: {
    fisier: 'assets/mancare/dakos.jpg',
    autor: 'Benoît Prieur',
    licenta: 'CC0',
    sursa: 'https://commons.wikimedia.org/wiki/File:Plat_de_Dakos_en_Cr%C3%A8te_en_juillet_2021.jpg',
  },
  graviera: {
    fisier: 'assets/mancare/graviera.jpg',
    autor: 'Catlemur',
    licenta: 'CC BY-SA 4.0',
    sursa: 'https://commons.wikimedia.org/wiki/File:Graviera_Kritis_Kraounaki_Rethymnou.jpg',
  },
  bougatsa: {
    fisier: 'assets/mancare/bougatsa.jpg',
    autor: 'Konstantinos Stampoulis (Geraki)',
    licenta: 'CC BY-SA 2.5',
    sursa: 'https://commons.wikimedia.org/wiki/File:Bougatsa.jpg',
  },
  raki: {
    fisier: 'assets/mancare/raki.jpg',
    autor: 'Nickeley102',
    licenta: 'CC BY-SA 3.0',
    sursa: 'https://commons.wikimedia.org/wiki/File:Tsikoudia_in_Stalida.JPG',
  },
  antikristo: {
    fisier: 'assets/mancare/antikristo.jpg',
    autor: 'Wagner67',
    licenta: 'CC BY-SA 4.0',
    sursa: 'https://commons.wikimedia.org/wiki/File:Ofto_(cretan_roast_meat)_or_Antikristo_(cretan_roasted_meat_around_the_fire).jpg',
  },
};

export function pozaMancare(id) {
  return POZE_MANCARE[id] || null;
}
