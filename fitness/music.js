// FitQuest — chiptune music, synthesized live with the Web Audio API (no audio files)
// Songs are written one token per eighth note: a note ("C5", "F#4", "Bb2") starts,
// "-" holds the previous note, "." is a rest. Drums: k = kick, s = snare, h = hat.

const SONGS = {
  // Cheerful town theme for everything outside of battle
  town: {
    bpm: 116,
    loop: true,
    lead: `
      E5 - G5 - C6 - G5 -   A5 - - G5 E5 - C5 -   F5 - A5 - C6 - A5 G5  G5 - - - D5 - . .
      E5 - G5 - C6 - D6 -   E6 - D6 C6 A5 - C6 -  A5 - G5 F5 G5 - B5 -  C6 - - - - - . .`,
    bass: `
      C3 . G3 . C3 . G3 .   A2 . E3 . A2 . E3 .   F2 . C3 . F2 . C3 .   G2 . D3 . G2 . D3 .
      C3 . G3 . C3 . G3 .   A2 . E3 . A2 . E3 .   F2 . C3 . G2 . D3 .   C3 . G3 . C3 - - .`,
    drums: "k . h . s . h .",
  },
  // Driving theme for regular monster fights
  battle: {
    bpm: 152,
    loop: true,
    lead: `
      A4 - C5 - E5 - A5 -   G5 - E5 - D5 E5 - .   F5 - - E5 D5 - C5 -   D5 - - - B4 - G4 -
      A4 - C5 - E5 - A5 -   B5 - C6 - B5 A5 G5 -  A5 - F5 - C5 - F5 -   E5 - - - G#5 - B5 -`,
    bass: `
      A2 A3 A2 A3 A2 A3 A2 A3   A2 A3 A2 A3 A2 A3 A2 A3   F2 F3 F2 F3 F2 F3 F2 F3   G2 G3 G2 G3 G2 G3 G2 G3
      A2 A3 A2 A3 A2 A3 A2 A3   A2 A3 A2 A3 A2 A3 A2 A3   F2 F3 F2 F3 F2 F3 F2 F3   E2 E3 E2 E3 E2 E3 E2 E3`,
    drums: "k h s h k k s h",
  },
  // Darker, faster theme when the boss appears
  boss: {
    bpm: 168,
    loop: true,
    lead: `
      D5 - - - A4 - D5 -    F5 - E5 - D5 - C#5 -  D5 - - - Bb4 - F5 -   E5 - - - - - A4 -
      D5 - F5 - A5 - - G5   F5 - E5 - F5 - A5 -   Bb5 - A5 - G5 - C6 -  A5 - - - C#6 - E6 -`,
    bass: `
      D2 D2 D3 D2 D2 D3 D2 D3   D2 D2 D3 D2 D2 D3 D2 D3   Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2   A1 A1 A2 A1 A1 A2 A1 A2
      D2 D2 D3 D2 D2 D3 D2 D3   D2 D2 D3 D2 D2 D3 D2 D3   Bb1 Bb1 Bb2 Bb1 C2 C2 C3 C2       A1 A1 A2 A1 A1 A2 C#2 E2`,
    drums: "k h s k k h s h",
  },
  victory: {
    bpm: 140,
    loop: false,
    lead: "G4 C5 E5 G5 - - E5 - G5 - - - C6 - - - - - - - . .",
    bass: "C3 . . . . . C3 . G2 . . . C3 - - - - - - - . .",
    drums: "k . . . . . s . k . . . k . . . . . . . . .",
  },
  defeat: {
    bpm: 90,
    loop: false,
    lead: "E5 - D5 - C5 - B4 - A4 - - - - - . .",
    bass: "A2 - - - F2 - - - E2 - - - A1 - . .",
  },
};

const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function noteFreq(token) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(token);
  if (!m) return null;
  const semis = NOTE_INDEX[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (Number(m[3]) + 1) * 12;
  return 440 * Math.pow(2, (semis - 69) / 12);
}

const tokens = (str) => (str || "").trim().split(/\s+/).filter(Boolean);

const Music = (() => {
  let ctx = null;
  let master = null;
  let noise = null;
  let current = null; // { name, song, out, step, nextTime }
  let wanted = null; // the song that should be playing (kept while audio is locked)
  let timer = null;

  const enabled = () => typeof settings === "undefined" || settings.music !== false;

  function setup() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return true;
  }

  function tone(out, type, freq, start, dur, vol) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const end = start + dur;
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(vol, start + 0.008);
    env.gain.setValueAtTime(vol * 0.75, Math.max(start + 0.01, end - 0.03));
    env.gain.linearRampToValueAtTime(0, end);
    osc.connect(env).connect(out);
    osc.start(start);
    osc.stop(end + 0.02);
  }

  function drum(out, kind, start) {
    if (kind === "k") {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.frequency.setValueAtTime(150, start);
      osc.frequency.exponentialRampToValueAtTime(40, start + 0.12);
      env.gain.setValueAtTime(0.5, start);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      osc.connect(env).connect(out);
      osc.start(start);
      osc.stop(start + 0.15);
      return;
    }
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();
    const len = kind === "s" ? 0.12 : 0.04;
    src.buffer = noise;
    filter.type = "highpass";
    filter.frequency.value = kind === "s" ? 1200 : 7000;
    env.gain.setValueAtTime(kind === "s" ? 0.28 : 0.1, start);
    env.gain.exponentialRampToValueAtTime(0.001, start + len);
    src.connect(filter).connect(env).connect(out);
    src.start(start);
    src.stop(start + len + 0.01);
  }

  // How many steps a note lasts: itself plus the "-" holds after it
  function length(list, i) {
    let n = 1;
    while (list[i + n] === "-") n++;
    return n;
  }

  function scheduleStep(track, time) {
    const { song, out, step } = track;
    const stepDur = 30 / song.bpm;
    [
      [song.leadNotes, "square", 0.1],
      [song.bassNotes, "triangle", 0.3],
    ].forEach(([list, type, vol]) => {
      const freq = noteFreq(list[step]);
      if (freq) tone(out, type, freq, time, length(list, step) * stepDur * 0.92, vol);
    });
    if (song.drumNotes.length) {
      const hit = song.drumNotes[step % song.drumNotes.length];
      if (hit === "k" || hit === "s" || hit === "h") drum(out, hit, time);
    }
  }

  function tick() {
    const track = current;
    if (!track || ctx.state !== "running") return;
    const stepDur = 30 / track.song.bpm;
    while (track.nextTime < ctx.currentTime + 0.15) {
      if (track.step >= track.song.leadNotes.length) {
        if (!track.song.loop) return stopTrack();
        track.step = 0;
      }
      scheduleStep(track, track.nextTime);
      track.step++;
      track.nextTime += stepDur;
    }
  }

  function stopTrack() {
    if (!current) return;
    const out = current.out;
    const now = ctx.currentTime;
    out.gain.setValueAtTime(out.gain.value, now);
    out.gain.linearRampToValueAtTime(0, now + 0.15);
    setTimeout(() => out.disconnect(), 400);
    current = null;
  }

  function start(name) {
    stopTrack();
    const song = SONGS[name];
    if (!song.leadNotes) {
      song.leadNotes = tokens(song.lead);
      song.bassNotes = tokens(song.bass);
      song.drumNotes = tokens(song.drums);
    }
    const out = ctx.createGain();
    out.connect(master);
    current = { name, song, out, step: 0, nextTime: ctx.currentTime + 0.05 };
    if (!timer) timer = setInterval(tick, 25);
    tick();
  }

  // Switch to a song (no-op if it's already playing). Browsers only allow audio
  // after the first tap, so until then the request is remembered.
  function play(name) {
    wanted = name;
    if (!enabled() || !setup()) return;
    if (ctx.state === "running") return startIfNeeded(name);
    ctx.resume().then(() => wanted === name && startIfNeeded(name)).catch(() => {});
  }

  function startIfNeeded(name) {
    if (current && current.name === name && SONGS[name].loop) return;
    start(name);
  }

  function stop() {
    if (ctx) stopTrack();
  }

  function unlock() {
    if (!enabled() || document.hidden || !setup()) return;
    const resume = ctx.state === "running" ? Promise.resolve() : ctx.resume();
    resume
      .then(() => {
        if (wanted && SONGS[wanted].loop) startIfNeeded(wanted);
      })
      .catch(() => {});
  }

  ["pointerdown", "keydown", "touchend"].forEach((type) => document.addEventListener(type, unlock, true));

  // Go quiet while the app is in the background
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else if (enabled()) unlock();
  });

  function setEnabled(on) {
    if (on) unlock();
    else stop();
  }

  return { play, stop, setEnabled, get playing() { return current ? current.name : null; } };
})();
