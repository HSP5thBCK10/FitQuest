// ---------- Game data ----------

const STATS = {
  STR: { label: "Strength", color: "#ef4444" },
  AGI: { label: "Agility", color: "#22c55e" },
  WIS: { label: "Wisdom", color: "#f59e0b" },
  VIT: { label: "Vitality", color: "#38bdf8" },
};

// Each activity trains one attribute. MET values estimate calories:
// kcal = MET * weight(kg) * hours
const ACTIVITIES = {
  strength: { label: "Weights", icon: "🏋️", stat: "STR", met: 5.0 },
  calisthenics: { label: "Calisthenics", icon: "🤸", stat: "STR", met: 4.5 },
  running: { label: "Running", icon: "🏃", stat: "AGI", met: 9.8 },
  hiit: { label: "HIIT", icon: "🔥", stat: "AGI", met: 8.0 },
  cycling: { label: "Cycling", icon: "🚴", stat: "AGI", met: 7.5 },
  sports: { label: "Sports", icon: "⚽", stat: "AGI", met: 7.0 },
  yoga: { label: "Yoga", icon: "🧘", stat: "WIS", met: 2.5 },
  stretching: { label: "Stretching", icon: "🙆", stat: "WIS", met: 2.3 },
  meditation: { label: "Meditation", icon: "🪷", stat: "WIS", met: 1.3 },
  walking: { label: "Walking", icon: "🚶", stat: "VIT", met: 3.5 },
  hiking: { label: "Hiking", icon: "🥾", stat: "VIT", met: 6.0 },
  swimming: { label: "Swimming", icon: "🏊", stat: "VIT", met: 8.0 },
  other: { label: "Other", icon: "⭐", stat: "VIT", met: 4.0 },
};

// Levels at which a hero earns a new title
const TITLE_LEVELS = [1, 3, 5, 8, 12, 16, 20, 30];

const CLASSES = {
  barbarian: {
    name: "Barbarian",
    color: "#ef4444",
    body: "Bodybuilder physique",
    tagline: "Raw power. Pack on muscle mass and build a towering, bodybuilder frame.",
    focus: "Heavy lifting, progressive overload, high-protein meals",
    bonus: { STR: 2 },
    bonusText: "2× XP on Strength training",
    base: { STR: 8, AGI: 4, WIS: 3, VIT: 5 },
    titles: ["Wildling", "Brute", "Raider", "Berserker", "Chieftain", "Warlord", "Titan", "Godslayer"],
    quests: [
      { id: "b1", name: "Iron Will", desc: "Train Strength for 30 minutes", stat: "STR", minutes: 30, xp: 60 },
      { id: "b2", name: "Lift the Mountain", desc: "Train Strength for 45 minutes", stat: "STR", minutes: 45, xp: 90 },
      { id: "b3", name: "War Cry", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
      { id: "b4", name: "Bulk Up", desc: "Lift weights for 20 minutes", type: "strength", minutes: 20, xp: 50 },
    ],
  },
  assassin: {
    name: "Assassin",
    color: "#22c55e",
    body: "Lean & athletic",
    tagline: "Swift and deadly. Forge a lean, agile, explosive body built for speed.",
    focus: "Running, HIIT, cycling, sports and bodyweight work",
    bonus: { AGI: 2 },
    bonusText: "2× XP on Agility training",
    base: { STR: 4, AGI: 8, WIS: 4, VIT: 4 },
    titles: ["Pickpocket", "Shadow", "Blade", "Nightstalker", "Phantom", "Master Assassin", "Ghost", "Living Legend"],
    quests: [
      { id: "a1", name: "Swift Shadow", desc: "Train Agility for 30 minutes", stat: "AGI", minutes: 30, xp: 60 },
      { id: "a2", name: "Into the Night", desc: "Train Agility for 45 minutes", stat: "AGI", minutes: 45, xp: 90 },
      { id: "a3", name: "Silent Steps", desc: "Cover 5 km in any training", km: 5, xp: 70 },
      { id: "a4", name: "Quick Strike", desc: "Do 20 minutes of HIIT", type: "hiit", minutes: 20, xp: 50 },
    ],
  },
  monk: {
    name: "Monk",
    color: "#f59e0b",
    body: "Flexible & balanced",
    tagline: "Mind and body as one. Master yoga, stretching and meditation for calm and mobility.",
    focus: "Yoga, stretching, meditation and mindful movement",
    bonus: { WIS: 2 },
    bonusText: "2× XP on Wisdom training",
    base: { STR: 3, AGI: 4, WIS: 9, VIT: 4 },
    titles: ["Novice", "Acolyte", "Disciple", "Adept", "Sage", "Master", "Grandmaster", "Enlightened One"],
    quests: [
      { id: "m1", name: "Inner Peace", desc: "Train Wisdom for 20 minutes", stat: "WIS", minutes: 20, xp: 50 },
      { id: "m2", name: "Flowing Water", desc: "Train Wisdom for 40 minutes", stat: "WIS", minutes: 40, xp: 90 },
      { id: "m3", name: "Still Mind", desc: "Meditate for 10 minutes", type: "meditation", minutes: 10, xp: 40 },
      { id: "m4", name: "Balanced Path", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
    ],
  },
  warrior: {
    name: "Warrior",
    color: "#3b82f6",
    body: "Regular physique",
    tagline: "Balanced in all things. Build a strong, healthy, well-rounded body.",
    focus: "A mix of everything: strength, cardio and mobility",
    bonus: { STR: 1.5, AGI: 1.5, WIS: 1.5, VIT: 1.5 },
    bonusText: "1.5× XP on all training",
    base: { STR: 6, AGI: 5, WIS: 4, VIT: 5 },
    titles: ["Recruit", "Squire", "Soldier", "Knight", "Champion", "Commander", "Hero", "Legend"],
    quests: [
      { id: "w1", name: "Daily Drill", desc: "Train for 30 minutes", minutes: 30, xp: 50 },
      { id: "w2", name: "Shield Wall", desc: "Train Strength for 20 minutes", stat: "STR", minutes: 20, xp: 50 },
      { id: "w3", name: "Forced March", desc: "Train Vitality for 30 minutes", stat: "VIT", minutes: 30, xp: 50 },
      { id: "w4", name: "Battle Ready", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
    ],
  },
};

// 16x16 pixel-art sprites. Each letter maps to a color in SPRITE_COLORS.
const SPRITES = {
  barbarian: [
    ".w............w.",
    ".ww...mmmm...ww.",
    "..ww.mmmmmm.ww..",
    "...wwmmmmmmww...",
    ".....ssssss.....",
    ".....sesses.....",
    ".....hhsshh.....",
    ".....hhhhhh.....",
    "..ssshhhhhhsss..",
    ".ssssshhhhsssss.",
    ".ssd.ssssss.dss.",
    ".ss..sdssds..ss.",
    ".dd..bbbbbb..dd.",
    ".....ffffff.....",
    ".....ss..ss.....",
    "....ddd..ddd....",
  ],
  assassin: [
    "......cccc......",
    ".....cCCCCc.....",
    "....cCkkkkCc....",
    "....cCgkkgCc....",
    "....cCkkkkCc....",
    ".....cCCCCc.....",
    "....cccCCccc....",
    "...ccCcCCcCcc...",
    "...cc.cCCc.cc...",
    "...ss.cCCc.ss...",
    "...a..bbbb..a...",
    "...a..cCCc..a...",
    "......cccc......",
    "......c..c......",
    "......c..c......",
    ".....kk..kk.....",
  ],
  monk: [
    "....y......y....",
    "...y..ssss..y...",
    ".....ssssss.....",
    ".....skssks.....",
    ".....ssssss.....",
    "......sdds......",
    "....OooooooO....",
    "...OooossoooO...",
    "..OooooooooooO..",
    "..OooorrrroooO..",
    ".OooooooooooooO.",
    "OOooooooooooooOO",
    "OssOOOOOOOOOOssO",
    ".OOOOOOOOOOOOOO.",
    "................",
    "................",
  ],
  warrior: [
    "......mmmm....a.",
    ".....mmmmmm...a.",
    ".....MmmmmM...a.",
    ".....sesses...a.",
    ".....ssssss...a.",
    "......ssss....a.",
    "....mmbbbbmm..a.",
    "BBB.mmbbbbmm.yyy",
    "ByBsmbbbbbbmsss.",
    "BBB.bbyyyybb....",
    "BBB.BBBBBBBB....",
    ".B..BBB..BBB....",
    "....mm....mm....",
    "....mm....mm....",
    "...MMM....MMM...",
    "................",
  ],
};

const SPRITE_COLORS = {
  // shared
  s: "#e8b07c", d: "#b97a4a", e: "#111827", k: "#111827",
  m: "#9ca3af", M: "#4b5563", a: "#e5e7eb", y: "#facc15", b: "#4a2f17",
  // barbarian
  w: "#f5f5f4", h: "#9a4a1c", f: "#6b3f1d",
  // assassin
  c: "#14532d", C: "#16a34a", g: "#a3e635",
  // monk
  o: "#f59e0b", O: "#b45309", r: "#7c2d12",
  // warrior
  B: "#1d4ed8",
};

// Turns rows of letters into SVG pixels, offset by (dx, dy)
function pixels(rows, colors, dx = 0, dy = 0) {
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === "." || !colors[ch]) return;
      rects += `<rect x="${x + dx}" y="${y + dy}" width="1" height="1" fill="${colors[ch]}"/>`;
    });
  });
  return rects;
}

function spriteColors(cls) {
  // The warrior's tunic is class blue rather than brown leather
  return cls === "warrior" ? { ...SPRITE_COLORS, b: "#3b82f6" } : SPRITE_COLORS;
}

function spriteSvg(cls, label) {
  const rects = pixels(SPRITES[cls], spriteColors(cls));
  return `<svg class="sprite" viewBox="0 0 16 16" role="img" aria-label="${label}">${rects}</svg>`;
}

// ---------- Gear ----------

// Where gear attaches on each class sprite (in sprite coordinates)
const ANCHORS = {
  barbarian: { headTop: 1, shoulders: 8 },
  assassin: { headTop: 0, shoulders: 6 },
  monk: { headTop: 1, shoulders: 6 },
  warrior: { headTop: 0, shoulders: 6 },
};

// Unlock rules: { level } or { badge }. xp = permanent % bonus on new workouts.
const GEAR = [
  // Head: drawn on top of the head
  { id: "leaf_circlet", slot: "head", name: "Leaf Circlet", unlock: { level: 3 },
    art: [".g..g.", "gGgGgG"], colors: { g: "#4ade80", G: "#15803d" } },
  { id: "iron_crown", slot: "head", name: "Iron Crown", unlock: { level: 6 },
    art: ["m.mm.m", "mmmmmm"], colors: { m: "#cbd5e1" } },
  { id: "gold_crown", slot: "head", name: "Golden Crown", unlock: { level: 12 }, xp: 5,
    art: ["y.yy.y", "yryyry"], colors: { y: "#facc15", r: "#dc2626" } },
  { id: "halo", slot: "head", name: "Halo of Quests", unlock: { badge: "quests25" },
    art: [".yyyy.", "y....y"], colors: { y: "#fef08a" } },

  // Back: a cape drawn behind the hero
  { id: "travel_cloak", slot: "back", name: "Traveler's Cloak", unlock: { level: 2 },
    colors: { c: "#78350f", h: "#451a03" } },
  { id: "crimson_cape", slot: "back", name: "Crimson Cape", unlock: { level: 5 },
    colors: { c: "#dc2626", h: "#7f1d1d" } },
  { id: "shadow_cape", slot: "back", name: "Shadow Cape", unlock: { badge: "streak7" },
    colors: { c: "#312e81", h: "#0f0a2e" } },
  { id: "royal_cape", slot: "back", name: "Royal Cape", unlock: { level: 10 }, xp: 5,
    colors: { c: "#7e22ce", h: "#facc15" } },

  // Companion: a pet at the hero's feet
  { id: "slime", slot: "pet", name: "Slime", unlock: { level: 4 },
    art: [".ggg.", "ggggg", "gkgkg", "ggggg"], colors: { g: "#4ade80", k: "#052e16" } },
  { id: "cat", slot: "pet", name: "Tabby Cat", unlock: { badge: "streak3" },
    art: ["o...o", "ooooo", "okoko", "ooooo"], colors: { o: "#fb923c", k: "#111827" } },
  { id: "owl", slot: "pet", name: "Wise Owl", unlock: { badge: "trained10" },
    art: [".bbb.", "bwbwb", "bbybb", ".b.b."], colors: { b: "#a16207", w: "#fef9c3", y: "#f97316" } },
  { id: "dragon", slot: "pet", name: "Baby Dragon", unlock: { level: 15 }, xp: 5,
    art: ["r.r..", "rrrr.", "ykrrr", ".r.rr"], colors: { r: "#dc2626", k: "#111827", y: "#facc15" } },

  // Aura: a pixel glow behind the hero
  { id: "ember_aura", slot: "aura", name: "Ember Aura", unlock: { level: 7 },
    tones: ["#7c2d12", "#c2410c", "#f97316"] },
  { id: "frost_aura", slot: "aura", name: "Frost Aura", unlock: { badge: "marathon" },
    tones: ["#164e63", "#0e7490", "#22d3ee"] },
  { id: "void_aura", slot: "aura", name: "Void Aura", unlock: { level: 20 },
    tones: ["#2e1065", "#5b21b6", "#a78bfa"] },
  { id: "golden_aura", slot: "aura", name: "Golden Aura", unlock: { badge: "trained100" }, xp: 5,
    tones: ["#713f12", "#a16207", "#facc15"] },
];

const SLOTS = {
  head: "Headgear",
  back: "Cape",
  pet: "Companion",
  aura: "Aura",
};

const gearById = (id) => GEAR.find((g) => g.id === id);

// Hero sprite on a 20x20 canvas with room around it for gear
function heroSvg(cls, gear = {}, label = "Your hero") {
  const OX = 2;
  const OY = 2;
  const anchor = ANCHORS[cls];
  let rects = "";

  const aura = gearById(gear.aura);
  if (aura) {
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const d = Math.hypot(x - 9.5, y - 10);
        const tone = d < 5 ? 2 : d < 7.5 ? 1 : d < 10 ? 0 : -1;
        if (tone >= 0) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${aura.tones[tone]}"/>`;
      }
    }
  }

  const cape = gearById(gear.back);
  if (cape) {
    const top = anchor.shoulders + OY;
    for (let y = top; y < 20; y++) {
      const flare = Math.min(Math.floor((y - top) / 3), 2);
      for (let x = 6 - flare; x <= 13 + flare; x++) {
        const color = y >= 18 ? cape.colors.h : cape.colors.c;
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
      }
    }
  }

  rects += pixels(SPRITES[cls], spriteColors(cls), OX, OY);

  const head = gearById(gear.head);
  if (head) rects += pixels(head.art, head.colors, 7, anchor.headTop + OY - 2);

  const pet = gearById(gear.pet);
  if (pet) rects += pixels(pet.art, pet.colors, 15, 16);

  return `<svg class="sprite" viewBox="0 0 20 20" role="img" aria-label="${label}">${rects}</svg>`;
}

// ---------- Badges ----------

// Each check returns [current, target] so locked badges can show progress
const BADGES = [
  { id: "first", icon: "🩸", name: "First Blood", desc: "Complete your first workout", check: (c) => [c.count, 1] },
  { id: "trained10", icon: "🎒", name: "Adventurer", desc: "Complete 10 workouts", check: (c) => [c.count, 10] },
  { id: "trained50", icon: "🎖️", name: "Veteran", desc: "Complete 50 workouts", check: (c) => [c.count, 50] },
  { id: "trained100", icon: "🏛️", name: "Centurion", desc: "Complete 100 workouts", check: (c) => [c.count, 100] },
  { id: "streak3", icon: "🔥", name: "On Fire", desc: "Train 3 days in a row", check: (c) => [c.longestStreak, 3] },
  { id: "streak7", icon: "⚡", name: "Unstoppable", desc: "Train 7 days in a row", check: (c) => [c.longestStreak, 7] },
  { id: "streak30", icon: "⛓️", name: "Iron Habit", desc: "Train 30 days in a row", check: (c) => [c.longestStreak, 30] },
  { id: "hour", icon: "⏳", name: "Endurance", desc: "Train 60 minutes in one session", check: (c) => [c.maxDuration, 60] },
  { id: "km5", icon: "👟", name: "First 5K", desc: "Cover 5 km in one workout", check: (c) => [c.maxKm, 5] },
  { id: "km10", icon: "🏅", name: "10K Club", desc: "Cover 10 km in one workout", check: (c) => [c.maxKm, 10] },
  { id: "marathon", icon: "🗺️", name: "Marathoner", desc: "Cover 42.2 km in total", check: (c) => [c.totalKm, 42.2] },
  { id: "goal", icon: "🎯", name: "Goal Crusher", desc: "Hit your weekly goal", check: (c) => [c.bestWeek, c.goal] },
  { id: "quests5", icon: "📜", name: "Quest Hunter", desc: "Complete 5 daily quests", check: (c) => [c.quests, 5] },
  { id: "quests25", icon: "🏆", name: "Questmaster", desc: "Complete 25 daily quests", check: (c) => [c.quests, 25] },
  { id: "allstats", icon: "🃏", name: "Jack of All Trades", desc: "Train all four attributes", check: (c) => [c.statsTrained, 4] },
  { id: "explorer", icon: "🧭", name: "Explorer", desc: "Try 6 different activities", check: (c) => [c.activityTypes, 6] },
  { id: "str", icon: "💪", name: "Iron Body", desc: "Train Strength for 10 hours", check: (c) => [c.statMinutes.STR, 600] },
  { id: "agi", icon: "💨", name: "Wind Runner", desc: "Train Agility for 10 hours", check: (c) => [c.statMinutes.AGI, 600] },
  { id: "wis", icon: "🕯️", name: "Inner Calm", desc: "Train Wisdom for 10 hours", check: (c) => [c.statMinutes.WIS, 600] },
  { id: "vit", icon: "🌲", name: "Trailblazer", desc: "Train Vitality for 10 hours", check: (c) => [c.statMinutes.VIT, 600] },
  { id: "lvl5", icon: "⭐", name: "Rising Hero", desc: "Reach level 5", check: (c) => [c.level, 5] },
  { id: "lvl10", icon: "🌟", name: "Champion", desc: "Reach level 10", check: (c) => [c.level, 10] },
  { id: "lvl20", icon: "💫", name: "Legend", desc: "Reach level 20", check: (c) => [c.level, 20] },
];

const badgeById = (id) => BADGES.find((b) => b.id === id);

// ---------- Storage ----------

const STORAGE_KEY = "fittrack.workouts";
const SETTINGS_KEY = "fittrack.settings";
const QUESTS_KEY = "fittrack.quests";
const UNLOCKS_KEY = "fittrack.unlocks";
const DEFAULT_SETTINGS = { goal: 150, weight: 70, cls: null, heroName: "", gear: {} };

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Storage may be full or unavailable; the app keeps working for this session
  }
}

let workouts = load(STORAGE_KEY, []);
let settings = { ...DEFAULT_SETTINGS, ...load(SETTINGS_KEY, {}) };
// Completed daily quests: { date, id, xp }
let questAwards = load(QUESTS_KEY, []);
// Badges and gear the player has already been told about
let seen = { badges: [], gear: [], ...load(UNLOCKS_KEY, {}) };

function persist() {
  save(STORAGE_KEY, workouts);
  save(QUESTS_KEY, questAwards);
}

// ---------- Date helpers ----------

// Local date as YYYY-MM-DD (avoids UTC shifting from toISOString)
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
}

// Monday-based start of the week
function startOfWeek(date) {
  const day = (date.getDay() + 6) % 7;
  return addDays(new Date(date.getFullYear(), date.getMonth(), date.getDate()), -day);
}

function formatDay(key) {
  const today = toKey(new Date());
  const yesterday = toKey(addDays(new Date(), -1));
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return fromKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// ---------- Game rules ----------

const XP_PER_MINUTE = 2;

function activityOf(w) {
  return ACTIVITIES[w.type] || ACTIVITIES.other;
}

function multiplier(cls, stat) {
  return (CLASSES[cls] && CLASSES[cls].bonus[stat]) || 1;
}

function gearBonus() {
  return Object.values(settings.gear).reduce((total, id) => total + ((gearById(id) || {}).xp || 0), 0);
}

function workoutXp(type, minutes, cls, bonusPct = gearBonus()) {
  const stat = (ACTIVITIES[type] || ACTIVITIES.other).stat;
  return Math.round(minutes * XP_PER_MINUTE * multiplier(cls, stat) * (1 + bonusPct / 100));
}

function estimateCalories(type, minutes) {
  const met = (ACTIVITIES[type] || ACTIVITIES.other).met;
  return Math.round(met * settings.weight * (minutes / 60));
}

function sumBy(list, field) {
  return list.reduce((total, w) => total + (Number(w[field]) || 0), 0);
}

function workoutsOn(key) {
  return workouts.filter((w) => w.date === key);
}

function totalXp() {
  return sumBy(workouts, "xp") + sumBy(questAwards, "xp");
}

// Reaching level L takes 50 * (L-1) * L total XP: 100, 300, 600, 1000...
function levelInfo(xp) {
  let level = 1;
  while (xp >= 50 * level * (level + 1)) level++;
  const start = 50 * (level - 1) * level;
  const next = 50 * level * (level + 1);
  return { level, into: xp - start, need: next - start };
}

function titleFor(cls, level) {
  const tier = TITLE_LEVELS.filter((l) => level >= l).length - 1;
  return CLASSES[cls].titles[tier];
}

function currentStreak() {
  const days = new Set(workouts.map((w) => w.date));
  let cursor = new Date();
  // A streak is still alive if you haven't worked out yet today
  if (!days.has(toKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (days.has(toKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Each class has its own quest pool; one is chosen per day
function questFor(key, cls) {
  const pool = CLASSES[cls].quests;
  const dayNumber = Math.round(fromKey(key).getTime() / 86400000);
  return pool[((dayNumber % pool.length) + pool.length) % pool.length];
}

function findQuest(id) {
  for (const c of Object.values(CLASSES)) {
    const quest = c.quests.find((q) => q.id === id);
    if (quest) return quest;
  }
  return null;
}

function questProgress(quest, list) {
  const relevant = list.filter(
    (w) => (!quest.stat || activityOf(w).stat === quest.stat) && (!quest.type || w.type === quest.type)
  );
  if (quest.sessions) return { cur: relevant.length, target: quest.sessions, unit: "sessions" };
  if (quest.km) return { cur: Math.round(sumBy(relevant, "distance") * 10) / 10, target: quest.km, unit: "km" };
  return { cur: sumBy(relevant, "duration"), target: quest.minutes, unit: "min" };
}

// Re-checks a day's quest after workouts change. Quests can only be earned
// on the day itself, but deleting a workout can take a reward away again.
// Returns the quest if it was newly completed.
function syncQuest(key) {
  const award = questAwards.find((a) => a.date === key);
  const isToday = key === toKey(new Date());
  const quest = award ? findQuest(award.id) : isToday ? questFor(key, settings.cls) : null;
  if (!quest) return null;
  const p = questProgress(quest, workoutsOn(key));
  const met = p.cur >= p.target;
  if (met && !award) {
    questAwards.push({ date: key, id: quest.id, xp: quest.xp });
    return quest;
  }
  if (!met && award) questAwards = questAwards.filter((a) => a !== award);
  return null;
}

function longestStreak() {
  const days = [...new Set(workouts.map((w) => w.date))].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const key of days) {
    run = prev && toKey(addDays(fromKey(prev), 1)) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return best;
}

function badgeContext() {
  const statMinutes = {};
  for (const stat of Object.keys(STATS)) {
    statMinutes[stat] = sumBy(workouts.filter((w) => activityOf(w).stat === stat), "duration");
  }
  const weeks = {};
  for (const w of workouts) {
    const week = toKey(startOfWeek(fromKey(w.date)));
    weeks[week] = (weeks[week] || 0) + w.duration;
  }
  return {
    count: workouts.length,
    longestStreak: longestStreak(),
    maxDuration: Math.max(0, ...workouts.map((w) => w.duration)),
    maxKm: Math.max(0, ...workouts.map((w) => w.distance || 0)),
    totalKm: Math.round(sumBy(workouts, "distance") * 10) / 10,
    bestWeek: Math.max(0, ...Object.values(weeks)),
    goal: settings.goal,
    quests: questAwards.length,
    statsTrained: Object.values(statMinutes).filter((m) => m > 0).length,
    activityTypes: new Set(workouts.map((w) => w.type)).size,
    statMinutes,
    level: levelInfo(totalXp()).level,
  };
}

function badgeStatus() {
  const ctx = badgeContext();
  return BADGES.map((b) => {
    const [cur, target] = b.check(ctx);
    return { ...b, cur: Math.min(cur, target), target, earned: cur >= target };
  });
}

function unlockedGear(badges = badgeStatus()) {
  const earned = new Set(badges.filter((b) => b.earned).map((b) => b.id));
  const level = levelInfo(totalXp()).level;
  return GEAR.filter((g) => (g.unlock.level ? level >= g.unlock.level : earned.has(g.unlock.badge)));
}

function unlockText(g) {
  return g.unlock.level ? `Reach LV ${g.unlock.level}` : `Earn "${badgeById(g.unlock.badge).name}"`;
}

// Compares what is unlocked now with what the player has seen. Gear that is
// no longer unlocked (e.g. after deleting workouts) is unequipped.
// Returns newly unlocked badges and gear.
function syncUnlocks() {
  const status = badgeStatus();
  const badges = status.filter((b) => b.earned);
  const gear = unlockedGear(status);
  const fresh = {
    badges: badges.filter((b) => !seen.badges.includes(b.id)),
    gear: gear.filter((g) => !seen.gear.includes(g.id)),
  };
  seen = { badges: badges.map((b) => b.id), gear: gear.map((g) => g.id) };
  save(UNLOCKS_KEY, seen);

  let unequipped = false;
  for (const [slot, id] of Object.entries(settings.gear)) {
    if (id && !seen.gear.includes(id)) {
      delete settings.gear[slot];
      unequipped = true;
    }
  }
  if (unequipped) save(SETTINGS_KEY, settings);
  return fresh;
}

// ---------- Rendering ----------

const $ = (id) => document.getElementById(id);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function applyTheme() {
  const color = settings.cls ? CLASSES[settings.cls].color : "#facc15";
  document.documentElement.style.setProperty("--accent", color);
}

function workoutItem(w) {
  const activity = activityOf(w);
  const meta = [`${w.duration} min`];
  if (w.distance) meta.push(`${w.distance} km`);
  meta.push(`${w.calories} kcal`);
  return `
    <li class="workout">
      <div class="workout-icon" aria-hidden="true">${activity.icon}</div>
      <div class="workout-info">
        <div class="workout-name">${activity.label}<span class="workout-xp">+${w.xp || 0} XP</span></div>
        <div class="workout-meta">${meta.join(" · ")}</div>
        ${w.notes ? `<div class="workout-notes">${escapeHtml(w.notes)}</div>` : ""}
      </div>
      <button class="delete-btn" data-id="${w.id}" aria-label="Delete ${activity.label} workout">&#10005;</button>
    </li>`;
}

function renderHero() {
  const cls = CLASSES[settings.cls];
  const now = new Date();
  const todayKey = toKey(now);
  const todays = workoutsOn(todayKey);

  // Character card
  const info = levelInfo(totalXp());
  $("hero-portrait").innerHTML = heroSvg(settings.cls, settings.gear, cls.name);
  $("hero-name-display").textContent = settings.heroName || "Hero";
  $("hero-title").textContent = `${titleFor(settings.cls, info.level)} · ${cls.name}`;
  $("hero-level").textContent = info.level;
  $("header-level").textContent = `LV ${info.level}`;
  $("xp-text").textContent = `${info.into} / ${info.need} XP`;
  $("xp-fill").style.width = `${(info.into / info.need) * 100}%`;

  // Daily quest
  const award = questAwards.find((a) => a.date === todayKey);
  const quest = award ? findQuest(award.id) : questFor(todayKey, settings.cls);
  const p = questProgress(quest, todays);
  const done = p.cur >= p.target;
  $("quest-card").classList.toggle("done", done);
  $("quest-name").textContent = quest.name;
  $("quest-desc").textContent = quest.desc;
  $("quest-reward").textContent = done ? "Complete!" : `+${quest.xp} XP`;
  $("quest-fill").style.width = `${Math.min(p.cur / p.target, 1) * 100}%`;
  $("quest-progress").textContent = done
    ? `Reward claimed: +${quest.xp} XP`
    : `${p.cur} / ${p.target} ${p.unit}`;

  // Today
  $("today-minutes").textContent = sumBy(todays, "duration");
  $("today-calories").textContent = sumBy(todays, "calories");
  $("streak").textContent = currentStreak();

  // Attributes: class base + 1 point per 15 minutes trained
  const values = {};
  for (const stat of Object.keys(STATS)) {
    const minutes = sumBy(workouts.filter((w) => activityOf(w).stat === stat), "duration");
    values[stat] = cls.base[stat] + Math.floor(minutes / 15);
  }
  const maxValue = Math.max(20, ...Object.values(values));
  const isWarrior = settings.cls === "warrior";
  $("attributes").innerHTML = Object.entries(STATS)
    .map(([stat, s]) => {
      const bonus = !isWarrior && cls.bonus[stat] > 1;
      return `
        <div class="attr pixel" title="${s.label}">
          <span class="attr-name ${bonus ? "bonus" : ""}" ${bonus ? 'aria-label="' + stat + ', class bonus"' : ""}>${stat}</span>
          <div class="bar"><div class="bar-fill" style="width:${(values[stat] / maxValue) * 100}%;background:${s.color}"></div></div>
          <span class="attr-value">${values[stat]}</span>
        </div>`;
    })
    .join("");

  // Weekly goal
  const weekStart = toKey(startOfWeek(now));
  const weekMinutes = sumBy(workouts.filter((w) => w.date >= weekStart && w.date <= todayKey), "duration");
  const pct = Math.min(Math.round((weekMinutes / settings.goal) * 100), 100);
  $("week-text").textContent = `${weekMinutes} / ${settings.goal} min`;
  $("week-pct").textContent = `${pct}%`;
  $("week-fill").style.width = `${pct}%`;

  // 7-day chart
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = addDays(now, -i);
    const key = toKey(date);
    days.push({ key, date, minutes: sumBy(workoutsOn(key), "duration") });
  }
  const max = Math.max(30, ...days.map((d) => d.minutes));
  $("week-chart").innerHTML = days
    .map((d) => {
      const height = Math.round((d.minutes / max) * 100);
      const label = d.date.toLocaleDateString(undefined, { weekday: "narrow" });
      return `
        <div class="bar-col ${d.key === todayKey ? "today" : ""}">
          <span class="col-value">${d.minutes || ""}</span>
          <div class="col ${d.minutes ? "" : "empty"}" style="height:${height}%"></div>
          <span class="col-day">${label}</span>
        </div>`;
    })
    .join("");

  $("today-list").innerHTML = todays.length
    ? todays.map(workoutItem).join("")
    : `<li class="empty-state">No battles yet today. Tap <strong>Train</strong> to earn XP!</li>`;
}

function renderJournal() {
  $("all-time").innerHTML = `
    <div class="stat"><span class="stat-value pixel">${workouts.length}</span><span class="stat-label">battles</span></div>
    <div class="stat"><span class="stat-value pixel">${Math.round(sumBy(workouts, "duration") / 60)}</span><span class="stat-label">hours</span></div>
    <div class="stat"><span class="stat-value pixel">${totalXp().toLocaleString()}</span><span class="stat-label">total XP</span></div>`;

  if (!workouts.length) {
    $("history-list").innerHTML = `<div class="panel empty-state">Your legend begins with your first workout.</div>`;
    return;
  }

  const byDay = {};
  for (const w of workouts) (byDay[w.date] ||= []).push(w);
  $("history-list").innerHTML = Object.keys(byDay)
    .sort()
    .reverse()
    .map((key) => {
      const award = questAwards.find((a) => a.date === key);
      const quest = award && findQuest(award.id);
      return `
      <div class="history-day">
        <h3>${formatDay(key)} · ${sumBy(byDay[key], "duration")} min${quest ? ` · ✔ ${quest.name}` : ""}</h3>
        <div class="panel"><ul class="workout-list">${byDay[key].map(workoutItem).join("")}</ul></div>
      </div>`;
    })
    .join("");
}

function renderSettings() {
  const cls = CLASSES[settings.cls];
  const level = levelInfo(totalXp()).level;
  $("current-class").innerHTML = `
    <div class="portrait">${heroSvg(settings.cls, settings.gear, cls.name)}</div>
    <div>
      <div class="pixel" style="font-size:0.7rem;margin-bottom:6px">${escapeHtml(settings.heroName || "Hero")}</div>
      <div style="color:var(--accent);font-weight:700">${cls.name} · ${titleFor(settings.cls, level)}</div>
      <div class="hint">${cls.bonusText}</div>
    </div>`;
}

function renderActivities() {
  const selected = $("activity-grid").dataset.value || "";
  const entries = Object.entries(ACTIVITIES);
  // Show the class's bonus activities first
  entries.sort((a, b) => multiplier(settings.cls, b[1].stat) - multiplier(settings.cls, a[1].stat));
  const isWarrior = settings.cls === "warrior";
  $("activity-grid").innerHTML = entries
    .map(([value, a]) => {
      const m = multiplier(settings.cls, a.stat);
      const badge = m > 1 && !isWarrior ? `<span class="badge">${m}× XP</span>` : "";
      return `
        <button type="button" class="activity ${value === selected ? "selected" : ""}" data-value="${value}"
          role="radio" aria-checked="${value === selected}">
          ${badge}
          <span class="activity-icon" aria-hidden="true">${a.icon}</span>
          <span>${a.label}</span>
          <span class="activity-stat">${a.stat}</span>
        </button>`;
    })
    .join("");
}

function renderLoot() {
  const cls = CLASSES[settings.cls];
  const status = badgeStatus();
  const unlocked = new Set(unlockedGear(status).map((g) => g.id));
  const bonus = gearBonus();

  $("loot-portrait").innerHTML = heroSvg(settings.cls, settings.gear, cls.name);
  $("loot-name").textContent = settings.heroName || "Hero";
  $("loot-bonus").textContent = bonus ? `Gear bonus: +${bonus}% XP` : "Equip gear to customize your hero";
  $("gear-count").textContent = `${unlocked.size} / ${GEAR.length}`;

  $("gear-slots").innerHTML = Object.entries(SLOTS)
    .map(([slot, label]) => {
      const tiles = GEAR.filter((g) => g.slot === slot)
        .map((g) => {
          const isUnlocked = unlocked.has(g.id);
          const equipped = settings.gear[slot] === g.id;
          const state = equipped ? "Equipped" : isUnlocked ? "Tap to equip" : unlockText(g);
          return `
            <button type="button" class="gear ${isUnlocked ? "" : "locked"} ${equipped ? "equipped" : ""}"
              data-gear="${g.id}" ${isUnlocked ? "" : "disabled"} aria-pressed="${equipped}">
              ${g.xp ? `<span class="badge">+${g.xp}% XP</span>` : ""}
              <span class="gear-preview">${heroSvg(settings.cls, { [slot]: g.id }, g.name)}</span>
              <span class="gear-name">${isUnlocked ? "" : "🔒 "}${g.name}</span>
              <span class="gear-state">${state}</span>
            </button>`;
        })
        .join("");
      return `<h3 class="slot-title pixel">${label}</h3><div class="gear-grid">${tiles}</div>`;
    })
    .join("");

  const earned = status.filter((b) => b.earned).length;
  $("badge-count").textContent = `${earned} / ${BADGES.length}`;
  $("badge-grid").innerHTML = status
    .map((b) => {
      const target = Number.isInteger(b.target) ? b.target : b.target.toFixed(1);
      const cur = Number.isInteger(b.cur) ? b.cur : b.cur.toFixed(1);
      return `
        <div class="achievement ${b.earned ? "earned" : ""}">
          <span class="achievement-icon" aria-hidden="true">${b.icon}</span>
          <span class="achievement-name">${b.name}</span>
          <span class="achievement-desc">${b.desc}</span>
          ${b.earned
            ? `<span class="achievement-state pixel">Earned</span>`
            : `<div class="bar mini-bar"><div class="bar-fill" style="width:${(b.cur / b.target) * 100}%"></div></div>
               <span class="achievement-state">${cur} / ${target}</span>`}
        </div>`;
    })
    .join("");
}

function render() {
  if (!settings.cls) return;
  applyTheme();
  renderHero();
  renderJournal();
  renderSettings();
  renderLoot();
}

// ---------- Feedback ----------

let toastTimer;
function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

const popupQueue = [];
function popup(icon, title, text) {
  popupQueue.push({ icon, title, text });
  if ($("popup").hidden) showNextPopup();
}

function showNextPopup() {
  const next = popupQueue.shift();
  if (!next) {
    $("popup").hidden = true;
    return;
  }
  $("popup-icon").innerHTML = next.icon;
  $("popup-title").textContent = next.title;
  $("popup-text").textContent = next.text;
  $("popup").hidden = false;
  $("popup-btn").focus();
}

$("popup-btn").addEventListener("click", showNextPopup);

// ---------- Navigation ----------

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === name));
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.screen === name));
  $("screen-title").textContent = $(name).dataset.title;
  window.scrollTo(0, 0);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => showScreen(tab.dataset.screen));
});

// ---------- Class selection ----------

let pickedClass = null;

function renderClassPicker() {
  $("class-grid").innerHTML = Object.entries(CLASSES)
    .map(
      ([key, c]) => `
      <button type="button" class="class-card ${key === pickedClass ? "selected" : ""}" data-class="${key}"
        style="--c:${c.color}" role="radio" aria-checked="${key === pickedClass}">
        <div class="portrait">${spriteSvg(key, c.name)}</div>
        <span class="class-card-name">${c.name}</span>
        <span class="class-card-body">${c.body}</span>
      </button>`
    )
    .join("");

  const c = CLASSES[pickedClass];
  $("class-detail").innerHTML = c
    ? `
      <h3 style="color:${c.color}">${c.name}</h3>
      <p>${c.tagline}</p>
      <dl>
        <dt>Body type</dt><dd>${c.body}</dd>
        <dt>Training</dt><dd>${c.focus}</dd>
        <dt>Class bonus</dt><dd style="color:var(--gold)">${c.bonusText}</dd>
      </dl>`
    : `<p class="hint">Tap a class to learn more.</p>`;
  $("begin-btn").disabled = !pickedClass;
}

function openClassPicker(isChange) {
  pickedClass = settings.cls;
  $("hero-name").value = settings.heroName;
  $("class-select-title").textContent = isChange ? "Change Class" : "Choose Your Class";
  $("begin-btn").textContent = isChange ? "Confirm" : "Begin Adventure";
  $("cancel-class-btn").hidden = !isChange;
  renderClassPicker();
  $("class-select").hidden = false;
  $("class-select").scrollTop = 0;
}

$("class-grid").addEventListener("click", (event) => {
  const card = event.target.closest(".class-card");
  if (!card) return;
  pickedClass = card.dataset.class;
  renderClassPicker();
});

$("begin-btn").addEventListener("click", () => {
  if (!pickedClass) return;
  const isNew = !settings.cls;
  const changed = settings.cls && settings.cls !== pickedClass;
  settings.cls = pickedClass;
  settings.heroName = $("hero-name").value.trim().slice(0, 20);
  save(SETTINGS_KEY, settings);
  $("class-select").hidden = true;
  renderActivities();
  resetForm();
  render();
  showScreen("hero");
  const c = CLASSES[pickedClass];
  if (isNew) {
    popup(
      spriteSvg(pickedClass, c.name),
      `Welcome, ${settings.heroName || "Hero"}!`,
      `Your journey as a ${c.name} begins. ${c.bonusText}. Complete your daily quest to level up faster.`
    );
  } else if (changed) {
    toast(`You are now a ${c.name}!`);
  }
});

$("cancel-class-btn").addEventListener("click", () => {
  $("class-select").hidden = true;
});

$("change-class-btn").addEventListener("click", () => openClassPicker(true));

// ---------- Train ----------

const form = $("workout-form");

$("activity-grid").addEventListener("click", (event) => {
  const tile = event.target.closest(".activity");
  if (!tile) return;
  $("activity-grid").dataset.value = tile.dataset.value;
  renderActivities();
  updatePreview();
});

function selectedType() {
  return $("activity-grid").dataset.value || "";
}

function resetForm() {
  form.reset();
  $("activity-grid").dataset.value = "";
  renderActivities();
  form.date.value = toKey(new Date());
  form.date.max = toKey(new Date());
  updatePreview();
}

function updatePreview() {
  const type = selectedType();
  const minutes = Number(form.duration.value);
  if (!type || !(minutes > 0)) {
    $("reward-preview").textContent = "";
    return;
  }
  const xp = workoutXp(type, minutes, settings.cls);
  const kcal = form.calories.value ? Math.round(Number(form.calories.value)) : estimateCalories(type, minutes);
  $("reward-preview").textContent = `Reward: +${xp} XP · ~${kcal} kcal`;
}

["input", "change"].forEach((evt) => form.addEventListener(evt, updatePreview));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = $("form-status");
  status.className = "form-status";
  const type = selectedType();

  const fail = (msg) => {
    status.textContent = msg;
    status.classList.add("error");
  };
  if (!type) return fail("Choose a type of training.");
  const duration = Math.round(Number(form.duration.value));
  if (!duration || duration < 1 || duration > 1440) return fail("Enter a duration between 1 and 1440 minutes.");
  if (!form.date.value) return fail("Choose a date.");

  const levelBefore = levelInfo(totalXp()).level;
  const distance = Number(form.distance.value);
  const xp = workoutXp(type, duration, settings.cls);
  workouts.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type,
    duration,
    distance: distance > 0 ? Math.round(distance * 100) / 100 : null,
    calories: form.calories.value ? Math.round(Number(form.calories.value)) : estimateCalories(type, duration),
    date: form.date.value,
    notes: form.notes.value.trim(),
    cls: settings.cls,
    xp,
  });
  const completed = syncQuest(form.date.value);
  persist();
  const unlocks = syncUnlocks();
  render();
  resetForm();
  status.textContent = "";
  showScreen("hero");
  toast(`+${xp} XP`);

  if (completed) {
    popup("📜", "Quest Complete!", `${completed.name}: +${completed.xp} bonus XP`);
  }
  const levelAfter = levelInfo(totalXp()).level;
  if (levelAfter > levelBefore) {
    const newTitle = titleFor(settings.cls, levelAfter);
    const titleChanged = newTitle !== titleFor(settings.cls, levelBefore);
    popup(
      heroSvg(settings.cls, settings.gear, CLASSES[settings.cls].name),
      `Level Up! LV ${levelAfter}`,
      titleChanged ? `New title unlocked: ${newTitle}!` : "Your power grows. Keep training!"
    );
  }
  for (const b of unlocks.badges) {
    popup(b.icon, "Badge Earned!", `${b.name}: ${b.desc}`);
  }
  for (const g of unlocks.gear) {
    popup(
      heroSvg(settings.cls, { [g.slot]: g.id }, g.name),
      "New Gear!",
      `${g.name} unlocked${g.xp ? ` (+${g.xp}% XP)` : ""}. Equip it in Loot.`
    );
  }
});

// ---------- Loot ----------

$("gear-slots").addEventListener("click", (event) => {
  const tile = event.target.closest(".gear");
  if (!tile || tile.disabled) return;
  const g = gearById(tile.dataset.gear);
  if (settings.gear[g.slot] === g.id) delete settings.gear[g.slot];
  else settings.gear[g.slot] = g.id;
  save(SETTINGS_KEY, settings);
  render();
  updatePreview();
});

// ---------- Delete ----------

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  if (!confirm("Delete this workout? Its XP will be removed.")) return;
  const removed = workouts.find((w) => w.id === btn.dataset.id);
  workouts = workouts.filter((w) => w !== removed);
  if (removed) syncQuest(removed.date);
  persist();
  syncUnlocks();
  render();
});

// ---------- Settings ----------

const settingsForm = $("settings-form");
settingsForm.goal.value = settings.goal;
settingsForm.weight.value = settings.weight;

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = $("settings-status");
  const goal = Math.round(Number(settingsForm.goal.value));
  const weight = Number(settingsForm.weight.value);
  status.className = "form-status";

  if (!(goal >= 10 && goal <= 5000) || !(weight >= 20 && weight <= 300)) {
    status.textContent = "Goal must be 10–5000 min and weight 20–300 kg.";
    status.classList.add("error");
    return;
  }
  settings = { ...settings, goal, weight };
  save(SETTINGS_KEY, settings);
  syncUnlocks();
  render();
  status.textContent = "Saved.";
  status.classList.add("success");
});

$("export-btn").addEventListener("click", () => {
  const data = { settings, workouts, questAwards, unlocks: seen };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fitquest-${toKey(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

$("clear-btn").addEventListener("click", () => {
  if (!confirm("Delete ALL workouts, XP, levels, badges and gear? This cannot be undone.")) return;
  workouts = [];
  questAwards = [];
  persist();
  syncUnlocks();
  render();
});

// ---------- Start ----------

// Workouts saved before classes existed have no XP yet
let migrated = false;
for (const w of workouts) {
  if (w.xp == null) {
    w.cls = w.cls || "warrior";
    w.xp = workoutXp(w.type, w.duration, w.cls, 0);
    migrated = true;
  }
}
if (migrated) persist();

// Catch up quietly on anything unlocked before this version or while away
syncUnlocks();

if (settings.cls) {
  renderActivities();
  resetForm();
  render();
} else {
  applyTheme();
  openClassPicker(false);
}

// Re-render if the app is left open past midnight
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) render();
});

// Offline support
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
