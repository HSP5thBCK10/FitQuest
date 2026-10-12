// ---------- Data ----------

// MET values are used to estimate calories: kcal = MET * weight(kg) * hours
const ACTIVITIES = {
  running: { label: "Running", icon: "🏃", met: 9.8 },
  walking: { label: "Walking", icon: "🚶", met: 3.5 },
  cycling: { label: "Cycling", icon: "🚴", met: 7.5 },
  swimming: { label: "Swimming", icon: "🏊", met: 8.0 },
  strength: { label: "Strength Training", icon: "🏋️", met: 5.0 },
  yoga: { label: "Yoga", icon: "🧘", met: 2.5 },
  hiit: { label: "HIIT", icon: "🔥", met: 8.0 },
  hiking: { label: "Hiking", icon: "🥾", met: 6.0 },
  sports: { label: "Sports", icon: "⚽", met: 7.0 },
  other: { label: "Other", icon: "⭐", met: 4.0 },
};

const STORAGE_KEY = "fittrack.workouts";
const SETTINGS_KEY = "fittrack.settings";
const DEFAULT_SETTINGS = { goal: 150, weight: 70 };

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

// ---------- Calculations ----------

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

// ---------- Rendering ----------

const $ = (id) => document.getElementById(id);

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function workoutItem(w) {
  const activity = ACTIVITIES[w.type] || ACTIVITIES.other;
  const meta = [`${w.duration} min`];
  if (w.distance) meta.push(`${w.distance} km`);
  meta.push(`${w.calories} kcal`);
  return `
    <li class="workout">
      <div class="workout-icon" aria-hidden="true">${activity.icon}</div>
      <div class="workout-info">
        <div class="workout-name">${activity.label}</div>
        <div class="workout-meta">${meta.join(" · ")}</div>
        ${w.notes ? `<div class="workout-notes">${escapeHtml(w.notes)}</div>` : ""}
      </div>
      <button class="delete-btn" data-id="${w.id}" aria-label="Delete ${activity.label} workout">&#10005;</button>
    </li>`;
}

function renderToday() {
  const now = new Date();
  const todayKey = toKey(now);
  const todays = workoutsOn(todayKey);

  // Weekly goal ring
  const weekStart = toKey(startOfWeek(now));
  const weekMinutes = sumBy(workouts.filter((w) => w.date >= weekStart && w.date <= todayKey), "duration");
  const circumference = 2 * Math.PI * 52;
  const progress = Math.min(weekMinutes / settings.goal, 1);
  const ring = $("goal-ring");
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference * (1 - progress);
  $("week-minutes").textContent = weekMinutes;
  $("week-goal").textContent = settings.goal;

  // Stats
  $("today-minutes").textContent = sumBy(todays, "duration");
  $("today-calories").textContent = sumBy(todays, "calories");
  $("streak").textContent = currentStreak();

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
          <span class="bar-value">${d.minutes || ""}</span>
          <div class="bar ${d.minutes ? "" : "empty"}" style="height:${height}%"></div>
          <span class="bar-day">${label}</span>
        </div>`;
    })
    .join("");

  // Today's list
  $("today-list").innerHTML = todays.length
    ? todays.map(workoutItem).join("")
    : `<li class="empty-state">No workouts yet today. Tap <strong>Log</strong> to add one.</li>`;
}

function renderHistory() {
  $("all-time").innerHTML = `
    <div class="stat"><span class="stat-value">${workouts.length}</span><span class="stat-label">workouts</span></div>
    <div class="stat"><span class="stat-value">${Math.round(sumBy(workouts, "duration") / 60)}</span><span class="stat-label">hours</span></div>
    <div class="stat"><span class="stat-value">${sumBy(workouts, "calories").toLocaleString()}</span><span class="stat-label">kcal</span></div>`;

  if (!workouts.length) {
    $("history-list").innerHTML = `<div class="card empty-state">Your workout history will appear here.</div>`;
    return;
  }

  const byDay = {};
  for (const w of workouts) (byDay[w.date] ||= []).push(w);
  $("history-list").innerHTML = Object.keys(byDay)
    .sort()
    .reverse()
    .map(
      (key) => `
      <div class="history-day">
        <h3>${formatDay(key)} · ${sumBy(byDay[key], "duration")} min</h3>
        <div class="card"><ul class="workout-list">${byDay[key].map(workoutItem).join("")}</ul></div>
      </div>`
    )
    .join("");
}

function render() {
  renderToday();
  renderHistory();
}

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

// ---------- Log workout ----------

const form = $("workout-form");

$("type").innerHTML = Object.entries(ACTIVITIES)
  .map(([value, a]) => `<option value="${value}">${a.icon} ${a.label}</option>`)
  .join("");

function resetForm() {
  form.reset();
  form.date.value = toKey(new Date());
  form.date.max = toKey(new Date());
  updateCalorieHint();
}

function updateCalorieHint() {
  const minutes = Number(form.duration.value);
  $("calorie-hint").textContent =
    minutes > 0 && !form.calories.value
      ? `Estimated: ~${estimateCalories(form.type.value, minutes)} kcal (based on ${settings.weight} kg)`
      : "";
}

["input", "change"].forEach((evt) => form.addEventListener(evt, updateCalorieHint));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = $("form-status");
  status.className = "form-status";

  const duration = Math.round(Number(form.duration.value));
  if (!duration || duration < 1 || duration > 1440) {
    status.textContent = "Please enter a duration between 1 and 1440 minutes.";
    status.classList.add("error");
    return;
  }
  if (!form.date.value) {
    status.textContent = "Please choose a date.";
    status.classList.add("error");
    return;
  }

  const distance = Number(form.distance.value);
  const calories = form.calories.value
    ? Math.round(Number(form.calories.value))
    : estimateCalories(form.type.value, duration);

  workouts.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: form.type.value,
    duration,
    distance: distance > 0 ? Math.round(distance * 100) / 100 : null,
    calories,
    date: form.date.value,
    notes: form.notes.value.trim(),
  });
  save(STORAGE_KEY, workouts);
  render();
  resetForm();
  status.textContent = "Workout saved! 💪";
  status.classList.add("success");
  setTimeout(() => {
    status.textContent = "";
    showScreen("today");
  }, 900);
});

// ---------- Delete ----------

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  if (!confirm("Delete this workout?")) return;
  workouts = workouts.filter((w) => w.id !== btn.dataset.id);
  save(STORAGE_KEY, workouts);
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
  settings = { goal, weight };
  save(SETTINGS_KEY, settings);
  render();
  status.textContent = "Settings saved.";
  status.classList.add("success");
});

$("export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ settings, workouts }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fittrack-${toKey(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

$("clear-btn").addEventListener("click", () => {
  if (!confirm("Delete ALL workouts? This cannot be undone.")) return;
  workouts = [];
  save(STORAGE_KEY, workouts);
  render();
});

// ---------- Start ----------

resetForm();
render();

// Re-render if the app is left open past midnight
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) render();
});

// Offline support
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
