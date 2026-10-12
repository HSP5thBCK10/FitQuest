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

# FitTrack (fitness app)

A mobile fitness tracker in the `fitness/` folder. It's a Progressive Web App (PWA): it
runs in your phone's browser, can be installed to the home screen like a normal app, and
works offline.

## Features

- Log workouts: activity, duration, distance, calories, date, and notes
- Calories are estimated automatically from the activity and your body weight
- Weekly goal progress ring, today's totals, and your day streak
- 7-day activity chart
- Full history grouped by day, with delete
- Settings for weekly goal and body weight
- Export your data as JSON
- Data is stored only on your device (browser storage)

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
| `index.html`       | Screens: Today, Log, History, Settings      |
| `app.css`          | Mobile-first styles, automatic dark mode    |
| `app.js`           | Workout logic, stats, charts, storage       |
| `sw.js`            | Service worker for offline use              |
| `manifest.json`    | Makes the app installable                   |
| `icons/`           | App icons                                   |

When you change app files, bump `CACHE` in `sw.js` (e.g. `fittrack-v2`) so installed
copies pick up the update.
