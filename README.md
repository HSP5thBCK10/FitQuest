# First Project

A simple, responsive static website built with plain HTML, CSS, and JavaScript.

## Features

- Responsive layout with a mobile menu
- Light/dark mode toggle (remembered between visits)
- Contact form with client-side validation

## Running it

There's no build step. Either:

- Open `index.html` directly in your browser, or
- Serve the folder locally:

  ```bash
  python3 -m http.server 8000
  ```

  then visit http://localhost:8000

## Files

| File         | Purpose                     |
| ------------ | --------------------------- |
| `index.html` | Page structure and content  |
| `styles.css` | Styling and themes          |
| `script.js`  | Menu, dark mode, form logic |

## Note

The contact form doesn't send anything yet. To make it work for real, connect it to a
form service (e.g. Formspree) or your own backend.

---

# FitQuest (fitness RPG app)

A video-game-style fitness tracker in the `fitness/` folder. Your workouts earn XP that
levels up your hero. It's a Progressive Web App (PWA): it runs in your phone's browser,
can be installed to the home screen like a normal app, and works offline.

## Classes

On first launch you choose a class (you can change it later in **Camp**):

| Class         | Body type              | Focus                                  | Bonus                 |
| ------------- | ---------------------- | -------------------------------------- | --------------------- |
| **Barbarian** | Bodybuilder physique   | Heavy lifting, muscle mass             | 2× XP on Strength     |
| **Assassin**  | Lean & athletic        | Running, HIIT, cycling, sports         | 2× XP on Agility      |
| **Monk**      | Flexible & balanced    | Yoga, stretching, meditation           | 2× XP on Wisdom       |
| **Warrior**   | Regular physique       | A balanced mix of everything           | 1.5× XP on all training |
| **Knight**    | Strong & enduring      | Endurance, stamina & functional strength | 1.75× XP on Strength and Vitality |

### Class promotions

At **level 10**, every class can be promoted from the Hero screen. A promotion keeps
your progress and adds a stronger XP bonus, an upgraded passive, an exclusive
**Ultimate** combat skill, new titles and upgraded armor on your sprite.

| Base class | Promotes to   | XP bonus                       | Ultimate skill (grows with this challenge) |
| ---------- | ------------- | ------------------------------ | ------------------------------------------ |
| Barbarian  | **Chieftain** | 2.5× Strength                  | Warlord's Roar: heal 15% and +50% damage (overhead press) |
| Assassin   | **Phantom**   | 2.5× Agility                   | Death Mark: 180% damage that always crits (squat) |
| Monk       | **Master**    | 2.5× Wisdom                    | Thousand Palms: 6 armor-piercing strikes (push-ups) |
| Warrior    | **Gladiator** | 1.75× everything               | Arena Fury: 3 heavy blows with +20% crit (pull-ups) |
| Knight     | **Paladin**   | 2× Strength and Vitality       | Holy Light: heal 20% and +30% armor (meditation) |

Picking your base class again in **Camp** keeps your promotion; switching to a different
class means promoting that one separately.

## How the game works

- **XP:** every minute of training earns 2 XP, multiplied by your class bonus
- **Attributes:** each activity trains STR, AGI, WIS or VIT; stats grow as you train
- **Levels & titles:** level up as XP adds up, unlocking class titles
  (e.g. Barbarian: Wildling → Brute → Raider → Berserker → … → Godslayer)
- **Daily quest:** a class-specific challenge each day for bonus XP
- Streaks, weekly goal, 7-day chart, calorie estimates, and a full workout journal
- Deleting a workout removes its XP (and the quest bonus, if it no longer qualifies)

## Challenges & skills

In **Train → Challenge**, record personal-record attempts to learn skills. Each challenge
has 3 skill ranks; each rank gives attribute points and bonus XP, and every new personal
record gives +30 XP.

| Challenge      | Rank I → II → III                       | Skills                                      |
| -------------- | --------------------------------------- | ------------------------------------------- |
| Bench Press    | 0.75× → 1× → 1.5× bodyweight            | Shield Push, Iron Bulwark, Titan's Press    |
| Squat          | 1× → 1.5× → 2× bodyweight               | Stone Legs, Earthshaker, Mountain Stance    |
| Deadlift       | 1.25× → 1.75× → 2.5× bodyweight         | Grave Lift, Ogre Grip, World Lifter         |
| Overhead Press | 0.5× → 0.75× → 1× bodyweight            | Overhead Strike, Sky Splitter, Heaven's Hammer |
| Pull-ups       | 5 → 10 → 20 reps                        | Wall Climber, Rope Ascent, Spider Grip      |
| Push-ups       | 20 → 40 → 60 reps                       | Battle Ready, Iron Arms, Hundred Fists      |
| Mile Run       | 10:00 → 8:00 → 6:00                     | Quickstep, Wind Walker, Shadow Sprint       |
| 5K Run         | 35:00 → 28:00 → 22:00                   | Pathfinder, Swift Courier, Phantom Stride   |
| Plank Hold     | 1:00 → 2:00 → 4:00                      | Stone Skin, Iron Core, Unbreakable          |
| Meditation Sit | 10:00 → 20:00 → 45:00                   | Calm Mind, Inner Sight, Transcendence       |

Lifts use your estimated one-rep max (weight × reps), compared to your body weight at the
time of the lift, so ranks are fair for every size. Weights can be entered in kg or lb
(set in **Camp**).

## Fight: dungeons & combat skills

Take your hero into **5 dungeons** (Goblin Cave → Haunted Crypt → Spider Forest → Volcano
Depths → Dragon's Peak), each with 3 floors: two monsters and a boss. Battles are
turn-based and play out like a classic Pokémon battle: your hero (seen from behind, in
their class armor and equipped gear) and the monster (each with its own pixel-art sprite)
face off on the battlefield with HP boxes, messages type out one at a time ("A wild Goblin
appeared!", "A critical hit!"), and you choose **FIGHT** (Strike or one of your class
moves, which cost energy), **BAG** (Potions, 2 per run), **GUARD** or **RUN**. Tap the
message box to speed through text.

- **Your battle stats come from real training.** HP, power, armor, crit and dodge are
  based on your level and attributes, so you can't grind your way through: you get
  stronger by working out.
- **Combat skills are unique to each class** (5 each) and are learned through
  challenges: reach rank I in the matching challenge to unlock a skill, and every higher
  rank makes it stronger (+25% power per rank).

| Class     | Combat skills (challenge that teaches it)                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Barbarian | Crushing Blow (bench), Earthquake (squat), Rampage (deadlift), War Cry (push-ups), Thick Hide (plank)        |
| Assassin  | Shadowstep (mile), Blade Flurry (5K), Backstab (pull-ups), Poison Blade (push-ups), Smoke Bomb (plank)      |
| Monk      | Inner Light (meditation), Iron Body (plank), Flowing Strikes (mile), Palm of Heaven (overhead press), Dragon Kick (pull-ups) |
| Warrior   | Shield Bash (bench), Power Strike (squat), Second Wind (5K), Battle Shout (push-ups), Execute (deadlift)    |
| Knight    | Valiant Strike (squat), Aegis Wall (plank), Vigil (5K), Lance Charge (deadlift), Oath of Iron (push-ups)    |

- Each class also has a passive (Barbarian lifesteal, Assassin crit, Monk regeneration,
  Warrior damage and armor, Knight extra HP and armor with power from STR and VIT).
- Monsters have abilities (enrage, life drain, armor, evasion, poison, burn), and bosses
  telegraph a huge attack every third turn, so that's the time to Defend.
- Clearing a dungeon unlocks the next one and drops exclusive gear. Fights don't give XP:
  that only comes from real exercise.

## Loot: gear & badges

- **29 achievement badges**: workout milestones (1/10/50/100), streaks (3/7/30 days),
  distance (5K, 10K, marathon total), quests, levels, attribute mastery and more.
  Locked badges show your progress toward them.
- **Every badge grants a permanent buff**, and buffs stack. The Loot screen lists each
  badge's buff and an **Active Buffs** total. XP buffs apply to workouts, quests and
  records logged after you earn the badge; battle buffs apply in every fight.

| Buff type | Badges |
| --------- | ------ |
| XP | Veteran +5% · Iron Habit +10% · Dragonslayer +10% (all workouts); Iron Body / Wind Runner / Inner Calm / Trailblazer +10% (STR / AGI / WIS / VIT workouts); Quest Hunter +25% · Questmaster +50% (quest XP); Personal Best +50% (PR XP) |
| Battle stats | First Blood +5% HP · Endurance +10% HP · Legend +10% HP & power · Centurion +10% power · Rising Hero +5% power · Monster Hunter +5% power · Champion +10% armor · On Fire +3% crit · Grandmaster +5% crit · First 5K +2% dodge · 10K Club +3% dodge · Jack of All Trades +2 every attribute |
| Dungeon perks | Adventurer +1 potion · Explorer potions heal +10% · Marathoner 1% HP regen per turn · Unstoppable +15 starting energy · Goal Crusher +5 energy per turn · Skilled skills cost 5 less · Dungeon Delver +10% boss damage |
- **21 pieces of unlockable gear** in 4 slots: headgear, capes, companion pets and
  auras. Unlock them by leveling up, earning badges or clearing dungeons, and equip them in **Loot**:
  they appear on your pixel hero. Top-tier items give a permanent +5% XP bonus each
  (applies to new workouts).
- Popups announce new badges and gear when you earn them. Deleting workouts can take
  them away again.
- Data is stored only on your device; export it from **Camp**

## Running it

```bash
cd fitness
python3 -m http.server 8000
```

Then open http://localhost:8000 (offline support needs a server, so double-clicking
`index.html` won't enable it).

## Installing on your phone

The app must be served over HTTPS to install. The easiest free option is GitHub Pages
(repo **Settings → Pages**, deploy from your branch), then visit `/fitness/`:

- **iPhone (Safari):** Share → *Add to Home Screen*
- **Android (Chrome):** menu ⋮ → *Install app*

## Files

| File               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `index.html`       | Screens: Hero, Train, Fight, Loot, Journal, Camp, class picker, battle |
| `app.css`          | Pixel/retro game styling                    |
| `app.js`           | Classes, XP, quests, challenges, skills, badges, gear, sprites |
| `battle.js`        | Dungeons, monsters, class combat skills, turn-based battles |
| `battle-art.js`    | Pixel-art battle sprites: monsters and hero back views |
| `sw.js`            | Service worker for offline use              |
| `manifest.json`    | Makes the app installable                   |
| `icons/`, `fonts/` | App icons and the Press Start 2P pixel font (OFL) |

When you change app files, bump `CACHE` in `sw.js` (e.g. `fitquest-v12`) so installed
copies pick up the update.
