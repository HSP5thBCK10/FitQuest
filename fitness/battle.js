// ---------- Dungeons & turn-based battles ----------
// Loaded before app.js. It only uses app.js globals (settings, load, save,
// skillRank, heroAttributes, ...) inside functions, which run after both load.

// Monster abilities
//   enrage:  +50% damage once below 40% HP
//   drain:   heals for half the damage it deals
//   armored: double armor
//   evasive: 20% chance to dodge each of your hits
//   poison / burn: 35% chance per hit to deal damage over 3 turns
//   regen:   heals 2.5% of its max HP every turn
//   curse:   35% chance per hit to cut your damage by 25% for 2 turns
//   double:  attacks twice per turn at 55% damage each
const MONSTERS = {
  rat: { name: "Giant Rat" },
  goblin: { name: "Goblin", ability: "enrage" },
  goblin_king: { name: "Goblin King", ability: "enrage", boss: true },
  bat: { name: "Vampire Bat", ability: "drain" },
  skeleton: { name: "Skeleton", ability: "armored" },
  lich: { name: "Lich", ability: "drain", boss: true },
  wolf: { name: "Dire Wolf", ability: "evasive" },
  spider: { name: "Giant Spider", ability: "poison" },
  treant: { name: "Elder Treant", ability: "armored", boss: true },
  imp: { name: "Fire Imp", ability: "evasive" },
  golem: { name: "Lava Golem", ability: "armored" },
  drake: { name: "Fire Drake", ability: "burn", boss: true },
  wyvern: { name: "Wyvern", ability: "evasive" },
  ogre: { name: "Ogre", ability: "enrage" },
  dragon: { name: "Ancient Dragon", ability: "burn", boss: true },
  sprite: { name: "Frost Sprite", ability: "evasive" },
  yeti: { name: "Yeti", ability: "enrage" },
  frost_giant: { name: "Frost Giant", ability: "armored", boss: true },
  fishman: { name: "Deep One", ability: "drain" },
  crab: { name: "Giant Crab", ability: "armored" },
  kraken: { name: "Kraken", ability: "double", boss: true },
  scorpion: { name: "Giant Scorpion", ability: "poison" },
  mummy: { name: "Mummy", ability: "regen" },
  pharaoh: { name: "Cursed Pharaoh", ability: "curse", boss: true },
  shade: { name: "Shade", ability: "evasive" },
  nightmare: { name: "Nightmare", ability: "curse" },
  shadow_lord: { name: "Shadow Lord", ability: "drain", boss: true },
  gargoyle: { name: "Gargoyle", ability: "armored" },
  demon: { name: "Demon", ability: "burn" },
  demon_king: { name: "Demon King", ability: "double", boss: true },
};

// Each dungeon has 3 floors; the boss on the last floor is one level higher
const DUNGEONS = [
  { id: "cave", name: "Goblin Cave", icon: "🕳️", level: 1, floors: ["rat", "goblin", "goblin_king"] },
  { id: "crypt", name: "Haunted Crypt", icon: "⚰️", level: 4, floors: ["bat", "skeleton", "lich"] },
  { id: "forest", name: "Spider Forest", icon: "🌲", level: 8, floors: ["wolf", "spider", "treant"] },
  { id: "volcano", name: "Volcano Depths", icon: "🌋", level: 12, floors: ["imp", "golem", "drake"] },
  { id: "peak", name: "Dragon's Peak", icon: "🏔️", level: 17, floors: ["wyvern", "ogre", "dragon"] },
  { id: "tundra", name: "Frozen Tundra", icon: "❄️", level: 20, floors: ["sprite", "yeti", "frost_giant"] },
  { id: "temple", name: "Sunken Temple", icon: "🌊", level: 23, floors: ["fishman", "crab", "kraken"] },
  { id: "ruins", name: "Desert Ruins", icon: "🏜️", level: 26, floors: ["scorpion", "mummy", "pharaoh"] },
  { id: "shadow", name: "Shadow Realm", icon: "🌑", level: 30, floors: ["shade", "nightmare", "shadow_lord"] },
  { id: "abyss", name: "The Abyss", icon: "🔥", level: 35, floors: ["gargoyle", "demon", "demon_king"] },
];

// Combat skills are unique to each class. Each is taught by a challenge:
// reaching rank I unlocks it, and every further rank makes it stronger.
const CLASS_SKILLS = {
  barbarian: [
    { id: "crushing_blow", name: "Crushing Blow", icon: "🔨", challenge: "bench", cost: 30,
      desc: "A brutal strike for 180% damage", effect: { damage: 1.8 } },
    { id: "earthquake", name: "Earthquake", icon: "🌋", challenge: "squat", cost: 40,
      desc: "140% damage with a 50% chance to stun", effect: { damage: 1.4, stun: 0.5 } },
    { id: "rampage", name: "Rampage", icon: "💢", challenge: "deadlift", cost: 50,
      desc: "260% damage, but costs 8% of your max HP", effect: { damage: 2.6, recoil: 0.08 } },
    { id: "war_cry", name: "War Cry", icon: "📯", challenge: "pushups", cost: 25,
      desc: "+40% damage for 3 turns", effect: { buff: { atk: 0.4, turns: 3 } } },
    { id: "thick_hide", name: "Thick Hide", icon: "🦏", challenge: "plank", cost: 25,
      desc: "Block 60% of damage for 2 turns", effect: { buff: { block: 0.6, turns: 2 } } },
    { id: "skull_splitter", name: "Skull Splitter", icon: "🪓", challenge: "deadhang", cost: 35,
      desc: "160% damage with +30% crit chance", effect: { damage: 1.6, crit: 30 } },
    { id: "bloodrage", name: "Bloodrage", icon: "🩸", challenge: "burpees", cost: 30,
      desc: "Heal 10% of max HP and +30% damage for 2 turns", effect: { heal: 0.1, buff: { atk: 0.3, turns: 2 } } },
  ],
  assassin: [
    { id: "shadowstep", name: "Shadowstep", icon: "👤", challenge: "mile", cost: 40,
      desc: "100% damage, then dodge the next attack", effect: { damage: 1, buff: { evade: 1, turns: 1 } } },
    { id: "blade_flurry", name: "Blade Flurry", icon: "🌀", challenge: "fivek", cost: 40,
      desc: "4 quick hits of 50% damage", effect: { damage: 0.5, hits: 4 } },
    { id: "backstab", name: "Backstab", icon: "🗡️", challenge: "pullups", cost: 35,
      desc: "200% damage with +40% crit chance", effect: { damage: 2, crit: 40 } },
    { id: "poison_blade", name: "Poison Blade", icon: "🧪", challenge: "pushups", cost: 30,
      desc: "90% damage and poison for 3 turns", effect: { damage: 0.9, poison: { pct: 0.35, turns: 3 } } },
    { id: "smoke_bomb", name: "Smoke Bomb", icon: "💨", challenge: "plank", cost: 20,
      desc: "+50% dodge chance for 2 turns", effect: { buff: { dodge: 50, turns: 2 } } },
    { id: "fan_of_knives", name: "Fan of Knives", icon: "🔪", challenge: "burpees", cost: 40,
      desc: "5 quick hits of 35% damage", effect: { damage: 0.35, hits: 5 } },
    { id: "crippling_strike", name: "Crippling Strike", icon: "🦵", challenge: "row2k", cost: 35,
      desc: "110% damage with a 50% chance to stun", effect: { damage: 1.1, stun: 0.5 } },
  ],
  monk: [
    { id: "inner_light", name: "Inner Light", icon: "✨", challenge: "meditation", cost: 40,
      desc: "Heal 25% of your max HP", effect: { heal: 0.25 } },
    { id: "iron_body", name: "Iron Body", icon: "🪨", challenge: "plank", cost: 30,
      desc: "Block 50% of damage for 3 turns", effect: { buff: { block: 0.5, turns: 3 } } },
    { id: "flowing_strikes", name: "Flowing Strikes", icon: "🌊", challenge: "mile", cost: 35,
      desc: "3 strikes of 65% damage", effect: { damage: 0.65, hits: 3 } },
    { id: "palm_of_heaven", name: "Palm of Heaven", icon: "🖐️", challenge: "ohp", cost: 45,
      desc: "220% damage that ignores armor", effect: { damage: 2.2, pierce: true } },
    { id: "dragon_kick", name: "Dragon Kick", icon: "🦶", challenge: "pullups", cost: 40,
      desc: "150% damage with a 40% chance to stun", effect: { damage: 1.5, stun: 0.4 } },
    { id: "chi_wave", name: "Chi Wave", icon: "🌀", challenge: "situps", cost: 35,
      desc: "120% damage and heal 10% of max HP", effect: { damage: 1.2, heal: 0.1 } },
    { id: "serene_stance", name: "Serene Stance", icon: "🧘", challenge: "wallsit", cost: 35,
      desc: "Block 30% of damage and heal 6% per turn for 3 turns", effect: { buff: { block: 0.3, regen: 0.06, turns: 3 } } },
  ],
  warrior: [
    { id: "shield_bash", name: "Shield Bash", icon: "🛡️", challenge: "bench", cost: 30,
      desc: "120% damage with a 50% chance to stun", effect: { damage: 1.2, stun: 0.5 } },
    { id: "power_strike", name: "Power Strike", icon: "⚔️", challenge: "squat", cost: 35,
      desc: "A mighty blow for 200% damage", effect: { damage: 2 } },
    { id: "second_wind", name: "Second Wind", icon: "💚", challenge: "fivek", cost: 35,
      desc: "Heal 20% of max HP and cure poison", effect: { heal: 0.2, cleanse: true } },
    { id: "battle_shout", name: "Battle Shout", icon: "📣", challenge: "pushups", cost: 30,
      desc: "+30% damage and +30% armor for 3 turns", effect: { buff: { atk: 0.3, def: 0.3, turns: 3 } } },
    { id: "execute", name: "Execute", icon: "🪓", challenge: "deadlift", cost: 40,
      desc: "150% damage, tripled against foes under 30% HP", effect: { damage: 1.5, execute: 0.3 } },
    { id: "whirlwind", name: "Whirlwind", icon: "🌪️", challenge: "burpees", cost: 40,
      desc: "3 spinning hits of 60% damage", effect: { damage: 0.6, hits: 3 } },
    { id: "iron_will", name: "Iron Will", icon: "🗿", challenge: "wallsit", cost: 30,
      desc: "Block 50% of damage for 2 turns and cure poison", effect: { buff: { block: 0.5, turns: 2 }, cleanse: true } },
  ],
  knight: [
    { id: "valiant_strike", name: "Valiant Strike", icon: "⚜️", challenge: "squat", cost: 35,
      desc: "150% damage and +25% armor for 2 turns", effect: { damage: 1.5, buff: { def: 0.25, turns: 2 } } },
    { id: "aegis_wall", name: "Aegis Wall", icon: "🛡️", challenge: "plank", cost: 30,
      desc: "Block 50% of damage for 2 turns", effect: { buff: { block: 0.5, turns: 2 } } },
    { id: "vigil", name: "Vigil", icon: "🕯️", challenge: "fivek", cost: 35,
      desc: "Heal 5% of max HP every turn for 4 turns", effect: { buff: { regen: 0.05, turns: 4 } } },
    { id: "lance_charge", name: "Lance Charge", icon: "🏇", challenge: "deadlift", cost: 45,
      desc: "A thundering charge for 220% damage", effect: { damage: 2.2 } },
    { id: "oath_of_iron", name: "Oath of Iron", icon: "🤞", challenge: "pushups", cost: 30,
      desc: "+30% damage for 3 turns and cure poison", effect: { buff: { atk: 0.3, turns: 3 }, cleanse: true } },
    { id: "crusader_strike", name: "Crusader Strike", icon: "✝️", challenge: "deadhang", cost: 35,
      desc: "140% damage and heal 8% of max HP", effect: { damage: 1.4, heal: 0.08 } },
    { id: "steady_march", name: "Steady March", icon: "🥾", challenge: "row2k", cost: 30,
      desc: "Heal 12% of max HP and +20% armor for 3 turns", effect: { heal: 0.12, buff: { def: 0.2, turns: 3 } } },
  ],
};

// Each promoted class gains one exclusive ultimate skill (so a tier-2 hero has
// two). It unlocks with the promotion and grows stronger with ranks in its challenge.
const ULTIMATE_SKILLS = {
  marauder: { id: "warlords_roar", name: "Warlord's Roar", icon: "🦁", challenge: "ohp", cost: 45, ultimate: true,
    desc: "Heal 15% of max HP and +50% damage for 3 turns", effect: { heal: 0.15, buff: { atk: 0.5, turns: 3 } } },
  master: { id: "thousand_palms", name: "Thousand Palms", icon: "🙏", challenge: "pushups", cost: 50, ultimate: true,
    desc: "6 strikes of 35% damage that ignore armor", effect: { damage: 0.35, hits: 6, pierce: true } },
  gladiator: { id: "arena_fury", name: "Arena Fury", icon: "🏟️", challenge: "pullups", cost: 50, ultimate: true,
    desc: "3 heavy blows of 90% damage with +20% crit chance", effect: { damage: 0.9, hits: 3, crit: 20 } },
  phantom: { id: "death_mark", name: "Death Mark", icon: "💀", challenge: "squat", cost: 55, ultimate: true,
    desc: "180% damage that always lands a critical hit", effect: { damage: 1.8, crit: 100 } },
  paladin: { id: "holy_light", name: "Holy Light", icon: "🌟", challenge: "meditation", cost: 50, ultimate: true,
    desc: "Heal 20% of max HP and +30% armor for 2 turns", effect: { heal: 0.2, buff: { def: 0.3, turns: 2 } } },
  chieftain: { id: "hordes_fury", name: "Horde's Fury", icon: "🪓", challenge: "pullups", cost: 60, ultimate: true,
    desc: "4 savage blows of 70% damage with +20% crit chance", effect: { damage: 0.7, hits: 4, crit: 20 } },
  awakened: { id: "enlightened_fist", name: "Enlightened Fist", icon: "☀️", challenge: "fivek", cost: 60, ultimate: true,
    desc: "260% damage that ignores armor and heals 15% of max HP", effect: { damage: 2.6, pierce: true, heal: 0.15 } },
  centurion: { id: "legions_charge", name: "Legion's Charge", icon: "🛡️", challenge: "situps", cost: 60, ultimate: true,
    desc: "250% damage with a 40% chance to stun", effect: { damage: 2.5, stun: 0.4 } },
  reaper: { id: "soul_harvest", name: "Soul Harvest", icon: "⚰️", challenge: "deadhang", cost: 65, ultimate: true,
    desc: "200% damage that always crits and heals 15% of max HP", effect: { damage: 2, crit: 100, heal: 0.15 } },
  royal_guardian: { id: "sovereign_aegis", name: "Sovereign's Aegis", icon: "👑", challenge: "bench", cost: 60, ultimate: true,
    desc: "Heal 20% of max HP and block 60% of damage for 2 turns", effect: { heal: 0.2, buff: { block: 0.6, turns: 2 } } },
};

const CLASS_PASSIVES = {
  barbarian: "Bloodlust: +20% max HP, muscle (STR) adds to HP, and heal 15% of damage dealt",
  assassin: "Killer Instinct: +10% crit chance, and running stamina (AGI) adds to HP",
  monk: "Inner Peace: heal 3% HP every turn",
  warrior: "Veteran: +15% damage and +15% armor",
  knight: "Endurance: +20% max HP, +10% armor, and power from both STR and VIT",
  marauder: "Raider's Hunger: +25% max HP, +5% power, muscle (STR) adds to HP, and heal 20% of damage dealt",
  chieftain: "Warchief: +30% max HP, +10% power, muscle (STR) adds to HP, and heal 25% of damage dealt",
  awakened: "Awakening: heal 4.5% HP every turn, +8% dodge and +10% power",
  centurion: "Legion Commander: +30% damage, +25% armor and +10% crit chance",
  reaper: "Death's Embrace: +20% crit chance, +8% dodge, +10% power, and AGI adds to HP",
  royal_guardian: "Royal Bulwark: +30% max HP, +20% armor, +5% power, and power from STR and VIT",
  master: "Enlightenment: heal 3.5% HP every turn, +5% dodge and +5% power",
  gladiator: "Arena Champion: +25% damage, +15% armor and +8% crit chance",
  phantom: "Wraith: +15% crit chance, +5% dodge, +5% power, and AGI adds to HP",
  paladin: "Divine Endurance: +25% max HP, +15% armor, and power from STR and VIT",
};

// How each class turns attributes into battle stats (multipliers default to 1)
const balanced = (a) => ((a.STR + a.AGI + a.WIS + a.VIT) / 4) * 1.3;
const strAndVit = (a) => (a.STR + a.VIT) * 0.5;
const muscle = (a) => a.VIT + a.STR * 0.5; // a barbarian's muscle mass counts toward health
const stamina = (a) => a.VIT + a.AGI * 0.3; // an assassin's running stamina counts toward health
const COMBAT_PROFILES = {
  barbarian: { primary: (a) => a.STR, toughness: muscle, hp: 1.2, lifesteal: 0.15 },
  marauder: { primary: (a) => a.STR, toughness: muscle, hp: 1.25, pow: 1.05, lifesteal: 0.2 },
  chieftain: { primary: (a) => a.STR, toughness: muscle, hp: 1.3, pow: 1.1, lifesteal: 0.25 },
  awakened: { primary: (a) => a.WIS, pow: 1.1, dodge: 8, regen: 0.045 },
  centurion: { primary: balanced, pow: 1.3, def: 1.25, crit: 10 },
  reaper: { primary: (a) => a.AGI, toughness: stamina, pow: 1.1, crit: 20, dodge: 8 },
  royal_guardian: { primary: strAndVit, hp: 1.3, def: 1.2, pow: 1.05 },
  assassin: { primary: (a) => a.AGI, toughness: stamina, crit: 10 },
  phantom: { primary: (a) => a.AGI, toughness: stamina, pow: 1.05, crit: 15, dodge: 5 },
  monk: { primary: (a) => a.WIS, regen: 0.03 },
  master: { primary: (a) => a.WIS, pow: 1.05, dodge: 5, regen: 0.035 },
  warrior: { primary: balanced, pow: 1.15, def: 1.15 },
  gladiator: { primary: balanced, pow: 1.25, def: 1.15, crit: 8 },
  knight: { primary: strAndVit, hp: 1.2, def: 1.1 },
  paladin: { primary: strAndVit, hp: 1.25, def: 1.15 },
};

// Battle items, bought with gold on the Fight screen and used from the BAG
const SHOP_ITEMS = {
  hipotion: { name: "Hi-Potion", icon: "🧴", price: 40, desc: "Restores 70% of your HP" },
  ether: { name: "Ether", icon: "🔷", price: 35, desc: "Restores 50 energy" },
  antidote: { name: "Antidote", icon: "🌿", price: 20, desc: "Cures poison, burns and curses" },
  bomb: { name: "Fire Bomb", icon: "💣", price: 60, desc: "Blasts 30% of a monster's HP (10% for bosses)" },
  power_tonic: { name: "Power Tonic", icon: "🍷", price: 50, desc: "+30% damage for 3 turns" },
  iron_tonic: { name: "Iron Tonic", icon: "🥛", price: 50, desc: "+40% armor for 3 turns" },
  phoenix: { name: "Phoenix Feather", icon: "🪶", price: 150, desc: "Revives you at 40% HP when you fall (used automatically)" },
};

function buyItem(id) {
  const item = SHOP_ITEMS[id];
  if (!item || goldBalance() < item.price) return;
  shop.spent += item.price;
  shop.bought++;
  shop.items[id] = (shop.items[id] || 0) + 1;
  saveShop();
  const level = levelInfo(totalXp()).level;
  const unlocks = syncUnlocks();
  render();
  toast(`Bought ${item.name}!`);
  celebrate(level, unlocks);
}

function monsterGold(e) {
  return Math.round((e.level * 4 + 5) * (e.boss ? 3 : 1));
}

const FLOOR_LEVELS = [0, 0, 1];
const DUNGEONS_KEY = "fittrack.dungeons";
const MAX_ENERGY = 100;
const POTIONS_PER_RUN = 2;

// ---------- Progress ----------

let dungeonState = null;

function dungeonProgress() {
  if (!dungeonState) dungeonState = { cleared: {}, kills: 0, ...load(DUNGEONS_KEY, {}) };
  return dungeonState;
}

function saveDungeons() {
  save(DUNGEONS_KEY, dungeonProgress());
}

function resetDungeons() {
  dungeonState = { cleared: {}, kills: 0 };
  saveDungeons();
}

function dungeonUnlocked(index) {
  return index === 0 || Boolean(dungeonProgress().cleared[DUNGEONS[index - 1].id]);
}

// ---------- Hero combat stats ----------

// A class's 5 skills plus its promotion's ultimate (if it has one)
// A class's skills plus the ultimate of every promotion along its chain.
// Each ultimate is tagged with the class (and tier) that unlocks it.
function classSkillList(cls) {
  const list = [...CLASS_SKILLS[baseClass(cls)]];
  for (let c = CLASSES[baseClass(cls)].promotion; c; c = CLASSES[c].promotion) {
    list.push({ ...ULTIMATE_SKILLS[c], from: c, tier: classTier(c) });
  }
  return list;
}

function ultimateUnlocked(s, cls = settings.cls) {
  return classTier(cls) >= s.tier;
}

function combatSkillFor(cls, chId) {
  return classSkillList(cls).find((s) => s.challenge === chId && (!s.ultimate || ultimateUnlocked(s, cls)));
}

function combatSkills() {
  const discount = badgeBuffs().skillCost;
  return classSkillList(settings.cls).map((s) => ({
    ...s,
    rank: s.ultimate ? (ultimateUnlocked(s) ? Math.max(1, skillRank(s.challenge)) : 0) : skillRank(s.challenge),
    cost: Math.max(5, s.cost - discount),
  }));
}

function skillPower(rank) {
  return 1 + 0.25 * (rank - 1);
}

// Attributes grow quickly with training, so battle stats use their square root
function effective(attr) {
  return Math.sqrt(Math.max(0, attr)) * 4;
}

// Battle stats come straight from real training (attributes and level),
// plus the permanent buffs from badges
function heroCombat() {
  const a = heroAttributes();
  const buffs = badgeBuffs();
  const level = levelInfo(totalXp()).level;
  const p = COMBAT_PROFILES[settings.cls];
  const toughness = p.toughness ? p.toughness(a) : a.VIT;
  return {
    maxHp: Math.round((50 + level * 10 + effective(toughness) * 3) * (p.hp || 1) * (1 + buffs.hp / 100)),
    pow: Math.round((4 + level * 1.5 + effective(p.primary(a))) * (p.pow || 1) * (1 + buffs.pow / 100)),
    def: Math.round((level + effective(a.VIT) * 0.5) * (p.def || 1) * (1 + buffs.def / 100)),
    crit: Math.round(Math.min(5 + effective(a.AGI) * 0.6 + (p.crit || 0), 60) + buffs.crit),
    dodge: Math.round(Math.min(2 + effective(a.AGI) * 0.3 + (p.dodge || 0), 30) + buffs.dodge),
    regen: (p.regen || 0) + buffs.regen / 100,
    lifesteal: p.lifesteal || 0,
    startEnergy: Math.min(MAX_ENERGY, 40 + buffs.energy),
    energyPerTurn: 15 + buffs.energyRegen,
    potions: POTIONS_PER_RUN + buffs.potions,
    potionHeal: 0.4 + buffs.potionHeal / 100,
    bossDmg: buffs.bossDmg / 100,
  };
}

function monsterOnFloor(dungeon, floor) {
  return makeMonster(dungeon.floors[floor], dungeon.level + FLOOR_LEVELS[floor]);
}

function makeMonster(id, level) {
  const m = MONSTERS[id];
  // Deeper dungeons get tougher to keep pace with badge buffs and skill ranks,
  // ramping up faster past level 18
  const scale = 1 + level * 0.006 + Math.max(0, level - 18) * 0.035;
  const hp = Math.round((40 + level * 16 + level * level * 0.6) * scale * (m.boss ? 2 : 1));
  return {
    ...m,
    id,
    level,
    hp,
    maxHp: hp,
    atk: (7 + level * 2 + level * level * 0.08) * scale * (m.boss ? 1.2 : 1),
    def: level * (m.ability === "armored" ? 2 : 1),
    stun: false,
    stunImmune: false,
    dot: null,
    enraged: false,
    windup: false,
    turn: 0,
  };
}

// ---------- Battle engine ----------
// The engine resolves each turn instantly and queues what happened as events
// (messages, hits, heals). The battle screen then plays them back one at a
// time, Pokémon style: a message types out, the hit lands, the HP bar drains.

let battle = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms * (window.battleSpeed ?? 1)));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

// Armor reduces damage by def / (def + 50): never fully blocks a hit
function mitigate(damage, def) {
  return damage * (1 - def / (def + 50));
}

function buffTotal(key) {
  return battle.buffs.reduce((total, b) => total + (b[key] || 0), 0);
}

function heroName() {
  return settings.heroName || "Hero";
}

// How monsters are named in messages: "Wild Goblin" or just the boss's name
function foe(e = battle.enemy) {
  return e.boss ? e.name : `Wild ${e.name}`;
}

// Queues a battle message
function addLog(text) {
  battle.log.push(text);
  if (battle.log.length > 5) battle.log.shift();
  battle.events.push({ type: "msg", text });
}

// Queues a hit, heal or miss on one side, with both HP values at that moment
function floatText(target, text, cls = "") {
  battle.events.push({ type: "fx", target, text, cls, hp: battle.hp, enemyHp: battle.enemy.hp });
}

function heal(pct) {
  return healAmount(battle.stats.maxHp * pct);
}

function healAmount(value) {
  const amount = Math.min(Math.round(value), battle.stats.maxHp - battle.hp);
  battle.hp += amount;
  if (amount > 0) floatText("hero", `+${amount}`, "heal");
  return amount;
}

function startDungeon(index) {
  const dungeon = DUNGEONS[index];
  const stats = heroCombat();
  battle = {
    dungeon,
    floor: 0,
    stats,
    hp: stats.maxHp,
    energy: stats.startEnergy,
    buffs: [],
    dot: null,
    potions: stats.potions,
    log: [],
    events: [],
    busy: true,
    over: false,
    menu: "wait",
    shown: { hp: stats.maxHp, enemyHp: 0 },
  };
  battle.enemy = monsterOnFloor(dungeon, 0);
  $("b-hero-sprite").innerHTML = heroBackArt(settings.cls, settings.gear);
  $("b-scene").className = `scene ${dungeon.id}`;
  $("b-enemy-sprite").dataset.monster = "";
  $("battle").hidden = false;
  enterEnemy();
  beginTurn();
}

// Queues the next monster's entrance and warning
function enterEnemy() {
  const e = battle.enemy;
  battle.events.push({ type: "enter" });
  Music.play(e.boss ? "boss" : "battle");
  addLog(e.boss ? `The boss ${e.name} appeared!` : `A wild ${e.name} appeared!`);
  if (e.ability) addLog(ABILITY_WARNINGS[e.ability]);
}

async function beginTurn() {
  if (!(await present())) return;
  battle.busy = false;
  battle.menu = "main";
  renderBattle();
}

function heroStrike(mult, opts = {}) {
  const e = battle.enemy;
  let total = 0;
  let crits = 0;
  let landed = 0;
  for (let i = 0; i < (opts.hits || 1) && e.hp > 0; i++) {
    if (e.ability === "evasive" && Math.random() < 0.2) {
      floatText("enemy", "MISS");
      continue;
    }
    let m = mult * (e.boss ? 1 + battle.stats.bossDmg : 1);
    if (opts.execute && e.hp / e.maxHp < opts.execute) m *= 3;
    const crit = Math.random() * 100 < battle.stats.crit + (opts.crit || 0);
    const raw = battle.stats.pow * m * (1 + buffTotal("atk")) * (crit ? 1.75 : 1) * (battle.curse ? 0.75 : 1);
    const dmg = Math.max(1, Math.round(mitigate(raw, opts.pierce ? 0 : e.def) * rand(0.9, 1.1)));
    e.hp = Math.max(0, e.hp - dmg);
    total += dmg;
    landed++;
    if (crit) crits++;
    floatText("enemy", crit ? `${dmg}!` : String(dmg), crit ? "crit" : "");
  }
  if (battle.stats.lifesteal && total) healAmount(total * battle.stats.lifesteal);
  return { total, crits, landed, hits: opts.hits || 1 };
}

// Follow-up messages after a strike, like "A critical hit!"
function strikeMessages({ total, crits, landed, hits }) {
  if (!total) return addLog(`${foe()} dodged the attack!`);
  if (hits > 1) addLog(`Hit ${landed} time${landed > 1 ? "s" : ""}!`);
  if (crits) addLog(crits > 1 ? `${crits} critical hits!` : "A critical hit!");
}

function useSkill(skill) {
  const power = skillPower(skill.rank);
  const fx = skill.effect;
  const e = battle.enemy;
  battle.energy -= skill.cost;
  addLog(`${heroName()} used ${skill.name}!`);

  if (fx.damage) {
    strikeMessages(heroStrike(fx.damage * power, fx));
    if (fx.recoil) {
      const recoil = Math.round(battle.stats.maxHp * fx.recoil);
      battle.hp = Math.max(1, battle.hp - recoil);
      addLog(`${heroName()} is hurt by the recoil!`);
      floatText("hero", String(recoil), "hurt");
    }
    if (fx.stun && e.hp > 0) {
      // Bosses resist stuns, and nothing can be stunned two turns in a row
      const chance = e.stunImmune ? 0 : (fx.stun + 0.1 * (skill.rank - 1)) * (e.boss ? 0.5 : 1);
      if (Math.random() < chance) {
        e.stun = true;
        addLog(`${foe()} is stunned!`);
      } else if (e.stunImmune) {
        addLog(`${foe()} resisted the stun!`);
      }
    }
    if (fx.poison && e.hp > 0) {
      e.dot = { dmg: Math.max(1, Math.round(battle.stats.pow * fx.poison.pct * power)), turns: fx.poison.turns, label: "Poison" };
      addLog(`${foe()} was poisoned!`);
    }
  }
  if (fx.heal) {
    const healed = heal(fx.heal * power);
    addLog(healed ? `${heroName()} recovered ${healed} HP!` : `${heroName()}'s HP is already full!`);
  }
  if (fx.cleanse && (battle.dot || battle.curse)) {
    battle.dot = null;
    battle.curse = 0;
    addLog(`${heroName()} was cured!`);
  }
  if (fx.buff) {
    const b = { ...fx.buff, name: skill.name };
    if (b.atk) b.atk *= power;
    if (b.def) b.def *= power;
    if (b.regen) b.regen *= power;
    if (b.block) b.block = Math.min(b.block + 0.1 * (skill.rank - 1), 0.8);
    if (b.dodge) b.dodge += 10 * (skill.rank - 1);
    battle.buffs.push(b);
    addLog(buffMessage(b));
  }
}

function useItem(id) {
  const item = SHOP_ITEMS[id];
  const e = battle.enemy;
  shop.items[id]--;
  saveShop();
  addLog(`${heroName()} used a ${item.name}!`);
  if (id === "hipotion") {
    const healed = heal(0.7);
    addLog(healed ? `${heroName()} recovered ${healed} HP!` : `${heroName()}'s HP is already full!`);
  } else if (id === "ether") {
    battle.energy += 50;
    addLog(`${heroName()}'s energy surged!`);
  } else if (id === "antidote") {
    battle.dot = null;
    battle.curse = 0;
    addLog(`${heroName()} feels purified!`);
  } else if (id === "bomb") {
    const dmg = Math.round(e.maxHp * (e.boss ? 0.1 : 0.3));
    e.hp = Math.max(0, e.hp - dmg);
    floatText("enemy", String(dmg), "crit");
    addLog("Ka-boom!");
  } else if (id === "power_tonic" || id === "iron_tonic") {
    const b = id === "power_tonic" ? { atk: 0.3, turns: 3, name: "Power" } : { def: 0.4, turns: 3, name: "Iron" };
    battle.buffs.push(b);
    addLog(buffMessage(b));
  }
}

function buffMessage(b) {
  if (b.evade) return `${heroName()} melts into the shadows!`;
  const effects = [];
  if (b.atk) effects.push(`+${Math.round(b.atk * 100)}% damage`);
  if (b.def) effects.push(`+${Math.round(b.def * 100)}% armor`);
  if (b.block) effects.push(`${Math.round(b.block * 100)}% damage reduction`);
  if (b.dodge) effects.push(`+${b.dodge}% dodge`);
  if (b.regen) effects.push(`${Math.round(b.regen * 100)}% healing per turn`);
  return `${heroName()} gains ${effects.join(" and ")} for ${b.turns} turn${b.turns > 1 ? "s" : ""}!`;
}

function enemyStrike(mult, announce = true) {
  const e = battle.enemy;
  if (announce) addLog(`${foe()} attacks!`);
  const evade = battle.buffs.find((b) => b.evade);
  if (evade) {
    battle.buffs = battle.buffs.filter((b) => b !== evade);
    floatText("hero", "DODGE");
    addLog(`${heroName()} slipped away untouched!`);
    return;
  }
  if (Math.random() * 100 < battle.stats.dodge + buffTotal("dodge")) {
    floatText("hero", "DODGE");
    addLog(`${heroName()} dodged the attack!`);
    return;
  }
  const raw = e.atk * mult * (e.enraged ? 1.5 : 1);
  const blocked = 1 - Math.min(buffTotal("block"), 0.85);
  const dmg = Math.max(1, Math.round(mitigate(raw, battle.stats.def * (1 + buffTotal("def"))) * blocked * rand(0.9, 1.1)));
  battle.hp = Math.max(0, battle.hp - dmg);
  floatText("hero", String(dmg), mult > 1 ? "hurt heavy" : "hurt");
  if (blocked < 1) addLog("The guard softened the blow!");

  if (e.ability === "drain") {
    const healed = Math.min(Math.round(dmg * 0.5), e.maxHp - e.hp);
    if (healed > 0) {
      e.hp += healed;
      addLog(`${foe()} drained ${heroName()}'s health!`);
      floatText("enemy", `+${healed}`, "heal");
    }
  }
  if (e.ability === "curse" && !battle.curse && Math.random() < 0.35) {
    battle.curse = 2;
    addLog(`${heroName()} was cursed! Damage fell!`);
  }
  if ((e.ability === "poison" || e.ability === "burn") && !battle.dot && Math.random() < 0.35) {
    const label = e.ability === "burn" ? "Burn" : "Poison";
    battle.dot = { dmg: Math.max(1, Math.round(e.atk * 0.3)), turns: 3, label };
    addLog(e.ability === "burn" ? `${heroName()} was burned!` : `${heroName()} was poisoned!`);
  }
}

function enemyTurn() {
  const e = battle.enemy;
  e.turn++;
  if (e.dot) {
    e.hp = Math.max(0, e.hp - e.dot.dmg);
    addLog(`${foe()} is hurt by ${e.dot.label.toLowerCase()}!`);
    floatText("enemy", String(e.dot.dmg), "dot");
    e.dot.turns--;
    if (!e.dot.turns) e.dot = null;
    if (e.hp <= 0) return;
  }
  if (e.ability === "regen" && e.hp < e.maxHp) {
    e.hp = Math.min(e.maxHp, e.hp + Math.round(e.maxHp * 0.025));
    addLog(`${foe()} regenerates!`);
    floatText("enemy", "+", "heal");
  }
  if (e.stun) {
    e.stun = false;
    e.stunImmune = true;
    e.windup = false;
    addLog(`${foe()} is stunned and can't move!`);
    return;
  }
  e.stunImmune = false;
  if (e.ability === "enrage" && !e.enraged && e.hp / e.maxHp < 0.4) {
    e.enraged = true;
    addLog(`${foe()} flies into a rage!`);
  }
  // Bosses telegraph a heavy attack every third turn: a good time to guard
  if (e.boss) {
    if (e.windup) {
      e.windup = false;
      addLog(`${e.name} unleashes a devastating attack!`);
      enemyStrike(2.2, false);
      return;
    }
    if (e.turn % 3 === 0) {
      e.windup = true;
      addLog(`${e.name} is gathering power! Time to GUARD!`);
      return;
    }
  }
  if (e.ability === "double") {
    enemyStrike(0.55);
    if (battle.hp > 0) {
      addLog(`${foe()} strikes again!`);
      enemyStrike(0.55, false);
    }
    return;
  }
  enemyStrike(1);
}

function endRound() {
  if (battle.dot) {
    battle.hp = Math.max(0, battle.hp - battle.dot.dmg);
    addLog(`${heroName()} is hurt by ${battle.dot.label === "Burn" ? "the burn" : "poison"}!`);
    floatText("hero", String(battle.dot.dmg), "dot");
    battle.dot.turns--;
    if (!battle.dot.turns) battle.dot = null;
  }
  const regen = battle.stats.regen + buffTotal("regen");
  if (regen && battle.hp > 0) heal(regen);
  if (battle.curse) battle.curse--;
  battle.energy = Math.min(MAX_ENERGY, battle.energy + battle.stats.energyPerTurn);
  battle.buffs = battle.buffs.map((b) => ({ ...b, turns: b.turns - 1 })).filter((b) => b.turns > 0);
}

async function act(action) {
  if (!battle || battle.busy || battle.over) return;
  const skill = combatSkills().find((s) => s.id === action);
  if (skill && (skill.rank < 1 || battle.energy < skill.cost)) return;
  if (action === "potion" && battle.potions <= 0) return;
  const itemId = action.startsWith("item:") ? action.slice(5) : null;
  if (itemId && (!(shop.items[itemId] > 0) || itemId === "phoenix")) return;

  battle.busy = true;
  if (action === "attack") {
    addLog(`${heroName()} attacks!`);
    strikeMessages(heroStrike(1));
    battle.energy += 10;
  } else if (action === "defend") {
    battle.buffs.push({ block: 0.5, turns: 1, name: "Guard" });
    battle.energy += 20;
    addLog(`${heroName()} takes a defensive stance!`);
  } else if (action === "potion") {
    battle.potions--;
    addLog(`${heroName()} drank a potion!`);
    const healed = heal(battle.stats.potionHeal);
    addLog(healed ? `${heroName()} recovered ${healed} HP!` : `${heroName()}'s HP is already full!`);
  } else if (itemId) {
    useItem(itemId);
  } else if (skill) {
    useSkill(skill);
  }
  battle.energy = Math.min(MAX_ENERGY, battle.energy);
  if (!(await present())) return; // fled mid-turn
  if (battle.enemy.hp <= 0) return enemyDefeated();

  enemyTurn();
  if (!(await present())) return;
  if (battle.enemy.hp <= 0) return enemyDefeated();
  if (battle.hp <= 0) return defeat();

  endRound();
  if (!(await present())) return;
  if (battle.hp <= 0) return defeat();
  battle.busy = false;
  battle.menu = "main";
  renderBattle();
}

async function enemyDefeated() {
  battle.events.push({ type: "faint", target: "enemy" });
  addLog(`${foe()} fainted!`);
  const gold = monsterGold(battle.enemy);
  addLog(`${heroName()} found ${gold} gold!`);
  const progress = dungeonProgress();
  progress.kills++;
  progress.gold = (progress.gold || 0) + gold;
  battle.goldFound = (battle.goldFound || 0) + gold;
  saveDungeons();
  if (!(await present())) return;

  if (battle.floor < battle.dungeon.floors.length - 1) {
    battle.floor++;
    battle.buffs = [];
    battle.dot = null;
    const healed = heal(0.3);
    if (healed) addLog(`${heroName()} caught their breath and recovered ${healed} HP.`);
    battle.enemy = monsterOnFloor(battle.dungeon, battle.floor);
    enterEnemy();
    beginTurn();
  } else {
    victory();
  }
}

function victory() {
  const progress = dungeonProgress();
  const first = !progress.cleared[battle.dungeon.id];
  const bonus = first ? 50 * (DUNGEONS.indexOf(battle.dungeon) + 1) : 0;
  if (first) progress.cleared[battle.dungeon.id] = toKey(new Date());
  progress.gold = (progress.gold || 0) + bonus;
  battle.goldFound = (battle.goldFound || 0) + bonus;
  saveDungeons();
  battle.over = true;
  Music.play("victory");

  const level = levelInfo(totalXp()).level;
  const unlocks = syncUnlocks();
  render();
  const next = DUNGEONS[DUNGEONS.indexOf(battle.dungeon) + 1];
  showBattleEnd(
    "Victory!",
    first
      ? `You conquered ${battle.dungeon.name}! First-clear bonus: ${bonus} gold (${battle.goldFound} total).${next ? ` ${next.name} is now open.` : " You have conquered every dungeon!"}`
      : `You conquered ${battle.dungeon.name} again and found ${battle.goldFound} gold.`
  );
  celebrate(level, unlocks);
}

async function defeat() {
  if (shop.items.phoenix > 0) {
    shop.items.phoenix--;
    saveShop();
    battle.hp = Math.round(battle.stats.maxHp * 0.4);
    battle.dot = null;
    addLog("The Phoenix Feather bursts into flame!");
    floatText("hero", `+${battle.hp}`, "heal");
    addLog(`${heroName()} rose from the ashes!`);
    if (!(await present())) return;
    battle.busy = false;
    battle.menu = "main";
    renderBattle();
    return;
  }
  battle.events.push({ type: "faint", target: "hero" });
  addLog(`${heroName()} fainted...`);
  if (!(await present())) return;
  battle.over = true;
  Music.play("defeat");
  render();
  showBattleEnd(
    "Defeated",
    `You fell on floor ${battle.floor + 1} to the ${battle.enemy.name}. Train in real life to grow stronger: workouts raise your attributes and challenges teach new combat skills.`
  );
}

function fleeBattle() {
  if (battle && !battle.over && !confirm("Run from the dungeon? Your progress in this run will be lost.")) return;
  if (battle && battle.onTap) battle.onTap();
  battle = null;
  $("battle").hidden = true;
  Music.play("town");
  renderFight();
}

// ---------- Battle playback ----------

const TYPE_SPEED = 18; // ms per letter
const MESSAGE_HOLD = 650; // ms a finished message stays before moving on

// Plays queued events in order. Returns false if the battle ended meanwhile
// (the player ran away).
async function present() {
  const current = battle;
  battle.menu = "wait";
  renderBattle();
  while (battle === current && battle.events.length) {
    const ev = battle.events.shift();
    if (ev.type === "msg") await typeMessage(ev.text);
    else if (ev.type === "fx") await playHit(ev);
    else if (ev.type === "faint") await playFaint(ev.target);
    else if (ev.type === "enter") await playEnter();
  }
  if (battle !== current) return false;
  battle.shown = { hp: battle.hp, enemyHp: battle.enemy.hp };
  updateBars();
  return true;
}

async function typeMessage(text) {
  const box = $("b-text");
  const current = battle;
  battle.skipTyping = false;
  for (let i = 1; i <= text.length; i++) {
    if (battle !== current) return;
    if (battle.skipTyping) i = text.length;
    box.textContent = text.slice(0, i);
    if (i < text.length) await wait(TYPE_SPEED);
  }
  await waitOrTap(MESSAGE_HOLD);
}

// Waits, but a tap on the text box moves on early
function waitOrTap(ms) {
  return new Promise((resolve) => {
    const owner = battle;
    const done = () => {
      clearTimeout(timer);
      if (owner) owner.onTap = null;
      resolve();
    };
    const timer = setTimeout(done, ms * (window.battleSpeed ?? 1));
    owner.onTap = done;
  });
}

function restartAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // let the animation play again
  el.classList.add(cls);
}

// ---------- Vibration ----------
// Haptic feedback on hits (Android browsers; iPhones don't support it).
// Patterns are in milliseconds: vibrate, pause, vibrate...

const VIBRATIONS = {
  hit: 30,
  crit: [40, 40, 70],
  hurt: 80,
  heavy: [70, 40, 160],
  dot: 20,
  enemyFaint: [50, 40, 50],
  heroFaint: [150, 60, 300],
};

function buzz(kind) {
  if (settings.vibration === false || !navigator.vibrate) return;
  navigator.vibrate(VIBRATIONS[kind]);
}

function vibrationFor(ev) {
  if (ev.cls === "heal" || ev.text === "MISS" || ev.text === "DODGE") return null;
  if (ev.cls === "dot") return "dot";
  if (ev.target === "hero") return ev.cls.includes("heavy") ? "heavy" : "hurt";
  return ev.cls === "crit" ? "crit" : "hit";
}

async function playHit(ev) {
  const target = $(ev.target === "enemy" ? "b-enemy-sprite" : "b-hero-sprite");
  const attacker = $(ev.target === "enemy" ? "b-hero-sprite" : "b-enemy-sprite");
  const isAttack = ev.cls !== "heal" && ev.cls !== "dot";
  if (isAttack) {
    restartAnimation(attacker, ev.target === "enemy" ? "lunge-right" : "lunge-left");
    await wait(160);
  }
  const floater = document.createElement("span");
  floater.className = `floater pixel ${ev.cls}`;
  floater.textContent = ev.text;
  target.appendChild(floater);
  setTimeout(() => floater.remove(), 1000);
  if (ev.cls !== "heal" && ev.text !== "MISS" && ev.text !== "DODGE") restartAnimation(target, "hit");
  const vibration = vibrationFor(ev);
  if (vibration) buzz(vibration);
  battle.shown = { hp: ev.hp, enemyHp: ev.enemyHp };
  updateBars();
  await wait(480);
}

async function playFaint(side) {
  restartAnimation($(side === "enemy" ? "b-enemy-sprite" : "b-hero-sprite"), "fainted");
  buzz(side === "enemy" ? "enemyFaint" : "heroFaint");
  await wait(600);
}

async function playEnter() {
  battle.shownEnemy = battle.enemy;
  battle.shown.enemyHp = battle.enemy.hp;
  renderBattle();
  const sprite = $("b-enemy-sprite");
  sprite.classList.remove("fainted");
  restartAnimation(sprite, "enter");
  await wait(450);
}

// ---------- Battle UI ----------

const ABILITY_WARNINGS = {
  enrage: "It looks ready to snap when hurt!",
  drain: "It hungers for your life force!",
  armored: "Its thick armor shrugs off weak blows!",
  evasive: "It moves too fast to see!",
  poison: "Its fangs drip with venom!",
  burn: "Heat radiates from its scales!",
  regen: "Its wounds close before your eyes!",
  curse: "A dark curse hangs around it!",
  double: "It strikes with blinding speed!",
};

function hpClass(pct) {
  return pct > 0.5 ? "" : pct > 0.2 ? "mid" : "low";
}

function updateBars() {
  const b = battle;
  const e = b.shownEnemy || b.enemy;
  const enemyPct = b.shown.enemyHp / e.maxHp;
  const heroPct = b.shown.hp / b.stats.maxHp;
  const enemyBar = $("b-enemy-hp");
  enemyBar.style.width = `${enemyPct * 100}%`;
  enemyBar.className = `hp-fill ${hpClass(enemyPct)}`;
  const heroBar = $("b-hero-hp");
  heroBar.style.width = `${heroPct * 100}%`;
  heroBar.className = `hp-fill ${hpClass(heroPct)}`;
  $("b-hero-hp-text").textContent = `${b.shown.hp} / ${b.stats.maxHp}`;
  $("b-energy").style.width = `${b.energy}%`;
}

function chips(list) {
  return list.map(([cls, text]) => `<span class="status-tag ${cls}">${text}</span>`).join("");
}

function renderBattle() {
  const b = battle;
  const e = b.shownEnemy || b.enemy;
  $("b-dungeon").textContent = b.dungeon.name;
  $("b-floor").textContent = `Floor ${b.floor + 1}/${b.dungeon.floors.length}`;

  const enemySprite = $("b-enemy-sprite");
  if (enemySprite.dataset.monster !== e.id) {
    enemySprite.dataset.monster = e.id;
    enemySprite.innerHTML = `<div class="monster ${e.boss ? "boss" : ""}">${monsterArt(e.id, e.name)}</div>`;
  }
  $("b-enemy-name").textContent = `${e.boss ? "👑" : ""}${e.name}`;
  $("b-enemy-level").textContent = `Lv${e.level}`;
  const enemyStatus = [];
  if (e.windup) enemyStatus.push(["warn", "CHARGING"]);
  if (e.stun) enemyStatus.push(["stn", "STN"]);
  if (e.enraged) enemyStatus.push(["rage", "RAGE"]);
  if (e.dot) enemyStatus.push(["psn", "PSN"]);
  $("b-enemy-status").innerHTML = chips(enemyStatus);

  $("b-hero-name").textContent = heroName();
  $("b-hero-level").textContent = `Lv${levelInfo(totalXp()).level}`;
  const heroStatus = b.buffs.map((x) => ["buff", x.name.toUpperCase()]);
  if (b.dot) heroStatus.push([b.dot.label === "Burn" ? "brn" : "psn", b.dot.label === "Burn" ? "BRN" : "PSN"]);
  if (b.curse) heroStatus.push(["crs", "CURSE"]);
  $("b-hero-status").innerHTML = chips(heroStatus);
  updateBars();
  renderCommand();
}

// The bottom of the screen: messages, the FIGHT/BAG/GUARD/RUN menu, moves, bag
function renderCommand() {
  const b = battle;
  const menu = $("b-actions");
  $("b-command").dataset.menu = b.menu;
  if (b.menu === "main") {
    $("b-text").textContent = `What will ${heroName()} do?`;
    menu.innerHTML = `
      <button type="button" class="cmd selected pixel" data-menu="fight">Fight</button>
      <button type="button" class="cmd pixel" data-menu="bag">Bag</button>
      <button type="button" class="cmd pixel" data-action="defend">Guard</button>
      <button type="button" class="cmd pixel" data-run>Run</button>`;
  } else if (b.menu === "fight") {
    // Like Pokémon, only show the moves you know
    const skills = combatSkills();
    const locked = skills.filter((s) => s.rank < 1).length;
    const moves = skills
      .filter((s) => s.rank > 0)
      .map((s) => {
        return `
          <button type="button" class="move ${s.ultimate ? "ultimate" : ""}" data-action="${s.id}" ${b.energy < s.cost ? "disabled" : ""}>
            <span class="move-name">${s.icon} ${s.name}</span>
            <span class="move-meta">EN ${s.cost} · Rank ${RANKS[s.rank - 1]}</span>
          </button>`;
      })
      .join("");
    menu.innerHTML = `
      <button type="button" class="move" data-action="attack">
        <span class="move-name">⚔️ Strike</span><span class="move-meta">Free · +10 EN</span>
      </button>
      ${moves}
      ${locked ? `<p class="move-note">🔒 ${locked} more move${locked > 1 ? "s" : ""} to learn in Train → Challenge</p>` : ""}
      <div class="move-footer">
        <span class="pixel">EN ${b.energy}/${MAX_ENERGY}</span>
        <button type="button" class="cmd back pixel" data-menu="main">Back</button>
      </div>`;
  } else if (b.menu === "bag") {
    menu.innerHTML = `
      <button type="button" class="move" data-action="potion" ${b.potions ? "" : "disabled"}>
        <span class="move-name">🧪 Potion ×${b.potions}</span>
        <span class="move-meta">Restores ${Math.round(b.stats.potionHeal * 100)}% HP</span>
      </button>
      ${Object.entries(SHOP_ITEMS)
        .filter(([id]) => shop.items[id] > 0)
        .map(([id, item]) =>
          id === "phoenix"
            ? `<p class="move-note">🪶 Phoenix Feather ×${shop.items[id]}: revives you automatically</p>`
            : `<button type="button" class="move" data-action="item:${id}">
                 <span class="move-name">${item.icon} ${item.name} ×${shop.items[id]}</span>
                 <span class="move-meta">${item.desc}</span>
               </button>`
        )
        .join("")}
      <div class="move-footer">
        <span class="pixel">Bag</span>
        <button type="button" class="cmd back pixel" data-menu="main">Back</button>
      </div>`;
  } else if (b.menu === "end") {
    menu.innerHTML = `
      <div class="battle-end">
        <div class="popup-title pixel">${b.endTitle}</div>
        <p class="end-text">${b.endText}</p>
        <button type="button" class="btn pixel" id="b-return">Return to Town</button>
      </div>`;
  } else {
    menu.innerHTML = "";
  }
}

function showBattleEnd(title, text) {
  battle.menu = "end";
  battle.endTitle = title;
  battle.endText = text;
  renderBattle();
}

document.getElementById("b-actions").addEventListener("click", (event) => {
  if (!battle) return;
  if (event.target.closest("#b-return")) return fleeBattle();
  const btn = event.target.closest("button");
  if (!btn || btn.disabled || battle.busy) return;
  if (btn.dataset.menu) {
    battle.menu = btn.dataset.menu;
    renderBattle();
  } else if ("run" in btn.dataset) {
    fleeBattle();
  } else if (btn.dataset.action) {
    act(btn.dataset.action);
  }
});

// Tapping the message box skips the typing, then moves to the next message
document.getElementById("b-text").addEventListener("click", () => {
  if (!battle) return;
  if (battle.onTap) battle.onTap();
  else battle.skipTyping = true;
});

// ---------- Fight screen ----------

function renderFight() {
  if (!settings.cls) return;
  const stats = heroCombat();
  $("combat-stats").innerHTML = [
    ["HP", stats.maxHp],
    ["POW", stats.pow],
    ["DEF", stats.def],
    ["CRIT", `${stats.crit}%`],
    ["DODGE", `${stats.dodge}%`],
  ]
    .map(([k, v]) => `<div class="cstat"><span class="cstat-value pixel">${v}</span><span class="stat-label">${k}</span></div>`)
    .join("");
  $("class-passive").textContent = CLASS_PASSIVES[settings.cls];

  $("combat-skill-list").innerHTML = combatSkills()
    .map((s) => {
      const ch = CHALLENGES[s.challenge];
      const state =
        s.rank > 0
          ? `Rank ${RANKS[s.rank - 1]} · ${Math.round(skillPower(s.rank) * 100)}% power · ${s.cost} EN`
          : s.ultimate
            ? `🔒 Become a ${CLASSES[s.from].name} (LV ${PROMOTION_LEVELS[s.tier]}) to unlock`
            : `🔒 Learn it: reach rank I in ${ch.name}`;
      return `
        <li class="skill ${s.rank ? "" : "locked"}">
          <span class="workout-icon" aria-hidden="true">${s.icon}</span>
          <span class="workout-info">
            <span class="workout-name">${s.name}${s.ultimate ? ` <span class="ult-tag pixel">Ultimate</span>` : ""}</span>
            <span class="workout-meta">${s.desc}</span>
            <span class="skill-state">${state}</span>
          </span>
          <span class="pips">${pips(s.rank)}</span>
        </li>`;
    })
    .join("");

  $("shop-gold").textContent = `🪙 ${goldBalance()}`;
  $("shop-list").innerHTML = Object.entries(SHOP_ITEMS)
    .map(([id, item]) => {
      const owned = shop.items[id] || 0;
      return `
        <div class="shop-item">
          <span class="workout-icon" aria-hidden="true">${item.icon}</span>
          <span class="workout-info">
            <span class="workout-name">${item.name}${owned ? ` <span class="owned">×${owned}</span>` : ""}</span>
            <span class="workout-meta">${item.desc}</span>
          </span>
          <button type="button" class="btn pixel buy-btn" data-buy="${id}" ${goldBalance() < item.price ? "disabled" : ""}>${item.price}🪙</button>
        </div>`;
    })
    .join("");

  const progress = dungeonProgress();
  $("dungeon-list").innerHTML = DUNGEONS.map((d, i) => {
    const open = dungeonUnlocked(i);
    const cleared = progress.cleared[d.id];
    const loot = GEAR.find((g) => g.unlock.dungeon === d.id);
    return `
      <div class="dungeon ${open ? "" : "locked"} ${cleared ? "cleared" : ""}">
        <div class="dungeon-icon" aria-hidden="true">${open ? d.icon : "🔒"}</div>
        <div class="dungeon-info">
          <div class="dungeon-name pixel">${d.name}</div>
          <div class="mini-monsters">${d.floors.map((f) => monsterArt(f, MONSTERS[f].name)).join("")}</div>
          <div class="workout-meta">Recommended LV ${d.level}</div>
          <div class="workout-meta">${cleared ? `✔ Cleared · Loot: ${loot.name}` : open ? `Boss loot: ${loot.name}` : `Clear ${DUNGEONS[i - 1].name} first`}</div>
        </div>
        <button type="button" class="btn pixel enter-btn" data-dungeon="${i}" ${open ? "" : "disabled"}>${cleared ? "Again" : "Enter"}</button>
      </div>`;
  }).join("");
  $("kill-count").textContent = `${progress.kills} slain`;
}

document.getElementById("shop-list").addEventListener("click", (event) => {
  const btn = event.target.closest(".buy-btn");
  if (btn && !btn.disabled) buyItem(btn.dataset.buy);
});

document.getElementById("dungeon-list").addEventListener("click", (event) => {
  const btn = event.target.closest(".enter-btn");
  if (btn && !btn.disabled) startDungeon(Number(btn.dataset.dungeon));
});
