// Întrebări pentru un grup de prieteni din copilărie.
//
// Regula după care au fost scrise: fiecare trebuie să scoată o POVESTE, nu un
// „da" sau un „nu". De asta aproape toate încep cu „care", „când" sau „ce" și
// cer un moment anume, nu o părere generală.

export const TEME = [
  { id: 'copilarie', titlu: 'Copilărie și amintiri', emoji: '🪁' },
  { id: 'atunci-acum', titlu: 'Cine eram, cine am ajuns', emoji: '🪞' },
  { id: 'doi', titlu: 'Viața în doi', emoji: '💍' },
  { id: 'credinta', titlu: 'Credință și valori', emoji: '🕊️' },
  { id: 'viitor', titlu: 'Viitor și vise', emoji: '🌅' },
  { id: 'grup', titlu: 'Despre noi șapte', emoji: '🫂' },
  { id: 'jucause', titlu: 'Ușoare și amuzante', emoji: '🎲' },
];

export const INTREBARI = [
  // ── Copilărie ──
  { id: 'c1', tema: 'copilarie', text: 'Care e prima amintire în care apare cineva din grupul ăsta?' },
  { id: 'c2', tema: 'copilarie', text: 'Ce prostie am făcut împreună și n-au aflat niciodată părinții noștri?' },
  { id: 'c3', tema: 'copilarie', text: 'Care a fost cea mai bună vară din copilăria ta și ce o făcea specială?' },
  { id: 'c4', tema: 'copilarie', text: 'Ce loc din copilărie ai vrea să revezi exact așa cum era?' },
  { id: 'c5', tema: 'copilarie', text: 'Care a fost prima ta frică serioasă și ce s-a întâmplat cu ea?' },
  { id: 'c6', tema: 'copilarie', text: 'Ce ți-a spus un adult, când erai mic, și îți răsună și azi în cap?' },
  { id: 'c7', tema: 'copilarie', text: 'Care e cea mai bună bătaie de cap pe care ne-am dat-o unul altuia?' },

  // ── Atunci și acum ──
  { id: 'a1', tema: 'atunci-acum', text: 'La 15 ani, ce credeai că vei face la vârsta la care ești acum?' },
  { id: 'a2', tema: 'atunci-acum', text: 'Ce ai crezut sigur despre viață și s-a dovedit complet greșit?' },
  { id: 'a3', tema: 'atunci-acum', text: 'Care decizie din ultimii zece ani a schimbat cel mai mult drumul tău?' },
  { id: 'a4', tema: 'atunci-acum', text: 'Ce ai învățat pe pielea ta și n-ai fi crezut dacă ți-ar fi spus cineva?' },
  { id: 'a5', tema: 'atunci-acum', text: 'Ce parte din copilul care erai ai pierdut și ți-ar plăcea s-o recuperezi?' },
  { id: 'a6', tema: 'atunci-acum', text: 'De ce ești mai mândru acum decât la 20 de ani?' },
  { id: 'a7', tema: 'atunci-acum', text: 'Ce te-ar surprinde cel mai mult la tine, dacă te-ai vedea cu ochii de atunci?' },

  // ── Viața în doi ──
  { id: 'd1', tema: 'doi', text: 'Care a fost momentul în care ai știut că ea/el e persoana?' },
  { id: 'd2', tema: 'doi', text: 'Ce ai învățat despre tine abia după ce te-ai căsătorit?' },
  { id: 'd3', tema: 'doi', text: 'Care e cel mai bun sfat despre căsnicie pe care l-ai primit — și l-ai și folosit?' },
  { id: 'd4', tema: 'doi', text: 'Ce faceți voi doi și nimeni din afară nu ar înțelege?' },
  { id: 'd5', tema: 'doi', text: 'Ce te-a învățat partenerul tău, fără să-ți predea nimic?' },
  { id: 'd6', tema: 'doi', text: 'Care a fost cel mai greu an de până acum și ce l-a ținut pe picioare?' },
  { id: 'd7', tema: 'doi', text: 'Dacă ai putea repeta o singură zi din relația voastră, care ar fi?' },

  // ── Credință și valori ──
  { id: 'f1', tema: 'credinta', text: 'Când s-a simțit credința ta cel mai reală — nu cea mai ușoară, cea mai reală?' },
  { id: 'f2', tema: 'credinta', text: 'Ce întrebare despre Dumnezeu încă nu are răspuns pentru tine?' },
  { id: 'f3', tema: 'credinta', text: 'Ce te-a schimbat mai mult: o predică, o carte sau un om?' },
  { id: 'f4', tema: 'credinta', text: 'Care e valoarea pe care o aperi chiar când te costă?' },
  { id: 'f5', tema: 'credinta', text: 'Când ai iertat ceva greu și cum ai reușit?' },
  { id: 'f6', tema: 'credinta', text: 'Ce rugăciune ți s-a răspuns altfel decât ai cerut, și mai bine?' },

  // ── Viitor ──
  { id: 'v1', tema: 'viitor', text: 'Ce vrei să fie adevărat despre viața ta în cinci ani?' },
  { id: 'v2', tema: 'viitor', text: 'Ce ți-e frică să încerci, deși știi că ți-ar plăcea?' },
  { id: 'v3', tema: 'viitor', text: 'Ce ai face dacă banii nu ar fi o problemă — dar chiar ai face, nu ce ai spune?' },
  { id: 'v4', tema: 'viitor', text: 'Ce vrei să-și amintească despre tine copiii tăi sau cei din jur?' },
  { id: 'v5', tema: 'viitor', text: 'Unde ne vezi pe noi șapte în zece ani?' },
  { id: 'v6', tema: 'viitor', text: 'Ce ai vrea să înveți, deși nu ai niciun motiv practic?' },

  // ── Despre noi ──
  { id: 'g1', tema: 'grup', text: 'Ce ne ține împreună după atâția ani? Fiecare să răspundă pe rând.' },
  { id: 'g2', tema: 'grup', text: 'Care e legenda grupului — povestea pe care o repovestim de fiecare dată?' },
  { id: 'g3', tema: 'grup', text: 'Cu care dintre noi te-ai schimba o zi și ce ai vrea să vezi?' },
  { id: 'g4', tema: 'grup', text: 'Ce apreciezi la fiecare dintre ceilalți și nu i-ai spus niciodată direct?' },
  { id: 'g5', tema: 'grup', text: 'Când ați fost voi acolo pentru mine fără să vă cer nimic?' },
  { id: 'g6', tema: 'grup', text: 'Ce am ratat ca grup și ar merita recuperat?' },
  { id: 'g7', tema: 'grup', text: 'Dacă ar trebui să dăm grupului nostru un nume, care ar fi și de ce?' },
  { id: 'g8', tema: 'grup', text: 'Cererea perfectă pentru Marian: cum ar arăta? Fiecare pune o piesă — locul, momentul, cine e de față, ce se aude, cine filmează. La final, Marian spune ce a nimerit grupul și ce nu.' },
  { id: 'g9', tema: 'grup', text: 'Marian: ce ai învățat uitându-te la căsniciile noastre — ce ai copia și ce ai face altfel?' },

  // ── Ușoare ──
  { id: 'j1', tema: 'jucause', text: 'Care e cel mai prost lucru pe care l-ai cumpărat vreodată?' },
  { id: 'j2', tema: 'jucause', text: 'Ce talent complet nefolositor ai?' },
  { id: 'j3', tema: 'jucause', text: 'Care e cea mai ciudată mâncare pe care ai mâncat-o și ți-a plăcut?' },
  { id: 'j4', tema: 'jucause', text: 'Ce melodie îți aduce imediat în minte un an anume?' },
  { id: 'j5', tema: 'jucause', text: 'Dacă ar trebui să trăiești în altă țară de mâine, care?' },
  { id: 'j6', tema: 'jucause', text: 'Care e cea mai jenantă poză cu tine care încă există?' },
  { id: 'j7', tema: 'jucause', text: 'Ce faci foarte bine, dar nu recunoști în public?' },
  { id: 'j8', tema: 'jucause', text: 'Care dintre noi ar rezista cel mai mult pe o insulă pustie și de ce nu tu?' },
];

export function intrebariPeTema(idTema) {
  return INTREBARI.filter((i) => i.tema === idTema);
}

export function intrebarea(id) {
  return INTREBARI.find((i) => i.id === id) || null;
}

export function tema(id) {
  return TEME.find((t) => t.id === id) || null;
}

/** O întrebare la întâmplare, de preferat una nepusă încă. */
export function trageUna(puse = [], seed = Math.random()) {
  const rest = INTREBARI.filter((i) => !puse.includes(i.id));
  const din = rest.length ? rest : INTREBARI;
  return din[Math.floor(seed * din.length) % din.length];
}
