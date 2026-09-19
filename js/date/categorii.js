// Categoriile de cheltuieli. `Combustibil` e specială: din ea se alimentează
// singură secțiunea Mașina (consum, cost pe 100 km).

export const CATEGORIE_COMBUSTIBIL = 'Combustibil';

export const CATEGORII = [
  { id: 'Cazare', eticheta: 'Cazare', emoji: '🛏️' },
  { id: CATEGORIE_COMBUSTIBIL, eticheta: 'Combustibil', emoji: '⛽' },
  { id: 'Mașină', eticheta: 'Mașină (închiriere, parcări, taxe)', emoji: '🚗' },
  { id: 'Restaurant', eticheta: 'Restaurant / taverne', emoji: '🍽️' },
  { id: 'Cumpărături', eticheta: 'Cumpărături, market', emoji: '🛒' },
  { id: 'Intrări', eticheta: 'Intrări, bilete, bărci', emoji: '🎟️' },
  { id: 'Plajă', eticheta: 'Șezlonguri, umbrele', emoji: '⛱️' },
  { id: 'Altele', eticheta: 'Altele', emoji: '💬' },
];

export function categorie(id) {
  return CATEGORII.find((c) => c.id === id) || CATEGORII[CATEGORII.length - 1];
}
