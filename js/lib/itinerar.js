// Timp și lanțuri de evenimente.
//
// Fusul: Creta e UTC+3 (EEST) în septembrie, iar ora de vară se termină la
// sfârșitul lui octombrie — deci toată excursia e la +3. România e tot la +3 în
// septembrie, așa că ceasul nu se schimbă la aterizare. Ancorăm totuși explicit
// la +3, ca „ce urmează" să fie corect și dacă cineva deschide site-ul de pe un
// telefon lăsat pe alt fus.

export const FUS_CRETA = 3;

/** '17:05' → 1025 (minute de la miezul nopții). NaN dacă nu e oră. */
export function minute(ora) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(ora || '').trim());
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 47 || min > 59) return NaN;
  return h * 60 + min;
}

/** 1025 → '17:05'. Trece peste miezul nopții: 1500 → '01:00'. */
export function oraDin(minute) {
  const m = ((Math.round(minute) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Data ISO + ora locală din Creta → moment absolut. */
export function moment(dataIso, ora = '00:00') {
  const [a, l, z] = String(dataIso).slice(0, 10).split('-').map(Number);
  const min = minute(ora);
  if (!Number.isFinite(min)) return null;
  // minutele pot depăși 1440 (ex. sosire la 02:15 în noaptea zilei precedente)
  return new Date(Date.UTC(a, l - 1, z, 0, 0, 0) + (min - FUS_CRETA * 60) * 60000);
}

/**
 * Verifică un lanț de pași contra unei ore-limită.
 * Fiecare pas consumă `durataMin` minute; ora de început a fiecăruia se
 * calculează în cascadă din `start`.
 * @returns {{pasi: Array, finalMinute: number, final: string, limita: string,
 *            marjaMinute: number, ok: boolean}}
 */
export function lant({ start, pasi = [], limita }) {
  let curent = minute(start);
  if (!Number.isFinite(curent)) throw new Error(`Oră de start invalidă: ${start}`);

  const cuOre = pasi.map((p) => {
    const de_la = curent;
    curent += Math.max(0, Number(p.durataMin) || 0);
    return { ...p, start: oraDin(de_la), sfarsit: oraDin(curent), startMinute: de_la };
  });

  const limitaMin = minute(limita);
  const marjaMinute = Number.isFinite(limitaMin) ? limitaMin - curent : null;

  return {
    pasi: cuOre,
    finalMinute: curent,
    final: oraDin(curent),
    limita,
    marjaMinute,
    ok: marjaMinute === null ? true : marjaMinute >= 0,
  };
}

/**
 * Lanțul zilei de joi, cel care aproape a costat un zbor.
 *
 * Masa la Peskesi → drum spre aeroport → predarea mașinii → mersul până la
 * terminal, contra orei la care Jet2 închide bag-drop-ul (40 de minute înainte
 * de decolarea LS1454 de la 19:55).
 *
 * Cu masa la 17:00 marja iese negativă. De aceea s-a mutat la 15:00.
 */
export function lantJoi(oraMasa = '15:00', opt = {}) {
  const durataMasa = opt.durataMasa ?? 120;
  return lant({
    start: oraMasa,
    limita: '19:15', // 19:55 minus 40 de minute
    pasi: [
      { eticheta: 'Masa la Peskesi', durataMin: durataMasa, detaliu: 'Kapetan Charalampi 6–8, Heraklion' },
      { eticheta: 'Drum spre aeroport', durataMin: 20, detaliu: '~13 km, centru → HER' },
      { eticheta: 'Predarea mașinii la Eurocars', durataMin: 25, detaliu: 'verificare, plata restului în numerar' },
      { eticheta: 'Mers până la terminal', durataMin: 10, detaliu: '~150 m, cu bagajele' },
    ],
  });
}

/** Ziua din itinerariu care se potrivește cu momentul dat. */
export function ziuaCurenta(zile, acum = new Date()) {
  const azi = new Date(acum.getTime() + FUS_CRETA * 3600000).toISOString().slice(0, 10);
  return (zile || []).find((z) => z.data === azi) || null;
}

/** Toate evenimentele din toate zilele, în ordine cronologică. */
export function evenimente(zile) {
  const tot = [];
  for (const zi of zile || []) {
    for (const ev of zi.program || []) {
      if (!ev.ora) continue;
      const m = moment(zi.data, ev.ora);
      if (m) tot.push({ ...ev, zi: zi.data, numeZi: zi.titlu, moment: m });
    }
  }
  return tot.sort((a, b) => a.moment - b.moment);
}

/** Următorul eveniment care nu a trecut încă. */
export function ceUrmeaza(zile, acum = new Date()) {
  return evenimente(zile).find((ev) => ev.moment >= acum) || null;
}

/** Evenimentul în curs: a început, dar următorul n-a venit încă. */
export function acumSeIntampla(zile, acum = new Date()) {
  const toate = evenimente(zile);
  let curent = null;
  for (const ev of toate) {
    if (ev.moment <= acum) curent = ev;
    else break;
  }
  return curent;
}

/**
 * Ziua pe care o pregătim acum.
 *
 * Votul e mereu despre MÂINE, nu despre azi: ziua de azi e deja în desfășurare,
 * iar o dezbatere despre ea vine prea târziu. Înainte de plecare, „mâine"
 * înseamnă prima zi cu ceva de decis — ziua 2, fiindcă ziua 1 e doar zbor și
 * drum.
 */
export function ziuaDePregatit(zile, acum = new Date()) {
  const lista = zile || [];
  const azi = new Date(acum.getTime() + FUS_CRETA * 3600000).toISOString().slice(0, 10);

  const maine = lista.find((z) => z.data > azi && (z.propuneri || []).length);
  if (maine) return maine;

  // excursia s-a terminat (sau azi e ultima zi cu ceva de votat)
  return lista.filter((z) => (z.propuneri || []).length).pop() || null;
}

/** Unde dormim în noaptea de dinaintea unei zile — de acolo se pleacă dimineața. */
export function bazaZilei(zi) {
  if (!zi) return 'vest';
  if (zi.zona === 'est') return 'est';
  if (zi.zona === 'centru') return 'est';
  return 'vest';
}
