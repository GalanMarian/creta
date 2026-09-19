// Ce trebuie rezervat, ce se ia pe loc, și unde e o capcană.
//
// Întrebarea care a pornit fișierul ăsta: „la Samaria trebuie să fac book la
// transferuri?" Răspunsul scurt e că biletul de intrare nu, dar ÎNTOARCEREA e
// toată problema — iar asta nu se vede până nu ești deja jos, la mare.
//
// `cand`: 'acum' = înainte de plecare · 'cu-o-zi' = cu o zi înainte
//         'pe-loc' = se ia la fața locului, fără rezervare

export const REZERVARI = [
  {
    id: 'rez-peskesi',
    fapt: 'peskesi-mutat',
    titlu: 'Peskesi — mutarea mesei la 15:00',
    cand: 'acum',
    critic: true,
    stare: 'de-facut',
    ce: 'Rezervarea există, pe numele lui Marian, dar e la 17:00. La ora aia lanțul de joi nu mai încape.',
    cum: 'Telefon: +30 2810 288887, deschis de la 13:00.',
  },
  {
    id: 'rez-sofer2',
    fapt: 'al-doilea-sofer',
    titlu: 'Eurocars — al doilea șofer și întrebarea cu Balos',
    cand: 'acum',
    critic: true,
    stare: 'de-facut',
    ce: 'Două lucruri într-un singur mesaj: se poate adăuga un al doilea șofer pe contract, și se poate merge la Balos cu mașina?',
    cum: 'WhatsApp +30 6970 017115 sau +30 2831 071053.',
  },
  {
    id: 'rez-parcare',
    fapt: 'parcare-rezervata',
    titlu: 'Parcarea de la Otopeni',
    cand: 'acum',
    critic: true,
    stare: 'de-facut',
    ce: '7 zile începute, ~130 lei. Se rezervă online sau la telefon.',
    cum: 'parcareinotopeni.ro sau 0765 53 00 53.',
  },

  {
    id: 'rez-samaria',
    titlu: 'Samaria — nu biletul e problema, ci întoarcerea',
    cand: 'cu-o-zi',
    capcana: true,
    ce: 'Biletul de intrare (5 €) se ia la poarta de la Xyloskalo, în ziua aceea. **Dar cheile se parcurg într-o singură direcție, iar la capătul de jos, la Agia Roumeli, nu ajunge niciun drum.** Ieși pe mare. Dacă ai lăsat mașina sus, la Xyloskalo, ea rămâne acolo toată ziua, de cealaltă parte a muntelui.',
    cum: 'Trei variante, în ordinea bunului simț:\n1. **Tur ghidat din Chania** (45–60 €/persoană) — pleci din Chania și te întorci în Chania. Rezolvă tot, inclusiv feribotul. Se rezervă cu o zi înainte.\n2. **Lași mașina la Chora Sfakion**, urci cu autobuzul la Omalos dimineața devreme, cobori cheile, iei feribotul din Agia Roumeli înapoi la Chora Sfakion — și mașina te așteaptă acolo.\n3. Mașina la Xyloskalo și cineva care vine s-o ia. Complicat.',
    atentie: 'Ultimul feribot de după-amiază din Agia Roumeli se umple repede. Dacă îl pierzi, dormi acolo — nu e drum.',
  },
  {
    id: 'rez-imbros-loutro',
    titlu: 'Imbros + Loutro — feribotul, nu cheile',
    cand: 'cu-o-zi',
    ce: 'Cheile Imbros n-au nevoie de nimic: 3 € la intrare, se plătesc pe loc. Feribotul din Chora Sfakion spre Loutro nici el nu se rezervă — dar **orarul se schimbă după vânt**.',
    cum: 'Verificați orarul în dimineața aceea, la port sau la cazare. Legătura bună e feribotul de 13:00, după ce coborâți cheile.',
    atentie: 'Și aici, cheile se parcurg într-o direcție: ieșiți la Komitades, nu unde ați lăsat mașina. Taxi ~15–20 €.',
  },
  {
    id: 'rez-balos',
    titlu: 'Balos — barca din Kissamos',
    cand: 'cu-o-zi',
    ce: 'În septembrie se găsesc bilete și la port, dimineața, dar pentru șapte oameni e mai sigur cu o zi înainte.',
    cum: 'Plecare 10:35 din portul Kissamos, întoarcere 17:45. 40 €/adult + 1 € taxă de municipalitate.',
  },
  {
    id: 'rez-chrissi',
    titlu: 'Insula Chrissi',
    cand: 'cu-o-zi',
    ce: 'Vaporul pleacă o dată pe zi din Ierapetra. Pentru un grup, se rezervă.',
    cum: 'Plecare ~10:45–11:00, ~40 €/adult, 6 ore în total.',
  },
  {
    id: 'rez-activitati',
    titlu: 'Jet ski, quad-uri, călărie, curs de gătit',
    cand: 'cu-o-zi',
    ce: 'Toate cer rezervare, mai ales pentru șapte oameni — nu au atâtea locuri libere pe loc.',
    cum: 'Prin cazare sau direct la operator, cu o zi-două înainte. Călăria din Finikia se rezervă online, din timp.',
  },
  {
    id: 'rez-restaurante',
    titlu: 'Restaurantele bune, seara',
    cand: 'cu-o-zi',
    ce: 'Salis, Tamam și Paliria se umplu în sezon. Șapte oameni fără rezervare înseamnă așteptat sau plecat în altă parte.',
    cum: 'Un telefon dimineața pentru seara aceea e de obicei destul.',
  },

  {
    id: 'rez-spinalonga',
    titlu: 'Spinalonga',
    cand: 'pe-loc',
    ce: 'Bărcile pleacă din Plaka la fiecare 20–30 de minute, de la 9:00–10:00 până la 17:00–18:00. Nu se rezervă.',
    cum: '12 € barca + 20 € intrarea pe insulă, ambele pe loc, numerar.',
  },
  {
    id: 'rez-knossos',
    titlu: 'Knossos',
    cand: 'pe-loc',
    ce: 'Biletul se ia la intrare, 20 €. Se poate lua și online, ca să sari coada — joi dimineață, în septembrie, coada nu e mare.',
    cum: 'Deschis 08:00–20:00, ultima intrare 19:30.',
  },
  {
    id: 'rez-restul',
    titlu: 'Plajele, cheile, peșterile, mănăstirile',
    cand: 'pe-loc',
    ce: 'Nimic de rezervat. Elafonisi, Falassarna, Voulisma, Kamini, Seitan, Preveli, Kourtaliotiko, Melidoni, Arkadi, Aptera, Malia, Lasithi — toate se plătesc la fața locului sau sunt gratuite.',
    cum: 'Aveți numerar la voi: multe au doar cutie de bilete, fără POS.',
  },
];

export const GRUPE_REZERVARI = [
  { id: 'acum', titlu: 'De rezolvat înainte de plecare', nota: 'Astea nu se mai pot face de acolo.' },
  { id: 'cu-o-zi', titlu: 'Cu o zi înainte, de acolo', nota: 'Când se decide ziua următoare, la vot.' },
  { id: 'pe-loc', titlu: 'Nu au nevoie de nimic', nota: 'Se plătesc la fața locului.' },
];

export function rezervariDin(cand) {
  return REZERVARI.filter((r) => r.cand === cand);
}

export function numarDeFacutAcum() {
  return REZERVARI.filter((r) => r.cand === 'acum').length;
}
