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
  climbing: { label: "Climbing", icon: "🧗", stat: "STR", met: 8.0 },
  rowing: { label: "Rowing", icon: "🚣", stat: "AGI", met: 7.0 },
  boxing: { label: "Boxing", icon: "🥊", stat: "AGI", met: 7.8 },
  jumprope: { label: "Jump Rope", icon: "🪢", stat: "AGI", met: 11.0 },
  dance: { label: "Dance", icon: "💃", stat: "AGI", met: 5.5 },
  martialarts: { label: "Martial Arts", icon: "🥋", stat: "WIS", met: 7.0 },
  pilates: { label: "Pilates", icon: "🤸‍♀️", stat: "WIS", met: 3.0 },
  rucking: { label: "Rucking", icon: "🎒", stat: "VIT", met: 6.5 },
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
    titles: ["Wildling", "Brute", "Raider", "Berserker", "Savage", "Warlord", "Titan", "Godslayer"],
    promotion: "marauder",
    quests: [
      { id: "b1", name: "Iron Will", desc: "Train Strength for 30 minutes", stat: "STR", minutes: 30, xp: 60 },
      { id: "b2", name: "Lift the Mountain", desc: "Train Strength for 45 minutes", stat: "STR", minutes: 45, xp: 90 },
      { id: "b3", name: "War Cry", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
      { id: "b4", name: "Bulk Up", desc: "Lift weights for 20 minutes", type: "strength", minutes: 20, xp: 50 },
      { id: "b5", name: "Berserker's Hour", desc: "Train for 60 minutes", minutes: 60, xp: 90 },
      { id: "b6", name: "Climb the Cliffs", desc: "Climb or do calisthenics for 25 minutes", type: "calisthenics", minutes: 25, xp: 55 },
      { id: "b7", name: "Raid Party", desc: "Complete 3 training sessions", sessions: 3, xp: 90 },
      { id: "b8", name: "Warpaint", desc: "Train Strength for 60 minutes", stat: "STR", minutes: 60, xp: 110 },
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
    titles: ["Pickpocket", "Shadow", "Blade", "Nightstalker", "Specter", "Master Assassin", "Ghost", "Living Legend"],
    promotion: "phantom",
    quests: [
      { id: "a1", name: "Swift Shadow", desc: "Train Agility for 30 minutes", stat: "AGI", minutes: 30, xp: 60 },
      { id: "a2", name: "Into the Night", desc: "Train Agility for 45 minutes", stat: "AGI", minutes: 45, xp: 90 },
      { id: "a3", name: "Silent Steps", desc: "Cover 5 km in any training", km: 5, xp: 70 },
      { id: "a4", name: "Quick Strike", desc: "Do 20 minutes of HIIT", type: "hiit", minutes: 20, xp: 50 },
      { id: "a5", name: "Rooftop Run", desc: "Run for 30 minutes", type: "running", minutes: 30, xp: 60 },
      { id: "a6", name: "Shadow Boxing", desc: "Box for 20 minutes", type: "boxing", minutes: 20, xp: 50 },
      { id: "a7", name: "Long Shadow", desc: "Cover 10 km in any training", km: 10, xp: 100 },
      { id: "a8", name: "Double Agent", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
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
    titles: ["Novice", "Acolyte", "Disciple", "Adept", "Sage", "Elder", "Grandmaster", "Enlightened One"],
    promotion: "master",
    quests: [
      { id: "m1", name: "Inner Peace", desc: "Train Wisdom for 20 minutes", stat: "WIS", minutes: 20, xp: 50 },
      { id: "m2", name: "Flowing Water", desc: "Train Wisdom for 40 minutes", stat: "WIS", minutes: 40, xp: 90 },
      { id: "m3", name: "Still Mind", desc: "Meditate for 10 minutes", type: "meditation", minutes: 10, xp: 40 },
      { id: "m4", name: "Balanced Path", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
      { id: "m5", name: "Way of the Fist", desc: "Practice martial arts for 30 minutes", type: "martialarts", minutes: 30, xp: 60 },
      { id: "m6", name: "Lotus Flow", desc: "Do yoga for 30 minutes", type: "yoga", minutes: 30, xp: 60 },
      { id: "m7", name: "Pilgrim's Walk", desc: "Train Vitality for 30 minutes", stat: "VIT", minutes: 30, xp: 50 },
      { id: "m8", name: "Deep Stillness", desc: "Meditate for 20 minutes", type: "meditation", minutes: 20, xp: 60 },
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
    titles: ["Recruit", "Squire", "Soldier", "Vanguard", "Champion", "Commander", "Hero", "Legend"],
    promotion: "gladiator",
    quests: [
      { id: "w1", name: "Daily Drill", desc: "Train for 30 minutes", minutes: 30, xp: 50 },
      { id: "w2", name: "Shield Wall", desc: "Train Strength for 20 minutes", stat: "STR", minutes: 20, xp: 50 },
      { id: "w3", name: "Forced March", desc: "Train Vitality for 30 minutes", stat: "VIT", minutes: 30, xp: 50 },
      { id: "w4", name: "Battle Ready", desc: "Complete 2 training sessions", sessions: 2, xp: 60 },
      { id: "w5", name: "Swift Strikes", desc: "Train Agility for 30 minutes", stat: "AGI", minutes: 30, xp: 50 },
      { id: "w6", name: "Campaign", desc: "Train for 60 minutes", minutes: 60, xp: 90 },
      { id: "w7", name: "Meditate on Victory", desc: "Train Wisdom for 20 minutes", stat: "WIS", minutes: 20, xp: 45 },
      { id: "w8", name: "Three Fronts", desc: "Complete 3 training sessions", sessions: 3, xp: 90 },
    ],
  },
  knight: {
    name: "Knight",
    color: "#a855f7",
    body: "Strong & enduring",
    tagline: "Unyielding. Train for real-world strength and stamina that lasts, not for looks.",
    focus: "Long steady sessions, rucking and hiking, circuits and functional strength",
    bonus: { STR: 1.75, VIT: 1.75 },
    bonusText: "1.75× XP on Strength and Vitality training",
    base: { STR: 7, AGI: 3, WIS: 4, VIT: 8 },
    titles: ["Page", "Shieldbearer", "Knight-Errant", "Sworn Knight", "Knight Captain", "Banneret", "Lord Protector", "Knight of Legend"],
    promotion: "paladin",
    quests: [
      { id: "k1", name: "Long Ride", desc: "Train Vitality for 45 minutes", stat: "VIT", minutes: 45, xp: 80 },
      { id: "k2", name: "Trial of Endurance", desc: "Train for 60 minutes", minutes: 60, xp: 90 },
      { id: "k3", name: "Squire's Drill", desc: "Train Strength for 30 minutes", stat: "STR", minutes: 30, xp: 60 },
      { id: "k4", name: "Pilgrimage", desc: "Cover 8 km in any training", km: 8, xp: 80 },
      { id: "k5", name: "Armored March", desc: "Go rucking for 30 minutes", type: "rucking", minutes: 30, xp: 60 },
      { id: "k6", name: "Siege Training", desc: "Train Strength for 45 minutes", stat: "STR", minutes: 45, xp: 80 },
      { id: "k7", name: "Crusade", desc: "Cover 12 km in any training", km: 12, xp: 110 },
      { id: "k8", name: "Vigil of Iron", desc: "Train for 90 minutes", minutes: 90, xp: 130 },
    ],
  },
};

// Promoted classes. Each base class promotes twice: tier 1 at level 10 and
// tier 2 at level 20. Promoted classes share their base class's sprite
// (recolored), quests and base stats.
const PROMOTION_LEVELS = { 1: 10, 2: 20 };

Object.assign(CLASSES, {
  // Tier 1
  marauder: {
    name: "Marauder",
    from: "barbarian",
    promotion: "chieftain",
    color: "#f43f5e",
    body: "Massive & powerful",
    tagline: "A raider of legend. Your bodybuilder frame strikes fear into every village.",
    focus: "Heavy lifting, progressive overload, high-protein meals",
    bonus: { STR: 2.5 },
    bonusText: "2.5× XP on Strength training",
    titles: ["Pillager", "Reaver", "Raid Leader", "Ravager of Lands", "Dread Marauder", "Scourge", "Warbringer", "Terror of the North"],
  },
  master: {
    name: "Master",
    from: "monk",
    promotion: "awakened",
    color: "#fcd34d",
    body: "Supple & serene",
    tagline: "You have mastered mind and body. Your calm cannot be shaken.",
    focus: "Yoga, stretching, meditation and mindful movement",
    bonus: { WIS: 2.5 },
    bonusText: "2.5× XP on Wisdom training",
    titles: ["Initiate Master", "Master of Fists", "Master of Winds", "Master of Stillness", "True Master", "Grand Master", "Sage of Ages", "Ascended"],
  },
  gladiator: {
    name: "Gladiator",
    from: "warrior",
    promotion: "centurion",
    color: "#ea580c",
    body: "Battle-hardened",
    tagline: "Champion of the arena. Strong, fast and fearless in every way.",
    focus: "A mix of everything: strength, cardio and mobility",
    bonus: { STR: 1.75, AGI: 1.75, WIS: 1.75, VIT: 1.75 },
    bonusText: "1.75× XP on all training",
    titles: ["Arena Fodder", "Pit Fighter", "Bloodsport Brawler", "Crowd Favorite", "Arena Champion", "Grand Champion", "Colossus", "Undying Legend"],
  },
  phantom: {
    name: "Phantom",
    from: "assassin",
    promotion: "reaper",
    color: "#67e8f9",
    body: "Lean, fast & unseen",
    tagline: "More shadow than flesh. Your speed and endurance have become supernatural.",
    focus: "Running, HIIT, cycling, sports and bodyweight work",
    bonus: { AGI: 2.5 },
    bonusText: "2.5× XP on Agility training",
    titles: ["Shade", "Wisp", "Veilwalker", "Night Terror", "Wraith", "Phantom Lord", "Unseen One", "Living Myth"],
  },
  paladin: {
    name: "Paladin",
    from: "knight",
    promotion: "royal_guardian",
    color: "#f1f5f9",
    body: "Iron-willed & tireless",
    tagline: "A holy knight whose strength and endurance never fail.",
    focus: "Long steady sessions, rucking and hiking, circuits and functional strength",
    bonus: { STR: 2, VIT: 2 },
    bonusText: "2× XP on Strength and Vitality training",
    titles: ["Oathsworn", "Templar", "Crusader", "Holy Knight", "Lightbringer", "Grand Paladin", "Saint", "Divine Champion"],
  },

  // Tier 2
  chieftain: {
    name: "Chieftain",
    from: "marauder",
    color: "#facc15",
    body: "Colossal & commanding",
    tagline: "Leader of every clan. Your strength has become the stuff of songs.",
    focus: "Heavy lifting, progressive overload, high-protein meals",
    bonus: { STR: 3 },
    bonusText: "3× XP on Strength training",
    titles: ["Clan Blood", "Clan Champion", "Warband Leader", "Chieftain", "High Chieftain", "Warchief", "Horde King", "Lord of the Wilds"],
  },
  awakened: {
    name: "Awakened",
    from: "master",
    color: "#c4b5fd",
    body: "Radiant & unshakeable",
    tagline: "Your mind has opened to the stars. Body and spirit move as one light.",
    focus: "Yoga, stretching, meditation and mindful movement",
    bonus: { WIS: 3 },
    bonusText: "3× XP on Wisdom training",
    titles: ["Opened Eye", "Radiant One", "Starborn", "Lightwalker", "Celestial Sage", "Avatar", "Transcendent", "The Awakened One"],
  },
  centurion: {
    name: "Centurion",
    from: "gladiator",
    color: "#dc2626",
    body: "Disciplined & complete",
    tagline: "Commander of the legion. Every part of your fitness is battle-ready.",
    focus: "A mix of everything: strength, cardio and mobility",
    bonus: { STR: 2, AGI: 2, WIS: 2, VIT: 2 },
    bonusText: "2× XP on all training",
    titles: ["Optio", "Centurion", "Primus Pilus", "Legate", "Tribune", "Imperator", "Conqueror", "Eternal Legion"],
  },
  reaper: {
    name: "Reaper",
    from: "phantom",
    color: "#ef4444",
    body: "Swift & relentless",
    tagline: "Death itself runs at your side. Nothing outlasts you, nothing escapes you.",
    focus: "Running, HIIT, cycling, sports and bodyweight work",
    bonus: { AGI: 3 },
    bonusText: "3× XP on Agility training",
    titles: ["Death's Shadow", "Soul Taker", "Grim Blade", "Harvester", "Deathbringer", "Lord of Endings", "The Inevitable", "Death Incarnate"],
  },
  royal_guardian: {
    name: "Royal Guardian",
    from: "paladin",
    color: "#60a5fa",
    body: "Unbreakable & tireless",
    tagline: "Sworn shield of the crown. Your strength and stamina guard a kingdom.",
    focus: "Long steady sessions, rucking and hiking, circuits and functional strength",
    bonus: { STR: 2.25, VIT: 2.25 },
    bonusText: "2.25× XP on Strength and Vitality training",
    titles: ["Sworn Shield", "Queen's Guard", "King's Shield", "Royal Champion", "Lord Commander", "Shield of the Realm", "Guardian Eternal", "Living Fortress"],
  },
});

// A promoted class's original base class (or the class itself)
function baseClass(cls) {
  let c = cls;
  while (CLASSES[c].from) c = CLASSES[c].from;
  return c;
}

// 0 for a base class, 1 or 2 for promotions
function classTier(cls) {
  return CLASSES[cls].from ? classTier(CLASSES[cls].from) + 1 : 0;
}

for (const c of Object.keys(CLASSES)) {
  if (!CLASSES[c].from) continue;
  CLASSES[c].advanced = true;
  CLASSES[c].base = CLASSES[baseClass(c)].base;
  CLASSES[c].quests = CLASSES[baseClass(c)].quests;
}

// Level needed for the hero's next promotion (or null if there is none)
function nextPromotionLevel(cls = settings.cls) {
  return CLASSES[cls].promotion ? PROMOTION_LEVELS[classTier(cls) + 1] : null;
}

function canPromote() {
  const need = nextPromotionLevel();
  return need !== null && levelInfo(totalXp()).level >= need;
}

// Whether a class boosts every attribute equally (then no stat is highlighted)
function evenBonus(cls) {
  const b = CLASSES[cls].bonus;
  return Object.keys(STATS).every((stat) => b[stat] === b.STR);
}

// Palette letters used by the hero art (see art.js)
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
  // knight
  p: "#c084fc", t: "#7e22ce", T: "#581c87",
};

// Per-class recolors of the base sprites (promoted classes get finer armor)
const SPRITE_RECOLORS = {
  warrior: { b: "#3b82f6" }, // blue tunic rather than brown leather
  chieftain: { m: "#facc15", w: "#fef3c7", f: "#f5f5f4", b: "#991b1b" }, // gold helm, white wolf pelt
  master: { o: "#f8fafc", O: "#cbd5e1", r: "#facc15", y: "#fde047" }, // white robe, gold sash
  gladiator: { m: "#d97706", M: "#92400e", b: "#dc2626", B: "#7f1d1d" }, // bronze helm, red tunic
  phantom: { c: "#3b4a6e", C: "#94a8d8", g: "#67e8f9", a: "#a5f3fc", b: "#1e293b" }, // pale ghostly cloak, glowing eyes
  marauder: { m: "#3f3f46", w: "#b91c1c", f: "#1c1917", b: "#dc2626", h: "#9a3412" }, // black iron helm, blood-red horns
  reaper: { c: "#0a0a0a", C: "#262626", g: "#ef4444", a: "#e7e5e4", b: "#450a0a" }, // black shroud, red eyes, bone blades
  awakened: { o: "#c4b5fd", O: "#7c3aed", r: "#fde047", y: "#e0f2fe" }, // starlit violet robe
  centurion: { m: "#facc15", M: "#a16207", b: "#991b1b", B: "#eab308" }, // gold helm and shield, legion red
  royal_guardian: { a: "#e0e7ff", m: "#facc15", t: "#1d4ed8", T: "#1e3a8a", p: "#dc2626" }, // royal blue and gold
  paladin: { a: "#fefce8", m: "#facc15", t: "#f8fafc", T: "#f8fafc", p: "#fde047" }, // gold and white plate
};

function spriteColors(cls) {
  return { ...SPRITE_COLORS, ...(SPRITE_RECOLORS[cls] || {}) };
}

// ---------- Gear ----------

// Unlock rules: { level }, { badge } or { dungeon }. xp = permanent % bonus on new workouts.
const GEAR = [
  // Head: drawn on top of the head
  { id: "leaf_circlet", slot: "head", name: "Leaf Circlet", unlock: { level: 3 },
    colors: { g: "#4ade80", G: "#15803d" } },
  { id: "iron_crown", slot: "head", name: "Iron Crown", unlock: { level: 6 },
    colors: { m: "#cbd5e1" } },
  { id: "gold_crown", slot: "head", name: "Golden Crown", unlock: { level: 12 }, xp: 5,
    colors: { y: "#facc15", r: "#dc2626" } },
  { id: "halo", slot: "head", name: "Halo of Quests", unlock: { badge: "quests25" },
    colors: { y: "#fef08a" } },

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
    colors: { g: "#4ade80", k: "#052e16" } },
  { id: "cat", slot: "pet", name: "Tabby Cat", unlock: { badge: "streak3" },
    colors: { o: "#fb923c", k: "#111827" } },
  { id: "owl", slot: "pet", name: "Wise Owl", unlock: { badge: "trained10" },
    colors: { b: "#a16207", w: "#fef9c3", y: "#f97316" } },
  { id: "dragon", slot: "pet", name: "Baby Dragon", unlock: { level: 15 }, xp: 5,
    colors: { r: "#dc2626", k: "#111827", y: "#facc15" } },

  // Aura: a pixel glow behind the hero
  { id: "ember_aura", slot: "aura", name: "Ember Aura", unlock: { level: 7 },
    tones: ["#7c2d12", "#c2410c", "#f97316"] },
  { id: "frost_aura", slot: "aura", name: "Frost Aura", unlock: { badge: "marathon" },
    tones: ["#164e63", "#0e7490", "#22d3ee"] },
  { id: "void_aura", slot: "aura", name: "Void Aura", unlock: { level: 20 },
    tones: ["#2e1065", "#5b21b6", "#a78bfa"] },
  { id: "golden_aura", slot: "aura", name: "Golden Aura", unlock: { badge: "trained100" }, xp: 5,
    tones: ["#713f12", "#a16207", "#facc15"] },

  // Dungeon boss loot
  { id: "goblin_crown", slot: "head", name: "Goblin Crown", unlock: { dungeon: "cave" },
    colors: { g: "#65a30d", y: "#facc15" } },
  { id: "bone_cloak", slot: "back", name: "Bone Cloak", unlock: { dungeon: "crypt" },
    colors: { c: "#d6d3d1", h: "#57534e" } },
  { id: "sprout", slot: "pet", name: "Treant Sprout", unlock: { dungeon: "forest" },
    colors: { g: "#22c55e", b: "#92400e", k: "#111827" } },
  { id: "magma_aura", slot: "aura", name: "Magma Aura", unlock: { dungeon: "volcano" },
    tones: ["#450a0a", "#b91c1c", "#fbbf24"] },
  { id: "dragon_helm", slot: "head", name: "Dragonslayer Helm", unlock: { dungeon: "peak" }, xp: 5,
    colors: { r: "#b91c1c", y: "#facc15" } },
  { id: "frost_crown", slot: "head", name: "Frost Crown", unlock: { dungeon: "tundra" },
    colors: { m: "#bae6fd", r: "#0ea5e9" } },
  { id: "tidal_cape", slot: "back", name: "Tidal Cape", unlock: { dungeon: "temple" },
    colors: { c: "#0e7490", h: "#67e8f9" } },
  { id: "scarab", slot: "pet", name: "Golden Scarab", unlock: { dungeon: "ruins" } },
  { id: "shadow_aura", slot: "aura", name: "Shadow Aura", unlock: { dungeon: "shadow" },
    tones: ["#1e1b4b", "#4c1d95", "#8b5cf6"] },
  { id: "demon_horns", slot: "head", name: "Demon Horns", unlock: { dungeon: "abyss" }, xp: 5,
    colors: { r: "#450a0a", y: "#f97316" } },

  // High-level rewards
  { id: "starlight_aura", slot: "aura", name: "Starlight Aura", unlock: { level: 25 },
    tones: ["#1e3a8a", "#6366f1", "#e0e7ff"] },
  { id: "champion_cape", slot: "back", name: "Champion's Cape", unlock: { level: 30 }, xp: 5,
    colors: { c: "#facc15", h: "#b45309" } },
  { id: "wolf_pup", slot: "pet", name: "Wolf Pup", unlock: { badge: "slayer" } },
  { id: "celestial_crown", slot: "head", name: "Celestial Crown", unlock: { badge: "realm" }, xp: 5,
    colors: { y: "#fef9c3", r: "#a855f7" } },
  { id: "phoenix_chick", slot: "pet", name: "Phoenix Chick", unlock: { badge: "lvl30" }, xp: 5 },
];

const SLOTS = {
  head: "Headgear",
  back: "Cape",
  pet: "Companion",
  aura: "Aura",
};

const gearById = (id) => GEAR.find((g) => g.id === id);

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
  { id: "pr", icon: "📈", name: "Personal Best", desc: "Record your first challenge", check: (c) => [c.feats, 1] },
  { id: "skills5", icon: "📖", name: "Skilled", desc: "Learn 5 skills", check: (c) => [c.skills, 5] },
  { id: "mastery", icon: "🥋", name: "Grandmaster", desc: "Reach rank III in any skill", check: (c) => [c.maxRank, 3] },
  { id: "delver", icon: "🗝️", name: "Dungeon Delver", desc: "Clear your first dungeon", check: (c) => [c.clears, 1] },
  { id: "hunter", icon: "☠️", name: "Monster Hunter", desc: "Defeat 50 monsters", check: (c) => [c.kills, 50] },
  { id: "dragonslayer", icon: "🐉", name: "Dragonslayer", desc: "Conquer Dragon's Peak", check: (c) => [c.dragon, 1] },
  { id: "realm", icon: "🌌", name: "Realm Walker", desc: "Clear all 10 dungeons", check: (c) => [c.clears, 10] },
  { id: "slayer", icon: "🗡️", name: "Slayer", desc: "Defeat 200 monsters", check: (c) => [c.kills, 200] },
  { id: "rich", icon: "💰", name: "Treasure Hunter", desc: "Earn 1,000 gold", check: (c) => [c.gold, 1000] },
  { id: "shopper", icon: "🛒", name: "Good Customer", desc: "Buy 5 items in the shop", check: (c) => [c.purchases, 5] },
  { id: "bounty1", icon: "📯", name: "Bounty Hunter", desc: "Complete a weekly bounty", check: (c) => [c.bounties, 1] },
  { id: "bounty10", icon: "🏹", name: "Legendary Hunter", desc: "Complete 10 weekly bounties", check: (c) => [c.bounties, 10] },
  { id: "trained250", icon: "🗿", name: "Iron Devotion", desc: "Complete 250 workouts", check: (c) => [c.count, 250] },
  { id: "allchallenges", icon: "🎖", name: "Completionist", desc: "Record every challenge", check: (c) => [c.challengesDone, Object.keys(CHALLENGES).length] },
  { id: "lvl30", icon: "☄️", name: "Mythic", desc: "Reach level 30", check: (c) => [c.level, 30] },
];

const badgeById = (id) => BADGES.find((b) => b.id === id);

// Every badge grants a permanent buff while you hold it. Buffs of the same
// kind add up. XP buffs apply to workouts, quests and records logged after
// you earn them; battle buffs apply in every fight.
const BADGE_BUFFS = {
  first: { hp: 5 },
  trained10: { potions: 1 },
  trained50: { xp: 5 },
  trained100: { pow: 10 },
  streak3: { crit: 3 },
  streak7: { energy: 15 },
  streak30: { xp: 10 },
  hour: { hp: 10 },
  km5: { dodge: 2 },
  km10: { dodge: 3 },
  marathon: { regen: 1 },
  goal: { energyRegen: 5 },
  quests5: { questXp: 25 },
  quests25: { questXp: 50 },
  allstats: { allStats: 2 },
  explorer: { potionHeal: 10 },
  str: { xpSTR: 10 },
  agi: { xpAGI: 10 },
  wis: { xpWIS: 10 },
  vit: { xpVIT: 10 },
  lvl5: { pow: 5 },
  lvl10: { def: 10 },
  lvl20: { pow: 10, hp: 10 },
  pr: { prXp: 50 },
  skills5: { skillCost: 5 },
  mastery: { crit: 5 },
  delver: { bossDmg: 10 },
  hunter: { pow: 5 },
  dragonslayer: { xp: 10 },
  realm: { pow: 10 },
  slayer: { crit: 5 },
  rich: { potions: 1 },
  shopper: { potionHeal: 10 },
  bounty1: { questXp: 25 },
  bounty10: { xp: 10 },
  trained250: { def: 10 },
  allchallenges: { allStats: 3 },
  lvl30: { hp: 15, pow: 10 },
};

const BUFF_LABELS = {
  hp: (v) => `+${v}% max HP`,
  pow: (v) => `+${v}% battle power`,
  def: (v) => `+${v}% armor`,
  crit: (v) => `+${v}% crit chance`,
  dodge: (v) => `+${v}% dodge`,
  regen: (v) => `Heal ${v}% HP each battle turn`,
  energy: (v) => `Start battles with +${v} energy`,
  energyRegen: (v) => `+${v} energy each battle turn`,
  potions: (v) => `+${v} potion per dungeon`,
  potionHeal: (v) => `Potions heal +${v}% more`,
  skillCost: (v) => `Combat skills cost ${v} less energy`,
  bossDmg: (v) => `+${v}% damage to bosses`,
  allStats: (v) => `+${v} to every attribute`,
  xp: (v) => `+${v}% XP from workouts`,
  xpSTR: (v) => `+${v}% XP on Strength workouts`,
  xpAGI: (v) => `+${v}% XP on Agility workouts`,
  xpWIS: (v) => `+${v}% XP on Wisdom workouts`,
  xpVIT: (v) => `+${v}% XP on Vitality workouts`,
  questXp: (v) => `+${v}% daily quest XP`,
  prXp: (v) => `+${v}% personal record XP`,
};

function buffText(buff) {
  return Object.entries(buff)
    .map(([key, value]) => BUFF_LABELS[key](value))
    .join(", ");
}

// Sum of the buffs from every badge currently earned
function badgeBuffs(status = badgeStatus()) {
  const total = Object.fromEntries(Object.keys(BUFF_LABELS).map((key) => [key, 0]));
  for (const b of status) {
    if (!b.earned) continue;
    for (const [key, value] of Object.entries(BADGE_BUFFS[b.id] || {})) total[key] += value;
  }
  return total;
}

// ---------- Challenges & skills ----------

// Kinds: "lift" (weight x reps, ranked by estimated 1-rep max relative to
// bodyweight), "reps" (max reps), "run" (time for a distance, lower is better)
// and "hold" (time held, higher is better). Each challenge teaches 3 skill ranks.
const CHALLENGES = {
  bench: { name: "Bench Press", icon: "🏋️", kind: "lift", stat: "STR", tiers: [0.75, 1, 1.5],
    skills: ["Shield Push", "Iron Bulwark", "Titan's Press"] },
  squat: { name: "Squat", icon: "🦵", kind: "lift", stat: "STR", tiers: [1, 1.5, 2],
    skills: ["Stone Legs", "Earthshaker", "Mountain Stance"] },
  deadlift: { name: "Deadlift", icon: "🪨", kind: "lift", stat: "STR", tiers: [1.25, 1.75, 2.5],
    skills: ["Grave Lift", "Ogre Grip", "World Lifter"] },
  ohp: { name: "Overhead Press", icon: "🙌", kind: "lift", stat: "STR", tiers: [0.5, 0.75, 1],
    skills: ["Overhead Strike", "Sky Splitter", "Heaven's Hammer"] },
  pullups: { name: "Pull-ups", icon: "🧗", kind: "reps", stat: "STR", tiers: [5, 10, 20],
    skills: ["Wall Climber", "Rope Ascent", "Spider Grip"] },
  pushups: { name: "Push-ups", icon: "💪", kind: "reps", stat: "STR", tiers: [20, 40, 60],
    skills: ["Battle Ready", "Iron Arms", "Hundred Fists"] },
  mile: { name: "Mile Run", icon: "🏃", kind: "run", stat: "AGI", tiers: [600, 480, 360],
    skills: ["Quickstep", "Wind Walker", "Shadow Sprint"] },
  fivek: { name: "5K Run", icon: "🏁", kind: "run", stat: "AGI", tiers: [2100, 1680, 1320],
    skills: ["Pathfinder", "Swift Courier", "Phantom Stride"] },
  plank: { name: "Plank Hold", icon: "🧱", kind: "hold", stat: "VIT", tiers: [60, 120, 240],
    skills: ["Stone Skin", "Iron Core", "Unbreakable"] },
  situps: { name: "Sit-ups", icon: "🔁", kind: "reps", stat: "VIT", tiers: [25, 50, 80],
    skills: ["Iron Gut", "Core of Steel", "Granite Core"] },
  burpees: { name: "Burpees", icon: "⚡", kind: "reps", stat: "AGI", tiers: [15, 30, 50],
    skills: ["Spring Step", "Relentless", "Unstoppable Force"] },
  deadhang: { name: "Dead Hang", icon: "🪝", kind: "hold", stat: "STR", tiers: [30, 60, 120],
    skills: ["Firm Grip", "Iron Claws", "Dragon Grip"] },
  wallsit: { name: "Wall Sit", icon: "🪑", kind: "hold", stat: "VIT", tiers: [60, 120, 240],
    skills: ["Stone Seat", "Iron Legs", "Mountain Root"] },
  row2k: { name: "2K Row", icon: "🚣", kind: "run", stat: "AGI", tiers: [540, 480, 420],
    skills: ["Oarsman", "Tidebreaker", "Storm Rower"] },
  meditation: { name: "Meditation Sit", icon: "🪷", kind: "hold", stat: "WIS", tiers: [600, 1200, 2700],
    skills: ["Calm Mind", "Inner Sight", "Transcendence"] },
};

const RANKS = ["I", "II", "III"];
const RANK_XP = [100, 200, 400]; // one-time reward for learning each rank
const RANK_STATS = [3, 5, 8]; // attribute points each rank grants
const PR_XP = 30; // reward for beating your previous best

function e1rm(weight, reps) {
  return reps <= 1 ? weight : weight * (1 + reps / 30);
}

// Score used for personal records: absolute, so bodyweight changes don't matter
function prScore(f) {
  return CHALLENGES[f.challenge].kind === "lift" ? e1rm(f.weight, f.reps) : f.value;
}

// Score used for skill ranks: lifts are relative to bodyweight at the time
function rankScore(f) {
  return CHALLENGES[f.challenge].kind === "lift" ? e1rm(f.weight, f.reps) / f.bw : f.value;
}

function isBetter(chId, a, b) {
  return CHALLENGES[chId].kind === "run" ? a < b : a > b;
}

function rankFor(chId, score) {
  const ch = CHALLENGES[chId];
  return ch.tiers.filter((t) => (ch.kind === "run" ? score <= t : score >= t)).length;
}

// ---------- Storage ----------

const STORAGE_KEY = "fittrack.workouts";
const SETTINGS_KEY = "fittrack.settings";
const QUESTS_KEY = "fittrack.quests";
const UNLOCKS_KEY = "fittrack.unlocks";
const FEATS_KEY = "fittrack.feats";
const BOUNTIES_KEY = "fittrack.bounties";
const SHOP_KEY = "fittrack.shop";
const DEFAULT_SETTINGS = { goal: 150, weight: 70, units: "kg", cls: null, heroName: "", gear: {} };

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
// Challenge results: { id, challenge, date, weight (kg), reps, value, bw, xp }
// (xp is the personal-record bonus; skill-rank XP is derived from ranks held)
let feats = load(FEATS_KEY, []);
// Completed weekly bounties: { week, id, xp }
let bountyAwards = load(BOUNTIES_KEY, []);
// Gold spent and battle items owned
let shop = { spent: 0, bought: 0, items: {}, ...load(SHOP_KEY, {}) };
// Badges and gear the player has already been told about
let seen = { badges: [], gear: [], ...load(UNLOCKS_KEY, {}) };

function persist() {
  save(STORAGE_KEY, workouts);
  save(QUESTS_KEY, questAwards);
  save(FEATS_KEY, feats);
  save(BOUNTIES_KEY, bountyAwards);
}

function saveShop() {
  save(SHOP_KEY, shop);
}

// ---------- Units ----------

const LB_PER_KG = 2.20462;

function toDisplayWeight(kg) {
  return settings.units === "lb" ? Math.round(kg * LB_PER_KG) : Math.round(kg * 10) / 10;
}

function fromDisplayWeight(value) {
  return settings.units === "lb" ? value / LB_PER_KG : value;
}

function fmtWeight(kg) {
  return `${toDisplayWeight(kg)} ${settings.units}`;
}

function fmtTime(seconds) {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
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

// Gear plus badge XP buffs, in percent
function xpBonus(type) {
  const buffs = badgeBuffs();
  return gearBonus() + buffs.xp + buffs[`xp${(ACTIVITIES[type] || ACTIVITIES.other).stat}`];
}

function workoutXp(type, minutes, cls, bonusPct = xpBonus(type)) {
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
  return sumBy(workouts, "xp") + sumBy(questAwards, "xp") + sumBy(bountyAwards, "xp") + sumBy(feats, "xp") + skillXp();
}

// ---------- Gold ----------
// Gold is earned from training, quests, bounties and dungeon monsters, and
// spent in the shop. Like XP, deleting a workout takes its gold back.

const GOLD_PER_QUEST = 25;
const GOLD_PER_BOUNTY = 100;

function workoutGold(minutes) {
  return Math.floor(minutes / 2);
}

function goldEarned() {
  return (
    workouts.reduce((total, w) => total + workoutGold(w.duration), 0) +
    questAwards.length * GOLD_PER_QUEST +
    bountyAwards.length * GOLD_PER_BOUNTY +
    (dungeonProgress().gold || 0)
  );
}

function goldBalance() {
  return Math.max(0, goldEarned() - shop.spent);
}

function skillXp() {
  return learnedSkills().reduce((total, s) => total + RANK_XP.slice(0, s.rank).reduce((a, b) => a + b, 0), 0);
}

function featsFor(chId, list = feats) {
  return list.filter((f) => f.challenge === chId);
}

function bestFeat(chId, list = feats) {
  return featsFor(chId, list).reduce(
    (best, f) => (!best || isBetter(chId, prScore(f), prScore(best)) ? f : best),
    null
  );
}

function skillRank(chId, list = feats) {
  return Math.max(0, ...featsFor(chId, list).map((f) => rankFor(chId, rankScore(f))));
}

function learnedSkills() {
  return Object.keys(CHALLENGES)
    .map((chId) => ({ chId, rank: skillRank(chId) }))
    .filter((s) => s.rank > 0);
}

function featText(f) {
  const ch = CHALLENGES[f.challenge];
  if (ch.kind === "lift") {
    const est = f.reps > 1 ? ` (est. max ${fmtWeight(e1rm(f.weight, f.reps))})` : "";
    return `${fmtWeight(f.weight)} × ${f.reps}${est}`;
  }
  return ch.kind === "reps" ? `${f.value} reps` : fmtTime(f.value);
}

function tierText(chId, i) {
  const ch = CHALLENGES[chId];
  const t = ch.tiers[i];
  if (ch.kind === "lift") return `Max ${t}× bodyweight (${fmtWeight(t * settings.weight)})`;
  if (ch.kind === "reps") return `${t} reps in one set`;
  if (ch.kind === "run") return `Finish in ${fmtTime(t)} or less`;
  return `Hold for ${fmtTime(t)}`;
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

function questReward(quest) {
  return Math.round(quest.xp * (1 + badgeBuffs().questXp / 100));
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
    const award = { date: key, id: quest.id, xp: questReward(quest) };
    questAwards.push(award);
    return { ...quest, xp: award.xp };
  }
  if (!met && award) questAwards = questAwards.filter((a) => a !== award);
  return null;
}

// ---------- Weekly bounties ----------
// One bounty per week (shared by all classes) for a big XP and gold reward.

const BOUNTY_XP = 200;
const BOUNTIES = [
  { id: "wb1", name: "Iron Week", desc: "Train 150 minutes this week", minutes: 150 },
  { id: "wb2", name: "Five Battles", desc: "Complete 5 workouts this week", sessions: 5 },
  { id: "wb3", name: "Four Fronts", desc: "Train on 4 different days this week", days: 4 },
  { id: "wb4", name: "The Long Road", desc: "Cover 15 km this week", km: 15 },
  { id: "wb5", name: "Well Rounded", desc: "Train all four attributes this week", stats: 4 },
  { id: "wb6", name: "Marathon Session", desc: "Do one 75-minute session this week", single: 75 },
  { id: "wb7", name: "Strength Camp", desc: "Train Strength for 90 minutes this week", stat: "STR", minutes: 90 },
  { id: "wb8", name: "Endurance Trial", desc: "Train Vitality for 120 minutes this week", stat: "VIT", minutes: 120 },
];

function weekOf(dateKey) {
  return toKey(startOfWeek(fromKey(dateKey)));
}

function bountyFor(weekKey) {
  const weekNumber = Math.round(fromKey(weekKey).getTime() / (7 * 86400000));
  return BOUNTIES[((weekNumber % BOUNTIES.length) + BOUNTIES.length) % BOUNTIES.length];
}

function bountyProgress(bounty, weekKey) {
  const list = workouts.filter((w) => weekOf(w.date) === weekKey && (!bounty.stat || activityOf(w).stat === bounty.stat));
  if (bounty.sessions) return { cur: list.length, target: bounty.sessions, unit: "workouts" };
  if (bounty.days) return { cur: new Set(list.map((w) => w.date)).size, target: bounty.days, unit: "days" };
  if (bounty.km) return { cur: Math.round(sumBy(list, "distance") * 10) / 10, target: bounty.km, unit: "km" };
  if (bounty.stats) return { cur: new Set(list.map((w) => activityOf(w).stat)).size, target: bounty.stats, unit: "attributes" };
  if (bounty.single) return { cur: Math.max(0, ...list.map((w) => w.duration)), target: bounty.single, unit: "min" };
  return { cur: sumBy(list, "duration"), target: bounty.minutes, unit: "min" };
}

function bountyReward() {
  return Math.round(BOUNTY_XP * (1 + badgeBuffs().questXp / 100));
}

// Like daily quests: earned only during its week, revoked if workouts are deleted
function syncBounty(weekKey) {
  const award = bountyAwards.find((a) => a.week === weekKey);
  const isCurrent = weekKey === weekOf(toKey(new Date()));
  const bounty = award ? BOUNTIES.find((b) => b.id === award.id) : isCurrent ? bountyFor(weekKey) : null;
  if (!bounty) return null;
  const p = bountyProgress(bounty, weekKey);
  const met = p.cur >= p.target;
  if (met && !award) {
    const xp = bountyReward();
    bountyAwards.push({ week: weekKey, id: bounty.id, xp });
    return { ...bounty, xp };
  }
  if (!met && award) bountyAwards = bountyAwards.filter((a) => a !== award);
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
    feats: feats.length,
    skills: learnedSkills().reduce((total, s) => total + s.rank, 0),
    maxRank: Math.max(0, ...learnedSkills().map((s) => s.rank)),
    clears: Object.keys(dungeonProgress().cleared).length,
    gold: goldEarned(),
    purchases: shop.bought,
    bounties: bountyAwards.length,
    challengesDone: Object.keys(CHALLENGES).filter((id) => featsFor(id).length).length,
    kills: dungeonProgress().kills,
    dragon: dungeonProgress().cleared.peak ? 1 : 0,
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
  const cleared = dungeonProgress().cleared;
  return GEAR.filter((g) =>
    g.unlock.level ? level >= g.unlock.level : g.unlock.dungeon ? Boolean(cleared[g.unlock.dungeon]) : earned.has(g.unlock.badge)
  );
}

function unlockText(g) {
  if (g.unlock.level) return `Reach LV ${g.unlock.level}`;
  if (g.unlock.dungeon) return `Clear ${DUNGEONS.find((d) => d.id === g.unlock.dungeon).name}`;
  return `Earn "${badgeById(g.unlock.badge).name}"`;
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

// Attributes: class base + 1 point per 15 minutes trained + skill rank points
function heroAttributes() {
  const values = {};
  for (const stat of Object.keys(STATS)) {
    const minutes = sumBy(workouts.filter((w) => activityOf(w).stat === stat), "duration");
    values[stat] = CLASSES[settings.cls].base[stat] + Math.floor(minutes / 15);
  }
  for (const { chId, rank } of learnedSkills()) {
    values[CHALLENGES[chId].stat] += RANK_STATS.slice(0, rank).reduce((a, b) => a + b, 0);
  }
  const allStats = badgeBuffs().allStats;
  for (const stat of Object.keys(values)) values[stat] += allStats;
  return values;
}

function pips(rank) {
  return RANKS.map((_, i) => `<span class="pip ${i < rank ? "on" : ""}"></span>`).join("");
}

function featItem(f) {
  const ch = CHALLENGES[f.challenge];
  return `
    <li class="workout">
      <div class="workout-icon" aria-hidden="true">${ch.icon}</div>
      <div class="workout-info">
        <div class="workout-name">${ch.name}${f.xp ? `<span class="workout-xp">+${f.xp} XP</span>` : ""}</div>
        <div class="workout-meta">🏆 ${featText(f)}</div>
      </div>
      <button class="delete-btn" data-feat="${f.id}" aria-label="Delete ${ch.name} record">&#10005;</button>
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
  $("header-gold").textContent = `🪙 ${goldBalance()}`;
  $("xp-text").textContent = `${info.into} / ${info.need} XP`;
  $("xp-fill").style.width = `${(info.into / info.need) * 100}%`;

  renderPromotion(info.level);

  // Daily quest
  const award = questAwards.find((a) => a.date === todayKey);
  const quest = award ? findQuest(award.id) : questFor(todayKey, settings.cls);
  const p = questProgress(quest, todays);
  const done = p.cur >= p.target;
  $("quest-card").classList.toggle("done", done);
  $("quest-name").textContent = quest.name;
  $("quest-desc").textContent = quest.desc;
  $("quest-reward").textContent = done ? "Complete!" : `+${questReward(quest)} XP`;
  $("quest-fill").style.width = `${Math.min(p.cur / p.target, 1) * 100}%`;
  $("quest-progress").textContent = done
    ? `Reward claimed: +${award ? award.xp : questReward(quest)} XP, +${GOLD_PER_QUEST} gold`
    : `${p.cur} / ${p.target} ${p.unit}`;

  // Weekly bounty
  const weekKey = weekOf(todayKey);
  const bountyAward = bountyAwards.find((a) => a.week === weekKey);
  const bounty = bountyAward ? BOUNTIES.find((b) => b.id === bountyAward.id) : bountyFor(weekKey);
  const bp = bountyProgress(bounty, weekKey);
  const bountyDone = bp.cur >= bp.target;
  const daysLeft = 7 - ((now.getDay() + 6) % 7);
  $("bounty-card").classList.toggle("done", bountyDone);
  $("bounty-name").textContent = bounty.name;
  $("bounty-desc").textContent = bounty.desc;
  $("bounty-reward").textContent = bountyDone ? "Complete!" : `+${bountyReward()} XP · ${GOLD_PER_BOUNTY}🪙`;
  $("bounty-fill").style.width = `${Math.min(bp.cur / bp.target, 1) * 100}%`;
  $("bounty-progress").textContent = bountyDone
    ? `Bounty claimed: +${bountyAward ? bountyAward.xp : bountyReward()} XP, +${GOLD_PER_BOUNTY} gold`
    : `${bp.cur} / ${bp.target} ${bp.unit} · ${daysLeft} day${daysLeft > 1 ? "s" : ""} left`;

  // Today
  $("today-minutes").textContent = sumBy(todays, "duration");
  $("today-calories").textContent = sumBy(todays, "calories");
  $("streak").textContent = currentStreak();

  const values = heroAttributes();
  const skills = learnedSkills();
  $("skill-list").innerHTML = skills.length
    ? skills
        .map(({ chId, rank }) => {
          const ch = CHALLENGES[chId];
          const points = RANK_STATS.slice(0, rank).reduce((a, b) => a + b, 0);
          return `
            <li class="skill">
              <span class="workout-icon" aria-hidden="true">${ch.icon}</span>
              <span class="workout-info">
                <span class="workout-name">${ch.skills[rank - 1]}</span>
                <span class="workout-meta">${ch.name} · Rank ${RANKS[rank - 1]} · +${points} ${ch.stat}</span>
              </span>
              <span class="pips">${pips(rank)}</span>
            </li>`;
        })
        .join("")
    : `<li class="empty-state">Complete challenges in <strong>Train</strong> to learn skills.</li>`;
  const maxValue = Math.max(20, ...Object.values(values));
  const even = evenBonus(settings.cls);
  $("attributes").innerHTML = Object.entries(STATS)
    .map(([stat, s]) => {
      const bonus = !even && cls.bonus[stat] > 1;
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

// Shows the upcoming (or ready) class promotion for base classes
function renderPromotion(level) {
  const card = $("promotion-card");
  const promoId = CLASSES[settings.cls].promotion;
  card.hidden = !promoId;
  if (!promoId) return;
  const promo = CLASSES[promoId];
  const need = nextPromotionLevel();
  const ready = level >= need;
  const ultimate = ULTIMATE_SKILLS[promoId];
  card.classList.toggle("ready", ready);
  card.innerHTML = `
    <div class="quest-header pixel"><span>⚜ ${classTier(promoId) === 2 ? "Second" : "Class"} Promotion</span><span>${ready ? "Ready!" : `LV ${level} / ${need}`}</span></div>
    <div class="promo-sprites">
      <div class="portrait">${heroSvg(settings.cls, settings.gear, CLASSES[settings.cls].name)}</div>
      <span class="promo-arrow pixel" aria-hidden="true">➜</span>
      <div class="portrait promo-target" style="--c:${promo.color}">${heroSvg(promoId, settings.gear, promo.name)}</div>
    </div>
    <div class="quest-name pixel" style="color:${promo.color}">${promo.name}</div>
    <p class="quest-desc">${promo.tagline}</p>
    <ul class="promo-perks">
      <li>📈 ${promo.bonusText}</li>
      <li>🛡️ ${CLASS_PASSIVES[promoId]}</li>
      <li>${ultimate.icon} Ultimate skill: <strong>${ultimate.name}</strong>. ${ultimate.desc}</li>
      <li>✨ New titles and upgraded armor</li>
    </ul>
    <button type="button" class="btn pixel" id="promote-btn" ${ready ? "" : "disabled"}>
      ${ready ? `Promote to ${promo.name}` : `Reach LV ${need} to promote`}
    </button>`;
}

function promote() {
  if (!canPromote()) return;
  const from = CLASSES[settings.cls];
  settings.cls = from.promotion;
  save(SETTINGS_KEY, settings);
  const promo = CLASSES[settings.cls];
  renderActivities();
  render();
  window.scrollTo(0, 0);
  popup(
    heroSvg(settings.cls, settings.gear, promo.name),
    `You are now a ${promo.name}!`,
    `Your ${from.name} has been promoted. ${promo.bonusText}, a stronger passive, and the ultimate skill ${ULTIMATE_SKILLS[settings.cls].name}.`
  );
}

document.getElementById("promotion-card").addEventListener("click", (event) => {
  if (event.target.closest("#promote-btn")) promote();
});

function renderJournal() {
  $("all-time").innerHTML = `
    <div class="stat"><span class="stat-value pixel">${workouts.length}</span><span class="stat-label">battles</span></div>
    <div class="stat"><span class="stat-value pixel">${Math.round(sumBy(workouts, "duration") / 60)}</span><span class="stat-label">hours</span></div>
    <div class="stat"><span class="stat-value pixel">${totalXp().toLocaleString()}</span><span class="stat-label">total XP</span></div>`;

  if (!workouts.length && !feats.length) {
    $("history-list").innerHTML = `<div class="panel empty-state">Your legend begins with your first workout.</div>`;
    return;
  }

  const byDay = {};
  for (const w of workouts) (byDay[w.date] ||= []).push(w);
  for (const f of feats) (byDay[f.date] ||= []).push(f);
  $("history-list").innerHTML = Object.keys(byDay)
    .sort()
    .reverse()
    .map((key) => {
      const award = questAwards.find((a) => a.date === key);
      const quest = award && findQuest(award.id);
      return `
      <div class="history-day">
        <h3>${formatDay(key)} · ${sumBy(byDay[key], "duration")} min${quest ? ` · ✔ ${quest.name}` : ""}</h3>
        <div class="panel"><ul class="workout-list">${byDay[key]
          .map((item) => (item.challenge ? featItem(item) : workoutItem(item)))
          .join("")}</ul></div>
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
  const even = evenBonus(settings.cls);
  $("activity-grid").innerHTML = entries
    .map(([value, a]) => {
      const m = multiplier(settings.cls, a.stat);
      const badge = m > 1 && !even ? `<span class="badge">${m}× XP</span>` : "";
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

  const active = Object.entries(badgeBuffs(status)).filter(([, value]) => value > 0);
  $("buff-list").innerHTML = active.length
    ? active.map(([key, value]) => `<li>${BUFF_LABELS[key](value)}</li>`).join("")
    : `<li class="empty-state">Earn badges to gain permanent buffs.</li>`;

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
          <span class="achievement-buff">${buffText(BADGE_BUFFS[b.id])}</span>
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
  renderChallenges();
  renderFight();
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
    .filter(([, c]) => !c.advanced)
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
  pickedClass = settings.cls && baseClass(settings.cls);
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
  const before = settings.cls;
  // Re-picking your own base class keeps a promotion
  if (!before || baseClass(before) !== pickedClass) settings.cls = pickedClass;
  const changed = before && before !== settings.cls;
  settings.heroName = $("hero-name").value.trim().slice(0, 20);
  save(SETTINGS_KEY, settings);
  $("class-select").hidden = true;
  renderActivities();
  resetForm();
  resetFeatForm();
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
  const bountyDone = syncBounty(weekOf(form.date.value));
  persist();
  const unlocks = syncUnlocks();
  render();
  resetForm();
  status.textContent = "";
  showScreen("hero");
  toast(`+${xp} XP · +${workoutGold(duration)} 🪙`);

  if (completed) {
    popup("📜", "Quest Complete!", `${completed.name}: +${completed.xp} bonus XP and ${GOLD_PER_QUEST} gold`);
  }
  if (bountyDone) {
    popup("📯", "Bounty Complete!", `${bountyDone.name}: +${bountyDone.xp} XP and ${GOLD_PER_BOUNTY} gold`);
  }
  celebrate(levelBefore, unlocks);
});

// Level-up, badge and gear popups shared by workouts and challenges
function celebrate(levelBefore, unlocks) {
  const levelAfter = levelInfo(totalXp()).level;
  if (levelAfter > levelBefore) {
    const newTitle = titleFor(settings.cls, levelAfter);
    const titleChanged = newTitle !== titleFor(settings.cls, levelBefore);
    popup(
      heroSvg(settings.cls, settings.gear, CLASSES[settings.cls].name),
      `Level Up! LV ${levelAfter}`,
      titleChanged ? `New title unlocked: ${newTitle}!` : "Your power grows. Keep training!"
    );
    const promoId = CLASSES[settings.cls].promotion;
    const need = nextPromotionLevel();
    if (promoId && levelBefore < need && levelAfter >= need) {
      popup("⚜️", "Promotion Available!", `Your ${CLASSES[settings.cls].name} can now become a ${CLASSES[promoId].name}. Promote on the Hero screen.`);
    }
  }
  for (const b of unlocks.badges) {
    popup(b.icon, "Badge Earned!", `${b.name}: ${b.desc}. Permanent buff: ${buffText(BADGE_BUFFS[b.id])}!`);
  }
  for (const g of unlocks.gear) {
    popup(
      heroSvg(settings.cls, { [g.slot]: g.id }, g.name),
      "New Gear!",
      `${g.name} unlocked${g.xp ? ` (+${g.xp}% XP)` : ""}. Equip it in Loot.`
    );
  }
}

// ---------- Challenges ----------

const featForm = $("feat-form");

function showMode(mode) {
  document.querySelectorAll(".mode").forEach((b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
    b.setAttribute("aria-selected", b.dataset.mode === mode);
  });
  form.hidden = mode !== "workout";
  featForm.hidden = mode !== "challenge";
}

document.querySelectorAll(".mode").forEach((b) => b.addEventListener("click", () => showMode(b.dataset.mode)));

function selectedChallenge() {
  return $("challenge-grid").dataset.value || "";
}

function renderChallenges() {
  const selected = selectedChallenge();
  $("challenge-grid").innerHTML = Object.entries(CHALLENGES)
    .map(([id, ch]) => {
      const best = bestFeat(id);
      return `
        <button type="button" class="activity ${id === selected ? "selected" : ""}" data-value="${id}"
          role="radio" aria-checked="${id === selected}">
          ${combatSkillFor(settings.cls, id) ? `<span class="badge">⚔ SKILL</span>` : ""}
          <span class="activity-icon" aria-hidden="true">${ch.icon}</span>
          <span>${ch.name}</span>
          <span class="pips">${pips(skillRank(id))}</span>
          <span class="activity-stat">${best ? featText(best).replace(/ \(.*\)/, "") : "No record"}</span>
        </button>`;
    })
    .join("");

  const ch = CHALLENGES[selected];
  $("challenge-info").hidden = !ch;
  ["lift", "reps", "time"].forEach((k) => ($(`fields-${k}`).hidden = true));
  if (!ch) return;
  $(`fields-${ch.kind === "run" || ch.kind === "hold" ? "time" : ch.kind}`).hidden = false;
  $("weight-unit").textContent = settings.units;

  const rank = skillRank(selected);
  const best = bestFeat(selected);
  $("challenge-info").innerHTML = `
    <div class="pb pixel">Personal best: <span>${best ? featText(best) : "none yet"}</span></div>
    <ol class="skill-ladder">
      ${ch.skills
        .map(
          (name, i) => `
          <li class="${i < rank ? "learned" : ""}">
            <span class="rank pixel">${RANKS[i]}</span>
            <span class="ladder-text">
              <strong>${i < rank ? "✔ " : ""}${name}</strong>
              <span>${tierText(selected, i)} · +${RANK_STATS[i]} ${ch.stat} · +${RANK_XP[i]} XP</span>
            </span>
          </li>`
        )
        .join("")}
    </ol>
    ${(() => {
      const cs = combatSkillFor(settings.cls, selected);
      return cs
        ? `<p class="combat-unlock">⚔ ${CLASSES[settings.cls].name} combat skill: <strong>${cs.icon} ${cs.name}</strong>. ${cs.desc}. Unlocks at rank I and grows stronger with each rank.</p>`
        : "";
    })()}
    ${ch.kind === "lift" ? `<p class="hint">Lift ranks compare your estimated one-rep max to your body weight (set in Camp).</p>` : ""}`;
}

$("challenge-grid").addEventListener("click", (event) => {
  const tile = event.target.closest(".activity");
  if (!tile) return;
  $("challenge-grid").dataset.value = tile.dataset.value;
  renderChallenges();
});

function resetFeatForm() {
  featForm.reset();
  featForm["feat-date"].value = toKey(new Date());
  featForm["feat-date"].max = toKey(new Date());
  renderChallenges();
}

featForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = $("feat-status");
  status.className = "form-status";
  const fail = (msg) => {
    status.textContent = msg;
    status.classList.add("error");
  };

  const chId = selectedChallenge();
  const ch = CHALLENGES[chId];
  if (!ch) return fail("Choose a challenge.");
  const date = featForm["feat-date"].value;
  if (!date) return fail("Choose a date.");

  const feat = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), challenge: chId, date, bw: settings.weight };
  if (ch.kind === "lift") {
    const weight = fromDisplayWeight(Number(featForm["lift-weight"].value));
    const reps = Math.round(Number(featForm["lift-reps"].value));
    if (!(weight > 0 && weight <= 600)) return fail("Enter the weight you lifted.");
    if (!(reps >= 1 && reps <= 30)) return fail("Reps must be between 1 and 30.");
    feat.weight = Math.round(weight * 100) / 100;
    feat.reps = reps;
    feat.value = feat.weight;
  } else if (ch.kind === "reps") {
    const reps = Math.round(Number(featForm["max-reps"].value));
    if (!(reps >= 1 && reps <= 1000)) return fail("Enter how many reps you did.");
    feat.value = reps;
  } else {
    const seconds = Math.round(Number(featForm["time-min"].value || 0) * 60 + Number(featForm["time-sec"].value || 0));
    if (!(seconds > 0 && seconds < 24 * 3600)) return fail("Enter a time.");
    if (Number(featForm["time-sec"].value) >= 60) return fail("Seconds must be under 60.");
    feat.value = seconds;
  }

  const levelBefore = levelInfo(totalXp()).level;
  const previous = bestFeat(chId);
  const isPR = !previous || isBetter(chId, prScore(feat), prScore(previous));
  const rankBefore = skillRank(chId);
  const rankAfter = Math.max(rankBefore, rankFor(chId, rankScore(feat)));
  feat.xp = isPR ? Math.round(PR_XP * (1 + badgeBuffs().prXp / 100)) : 0;

  feats.push(feat);
  persist();
  const unlocks = syncUnlocks();
  render();
  resetFeatForm();
  $("challenge-grid").dataset.value = chId;
  renderChallenges();
  status.textContent = "";

  if (isPR) {
    popup(
      ch.icon,
      previous ? "New Personal Record!" : "Record Set!",
      `${ch.name}: ${featText(feat)}${previous ? ` (old best: ${featText(previous)})` : ""}. +${feat.xp} XP`
    );
  } else {
    toast(`Logged. Best is still ${featText(previous).replace(/ \(.*\)/, "")}`);
  }
  for (let i = rankBefore; i < rankAfter; i++) {
    popup(
      ch.icon,
      "Skill Learned!",
      `${ch.skills[i]} (Rank ${RANKS[i]}): +${RANK_STATS[i]} ${ch.stat}, +${RANK_XP[i]} XP`
    );
  }
  celebrate(levelBefore, unlocks);
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
  if (btn.dataset.feat) {
    if (!confirm("Delete this record? Its XP, and any skill it earned, will be removed.")) return;
    feats = feats.filter((f) => f.id !== btn.dataset.feat);
    persist();
    syncUnlocks();
    render();
    return;
  }
  if (!confirm("Delete this workout? Its XP will be removed.")) return;
  const removed = workouts.find((w) => w.id === btn.dataset.id);
  workouts = workouts.filter((w) => w !== removed);
  if (removed) {
    syncQuest(removed.date);
    syncBounty(weekOf(removed.date));
  }
  persist();
  syncUnlocks();
  render();
});

// ---------- Settings ----------

const settingsForm = $("settings-form");
settingsForm.goal.value = settings.goal;
settingsForm.units.value = settings.units;

function showWeightSetting() {
  $("weight-label").textContent = `Body weight (${settings.units})`;
  settingsForm.weight.value = toDisplayWeight(settings.weight);
}
showWeightSetting();

// Switching units converts the number already in the box
settingsForm.units.addEventListener("change", () => {
  const kg = fromDisplayWeight(Number(settingsForm.weight.value));
  settings.units = settingsForm.units.value;
  save(SETTINGS_KEY, settings);
  if (kg > 0) settingsForm.weight.value = toDisplayWeight(kg);
  $("weight-label").textContent = `Body weight (${settings.units})`;
  render();
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = $("settings-status");
  const goal = Math.round(Number(settingsForm.goal.value));
  const weight = Math.round(fromDisplayWeight(Number(settingsForm.weight.value)) * 10) / 10;
  status.className = "form-status";

  if (!(goal >= 10 && goal <= 5000) || !(weight >= 20 && weight <= 300)) {
    status.textContent = `Goal must be 10–5000 min and weight ${fmtWeight(20)}–${fmtWeight(300)}.`;
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
  const data = { settings, workouts, questAwards, bountyAwards, feats, shop, dungeons: dungeonProgress(), unlocks: seen };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fitquest-${toKey(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

$("clear-btn").addEventListener("click", () => {
  if (!confirm("Delete ALL workouts, records, XP, gold, items, levels, skills, badges, gear and dungeon progress? This cannot be undone.")) return;
  workouts = [];
  questAwards = [];
  bountyAwards = [];
  feats = [];
  shop = { spent: 0, bought: 0, items: {} };
  persist();
  saveShop();
  resetDungeons();
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

// Chieftain used to be the Barbarian's first promotion; below level 20 it is now Marauder
if (settings.cls === "chieftain" && levelInfo(totalXp()).level < PROMOTION_LEVELS[2]) {
  settings.cls = "marauder";
  save(SETTINGS_KEY, settings);
}

// Catch up quietly on anything unlocked before this version or while away
syncUnlocks();

if (settings.cls) {
  renderActivities();
  resetForm();
  resetFeatForm();
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
