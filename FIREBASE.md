# Baza de date

Datele comune — cheltuieli, voturi, bife de pachet, kilometraj, amintiri — stau în
**Cloud Firestore**, în proiectul `creta` (`creta-2c92e`).

---

## Pe scurt

| | |
|---|---|
| Proiect | `creta-2c92e` |
| Colecție | `creta` — una singură |
| Reguli | `firestore.rules` |
| Cost | 0 — planul gratuit, fără card |
| Pauză la inactivitate | nu există |
| Autentificare | niciuna |

---

## Ce trebuie făcut o dată

Consola Firebase → **Firestore Database → Rules** → lipește tot conținutul din
`firestore.rules` → **Publish**.

Până atunci aplicația merge, dar fiecare telefon lucrează singur: Firestore răspunde
`403 PERMISSION_DENIED`, iar în bara de sus apare *„Regulile bazei de date nu permit
accesul"*. Nimic nu se pierde — modificările stau în coadă și pleacă în clipa în care
regulile sunt publicate.

---

## Prețul alegerii, pe șleau

Nu există conturi. Cheia web e publică prin design și stă în sursa paginii, deci
**oricine găsește adresa site-ului poate, din afara lui, să citească și să scrie în
colecția `creta`**.

E o alegere făcută conștient: pentru șapte oameni și cinci zile, un sistem de conturi
ar fi costat mai mult decât valorează datele dinăuntru.

Ce păstrăm totuși:

1. **Se deschide doar colecția `creta`.** Nimeni nu poate crea alte colecții în
   proiect, ca să-ți umple cota.
2. **Ștergerea e interzisă la nivel de reguli.** Aplicația șterge logic
   (`sters: true`). Nici din greșeală, nici dinadins nu se poate goli registrul de
   cheltuieli.
3. **Documentele au mărime limitată** (20 KB), ca să nu se poată umple baza cu un
   singur câmp uriaș.
4. **Codurile și PIN-urile nu sunt aici.** Ele stau criptate cu AES-GCM în
   `js/date/secret.json`, cu o parolă care nu ajunge niciodată pe server. Cine sparge
   baza de date nu află PIN-ul cazării.

---

## Cum arată un document

Un document per înregistrare — nu un document mare pe secțiune. Motivul: șapte oameni
care adaugă cheltuieli în același timp și-ar suprascrie unul altuia munca.

```
creta/chelt_m1a2b3c4d
  tip          "cheltuiala"
  actualizatLa "2026-09-22T14:03:11.204Z"
  d            "{\"id\":\"chelt_m1a2b3c4d\",\"sumaCenti\":6550,…}"
```

Înregistrarea întreagă stă ca JSON în câmpul `d`. Așa, în loc de câmpuri tipizate,
fiindcă Firestore nu ține tablouri în tablouri, iar noi avem `participanti` și
`achitat`. Dispar și conversiile de tip, cu tot cu greșelile lor. `tip` și
`actualizatLa` rămân separate ca să se vadă ceva util în consolă.

Tipurile: `cheltuiala`, `vot`, `pachet`, `km`, `amintire`, `setare`, `propunere`,
`aduce`, `raspuns`, `pusa`.

**Id-uri deterministe** unde re-scrierea trebuie să înlocuiască, nu să adune:
`vot_<propunere>_<om>`, `pachet_<om>_<obiect>`, `pusa_<intrebare>`, `aduce_<obiect>`.
Restul primesc id generat.

---

## Ce se sincronizează și când

Tot ce scrie cineva pleacă singur. **Când:** imediat după fiecare modificare, la
deschiderea paginii, la revenirea în fereastră, la revenirea internetului, și o dată
la cinci minute cât pagina stă deschisă. Nu există buton de sincronizare pentru că
nu e nevoie de el — dar există unul în ⚙️ Setări, pentru liniștea sufletească.

**Fără internet** se lucrează normal: modificările stau local și pleacă la următoarea
conectare.

Ce **nu** se sincronizează, fiindcă ține de telefonul de pe care lucrezi:

- cine ești (numele ales)
- dacă blocul cu coduri a fost deblocat pe telefonul ăsta
- copia locală a datelor și coada de trimitere

---

## Limitele planului gratuit

| | Gratuit | Consumul nostru |
|---|---|---|
| Spațiu | 1 GB | sub 100 KB |
| Citiri | 50.000/zi | câteva sute |
| Scrieri | 20.000/zi | câteva zeci |

O sincronizare completă costă câte o citire per document. Cu vreo 150 de documente
la finalul excursiei și o verificare la cinci minute, plafonul nu se atinge nici dacă
toți șapte țin pagina deschisă toată ziua.

---

## Dacă ceva nu merge

| Simptom | Cauză |
|---|---|
| „Regulile bazei de date nu permit accesul" | Regulile nu sunt publicate în consolă |
| „Fără internet · N de trimis" | Normal. Pleacă singure la reconectare |
| Datele nu apar pe alt telefon | Deschide aplicația acolo și așteaptă câteva secunde; verifică bara de sus |
| Cere parola pentru coduri, din nou | Blocul e încuiat pe telefonul ăla — normal, se cere o dată pe dispozitiv |
| Site-ul arată o versiune veche după publicare | `VERSIUNE` din `sw.js` n-a fost crescută |
| Ai șters ceva din greșeală | Ștergerea e logică; scrie-mi și se poate readuce din consolă |
