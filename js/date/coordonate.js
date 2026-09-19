// Coordonatele locurilor, luate de pe OpenStreetMap (Nominatim) și, pentru
// două dintre ele, din Wikipedia. Verificate să cadă toate în dreptunghiul
// Cretei și să dea distanțe care se potrivesc cu timpii de drum știuți.
//
// Le folosim la două lucruri: harta, și „ce e la mai puțin de 50 km de unde
// dormim mâine".

export const PUNCTE = {
  'agia-triada': [35.56056, 24.135],
  'agios-nikolaos': [35.18734, 25.90669],
  'amoudara-plaja': [35.16526, 25.71076],
  'aptera': [35.5111, 23.99389],
  'argiroupoli': [35.28537, 24.33483],
  'arkadi': [35.30991, 24.62943],
  'balos': [35.58094, 23.59121],
  'chania': [35.51751, 24.01212],
  'chrissi': [34.87351, 25.70358],
  'elafonisi': [35.26945, 23.53164],
  'falassarna': [35.49258, 23.58043],
  'georgioupolis': [35.36192, 24.26138],
  'heraklion-centru': [35.34281, 25.1343],
  'imbros': [35.22709, 24.16451],
  'kalypso': [35.17532, 24.41409],
  'kamini': [35.11111, 25.79261],
  'knossos': [35.29806, 25.16281],
  'kolymbari': [35.54271, 23.78081],
  'kournas': [35.33211, 24.27553],
  'kourtaliotiko': [35.19747, 24.46648],
  'kritsa': [35.15576, 25.64614],
  'lasithi': [35.18086, 25.46785],
  'loutro': [35.19665, 24.08288],
  'malia': [35.29349, 25.49218],
  'margarites': [35.33969, 24.68682],
  'mochlos': [35.18262, 25.9056],
  'muzeul-heraklion': [35.33914, 25.13742],
  'plaja-hotel': [35.52219, 23.84729],
  'plaka-elounda': [35.2989, 25.72236],
  'preveli': [35.15253, 24.47383],
  'rethymno': [35.3684, 24.47439],
  'richtis': [35.1685, 25.97794],
  'samaria': [35.29134, 23.95854],
  'seitan': [35.5519, 24.1934],
  'spinalonga': [35.29778, 25.73804],
  'stavros': [35.588, 24.091],
  'therisos': [35.44699, 23.99653],
  'vai': [35.20803, 26.10649],
  'voulisma': [35.12352, 25.73599],
  'melidoni': [35.38438, 24.72985],
  'muzeul-muzical': [35.19658, 25.18438],
  'triopetra': [35.11894, 24.54746],
  'zeus': [35.16286, 25.44506],
};

/** Bazele noastre și aeroportul. */
export const BAZE = {
  'maleme': { coord: [35.52219, 23.84729], nume: 'Maleme — cazarea din vest' },
  'heraklion_aeroport': { coord: [35.33706, 25.18097], nume: 'Aeroportul Heraklion' },
  'amoudara': { coord: [35.16526, 25.71076], nume: 'Amoudara — cazarea din est' },
};

/** Distanța în linie dreaptă, în km (haversine). */
export function distanta(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const p1 = rad(a[0]);
  const p2 = rad(b[0]);
  const dp = rad(b[0] - a[0]);
  const dl = rad(b[1] - a[1]);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function punct(idLoc) {
  return PUNCTE[idLoc] || null;
}

/**
 * Distanța de la o bază la un loc, în km linie dreaptă.
 * Pe șosele iese cu 25–40% mai mult — de asta filtrul de „50 km" e generos,
 * nu exact: ne interesează „e prin apropiere", nu „e la fix atâția kilometri".
 */
export function distantaDeLaBaza(numeBaza, idLoc) {
  const b = BAZE[numeBaza];
  const p = PUNCTE[idLoc];
  if (!b || !p) return null;
  return distanta(b.coord, p);
}
