// ---------- Dungeons & turn-based battles ----------
// Loaded before app.js. It only uses app.js globals (settings, load, save,
// skillRank, heroAttributes, ...) inside functions, which run after both load.

// Monster abilities
//   enrage:  +50% damage once below 40% HP
//   drain:   heals for half the damage it deals
//   armored: double armor
//   evasive: 20% chance to dodge each of your hits
//   poison / burn: 35% chance per hit to deal damage over 3 turns
const ABILITIES = {
  enrage: "Enrages when wounded",
  drain: "Drains your life",
  armored: "Thick armor",
  evasive: "Hard to hit",
  poison: "Venomous",
  burn: "Burns with fire",
};

const MONSTERS = {
  rat: { name: "Giant Rat", icon: "🐀" },
  goblin: { name: "Goblin", icon: "👺", ability: "enrage" },
  goblin_king: { name: "Goblin King", icon: "👹", ability: "enrage", boss: true },
  bat: { name: "Vampire Bat", icon: "🦇", ability: "drain" },
  skeleton: { name: "Skeleton", icon: "💀", ability: "armored" },
  lich: { name: "Lich", icon: "🧟", ability: "drain", boss: true },
  wolf: { name: "Dire Wolf", icon: "🐺", ability: "evasive" },
  spider: { name: "Giant Spider", icon: "🕷️", ability: "poison" },
  treant: { name: "Elder Treant", icon: "🌳", ability: "armored", boss: true },
  imp: { name: "Fire Imp", icon: "😈", ability: "evasive" },
  golem: { name: "Lava Golem", icon: "🗿", ability: "armored" },
  drake: { name: "Fire Drake", icon: "🐲", ability: "burn", boss: true },
  wyvern: { name: "Wyvern", icon: "🦅", ability: "evasive" },
  ogre: { name: "Ogre", icon: "🧌", ability: "enrage" },
  dragon: { name: "Ancient Dragon", icon: "🐉", ability: "burn", boss: true },
};

// Each dungeon has 3 floors; the boss on the last floor is one level higher
const DUNGEONS = [
  { id: "cave", name: "Goblin Cave", icon: "🕳️", level: 1, floors: ["rat", "goblin", "goblin_king"] },
  { id: "crypt", name: "Haunted Crypt", icon: "⚰️", level: 4, floors: ["bat", "skeleton", "lich"] },
  { id: "forest", name: "Spider Forest", icon: "🌲", level: 8, floors: ["wolf", "spider", "treant"] },
  { id: "volcano", name: "Volcano Depths", icon: "🌋", level: 12, floors: ["imp", "golem", "drake"] },
  { id: "peak", name: "Dragon's Peak", icon: "🏔️", level: 17, floors: ["wyvern", "ogre", "dragon"] },
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
  ],
};

// Each promoted class gains one exclusive ultimate skill. It unlocks with the
// promotion itself and grows stronger with ranks in its challenge.
const ULTIMATE_SKILLS = {
  chieftain: { id: "warlords_roar", name: "Warlord's Roar", icon: "🦁", challenge: "ohp", cost: 45, ultimate: true,
    desc: "Heal 15% of max HP and +50% damage for 3 turns", effect: { heal: 0.15, buff: { atk: 0.5, turns: 3 } } },
  master: { id: "thousand_palms", name: "Thousand Palms", icon: "🙏", challenge: "pushups", cost: 50, ultimate: true,
    desc: "6 strikes of 35% damage that ignore armor", effect: { damage: 0.35, hits: 6, pierce: true } },
  gladiator: { id: "arena_fury", name: "Arena Fury", icon: "🏟️", challenge: "pullups", cost: 50, ultimate: true,
    desc: "3 heavy blows of 90% damage with +20% crit chance", effect: { damage: 0.9, hits: 3, crit: 20 } },
  paladin: { id: "holy_light", name: "Holy Light", icon: "🌟", challenge: "meditation", cost: 50, ultimate: true,
    desc: "Heal 20% of max HP and +30% armor for 2 turns", effect: { heal: 0.2, buff: { def: 0.3, turns: 2 } } },
};

const CLASS_PASSIVES = {
  barbarian: "Bloodlust: +20% max HP, muscle (STR) adds to HP, and heal 15% of damage dealt",
  assassin: "Killer Instinct: +10% crit chance",
  monk: "Inner Peace: heal 3% HP every turn",
  warrior: "Veteran: +15% damage and +15% armor",
  knight: "Endurance: +20% max HP, +10% armor, and power from both STR and VIT",
  chieftain: "Warchief: +25% max HP, +5% power, muscle (STR) adds to HP, and heal 20% of damage dealt",
  master: "Enlightenment: heal 3.5% HP every turn, +5% dodge and +5% power",
  gladiator: "Arena Champion: +25% damage, +15% armor and +8% crit chance",
  paladin: "Divine Endurance: +25% max HP, +15% armor, and power from STR and VIT",
};

// How each class turns attributes into battle stats (multipliers default to 1)
const balanced = (a) => ((a.STR + a.AGI + a.WIS + a.VIT) / 4) * 1.3;
const strAndVit = (a) => (a.STR + a.VIT) * 0.5;
const muscle = (a) => a.VIT + a.STR * 0.5; // a barbarian's muscle mass counts toward health
const COMBAT_PROFILES = {
  barbarian: { primary: (a) => a.STR, toughness: muscle, hp: 1.2, lifesteal: 0.15 },
  chieftain: { primary: (a) => a.STR, toughness: muscle, hp: 1.25, pow: 1.05, lifesteal: 0.2 },
  assassin: { primary: (a) => a.AGI, crit: 10 },
  monk: { primary: (a) => a.WIS, regen: 0.03 },
  master: { primary: (a) => a.WIS, pow: 1.05, dodge: 5, regen: 0.035 },
  warrior: { primary: balanced, pow: 1.15, def: 1.15 },
  gladiator: { primary: balanced, pow: 1.25, def: 1.15, crit: 8 },
  knight: { primary: strAndVit, hp: 1.2, def: 1.1 },
  paladin: { primary: strAndVit, hp: 1.25, def: 1.15 },
};

const FLOOR_LEVELS = [0, 0, 1];
const DUNGEONS_KEY = "fittrack.dungeons";
const MAX_ENERGY = 100;
const POTIONS_PER_RUN = 2;
const TURN_DELAY = 650;

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
function classSkillList(cls) {
  const base = baseClass(cls);
  const ultimate = ULTIMATE_SKILLS[CLASSES[base].promotion];
  return ultimate ? [...CLASS_SKILLS[base], ultimate] : CLASS_SKILLS[base];
}

function combatSkillFor(cls, chId) {
  return classSkillList(cls).find((s) => s.challenge === chId && (!s.ultimate || CLASSES[cls].advanced));
}

function combatSkills() {
  const discount = badgeBuffs().skillCost;
  const promoted = Boolean(CLASSES[settings.cls].advanced);
  return classSkillList(settings.cls).map((s) => ({
    ...s,
    rank: s.ultimate ? (promoted ? Math.max(1, skillRank(s.challenge)) : 0) : skillRank(s.challenge),
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
  // Deeper dungeons get a little tougher to keep pace with badge buffs
  const scale = 1 + level * 0.006;
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

function addLog(text) {
  battle.log.push(text);
  if (battle.log.length > 5) battle.log.shift();
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
    busy: false,
    over: false,
  };
  battle.enemy = monsterOnFloor(dungeon, 0);
  addLog(`You enter ${dungeon.name}...`);
  addLog(`A ${battle.enemy.name} appears!`);
  $("b-hero-sprite").innerHTML = heroSvg(settings.cls, settings.gear, "Your hero");
  $("b-enemy-sprite").dataset.monster = "";
  $("battle").hidden = false;
  renderBattle();
}

function heroStrike(mult, opts = {}) {
  const e = battle.enemy;
  let total = 0;
  let crits = 0;
  for (let i = 0; i < (opts.hits || 1) && e.hp > 0; i++) {
    if (e.ability === "evasive" && Math.random() < 0.2) {
      floatText("enemy", "MISS");
      continue;
    }
    let m = mult * (e.boss ? 1 + battle.stats.bossDmg : 1);
    if (opts.execute && e.hp / e.maxHp < opts.execute) m *= 3;
    const crit = Math.random() * 100 < battle.stats.crit + (opts.crit || 0);
    const raw = battle.stats.pow * m * (1 + buffTotal("atk")) * (crit ? 1.75 : 1);
    const dmg = Math.max(1, Math.round(mitigate(raw, opts.pierce ? 0 : e.def) * rand(0.9, 1.1)));
    e.hp = Math.max(0, e.hp - dmg);
    total += dmg;
    if (crit) crits++;
    floatText("enemy", crit ? `${dmg}!` : String(dmg), crit ? "crit" : "");
  }
  if (battle.stats.lifesteal && total) healAmount(total * battle.stats.lifesteal);
  return { total, crits };
}

function strikeText({ total, crits }) {
  if (!total) return "but it misses";
  return `${total} damage${crits ? (crits > 1 ? ` (${crits} crits!)` : " (critical!)") : ""}`;
}

function useSkill(skill) {
  const power = skillPower(skill.rank);
  const fx = skill.effect;
  const e = battle.enemy;
  const parts = [];
  battle.energy -= skill.cost;

  if (fx.damage) {
    parts.push(strikeText(heroStrike(fx.damage * power, fx)));
    if (fx.recoil) {
      const recoil = Math.round(battle.stats.maxHp * fx.recoil);
      battle.hp = Math.max(1, battle.hp - recoil);
      parts.push(`you take ${recoil} recoil`);
    }
    if (fx.stun && e.hp > 0) {
      // Bosses resist stuns, and nothing can be stunned two turns in a row
      const chance = e.stunImmune ? 0 : (fx.stun + 0.1 * (skill.rank - 1)) * (e.boss ? 0.5 : 1);
      if (Math.random() < chance) {
        e.stun = true;
        parts.push(`${e.name} is stunned`);
      } else {
        parts.push(e.stunImmune ? `${e.name} resists the stun` : "no stun");
      }
    }
    if (fx.poison && e.hp > 0) {
      e.dot = { dmg: Math.max(1, Math.round(battle.stats.pow * fx.poison.pct * power)), turns: fx.poison.turns, label: "Poison" };
      parts.push("poisoned");
    }
  }
  if (fx.heal) {
    const healed = heal(fx.heal * power);
    parts.push(healed ? `healed ${healed} HP` : "already at full HP");
  }
  if (fx.cleanse && battle.dot) {
    battle.dot = null;
    parts.push("cured");
  }
  if (fx.buff) {
    const b = { ...fx.buff, name: skill.name };
    if (b.atk) b.atk *= power;
    if (b.def) b.def *= power;
    if (b.regen) b.regen *= power;
    if (b.block) b.block = Math.min(b.block + 0.1 * (skill.rank - 1), 0.8);
    if (b.dodge) b.dodge += 10 * (skill.rank - 1);
    battle.buffs.push(b);
    parts.push(buffSummary(b));
  }
  addLog(`${skill.icon} ${skill.name}: ${parts.join(", ")}.`);
}

function buffSummary(b) {
  const effects = [];
  if (b.atk) effects.push(`+${Math.round(b.atk * 100)}% damage`);
  if (b.def) effects.push(`+${Math.round(b.def * 100)}% armor`);
  if (b.block) effects.push(`blocking ${Math.round(b.block * 100)}%`);
  if (b.dodge) effects.push(`+${b.dodge}% dodge`);
  if (b.regen) effects.push(`healing ${Math.round(b.regen * 100)}% per turn`);
  if (b.evade) return "ready to dodge the next attack";
  return `${effects.join(" and ")} for ${b.turns} turn${b.turns > 1 ? "s" : ""}`;
}

function enemyStrike(mult) {
  const e = battle.enemy;
  const evade = battle.buffs.find((b) => b.evade);
  if (evade) {
    battle.buffs = battle.buffs.filter((b) => b !== evade);
    floatText("hero", "DODGE");
    addLog(`You slip into the shadows and dodge ${e.name}!`);
    return;
  }
  if (Math.random() * 100 < battle.stats.dodge + buffTotal("dodge")) {
    floatText("hero", "DODGE");
    addLog(`You dodge ${e.name}'s attack!`);
    return;
  }
  const raw = e.atk * mult * (e.enraged ? 1.5 : 1);
  const blocked = 1 - Math.min(buffTotal("block"), 0.85);
  const dmg = Math.max(1, Math.round(mitigate(raw, battle.stats.def * (1 + buffTotal("def"))) * blocked * rand(0.9, 1.1)));
  battle.hp = Math.max(0, battle.hp - dmg);
  floatText("hero", String(dmg), "hurt");
  addLog(`${e.name} hits you for ${dmg}${blocked < 1 ? " (blocked some)" : ""}.`);

  if (e.ability === "drain") {
    const healed = Math.min(Math.round(dmg * 0.5), e.maxHp - e.hp);
    if (healed > 0) {
      e.hp += healed;
      addLog(`${e.name} drains ${healed} HP.`);
    }
  }
  if ((e.ability === "poison" || e.ability === "burn") && !battle.dot && Math.random() < 0.35) {
    const label = e.ability === "burn" ? "Burn" : "Poison";
    battle.dot = { dmg: Math.max(1, Math.round(e.atk * 0.3)), turns: 3, label };
    addLog(e.ability === "burn" ? "You are burning!" : "You are poisoned!");
  }
}

function enemyTurn() {
  const e = battle.enemy;
  e.turn++;
  if (e.dot) {
    e.hp = Math.max(0, e.hp - e.dot.dmg);
    floatText("enemy", String(e.dot.dmg), "dot");
    addLog(`${e.name} takes ${e.dot.dmg} ${e.dot.label.toLowerCase()} damage.`);
    e.dot.turns--;
    if (!e.dot.turns) e.dot = null;
    if (e.hp <= 0) return;
  }
  if (e.stun) {
    e.stun = false;
    e.stunImmune = true;
    e.windup = false;
    addLog(`${e.name} is stunned and can't move!`);
    return;
  }
  e.stunImmune = false;
  if (e.ability === "enrage" && !e.enraged && e.hp / e.maxHp < 0.4) {
    e.enraged = true;
    addLog(`${e.name} flies into a rage!`);
  }
  // Bosses telegraph a heavy attack every third turn: a good time to defend
  if (e.boss) {
    if (e.windup) {
      e.windup = false;
      addLog(`${e.name} unleashes a devastating attack!`);
      enemyStrike(2.2);
      return;
    }
    if (e.turn % 3 === 0) {
      e.windup = true;
      addLog(`⚠️ ${e.name} is winding up a huge attack!`);
      return;
    }
  }
  enemyStrike(1);
}

function endRound() {
  if (battle.dot) {
    battle.hp = Math.max(0, battle.hp - battle.dot.dmg);
    floatText("hero", String(battle.dot.dmg), "dot");
    addLog(`You take ${battle.dot.dmg} ${battle.dot.label.toLowerCase()} damage.`);
    battle.dot.turns--;
    if (!battle.dot.turns) battle.dot = null;
  }
  const regen = battle.stats.regen + buffTotal("regen");
  if (regen && battle.hp > 0) heal(regen);
  battle.energy = Math.min(MAX_ENERGY, battle.energy + battle.stats.energyPerTurn);
  battle.buffs = battle.buffs.map((b) => ({ ...b, turns: b.turns - 1 })).filter((b) => b.turns > 0);
}

async function act(action) {
  if (!battle || battle.busy || battle.over) return;
  const skill = combatSkills().find((s) => s.id === action);
  if (skill && (skill.rank < 1 || battle.energy < skill.cost)) return;
  if (action === "potion" && battle.potions <= 0) return;

  const current = battle;
  battle.busy = true;
  if (action === "attack") {
    addLog(`You attack: ${strikeText(heroStrike(1))}.`);
    battle.energy += 10;
  } else if (action === "defend") {
    battle.buffs.push({ block: 0.5, turns: 1, name: "Guard" });
    battle.energy += 20;
    addLog("You raise your guard.");
  } else if (action === "potion") {
    battle.potions--;
    addLog(`🧪 You drink a potion and heal ${heal(battle.stats.potionHeal)} HP.`);
  } else if (skill) {
    useSkill(skill);
  }
  battle.energy = Math.min(MAX_ENERGY, battle.energy);
  renderBattle();
  if (battle.enemy.hp <= 0) return enemyDefeated();

  await wait(TURN_DELAY);
  if (battle !== current) return; // fled mid-turn
  enemyTurn();
  renderBattle();
  if (battle.enemy.hp <= 0) return enemyDefeated();
  if (battle.hp <= 0) return defeat();

  endRound();
  if (battle.hp <= 0) {
    renderBattle();
    return defeat();
  }
  battle.busy = false;
  renderBattle();
}

async function enemyDefeated() {
  const e = battle.enemy;
  addLog(`${e.icon} ${e.name} is defeated!`);
  dungeonProgress().kills++;
  saveDungeons();
  renderBattle();
  const current = battle;
  await wait(900);
  if (battle !== current) return;

  if (battle.floor < battle.dungeon.floors.length - 1) {
    battle.floor++;
    battle.buffs = [];
    battle.dot = null;
    const healed = heal(0.3);
    battle.enemy = monsterOnFloor(battle.dungeon, battle.floor);
    if (healed) addLog(`You catch your breath (+${healed} HP).`);
    addLog(`${battle.enemy.boss ? "👑 BOSS: " : ""}${battle.enemy.name} appears!`);
    battle.busy = false;
    renderBattle();
  } else {
    victory();
  }
}

function victory() {
  const progress = dungeonProgress();
  const first = !progress.cleared[battle.dungeon.id];
  if (first) progress.cleared[battle.dungeon.id] = toKey(new Date());
  saveDungeons();
  battle.over = true;

  const level = levelInfo(totalXp()).level;
  const unlocks = syncUnlocks();
  render();
  const next = DUNGEONS[DUNGEONS.indexOf(battle.dungeon) + 1];
  showBattleEnd(
    "Victory!",
    first
      ? `You conquered ${battle.dungeon.name}!${next ? ` ${next.name} is now open.` : " You have conquered every dungeon!"}`
      : `You conquered ${battle.dungeon.name} again.`
  );
  celebrate(level, unlocks);
}

function defeat() {
  battle.over = true;
  render();
  showBattleEnd(
    "Defeated",
    `You fell on floor ${battle.floor + 1} to the ${battle.enemy.name}. Train in real life to grow stronger: workouts raise your attributes and challenges teach new combat skills.`
  );
}

function fleeBattle() {
  if (battle && !battle.over && !confirm("Flee the dungeon? Your progress in this run will be lost.")) return;
  battle = null;
  $("battle").hidden = true;
  renderFight();
}

// ---------- Battle UI ----------

function floatText(target, text, cls = "") {
  const host = $(target === "enemy" ? "b-enemy-sprite" : "b-hero-sprite");
  const el = document.createElement("span");
  el.className = `floater pixel ${cls}`;
  el.textContent = text;
  host.appendChild(el);
  setTimeout(() => el.remove(), 1000);
  if (cls !== "heal") {
    host.classList.remove("hit");
    void host.offsetWidth; // restart the shake animation
    host.classList.add("hit");
  }
}

function statusChips(list) {
  return list.map(([icon, text]) => `<span class="chip">${icon} ${text}</span>`).join("");
}

function renderBattle() {
  const b = battle;
  const e = b.enemy;
  $("b-dungeon").textContent = b.dungeon.name;
  $("b-floor").textContent = `Floor ${b.floor + 1}/${b.dungeon.floors.length}`;

  const enemySprite = $("b-enemy-sprite");
  if (enemySprite.dataset.monster !== e.id) {
    enemySprite.dataset.monster = e.id;
    enemySprite.innerHTML = `<span class="monster-icon ${e.boss ? "boss" : ""}">${e.icon}</span>`;
  }
  enemySprite.classList.toggle("defeated", e.hp <= 0);
  $("b-enemy-name").textContent = `${e.boss ? "👑 " : ""}${e.name}`;
  $("b-enemy-level").textContent = `LV ${e.level}`;
  $("b-enemy-hp").style.width = `${(e.hp / e.maxHp) * 100}%`;
  $("b-enemy-hp-text").textContent = `${e.hp} / ${e.maxHp}`;
  const enemyStatus = [];
  if (e.ability) enemyStatus.push(["★", ABILITIES[e.ability]]);
  if (e.windup) enemyStatus.push(["⚠️", "Winding up!"]);
  if (e.stun) enemyStatus.push(["💫", "Stunned"]);
  if (e.enraged) enemyStatus.push(["😡", "Enraged"]);
  if (e.dot) enemyStatus.push(["🧪", `${e.dot.label} ${e.dot.turns}`]);
  $("b-enemy-status").innerHTML = statusChips(enemyStatus);

  $("b-hero-name").textContent = settings.heroName || "Hero";
  $("b-hero-hp").style.width = `${(b.hp / b.stats.maxHp) * 100}%`;
  $("b-hero-hp-text").textContent = `${b.hp} / ${b.stats.maxHp}`;
  $("b-energy").style.width = `${b.energy}%`;
  $("b-energy-text").textContent = `${b.energy} / ${MAX_ENERGY}`;
  const heroStatus = b.buffs.map((x) => ["✦", `${x.name} ${x.turns}`]);
  if (b.dot) heroStatus.push([b.dot.label === "Burn" ? "🔥" : "🧪", `${b.dot.label} ${b.dot.turns}`]);
  $("b-hero-status").innerHTML = statusChips(heroStatus);

  $("b-log").innerHTML = b.log.map((line, i) => `<p class="${i === b.log.length - 1 ? "latest" : ""}">${line}</p>`).join("");

  if (b.over) return;
  const disabled = b.busy ? "disabled" : "";
  const skills = combatSkills()
    .map((s) => {
      if (s.rank < 1) {
        return `
          <button type="button" class="action skill locked" disabled>
            <span class="action-name">🔒 ${s.name}</span>
            <span class="action-sub">${s.ultimate ? "Class promotion" : `${CHALLENGES[s.challenge].name} rank I`}</span>
          </button>`;
      }
      const noEnergy = b.energy < s.cost;
      return `
        <button type="button" class="action skill ${s.ultimate ? "ultimate" : ""}" data-action="${s.id}" ${disabled || noEnergy ? "disabled" : ""}>
          <span class="action-name">${s.icon} ${s.name}</span>
          <span class="action-sub">${s.cost} EN · Rank ${RANKS[s.rank - 1]}</span>
        </button>`;
    })
    .join("");
  $("b-actions").innerHTML = `
    <button type="button" class="action" data-action="attack" ${disabled}>
      <span class="action-name">⚔️ Attack</span><span class="action-sub">+10 EN</span>
    </button>
    <button type="button" class="action" data-action="defend" ${disabled}>
      <span class="action-name">🛡️ Defend</span><span class="action-sub">Block 50% · +20 EN</span>
    </button>
    <button type="button" class="action" data-action="potion" ${disabled || !b.potions ? "disabled" : ""}>
      <span class="action-name">🧪 Potion</span><span class="action-sub">Heal ${Math.round(b.stats.potionHeal * 100)}% · ${b.potions} left</span>
    </button>
    ${skills}`;
}

function showBattleEnd(title, text) {
  renderBattle();
  $("b-actions").innerHTML = `
    <div class="battle-end panel">
      <div class="popup-title pixel">${title}</div>
      <p class="popup-text">${text}</p>
      <button type="button" class="btn pixel" id="b-return">Return to Town</button>
    </div>`;
}

document.getElementById("b-actions").addEventListener("click", (event) => {
  if (event.target.closest("#b-return")) return fleeBattle();
  const btn = event.target.closest(".action[data-action]");
  if (btn && !btn.disabled) act(btn.dataset.action);
});

document.getElementById("b-flee").addEventListener("click", fleeBattle);

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
            ? `🔒 Promote to ${CLASSES[CLASSES[settings.cls].promotion].name} at LV ${PROMOTION_LEVEL} to unlock`
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
          <div class="workout-meta">Recommended LV ${d.level} · ${d.floors.map((f) => MONSTERS[f].icon).join(" ")}</div>
          <div class="workout-meta">${cleared ? `✔ Cleared · Loot: ${loot.name}` : open ? `Boss loot: ${loot.name}` : `Clear ${DUNGEONS[i - 1].name} first`}</div>
        </div>
        <button type="button" class="btn pixel enter-btn" data-dungeon="${i}" ${open ? "" : "disabled"}>${cleared ? "Again" : "Enter"}</button>
      </div>`;
  }).join("");
  $("kill-count").textContent = `${progress.kills} slain`;
}

document.getElementById("dungeon-list").addEventListener("click", (event) => {
  const btn = event.target.closest(".enter-btn");
  if (btn && !btn.disabled) startDungeon(Number(btn.dataset.dungeon));
});
