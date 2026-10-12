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

## How the game works

- **XP:** every minute of training earns 2 XP, multiplied by your class bonus
- **Attributes:** each activity trains STR, AGI, WIS or VIT; stats grow as you train
- **Levels & titles:** level up as XP adds up, unlocking class titles
  (e.g. Barbarian: Wildling → Brute → Raider → Berserker → … → Godslayer)
- **Daily quest:** a class-specific challenge each day for bonus XP
- Streaks, weekly goal, 7-day chart, calorie estimates, and a full workout journal
- Deleting a workout removes its XP (and the quest bonus, if it no longer qualifies)

## Loot: gear & badges

- **23 achievement badges**: workout milestones (1/10/50/100), streaks (3/7/30 days),
  distance (5K, 10K, marathon total), quests, levels, attribute mastery and more.
  Locked badges show your progress toward them.
- **16 pieces of unlockable gear** in 4 slots: headgear, capes, companion pets and
  auras. Unlock them by leveling up or earning badges, and equip them in **Loot**:
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
| `index.html`       | Screens: Hero, Train, Loot, Journal, Camp, class picker |
| `app.css`          | Pixel/retro game styling                    |
| `app.js`           | Classes, XP, quests, badges, gear, pixel sprites, storage |
| `sw.js`            | Service worker for offline use              |
| `manifest.json`    | Makes the app installable                   |
| `icons/`, `fonts/` | App icons and the Press Start 2P pixel font (OFL) |

When you change app files, bump `CACHE` in `sw.js` (e.g. `fitquest-v4`) so installed
copies pick up the update.
