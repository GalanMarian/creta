# Creta 2026 — șapte prieteni, șase zile

Site de grup pentru excursia din **19–24 septembrie 2026**: Marian, Demian, Adina,
Andrei, Sara, Bengi și Diana.

Tot ce ne trebuie într-un singur loc — zboruri, cazări, mașină, itinerariu pe zile,
locuri, restaurante, vot, cheltuieli, numere de urgență — și **merge fără internet**
după prima deschidere.

E un site static. Fără build, fără Node la rulare, fără server: se publică pe GitHub
Pages direct din branch.

---

## Pornire rapidă

```bash
npm test          # 75 de teste pe logica de calcul, fără nicio dependență
npm run verifica  # verificare de sintaxă pe toate modulele
npm run servi     # server local pe http://localhost:8765
```

Modulele sunt ESM, deci **nu** merge deschis cu dublu-clic din `file://` —
trebuie servit prin HTTP.

---

## ⚠️ Înainte de publicare: schimbă parola grupului

Datele sensibile (PIN-uri, coduri de rezervare, contactul gazdei) stau **criptate**
în `js/date/secret.json`, fiindcă depozitul e public.

> ⚠️ **Parola nu se scrie niciodată în acest fișier și în niciun alt fișier din
> depozit.** Dacă ajunge lângă blocul criptat, criptarea nu mai apără nimic —
> oricine clonează depozitul are și lacătul, și cheia.

**Rulează asta înainte de fiecare publicare în care s-au schimbat datele:**

```bash
node tools/cripteaza.mjs
```

Îți cere o parolă (de două ori, ascunsă), rescrie `js/date/secret.json` și verifică
pe loc că se decriptează corect. Parola nu se salvează nicăieri.

Apoi trimite-o grupului **pe alt canal decât adresa site-ului** — nu în același
mesaj. Fiecare o introduce o dată pe telefonul lui, după care codurile rămân
disponibile inclusiv offline.

Sursa în clar e `secrete.local.json`, care e în `.gitignore` și **nu trebuie să
ajungă niciodată într-un commit**.

---

## Publicare pe GitHub Pages

```bash
git init
git add -A
git commit -m "Creta 2026"
git branch -M main
git remote add origin git@github.com:<utilizator>/creta.git
git push -u origin main
```

Apoi în GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
Adresa iese `https://<utilizator>.github.io/creta/`.

`.nojekyll` e deja acolo, ca GitHub să nu treacă fișierele prin Jekyll.

**La fiecare publicare nouă**, crește `VERSIUNE` din `sw.js` (`creta-v1` → `creta-v2`).
Altfel telefoanele care au deja site-ul salvat rămân o încărcare pe versiunea veche.

---

## Regulile bazei de date

Până se publică regulile, aplicația funcționează, dar **nu se sincronizează între
telefoane** — Firestore răspunde 403 și fiecare vede doar ce a scris el. În bara de
sus apare mesajul.

Consola Firebase → proiectul `creta` → **Firestore Database → Rules** → lipește tot
conținutul din [`firestore.rules`](firestore.rules) → **Publish**.

Detalii despre ce se sincronizează și ce nu: [`FIREBASE.md`](FIREBASE.md).

---

## Ce e unde

| | |
|---|---|
| `index.html` | scheletul paginii |
| `css/style.css` | stilurile, mobil întâi, temă deschisă și întunecată |
| `js/main.js` | pornirea și routerul pe hash |
| `js/lib/` | **logică pură, fără DOM** — testată cu `node --test` |
| `js/date/` | datele: rezervări, locuri, restaurante, pachet, întrebări, urgențe |
| `js/ecrane/` | câte un modul pe secțiune, doar randare |
| `js/stare.js` | starea local-first + coada de trimitere |
| `js/firestore.js` | Firestore prin REST, fără SDK |
| `js/secrete.js` | deblocarea blocului criptat |
| `sw.js` | service worker, ca site-ul să meargă offline |
| `tools/cripteaza.mjs` | generează `js/date/secret.json` din sursa locală |
| `tests/` | testele logicii de calcul |
| `firestore.rules` | regulile de lipit în consolă |

---

## Cum e gândit

**Local întâi.** Aplicația pornește din `localStorage`, deci e utilă instantaneu și
fără semnal — în chei, pe drumuri de munte, sau cu roamingul britanic închis.
Scrierile intră imediat în starea locală și pleacă spre Firestore printr-o coadă
care se reia singură. Id-urile sunt deterministe (voturi, bife de pachet) sau
generate de noi (cheltuieli, amintiri), deci o reîncercare nu poate dubla nimic.

**Fără conturi.** Fiecare își alege numele o dată, pe telefonul lui. Șapte oameni
care se cunosc de mici nu au nevoie de autentificare ca să voteze unde se duc.
Ce chiar trebuie protejat — codurile — e criptat separat, cu o parolă care nu ajunge
niciodată pe server.

**Banii se calculează în cenți întregi.** 100 € împărțiți la 7 dau 14,2857…, iar
rotunjind fiecare parte separat suma iese 99,99. Restul de cenți se distribuie
explicit, deci sumele adună exact. Regula grupului: o cheltuială comună se împarte
**pe cap de om**, iar soțul achită partea lui și a soției — Marian acoperă 1/7,
fiecare cuplu 2/7.

**Ce nu se poate calcula rămâne o liniuță.** Un „0 l/100 km" ar fi o minciună; o
liniuță spune că lipsesc datele.

---

## Fotografiile locurilor

Cele 27 de fotografii din `assets/locuri/` vin de pe **Wikimedia Commons**, sunt liber
licențiate (CC BY, CC BY-SA, CC0 sau domeniu public) și au fost micșorate la 640 px —
1,3 MB în total, ca să intre în cache-ul offline fără să umfle prima încărcare.

Licențele cer atribuire, iar aplicația o afișează sub fiecare poză: autorul, licența și
legătura spre original. Creditele stau în `js/date/poze-locuri.js`. **Dacă schimbi o
poză, schimbă și creditul** — altfel atribuirea devine falsă.

Acolo unde fotografia nu e chiar locul exact, descrierea o spune: la „plaja de lângă
hotel" scrie că e o plajă similară de pe aceeași coastă, iar la Kamini se vede situl
Gournia de deasupra golfurilor.

---

## Copie de siguranță

Planul gratuit Firebase nu face copii automate. Butonul **⚙️ Setări → Descarcă tot**
e singura plasă de siguranță. Merită apăsat după excursie, ca să rămână cheltuielile
și amintirile.
