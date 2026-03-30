// ── FITNESS WORLD ────────────────────────────────────────────────────
let _fitPage = 0;
let _fitScanIndex = 0;
let _fitInitialized = false;

// ── FIT TOKEN SYSTEM ──────────────────────────────────────────────────
let _fitTokens = parseInt(localStorage.getItem('fitTokenBalance') || '0', 10);
function updateFitTokenDisplay() {
  const el = document.getElementById('fit-token-count');
  if (el) el.textContent = _fitTokens.toLocaleString();
}
function awardFitTokens(n, reason) {
  _fitTokens += n;
  localStorage.setItem('fitTokenBalance', _fitTokens);
  updateFitTokenDisplay();
  // Trigger main app Firebase sync so tokens are saved to user's account
  if (typeof queueSync === 'function') queueSync();
  const toast = document.createElement('div');
  toast.className = 'fit-token-toast';
  toast.textContent = '+' + n + ' 💪';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
let _fitBuilderQueue = []; // { uid, name, emoji, cat, secs }
let _fitBuilderCat = 'All';
let _fitTimerActive = false;
let _fitTimerStep = 0;
let _fitTimerSecsLeft = 0;
let _fitTimerInterval = null;
let _fitTimerQueue = [];

const FIT_WORKOUTS = [
  { id: 'stretch',  emoji: '🧘', name: 'Morning Stretch',    mins: 10, cat: 'Flexibility' },
  { id: 'walk',     emoji: '🚶', name: 'Walk / Light Cardio', mins: 30, cat: 'Cardio' },
  { id: 'run',      emoji: '🏃', name: 'Run',                 mins: 30, cat: 'Cardio' },
  { id: 'strength', emoji: '🏋️', name: 'Strength Training',  mins: 45, cat: 'Strength' },
  { id: 'hiit',     emoji: '⚡', name: 'HIIT Workout',        mins: 20, cat: 'Cardio' },
  { id: 'yoga',     emoji: '🌿', name: 'Yoga',                mins: 30, cat: 'Flexibility' },
  { id: 'swim',     emoji: '🏊', name: 'Swimming',            mins: 30, cat: 'Cardio' },
  { id: 'bike',     emoji: '🚴', name: 'Cycling',             mins: 40, cat: 'Cardio' },
  { id: 'core',     emoji: '🔥', name: 'Core & Abs',          mins: 15, cat: 'Strength' },
  { id: 'sports',   emoji: '🏀', name: 'Sport / Activity',    mins: 60, cat: 'Cardio' },
];

const FIT_EXERCISES = [
  { cat: '🏃 Cardio',    list: ['Running', 'Jump Rope', 'Burpees', 'Mountain Climbers', 'High Knees', 'Box Jumps', 'Rowing Machine'] },
  { cat: '💪 Chest',     list: ['Push-Ups', 'Bench Press', 'Dumbbell Flyes', 'Cable Crossover', 'Dips', 'Incline Press'] },
  { cat: '🔙 Back',      list: ['Pull-Ups', 'Bent-Over Row', 'Lat Pulldown', 'Deadlift', 'Cable Row', 'Face Pulls'] },
  { cat: '🦵 Legs',      list: ['Squats', 'Lunges', 'Leg Press', 'Romanian Deadlift', 'Calf Raises', 'Leg Curls', 'Glute Bridges'] },
  { cat: '🏋️ Shoulders', list: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Arnold Press', 'Reverse Flyes', 'Shrugs'] },
  { cat: '💪 Arms',      list: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Skull Crushers', 'Cable Curls', 'Tricep Pushdown'] },
  { cat: '🔥 Core',      list: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists', 'Dead Bug', 'Bird Dog', 'Ab Wheel'] },
  { cat: '🧘 Flexibility',list: ["Hip Flexor Stretch", "Hamstring Stretch", "Pigeon Pose", "Child's Pose", "Shoulder Stretch", "Spinal Twist"] },
];

// Flat builder exercise list with emoji + default seconds
const FIT_BUILDER_MOVES = [
  { name: 'Running',           emoji: '🏃', cat: 'Cardio',      secs: 60 },
  { name: 'Jump Rope',         emoji: '⚡', cat: 'Cardio',      secs: 45 },
  { name: 'Burpees',           emoji: '🔥', cat: 'Cardio',      secs: 40 },
  { name: 'Mountain Climbers', emoji: '🧗', cat: 'Cardio',      secs: 40 },
  { name: 'High Knees',        emoji: '🦵', cat: 'Cardio',      secs: 45 },
  { name: 'Box Jumps',         emoji: '📦', cat: 'Cardio',      secs: 30 },
  { name: 'Push-Ups',          emoji: '💪', cat: 'Chest',       secs: 50 },
  { name: 'Bench Press',       emoji: '🏋️', cat: 'Chest',       secs: 60 },
  { name: 'Dips',              emoji: '↕️', cat: 'Chest',       secs: 50 },
  { name: 'Pull-Ups',          emoji: '🔝', cat: 'Back',        secs: 50 },
  { name: 'Bent-Over Row',     emoji: '🔙', cat: 'Back',        secs: 60 },
  { name: 'Deadlift',          emoji: '⬆️', cat: 'Back',        secs: 60 },
  { name: 'Squats',            emoji: '🦵', cat: 'Legs',        secs: 60 },
  { name: 'Lunges',            emoji: '🚶', cat: 'Legs',        secs: 50 },
  { name: 'Leg Press',         emoji: '🦿', cat: 'Legs',        secs: 60 },
  { name: 'Calf Raises',       emoji: '👟', cat: 'Legs',        secs: 45 },
  { name: 'Overhead Press',    emoji: '🏋️', cat: 'Shoulders',   secs: 60 },
  { name: 'Lateral Raises',    emoji: '↔️', cat: 'Shoulders',   secs: 50 },
  { name: 'Bicep Curls',       emoji: '💪', cat: 'Arms',        secs: 50 },
  { name: 'Tricep Dips',       emoji: '🤸', cat: 'Arms',        secs: 50 },
  { name: 'Plank',             emoji: '⬛', cat: 'Core',        secs: 60 },
  { name: 'Crunches',          emoji: '🔄', cat: 'Core',        secs: 45 },
  { name: 'Leg Raises',        emoji: '🦵', cat: 'Core',        secs: 45 },
  { name: 'Russian Twists',    emoji: '🔁', cat: 'Core',        secs: 40 },
  { name: 'Ab Wheel',          emoji: '⚙️', cat: 'Core',        secs: 40 },
  { name: 'Hip Flexor Stretch',emoji: '🧘', cat: 'Stretch',     secs: 30 },
  { name: 'Hamstring Stretch', emoji: '🦵', cat: 'Stretch',     secs: 30 },
  { name: "Child's Pose",      emoji: '🌿', cat: 'Stretch',     secs: 30 },
  { name: 'Shoulder Stretch',  emoji: '🤸', cat: 'Stretch',     secs: 30 },
  { name: 'Spinal Twist',      emoji: '🔀', cat: 'Stretch',     secs: 30 },
  { name: 'Rest / Breathe',    emoji: '😤', cat: 'Rest',        secs: 30 },
  { name: 'Water Break',       emoji: '💧', cat: 'Rest',        secs: 20 },
];

const FIT_BUILDER_CATS = ['All', 'Cardio', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Stretch', 'Rest'];
const FIT_DURATION_OPTIONS = [15, 20, 30, 45, 60, 90, 120, 180, 300]; // seconds

function fitGetData() {
  try { return JSON.parse(localStorage.getItem('fitnessData') || '{}'); } catch { return {}; }
}
function fitSaveData(d) { localStorage.setItem('fitnessData', JSON.stringify(d)); }
function fitGetToday() { return new Date().toISOString().split('T')[0]; }
function fitFmtSecs(s) {
  if (s < 60) return s + 's';
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function fitToggle(id) {
  const d = fitGetData();
  const today = fitGetToday();
  if (!d[today]) d[today] = {};
  if (d[today][id]) delete d[today][id];
  else d[today][id] = true;
  fitSaveData(d);
  fitRenderToday();
}

function fitInit() {
  if (!_fitInitialized) {
    _fitInitialized = true;
    fitRenderExercises();
    setupPullToRefresh(
      document.getElementById('page-fit-today'),
      document.getElementById('pull-refresh-fit-today'),
      () => fitRenderToday()
    );
  }
  requestAnimationFrame(() => fitGoTo(0));
  updateFitTokenDisplay();
}

function fitGoTo(n) {
  _fitPage = n;
  const pages = document.getElementById('pages-fitness');
  if (pages) pages.style.transform = `translateX(${-n * 100}vw)`;
  [0,1,2,3,4].forEach(i => {
    const btn = document.getElementById('fnav-' + i);
    if (btn) btn.classList.toggle('active', i === n);
  });
  const totalTabs = 5;
  const tabWidth = 100 / totalTabs;
  const ind = document.getElementById('nav-indicator-fitness');
  if (ind) ind.style.left = (n * tabWidth + tabWidth * 0.2) + '%';
  if (n === 0) fitRenderToday();
  if (n === 1) fitRenderBuilder();
  if (n === 3) fitRenderProgress();
  if (n === 4) fitRenderPRs();
}

// ── TODAY ─────────────────────────────────────────────────────────────
function fitRenderToday() {
  const d = fitGetData();
  const today = fitGetToday();
  const todayData = d[today] || {};
  const doneCount = Object.keys(todayData).length;

  const dateEl = document.getElementById('fit-today-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const el = document.getElementById('fit-today-content');
  if (!el) return;

  el.innerHTML = `
    <div class="fit-token-header">💪 <span id="fit-token-count">0</span> tokens</div>
    <div class="fit-summary-bar">
      <span class="fit-summary-count">${doneCount}</span>
      <span class="fit-summary-label"> workout${doneCount !== 1 ? 's' : ''} logged today</span>
    </div>
    <div class="fit-workout-list">
      ${FIT_WORKOUTS.map(w => {
        const done = !!todayData[w.id];
        return `
          <div class="fit-workout-card${done ? ' done' : ''}" onclick="fitToggle('${w.id}')">
            <span class="fit-w-emoji">${w.emoji}</span>
            <div class="fit-w-body">
              <div class="fit-w-name">${w.name}</div>
              <div class="fit-w-meta">${w.cat} · ~${w.mins} min</div>
            </div>
            <div class="fit-w-check${done ? ' checked' : ''}">${done ? '✓' : ''}</div>
          </div>`;
      }).join('')}
    </div>
    ${fitBuildNutritionSection(today)}
    ${fitBuildRecoverySection(today)}
    ${fitBuildVitaminsSection(today)}
    ${fitBuildScanSection()}
  `;

  fitBindNutritionEvents(today);
  fitBindRecoveryEvents(today);
  fitBindVitaminEvents(today);
  fitBindScanEvents();
  fitRenderMeasurements();
  updateFitTokenDisplay();
}

// ── BUILDER ───────────────────────────────────────────────────────────
function fitRenderBuilder() {
  const el = document.getElementById('fit-builder-content');
  if (!el) return;

  const totalSecs = _fitBuilderQueue.reduce((a, i) => a + i.secs, 0);
  const totalMins = Math.ceil(totalSecs / 60);

  const queueHtml = _fitBuilderQueue.length === 0
    ? `<div class="fit-builder-empty">Tap exercises below to add them to your workout</div>`
    : _fitBuilderQueue.map((item, idx) => `
        <div class="fit-builder-queue-item" id="fbq-${item.uid}">
          <span class="fit-bq-num">${idx + 1}</span>
          <span class="fit-bq-emoji">${item.emoji}</span>
          <div class="fit-bq-info">
            <div class="fit-bq-name">${item.name}</div>
            <div class="fit-bq-cat">${item.cat}</div>
          </div>
          <select class="fit-bq-dur" onchange="fitBuilderSetDur('${item.uid}', this.value)">
            ${FIT_DURATION_OPTIONS.map(s => `<option value="${s}"${item.secs===s?' selected':''}>${fitFmtSecs(s)}</option>`).join('')}
          </select>
          <button class="fit-bq-remove" onclick="fitBuilderRemove('${item.uid}')">✕</button>
        </div>`).join('');

  const filtered = _fitBuilderCat === 'All'
    ? FIT_BUILDER_MOVES
    : FIT_BUILDER_MOVES.filter(m => m.cat === _fitBuilderCat);

  el.innerHTML = `
    ${fitBuildEquipmentSection()}
    ${fitBuildMealPlanSection()}

    <div class="fit-builder-queue-section">
      <div class="fit-builder-queue-header">
        <span class="fit-bq-title">Your Workout</span>
        ${_fitBuilderQueue.length > 0 ? `<span class="fit-bq-total">${totalMins} min</span>` : ''}
      </div>
      <div class="fit-builder-queue">${queueHtml}</div>
      ${_fitBuilderQueue.length > 0 ? `
        <div class="fit-builder-actions">
          <button class="fit-builder-clear" onclick="fitBuilderClear()">Clear</button>
          <button class="fit-builder-start" onclick="fitStartWorkout()">▶ Start Workout</button>
        </div>` : ''}
    </div>

    <div class="fit-builder-picker-section">
      <div class="fit-builder-picker-title">Add Exercises</div>
      <div class="fit-builder-cats">
        ${FIT_BUILDER_CATS.map(c => `
          <button class="fit-bcat-pill${_fitBuilderCat===c?' active':''}" onclick="fitBuilderSetCat('${c}')">${c}</button>
        `).join('')}
      </div>
      <div class="fit-builder-grid">
        ${filtered.map(m => `
          <button class="fit-builder-move" onclick="fitBuilderAdd('${m.name}','${m.emoji}','${m.cat}',${m.secs})">
            <span class="fit-bm-emoji">${m.emoji}</span>
            <span class="fit-bm-name">${m.name}</span>
            <span class="fit-bm-dur">${fitFmtSecs(m.secs)}</span>
            <span class="fit-bm-plus">+</span>
          </button>
        `).join('')}
      </div>
    </div>`;

  fitBindEquipmentEvents();
  fitBindMealPlanEvents();
}

function fitBuilderSetCat(cat) {
  _fitBuilderCat = cat;
  fitRenderBuilder();
}

function fitBuilderAdd(name, emoji, cat, secs) {
  _fitBuilderQueue.push({ uid: Date.now() + Math.random(), name, emoji, cat, secs });
  fitRenderBuilder();
  if (navigator.vibrate) navigator.vibrate(30);
}

function fitBuilderRemove(uid) {
  _fitBuilderQueue = _fitBuilderQueue.filter(i => String(i.uid) !== String(uid));
  fitRenderBuilder();
}

function fitBuilderSetDur(uid, secs) {
  const item = _fitBuilderQueue.find(i => String(i.uid) === String(uid));
  if (item) { item.secs = parseInt(secs); fitRenderBuilder(); }
}

function fitBuilderClear() {
  _fitBuilderQueue = [];
  fitRenderBuilder();
}

// ── TIMER ─────────────────────────────────────────────────────────────
function fitStartWorkout() {
  if (_fitBuilderQueue.length === 0) return;
  _fitTimerQueue = [..._fitBuilderQueue];
  _fitTimerStep = 0;
  _fitTimerActive = true;
  const overlay = document.getElementById('fit-timer-overlay');
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  awardFitTokens(10, 'started workout');
  fitTimerShowStep();
}

function fitTimerShowStep() {
  const item = _fitTimerQueue[_fitTimerStep];
  if (!item) { fitTimerEnd(); return; }
  _fitTimerSecsLeft = item.secs;

  document.getElementById('fit-timer-emoji').textContent = item.emoji;
  document.getElementById('fit-timer-name').textContent = item.name;
  document.getElementById('fit-timer-cat').textContent = item.cat;
  document.getElementById('fit-timer-step-label').textContent = `${_fitTimerStep + 1} / ${_fitTimerQueue.length}`;

  const next = _fitTimerQueue[_fitTimerStep + 1];
  document.getElementById('fit-timer-next-label').textContent = next ? `Next: ${next.emoji} ${next.name}` : 'Last exercise!';

  fitTimerUpdateClock();
  fitTimerUpdateProgress();

  if (_fitTimerInterval) clearInterval(_fitTimerInterval);
  _fitTimerInterval = setInterval(fitTimerTick, 1000);
}

function fitTimerTick() {
  _fitTimerSecsLeft--;
  if (_fitTimerSecsLeft <= 0) {
    clearInterval(_fitTimerInterval);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    _fitTimerStep++;
    if (_fitTimerStep >= _fitTimerQueue.length) { fitTimerEnd(); return; }
    setTimeout(fitTimerShowStep, 500);
  } else {
    fitTimerUpdateClock();
  }
}

function fitTimerUpdateClock() {
  const item = _fitTimerQueue[_fitTimerStep];
  const s = _fitTimerSecsLeft;
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  document.getElementById('fit-timer-clock').textContent = mins + ':' + String(secs).padStart(2, '0');

  // SVG ring
  const total = item ? item.secs : 1;
  const pct = _fitTimerSecsLeft / total;
  const circumference = 339.3;
  const offset = circumference * (1 - pct);
  const circle = document.getElementById('fit-timer-ring-circle');
  if (circle) circle.style.strokeDashoffset = offset;

  // Color urgency
  const color = s <= 5 ? '#c53030' : s <= 10 ? '#e53e3e' : '#e53e3e';
  if (circle) circle.style.stroke = color;
  document.getElementById('fit-timer-clock').style.color = color;
}

function fitTimerUpdateProgress() {
  const pct = (_fitTimerStep / _fitTimerQueue.length) * 100;
  const fill = document.getElementById('fit-timer-progress-fill');
  if (fill) fill.style.width = pct + '%';
}

function fitTimerSkip() {
  clearInterval(_fitTimerInterval);
  _fitTimerStep++;
  if (_fitTimerStep >= _fitTimerQueue.length) { fitTimerEnd(); return; }
  fitTimerShowStep();
}

function fitTimerEnd() {
  clearInterval(_fitTimerInterval);
  _fitTimerActive = false;
  _fitTimerStep = 0;
  document.body.style.overflow = '';
  const overlay = document.getElementById('fit-timer-overlay');
  if (overlay) overlay.classList.add('hidden');

  // Log workout as done
  const d = fitGetData();
  const today = fitGetToday();
  if (!d[today]) d[today] = {};
  d[today]['__builder__' + Date.now()] = { moves: _fitTimerQueue.length, ts: Date.now() };
  fitSaveData(d);

  awardFitTokens(25, 'completed workout');
}

// ── EXERCISES ─────────────────────────────────────────────────────────
function fitRenderExercises() {
  const el = document.getElementById('fit-exercises-content');
  if (!el) return;
  el.innerHTML = FIT_EXERCISES.map(cat => `
    <div class="fit-ex-section">
      <div class="fit-ex-cat">${cat.cat}</div>
      <div class="fit-ex-list">
        ${cat.list.map(ex => `<div class="fit-ex-item" onclick="fitBuilderAdd('${ex}','💪','${cat.cat.split(' ').pop()}',60);fitGoTo(1)">${ex} <span class="fit-ex-add">+</span></div>`).join('')}
      </div>
    </div>`).join('');
}

// ── PROGRESS ──────────────────────────────────────────────────────────
function fitRenderProgress() {
  const d = fitGetData();
  const today = fitGetToday();
  const el = document.getElementById('fit-progress-content');
  if (!el) return;

  let streak = 0;
  const check = new Date();
  for (let i = 0; i < 365; i++) {
    const key = check.toISOString().split('T')[0];
    if (d[key] && Object.keys(d[key]).length > 0) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }

  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().split('T')[0];
    last14.push({ key, day: dt.toLocaleDateString('en-US', { weekday: 'short' })[0], done: !!(d[key] && Object.keys(d[key]).length > 0) });
  }

  el.innerHTML = `
    <div class="fit-stat-row">
      <div class="fit-stat-card">
        <div class="fit-stat-icon">🔥</div>
        <div class="fit-stat-val">${streak}</div>
        <div class="fit-stat-lbl">Day Streak</div>
      </div>
      <div class="fit-stat-card">
        <div class="fit-stat-icon">📅</div>
        <div class="fit-stat-val">${Object.keys(d).length}</div>
        <div class="fit-stat-lbl">Total Days</div>
      </div>
      <div class="fit-stat-card">
        <div class="fit-stat-icon">🏋️</div>
        <div class="fit-stat-val">${Object.values(d).reduce((a,v)=>a+Object.keys(v).length,0)}</div>
        <div class="fit-stat-lbl">Total Logged</div>
      </div>
    </div>
    <div class="fit-cal-section">
      <div class="fit-cal-label">Last 14 Days</div>
      <div class="fit-cal-row">
        ${last14.map(d => `
          <div class="fit-cal-day${d.done ? ' done' : ''}${d.key === today ? ' today' : ''}">
            <div class="fit-cal-dot"></div>
            <div class="fit-cal-lbl">${d.day}</div>
          </div>`).join('')}
      </div>
    </div>`;

  fitRenderCalendar();
}

// ── NUTRITION HELPERS ─────────────────────────────────────────────────
function fitGetNutrition() {
  try { return JSON.parse(localStorage.getItem('nutritionData') || '{}'); } catch { return {}; }
}
function fitSaveNutrition(d) {
  localStorage.setItem('nutritionData', JSON.stringify(d));
  if (typeof queueSync === 'function') queueSync();
}

function fitBuildNutritionSection(today) {
  const nd = fitGetNutrition();
  const day = nd[today] || {};
  const meals = ['breakfast', 'lunch', 'dinner'];
  const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
  const mealEmojis = { breakfast: '🍳', lunch: '🥙', dinner: '🍽️' };

  const calGoal = parseInt(localStorage.getItem('fitCalGoal') || '2500');
  const protGoal = parseInt(localStorage.getItem('fitProtGoal') || '150');

  let totalCal = 0, totalProt = 0;
  meals.forEach(m => {
    if (day[m]) { totalCal += (day[m].cal || 0); totalProt += (day[m].protein || 0); }
  });

  const calPct = Math.min(100, Math.round((totalCal / calGoal) * 100));
  const protPct = Math.min(100, Math.round((totalProt / protGoal) * 100));

  const mealCards = meals.map(m => {
    const saved = day[m] || { cal: 0, protein: 0 };
    return `
      <div class="fit-nutrition-meal-card">
        <div class="fit-nm-header">
          <span class="fit-nm-emoji">${mealEmojis[m]}</span>
          <span class="fit-nm-label">${mealLabels[m]}</span>
          ${saved.logged ? '<span class="fit-nm-logged">✓ Logged</span>' : ''}
        </div>
        <div class="fit-nm-row">
          <label class="fit-nm-slider-label">Calories: <span id="fit-cal-val-${m}">${saved.cal}</span> kcal</label>
          <input type="range" class="fit-nm-slider" id="fit-cal-${m}" min="0" max="1500" step="50" value="${saved.cal}"
            oninput="document.getElementById('fit-cal-val-${m}').textContent=this.value" />
        </div>
        <div class="fit-nm-row">
          <label class="fit-nm-slider-label">Protein: <span id="fit-prot-val-${m}">${saved.protein}</span>g</label>
          <input type="range" class="fit-nm-slider" id="fit-prot-${m}" min="0" max="80" step="5" value="${saved.protein}"
            oninput="document.getElementById('fit-prot-val-${m}').textContent=this.value" />
        </div>
        <button class="fit-nm-log-btn" onclick="fitLogMeal('${m}')">Log Meal</button>
      </div>`;
  }).join('');

  return `
    <div class="fit-section-block">
      <div class="fit-section-title">🥗 Nutrition</div>
      ${mealCards}
      <div class="fit-nutrition-totals">
        <div class="fit-nt-row">
          <span class="fit-nt-label">Total Calories</span>
          <span class="fit-nt-val">${totalCal} / ${calGoal} kcal</span>
        </div>
        <div class="fit-progress-bar-wrap">
          <div class="fit-progress-bar-fill" style="width:${calPct}%;background:#e53e3e"></div>
        </div>
        <div class="fit-nt-row" style="margin-top:10px">
          <span class="fit-nt-label">Total Protein</span>
          <span class="fit-nt-val">${totalProt} / ${protGoal}g</span>
        </div>
        <div class="fit-progress-bar-wrap">
          <div class="fit-progress-bar-fill" style="width:${protPct}%;background:#48bb78"></div>
        </div>
        <div class="fit-nt-goals-row">
          <button class="fit-nt-goal-btn" onclick="fitEditNutritionGoals()">Edit Goals</button>
        </div>
      </div>
    </div>`;
}

function fitBindNutritionEvents() { /* sliders use inline oninput — no extra binding needed */ }

function fitLogMeal(meal) {
  const today = fitGetToday();
  const nd = fitGetNutrition();
  if (!nd[today]) nd[today] = {};
  const calEl = document.getElementById('fit-cal-' + meal);
  const protEl = document.getElementById('fit-prot-' + meal);
  nd[today][meal] = {
    cal: calEl ? parseInt(calEl.value) : 0,
    protein: protEl ? parseInt(protEl.value) : 0,
    logged: true,
    ts: Date.now()
  };
  fitSaveNutrition(nd);
  awardFitTokens(5, 'logged meal');

  // Check if daily calorie goal is met
  const calGoal = parseInt(localStorage.getItem('fitCalGoal') || '2500');
  const meals = ['breakfast', 'lunch', 'dinner'];
  let totalCal = 0;
  meals.forEach(m => { if (nd[today][m]) totalCal += (nd[today][m].cal || 0); });
  if (totalCal >= calGoal && !localStorage.getItem('fitCalGoalBonusAwarded_' + today)) {
    localStorage.setItem('fitCalGoalBonusAwarded_' + today, '1');
    awardFitTokens(15, 'daily calorie goal hit');
    const toast = document.createElement('div');
    toast.className = 'fit-token-toast';
    toast.textContent = 'Daily calorie goal hit! +15 💪';
    toast.style.bottom = '80px';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  fitRenderToday();
}

function fitEditNutritionGoals() {
  const calGoal = prompt('Daily calorie goal (kcal):', localStorage.getItem('fitCalGoal') || '2500');
  if (calGoal && !isNaN(calGoal)) localStorage.setItem('fitCalGoal', calGoal);
  const protGoal = prompt('Daily protein goal (g):', localStorage.getItem('fitProtGoal') || '150');
  if (protGoal && !isNaN(protGoal)) localStorage.setItem('fitProtGoal', protGoal);
  fitRenderToday();
}

// ── RECOVERY HELPERS ──────────────────────────────────────────────────
const FIT_RECOVERY_TIPS = [
  'Prioritize 7-9 hours of sleep — most muscle repair happens during deep sleep.',
  'Foam rolling after lifting reduces delayed-onset muscle soreness by up to 30%.',
  'Cold exposure for 2-3 minutes post-workout can cut inflammation and speed recovery.',
  'Stretching for 10 minutes after training improves flexibility and reduces injury risk.',
  'Hydration is critical: aim for at least 0.5 oz of water per lb of bodyweight daily.'
];

function fitGetRecovery() {
  try { return JSON.parse(localStorage.getItem('recoveryData') || '{}'); } catch { return {}; }
}
function fitSaveRecovery(d) {
  localStorage.setItem('recoveryData', JSON.stringify(d));
  if (typeof queueSync === 'function') queueSync();
}

function fitBuildRecoverySection(today) {
  const rd = fitGetRecovery();
  const day = rd[today] || {};
  const tipIdx = new Date().getDate() % FIT_RECOVERY_TIPS.length;
  const tip = FIT_RECOVERY_TIPS[tipIdx];

  const sleepVal = day.sleep || 5;
  const stretched = day.stretched || false;
  const coldShower = day.coldShower || false;
  const foamRolled = day.foamRolled || false;

  return `
    <div class="fit-section-block">
      <div class="fit-section-title">🛌 Post-Workout Recovery</div>
      <div class="fit-recovery-card">
        <div class="fit-rc-row">
          <label class="fit-rc-label">Sleep Quality: <span id="fit-sleep-quality-val">${sleepVal}</span>/10</label>
          <input type="range" class="fit-nm-slider" id="fit-sleep-quality" min="1" max="10" step="1" value="${sleepVal}"
            oninput="document.getElementById('fit-sleep-quality-val').textContent=this.value" onchange="fitSaveRecoveryField('sleep', this.value)" />
        </div>
        <div class="fit-rc-toggles">
          <button class="fit-rc-toggle${stretched ? ' active' : ''}" id="fit-rc-stretched" onclick="fitToggleRecovery('stretched')">
            🧘 Stretching ${stretched ? '✓' : ''}
          </button>
          <button class="fit-rc-toggle${coldShower ? ' active' : ''}" id="fit-rc-coldshower" onclick="fitToggleRecovery('coldShower')">
            🚿 Cold Shower ${coldShower ? '✓' : ''}
          </button>
          <button class="fit-rc-toggle${foamRolled ? ' active' : ''}" id="fit-rc-foamrolled" onclick="fitToggleRecovery('foamRolled')">
            🔵 Foam Roll ${foamRolled ? '✓' : ''}
          </button>
        </div>
        <div class="fit-rc-tip">
          <span class="fit-rc-tip-icon">💡</span>
          <span class="fit-rc-tip-text">${tip}</span>
        </div>
      </div>
    </div>`;
}

function fitBindRecoveryEvents() { /* toggles use inline onclick */ }

function fitSaveRecoveryField(field, value) {
  const today = fitGetToday();
  const rd = fitGetRecovery();
  if (!rd[today]) rd[today] = {};
  rd[today][field] = isNaN(value) ? value : Number(value);
  fitSaveRecovery(rd);
}

function fitToggleRecovery(field) {
  const today = fitGetToday();
  const rd = fitGetRecovery();
  if (!rd[today]) rd[today] = {};
  rd[today][field] = !rd[today][field];
  fitSaveRecovery(rd);
  fitRenderToday();
}

// ── VITAMINS HELPERS ──────────────────────────────────────────────────
const FIT_VITAMINS = [
  { id: 'vitD',      label: 'Vitamin D',  tip: 'Supports immune function, bone strength, and mood regulation.' },
  { id: 'magnesium', label: 'Magnesium',  tip: 'Critical for muscle contraction, sleep quality, and energy production.' },
  { id: 'omega3',    label: 'Omega-3',    tip: 'Reduces inflammation and supports cardiovascular and joint health.' },
  { id: 'zinc',      label: 'Zinc',       tip: 'Boosts testosterone production, wound healing, and immune defense.' },
  { id: 'b12',       label: 'B12',        tip: 'Essential for red blood cell production, energy, and nerve function.' },
  { id: 'creatine',  label: 'Creatine',   tip: 'The most research-backed supplement for strength and power output.' },
];
const FIT_ELECTROLYTES = [
  { id: 'sodium',    label: 'Sodium',    unit: 'mg' },
  { id: 'potassium', label: 'Potassium', unit: 'mg' },
  { id: 'magnesiumE',label: 'Magnesium', unit: 'mg' },
];

function fitGetVitamins() {
  try { return JSON.parse(localStorage.getItem('vitaminData') || '{}'); } catch { return {}; }
}
function fitSaveVitamins(d) {
  localStorage.setItem('vitaminData', JSON.stringify(d));
  if (typeof queueSync === 'function') queueSync();
}

function fitBuildVitaminsSection(today) {
  const vd = fitGetVitamins();
  const day = vd[today] || {};

  const vitaminRows = FIT_VITAMINS.map(v => {
    const checked = !!day[v.id];
    return `
      <div class="fit-vit-row">
        <label class="fit-vit-label">
          <input type="checkbox" class="fit-vit-cb" id="fit-vit-${v.id}" ${checked ? 'checked' : ''}
            onchange="fitToggleVitamin('${v.id}', this.checked)" />
          <span class="fit-vit-name">${v.label}</span>
        </label>
        <button class="fit-vit-why" onclick="fitToggleVitaminTip('tip-${v.id}')">💡</button>
        <div class="fit-vit-tip hidden" id="tip-${v.id}">${v.tip}</div>
      </div>`;
  }).join('');

  const electrolytes = FIT_ELECTROLYTES.map(e => {
    const amt = day[e.id] || 0;
    return `
      <div class="fit-elec-row">
        <span class="fit-elec-label">${e.label}</span>
        <div class="fit-elec-controls">
          <button class="fit-elec-btn" onclick="fitAdjustElectrolyte('${e.id}', -100)">−</button>
          <span class="fit-elec-val" id="fit-elec-${e.id}">${amt}${e.unit}</span>
          <button class="fit-elec-btn" onclick="fitAdjustElectrolyte('${e.id}', 100)">+</button>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="fit-section-block">
      <div class="fit-section-title fit-collapse-toggle" onclick="fitToggleCollapse('fit-vitamins-body')">
        💊 Vitamins &amp; Recovery <span class="fit-collapse-arrow" id="arrow-fit-vitamins-body">▾</span>
      </div>
      <div id="fit-vitamins-body">
        <div class="fit-vit-list">${vitaminRows}</div>
        <div class="fit-section-subtitle">Electrolytes</div>
        <div class="fit-elec-list">${electrolytes}</div>
      </div>
    </div>`;
}

function fitBindVitaminEvents() { /* checkboxes/buttons use inline handlers */ }

function fitToggleVitamin(id, checked) {
  const today = fitGetToday();
  const vd = fitGetVitamins();
  if (!vd[today]) vd[today] = {};
  if (checked) {
    vd[today][id] = true;
    awardFitTokens(2, 'vitamin checked');
  } else {
    delete vd[today][id];
  }
  fitSaveVitamins(vd);
}

function fitToggleVitaminTip(tipId) {
  const el = document.getElementById(tipId);
  if (el) el.classList.toggle('hidden');
}

function fitAdjustElectrolyte(id, delta) {
  const today = fitGetToday();
  const vd = fitGetVitamins();
  if (!vd[today]) vd[today] = {};
  const cur = vd[today][id] || 0;
  vd[today][id] = Math.max(0, cur + delta);
  fitSaveVitamins(vd);
  const el = document.getElementById('fit-elec-' + id);
  const unit = FIT_ELECTROLYTES.find(e => e.id === id)?.unit || '';
  if (el) el.textContent = vd[today][id] + unit;
}

function fitToggleCollapse(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById('arrow-' + id);
  if (!body) return;
  const hidden = body.style.display === 'none';
  body.style.display = hidden ? '' : 'none';
  if (arrow) arrow.textContent = hidden ? '▾' : '▸';
}

// ── SCAN STUB HELPERS ─────────────────────────────────────────────────
const FIT_SCAN_MACHINES = [
  { name: 'Chest Press', emoji: '💪', sets: '3 × 10', muscle: 'Chest' },
  { name: 'Shoulder Press', emoji: '🏋️', sets: '3 × 10', muscle: 'Shoulders' },
  { name: 'Lat Pulldown', emoji: '🔙', sets: '3 × 12', muscle: 'Back' },
  { name: 'Leg Press', emoji: '🦵', sets: '4 × 10', muscle: 'Legs' },
  { name: 'Cable Row', emoji: '⬅️', sets: '3 × 12', muscle: 'Back' },
  { name: 'Squat Rack', emoji: '🏋️', sets: '4 × 8', muscle: 'Legs' },
  { name: 'Treadmill', emoji: '🏃', sets: '20 min', muscle: 'Cardio' },
];

function fitGetRecentEquipment() {
  try { return JSON.parse(localStorage.getItem('fitRecentEquipment') || '[]'); } catch { return []; }
}
function fitSaveRecentEquipment(arr) {
  localStorage.setItem('fitRecentEquipment', JSON.stringify(arr));
}

function fitBuildScanSection() {
  const recent = fitGetRecentEquipment();
  const recentHtml = recent.length === 0 ? '' : `
    <div class="fit-scan-recent">
      <div class="fit-section-subtitle">Recent Equipment</div>
      ${recent.slice(0, 5).map(r => `<div class="fit-scan-recent-item">${r.emoji} ${r.name} <span class="fit-scan-recent-muscle">${r.muscle}</span></div>`).join('')}
    </div>`;

  return `
    <div class="fit-section-block">
      <div class="fit-section-title">📷 Scan Equipment</div>
      <div class="fit-scan-card">
        <p class="fit-scan-note">AI scanning coming soon — selecting shows sample results for now.</p>
        <label class="fit-scan-btn">
          📷 Scan Machine
          <input type="file" accept="image/*" capture="environment" id="fit-scan-input" style="display:none" onchange="fitHandleScan()" />
        </label>
        <div id="fit-scan-results"></div>
        ${recentHtml}
      </div>
    </div>`;
}

function fitBindScanEvents() { /* file input uses inline onchange */ }

function fitHandleScan() {
  const resultsEl = document.getElementById('fit-scan-results');
  if (!resultsEl) return;
  resultsEl.innerHTML = `<div class="fit-scan-loading"><div class="pull-spinner" style="border-top-color:#e53e3e;display:inline-block"></div> Analyzing...</div>`;

  setTimeout(() => {
    const picks = [];
    for (let i = 0; i < 3; i++) {
      picks.push(FIT_SCAN_MACHINES[(_fitScanIndex + i) % FIT_SCAN_MACHINES.length]);
    }
    _fitScanIndex = (_fitScanIndex + 3) % FIT_SCAN_MACHINES.length;

    resultsEl.innerHTML = `
      <div class="fit-scan-results-grid">
        ${picks.map((m, idx) => `
          <div class="fit-scan-result-card">
            <span class="fit-scan-r-emoji">${m.emoji}</span>
            <div class="fit-scan-r-info">
              <div class="fit-scan-r-name">${m.name}</div>
              <div class="fit-scan-r-meta">${m.muscle} · ${m.sets}</div>
            </div>
            <button class="fit-scan-r-select" onclick="fitSelectScannedMachine(${idx}, ${JSON.stringify(picks).split('"').join('&quot;')})">Select</button>
          </div>`).join('')}
      </div>`;
  }, 2000);
}

function fitSelectScannedMachine(idx, picks) {
  // picks may be passed as attr — reconstruct from DOM instead
  const cards = document.querySelectorAll('.fit-scan-result-card');
  const card = cards[idx];
  if (!card) return;
  const name = card.querySelector('.fit-scan-r-name')?.textContent || '';
  const emoji = card.querySelector('.fit-scan-r-emoji')?.textContent || '🏋️';
  const meta = card.querySelector('.fit-scan-r-meta')?.textContent || '';
  const muscle = meta.split('·')[0]?.trim() || 'General';

  const recent = fitGetRecentEquipment();
  if (!recent.find(r => r.name === name)) {
    recent.unshift({ name, emoji, muscle });
    fitSaveRecentEquipment(recent.slice(0, 10));
  }
  fitRenderToday();
}

// ── EQUIPMENT SECTION (BUILDER) ───────────────────────────────────────
const FIT_HOME_EQUIPMENT = ['Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Yoga Mat', 'Kettlebell', 'Barbell', 'Bench'];
const FIT_GYM_EQUIPMENT  = ['Free Weights', 'Cable Machines', 'Smith Machine', 'Cardio', 'Pool'];

const FIT_EQUIPMENT_WORKOUTS = {
  Dumbbells:         [{ name:'Dumbbell Curl', sets:'3×12' }, { name:'Overhead Press', sets:'3×10' }, { name:'Dumbbell Row', sets:'3×12' }, { name:'Goblet Squat', sets:'3×12' }, { name:'Dumbbell Fly', sets:'3×12' }],
  'Resistance Bands':[{ name:'Band Pull-Apart', sets:'3×15' }, { name:'Banded Squat', sets:'3×15' }, { name:'Band Row', sets:'3×15' }, { name:'Banded Hip Thrust', sets:'3×12' }, { name:'Band Curl', sets:'3×15' }],
  'Pull-up Bar':     [{ name:'Pull-Ups', sets:'4×8' }, { name:'Chin-Ups', sets:'3×8' }, { name:'Hanging Knee Raise', sets:'3×12' }, { name:'Dead Hang', sets:'3×30s' }, { name:'Archer Pull-Ups', sets:'3×6' }],
  'Yoga Mat':        [{ name:'Plank', sets:'3×60s' }, { name:'Push-Ups', sets:'3×20' }, { name:'Glute Bridge', sets:'3×20' }, { name:'Mountain Climbers', sets:'3×30s' }, { name:'Superman Hold', sets:'3×15' }],
  Kettlebell:        [{ name:'KB Swing', sets:'4×15' }, { name:'KB Goblet Squat', sets:'3×12' }, { name:'KB Press', sets:'3×10' }, { name:'KB Row', sets:'3×12' }, { name:'KB Turkish Get-Up', sets:'2×5' }],
  Barbell:           [{ name:'Barbell Squat', sets:'4×8' }, { name:'Deadlift', sets:'4×5' }, { name:'Bench Press', sets:'4×8' }, { name:'Bent-Over Row', sets:'3×10' }, { name:'Barbell OHP', sets:'3×8' }],
  Bench:             [{ name:'Bench Press', sets:'4×8' }, { name:'Incline Press', sets:'3×10' }, { name:'Step-Ups', sets:'3×12' }, { name:'Dips', sets:'3×10' }, { name:'Bulgarian Split Squat', sets:'3×10' }],
  'Free Weights':    [{ name:'Deadlift', sets:'4×5' }, { name:'Barbell Squat', sets:'4×8' }, { name:'Bench Press', sets:'4×8' }, { name:'Dumbbell Row', sets:'3×12' }, { name:'OHP', sets:'3×10' }, { name:'Incline DB Press', sets:'3×10' }, { name:'Lateral Raises', sets:'3×15' }, { name:'Leg Curls', sets:'3×12' }],
  'Cable Machines':  [{ name:'Cable Row', sets:'3×12' }, { name:'Lat Pulldown', sets:'3×12' }, { name:'Cable Curl', sets:'3×15' }, { name:'Tricep Pushdown', sets:'3×15' }, { name:'Cable Fly', sets:'3×12' }, { name:'Face Pull', sets:'3×15' }],
  'Smith Machine':   [{ name:'Smith Squat', sets:'4×10' }, { name:'Smith Bench', sets:'4×10' }, { name:'Smith Row', sets:'3×12' }, { name:'Smith Calf Raise', sets:'4×15' }, { name:'Smith Lunge', sets:'3×12' }],
  Cardio:            [{ name:'Treadmill Run', sets:'20 min' }, { name:'Elliptical', sets:'20 min' }, { name:'Bike HIIT', sets:'10×30s' }, { name:'Stair Climber', sets:'15 min' }, { name:'Rowing Machine', sets:'15 min' }, { name:'Jump Rope', sets:'5 min' }],
  Pool:              [{ name:'Freestyle Swim', sets:'10×50m' }, { name:'Backstroke', sets:'5×50m' }, { name:'Pool Sprints', sets:'8×25m' }, { name:'Kick Drill', sets:'6×50m' }, { name:'Water Jogging', sets:'15 min' }],
};

function fitGetEquipment() {
  try { return JSON.parse(localStorage.getItem('fitEquipment') || '{"type":"home","equipment":[]}'); } catch { return { type: 'home', equipment: [] }; }
}
function fitSaveEquipment(d) {
  localStorage.setItem('fitEquipment', JSON.stringify(d));
  if (typeof queueSync === 'function') queueSync();
}

function fitBuildEquipmentSection() {
  const eq = fitGetEquipment();
  const isHome = eq.type !== 'gym';
  const equipList = isHome ? FIT_HOME_EQUIPMENT : FIT_GYM_EQUIPMENT;

  const checkboxes = equipList.map(e => `
    <label class="fit-eq-label">
      <input type="checkbox" class="fit-eq-cb" value="${e}" ${eq.equipment.includes(e) ? 'checked' : ''}
        onchange="fitToggleEquipmentItem('${e}', this.checked)" />
      <span>${e}</span>
    </label>`).join('');

  return `
    <div class="fit-section-block">
      <div class="fit-section-title">🏋️ Equipment</div>
      <div class="fit-eq-type-row">
        <label class="fit-eq-type-option${isHome ? ' active' : ''}">
          <input type="radio" name="fit-eq-type" value="home" ${isHome ? 'checked' : ''} onchange="fitSetEquipmentType('home')" />
          🏠 Home
        </label>
        <label class="fit-eq-type-option${!isHome ? ' active' : ''}">
          <input type="radio" name="fit-eq-type" value="gym" ${!isHome ? 'checked' : ''} onchange="fitSetEquipmentType('gym')" />
          🏋️ Gym Membership
        </label>
      </div>
      <div class="fit-eq-checklist">${checkboxes}</div>
      <button class="fit-eq-generate-btn" onclick="fitGenerateEquipmentWorkout()">Generate Workout</button>
      <div id="fit-eq-workout-results"></div>
    </div>`;
}

function fitBindEquipmentEvents() { /* radios and checkboxes use inline handlers */ }

function fitSetEquipmentType(type) {
  const eq = fitGetEquipment();
  eq.type = type;
  eq.equipment = [];
  fitSaveEquipment(eq);
  fitRenderBuilder();
}

function fitToggleEquipmentItem(item, checked) {
  const eq = fitGetEquipment();
  if (checked) { if (!eq.equipment.includes(item)) eq.equipment.push(item); }
  else { eq.equipment = eq.equipment.filter(e => e !== item); }
  fitSaveEquipment(eq);
}

function fitGenerateEquipmentWorkout() {
  const eq = fitGetEquipment();
  const el = document.getElementById('fit-eq-workout-results');
  if (!el) return;
  if (eq.equipment.length === 0) {
    el.innerHTML = `<div class="fit-eq-no-eq">Select at least one piece of equipment above.</div>`;
    return;
  }
  const allExercises = [];
  eq.equipment.forEach(e => {
    const moves = FIT_EQUIPMENT_WORKOUTS[e] || [];
    moves.forEach(m => { if (!allExercises.find(x => x.name === m.name)) allExercises.push(m); });
  });
  const selected = allExercises.slice(0, 8);
  el.innerHTML = `
    <div class="fit-eq-workout-list">
      <div class="fit-eq-workout-title">Suggested Workout</div>
      ${selected.map(ex => `
        <div class="fit-eq-workout-item">
          <span class="fit-eq-ex-name">${ex.name}</span>
          <span class="fit-eq-ex-sets">${ex.sets}</span>
        </div>`).join('')}
    </div>`;
}

// ── MEAL PLAN (BUILDER) ───────────────────────────────────────────────
const FIT_MEAL_PLANS = {
  gain: {
    label: 'Gain Weight',
    cal: 2800,
    meals: [
      { name: 'Breakfast', cal: 700, suggest: 'Eggs + oats + banana' },
      { name: 'Lunch',     cal: 800, suggest: 'Chicken + rice + veggies' },
      { name: 'Snack',     cal: 400, suggest: 'Protein shake + almonds + PB' },
      { name: 'Dinner',    cal: 900, suggest: 'Steak + sweet potato + broccoli' },
    ]
  },
  lose: {
    label: 'Lose Weight',
    cal: 1800,
    meals: [
      { name: 'Breakfast', cal: 400, suggest: 'Greek yogurt + berries + eggs' },
      { name: 'Lunch',     cal: 500, suggest: 'Grilled chicken salad + lemon dressing' },
      { name: 'Snack',     cal: 200, suggest: 'Apple + protein shake' },
      { name: 'Dinner',    cal: 700, suggest: 'Salmon + zucchini + brown rice' },
    ]
  },
  maintain: {
    label: 'Maintain',
    cal: 2200,
    meals: [
      { name: 'Breakfast', cal: 550, suggest: 'Eggs + oats + banana' },
      { name: 'Lunch',     cal: 650, suggest: 'Chicken + rice + veggies' },
      { name: 'Snack',     cal: 300, suggest: 'Protein shake + almonds' },
      { name: 'Dinner',    cal: 700, suggest: 'Salmon + sweet potato + broccoli' },
    ]
  }
};

function fitBuildMealPlanSection() {
  const goal = localStorage.getItem('fitGoalType') || 'maintain';
  const plan = FIT_MEAL_PLANS[goal];
  const today = fitGetToday();
  const goalHit = localStorage.getItem('fitGoalHit_' + today);

  const planRows = plan.meals.map(m => `
    <div class="fit-mp-row">
      <div class="fit-mp-name">${m.name}</div>
      <div class="fit-mp-cal">~${m.cal} cal</div>
      <div class="fit-mp-suggest">${m.suggest}</div>
    </div>`).join('');

  const hitHtml = goalHit === 'yes'
    ? `<div class="fit-mp-hit-result yes">Goal hit today! Keep it up.</div>`
    : goalHit === 'no'
    ? `<div class="fit-mp-hit-result no">Missed today — tomorrow is a fresh start.</div>`
    : `<div class="fit-mp-eod">
        <span class="fit-mp-eod-label">Did you hit your goal today?</span>
        <button class="fit-mp-eod-btn yes" onclick="fitLogGoalHit('yes')">Yes</button>
        <button class="fit-mp-eod-btn no" onclick="fitLogGoalHit('no')">No</button>
      </div>`;

  return `
    <div class="fit-section-block">
      <div class="fit-section-title">🍱 Meal Plan</div>
      <div class="fit-mp-goal-select">
        ${Object.entries(FIT_MEAL_PLANS).map(([key, val]) => `
          <button class="fit-mp-goal-btn${goal === key ? ' active' : ''}" onclick="fitSetGoalType('${key}')">${val.label}</button>
        `).join('')}
      </div>
      <div class="fit-mp-target">Daily Target: <strong>${plan.cal} kcal</strong></div>
      <div class="fit-mp-plan">${planRows}</div>
      ${hitHtml}
    </div>`;
}

function fitBindMealPlanEvents() { /* inline handlers */ }

function fitSetGoalType(type) {
  localStorage.setItem('fitGoalType', type);
  if (typeof queueSync === 'function') queueSync();
  fitRenderBuilder();
}

function fitLogGoalHit(answer) {
  const today = fitGetToday();
  localStorage.setItem('fitGoalHit_' + today, answer);
  fitRenderBuilder();
}

// ── FEATURE 1: PERSONAL RECORDS (PR) TRACKER ──────────────────────────
function fitGetPRs() {
  try { return JSON.parse(localStorage.getItem('fitPRs') || '[]'); } catch { return []; }
}

function fitSavePR() {
  const exInput = document.getElementById('fit-pr-exercise');
  const valInput = document.getElementById('fit-pr-value');
  const unitInput = document.getElementById('fit-pr-unit');
  const dateInput = document.getElementById('fit-pr-date');
  if (!exInput || !valInput) return;
  const exercise = exInput.value.trim();
  const value = parseFloat(valInput.value);
  const unit = unitInput ? unitInput.value : 'lbs';
  const date = dateInput && dateInput.value ? dateInput.value : fitGetToday();
  if (!exercise || isNaN(value)) return;

  const prs = fitGetPRs();
  const existing = prs.find(p => p.exercise.toLowerCase() === exercise.toLowerCase());
  const isNewPR = !existing || value > existing.value;

  if (existing) {
    if (value > existing.value) {
      existing.value = value;
      existing.unit = unit;
      existing.date = date;
    }
  } else {
    prs.push({ exercise, value, unit, date });
  }
  localStorage.setItem('fitPRs', JSON.stringify(prs));

  if (isNewPR) {
    awardFitTokens(30, 'new PR');
    const toast = document.createElement('div');
    toast.className = 'fit-token-toast';
    toast.textContent = '🏆 NEW PR! +30 💪';
    toast.style.bottom = '80px';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  fitRenderPRs();
}

function fitRenderPRs() {
  const el = document.getElementById('fit-prs-content');
  if (!el) return;
  const prs = fitGetPRs();
  const today = fitGetToday();

  const unitOptions = ['lbs', 'kg', 'reps', 'seconds', 'km'];

  const prListHtml = prs.length === 0
    ? `<div class="fit-pr-empty">No records yet. Add your first PR below!</div>`
    : `<div class="fit-pr-list">
        ${prs.map(pr => `
          <div class="fit-pr-item">
            <div class="fit-pr-exercise">${pr.exercise}</div>
            <div class="fit-pr-val">${pr.value} ${pr.unit}</div>
            <div class="fit-pr-date">${pr.date}</div>
          </div>`).join('')}
      </div>`;

  el.innerHTML = `
    <div class="fit-section-block">
      <div class="fit-section-title">🏆 Personal Records</div>
      ${prListHtml}
      <div class="fit-pr-form">
        <div class="fit-pr-form-title">Add Record</div>
        <input class="fit-pr-input" id="fit-pr-exercise" type="text" placeholder="Exercise name (e.g. Bench Press)" />
        <div class="fit-pr-form-row">
          <input class="fit-pr-input fit-pr-val-input" id="fit-pr-value" type="number" placeholder="Value" min="0" step="0.5" />
          <select class="fit-pr-unit-select" id="fit-pr-unit">
            ${unitOptions.map(u => `<option value="${u}">${u}</option>`).join('')}
          </select>
        </div>
        <input class="fit-pr-input" id="fit-pr-date" type="date" value="${today}" />
        <button class="fit-pr-save-btn" onclick="fitSavePR()">Save PR</button>
      </div>
    </div>`;
}

// ── FEATURE 2: WORKOUT HISTORY CALENDAR (HEATMAP) ─────────────────────
function fitRenderCalendar() {
  const el = document.getElementById('fit-progress-content');
  if (!el) return;

  const d = fitGetData();
  const today = new Date();
  const totalDays = 84; // 12 weeks × 7 days

  // Build array of 84 days (oldest first)
  const days = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const key = dt.toISOString().split('T')[0];
    const dayData = d[key];
    let intensity = 0;
    if (dayData && Object.keys(dayData).length > 0) {
      // Try to get workout duration for intensity scaling
      const builderKeys = Object.keys(dayData).filter(k => k.startsWith('__builder__'));
      if (builderKeys.length > 0) {
        intensity = Math.min(1, (dayData[builderKeys[0]].moves || 1) / 10);
      } else {
        intensity = 0.6;
      }
      intensity = Math.max(0.3, intensity);
    }
    days.push({ key, dt: new Date(dt), intensity });
  }

  // Month labels: track when month changes across the 12-week grid (7 cols)
  const monthLabels = [];
  let lastMonth = -1;
  // We'll render col by col (weeks), each col = 7 days
  // Build cols: 12 weeks, 7 rows each
  const cols = [];
  for (let w = 0; w < 12; w++) {
    cols.push(days.slice(w * 7, w * 7 + 7));
  }

  // Collect month label positions (col index)
  cols.forEach((col, colIdx) => {
    const month = col[0].dt.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ colIdx, label: col[0].dt.toLocaleDateString('en-US', { month: 'short' }) });
      lastMonth = month;
    }
  });

  const monthLabelRow = `<div class="fit-heatmap-months">
    ${cols.map((col, colIdx) => {
      const lbl = monthLabels.find(m => m.colIdx === colIdx);
      return `<div class="fit-heatmap-month-label">${lbl ? lbl.label : ''}</div>`;
    }).join('')}
  </div>`;

  const gridCols = cols.map((col) => {
    const cells = col.map(day => {
      let color = 'rgba(255,255,255,0.08)';
      if (day.intensity > 0) {
        const alpha = 0.4 + day.intensity * 0.6;
        color = `rgba(34,197,94,${alpha.toFixed(2)})`;
      }
      const isToday = day.key === today.toISOString().split('T')[0];
      return `<div class="fit-heatmap-cell${isToday ? ' heatmap-today' : ''}" style="background:${color}" title="${day.key}"></div>`;
    }).join('');
    return `<div class="fit-heatmap-col">${cells}</div>`;
  }).join('');

  const heatmapHtml = `
    <div class="fit-section-block" style="margin-top:16px">
      <div class="fit-section-title">📅 Workout History (12 Weeks)</div>
      <div class="fit-heatmap-wrap">
        ${monthLabelRow}
        <div class="fit-heatmap-grid">${gridCols}</div>
        <div class="fit-heatmap-legend">
          <span class="fit-heatmap-legend-label">Less</span>
          <div class="fit-heatmap-cell" style="background:rgba(255,255,255,0.08)"></div>
          <div class="fit-heatmap-cell" style="background:rgba(34,197,94,0.3)"></div>
          <div class="fit-heatmap-cell" style="background:rgba(34,197,94,0.6)"></div>
          <div class="fit-heatmap-cell" style="background:rgba(34,197,94,0.9)"></div>
          <span class="fit-heatmap-legend-label">More</span>
        </div>
      </div>
    </div>`;

  el.insertAdjacentHTML('beforeend', heatmapHtml);
}

// ── FEATURE 3: BODY MEASUREMENTS LOG ──────────────────────────────────
function fitGetMeasurements() {
  try { return JSON.parse(localStorage.getItem('fitMeasurements') || '[]'); } catch { return []; }
}

function fitLogMeasurement() {
  const weightEl = document.getElementById('fit-meas-weight');
  const bfEl = document.getElementById('fit-meas-bf');
  const waistEl = document.getElementById('fit-meas-waist');
  const armsEl = document.getElementById('fit-meas-arms');
  if (!weightEl) return;
  const weight = parseFloat(weightEl.value);
  if (isNaN(weight) || weight <= 0) return;
  const entry = {
    date: fitGetToday(),
    weight,
    bodyFat: bfEl && bfEl.value ? parseFloat(bfEl.value) : null,
    waist: waistEl && waistEl.value ? parseFloat(waistEl.value) : null,
    arms: armsEl && armsEl.value ? parseFloat(armsEl.value) : null
  };
  const measurements = fitGetMeasurements();
  // Remove existing entry for today if present
  const filtered = measurements.filter(m => m.date !== entry.date);
  filtered.push(entry);
  filtered.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem('fitMeasurements', JSON.stringify(filtered));
  fitRenderMeasurements();
}

function fitRenderMeasurements() {
  const container = document.getElementById('fit-today-content');
  if (!container) return;

  // Remove existing measurements section if already rendered
  const existingEl = document.getElementById('fit-measurements-section');
  if (existingEl) existingEl.remove();

  const measurements = fitGetMeasurements();
  const last7 = measurements.slice(-7).reverse();

  // Trend calculation
  let trendHtml = '';
  if (measurements.length >= 2) {
    const latest = measurements[measurements.length - 1].weight;
    // Find entry ~7 days ago
    const today = fitGetToday();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoKey = weekAgo.toISOString().split('T')[0];
    const oldEntry = measurements.slice().reverse().find(m => m.date <= weekAgoKey);
    if (oldEntry) {
      const diff = (latest - oldEntry.weight).toFixed(1);
      const arrow = diff > 0 ? '↑' : '↓';
      trendHtml = `<div class="fit-meas-trend">Weight: ${arrow} ${Math.abs(diff)} lbs from last week</div>`;
    }
  }

  const tableHtml = last7.length === 0 ? '' : `
    <table class="fit-meas-table">
      <thead>
        <tr>
          <th>Date</th><th>Weight</th><th>Body Fat</th><th>Waist</th>
        </tr>
      </thead>
      <tbody>
        ${last7.map(m => `
          <tr>
            <td>${m.date}</td>
            <td>${m.weight} lbs</td>
            <td>${m.bodyFat != null ? m.bodyFat + '%' : '—'}</td>
            <td>${m.waist != null ? m.waist + '"' : '—'}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;

  const sectionHtml = `
    <div class="fit-section-block fit-collapse-block" id="fit-measurements-section">
      <div class="fit-section-title fit-collapse-toggle" onclick="fitToggleCollapse('fit-meas-body')">
        📏 Body Measurements <span class="fit-collapse-arrow" id="arrow-fit-meas-body">▾</span>
      </div>
      <div id="fit-meas-body">
        <div class="fit-meas-form">
          <div class="fit-meas-row">
            <label class="fit-meas-label">Weight (lbs)</label>
            <input class="fit-meas-input" id="fit-meas-weight" type="number" placeholder="e.g. 175" step="0.1" min="0" />
          </div>
          <div class="fit-meas-row">
            <label class="fit-meas-label">Body Fat % (optional)</label>
            <input class="fit-meas-input" id="fit-meas-bf" type="number" placeholder="e.g. 18.5" step="0.1" min="0" max="100" />
          </div>
          <div class="fit-meas-row">
            <label class="fit-meas-label">Waist (inches)</label>
            <input class="fit-meas-input" id="fit-meas-waist" type="number" placeholder="e.g. 32" step="0.5" min="0" />
          </div>
          <div class="fit-meas-row">
            <label class="fit-meas-label">Arms (inches)</label>
            <input class="fit-meas-input" id="fit-meas-arms" type="number" placeholder="e.g. 14" step="0.25" min="0" />
          </div>
          <button class="fit-meas-log-btn" onclick="fitLogMeasurement()">Log Today</button>
        </div>
        ${trendHtml}
        ${tableHtml}
      </div>
    </div>`;

  container.insertAdjacentHTML('beforeend', sectionHtml);
}

// ── FEATURE 4: CALORIE GOAL RING ──────────────────────────────────────
// Replace plain calorie display in fitBuildNutritionSection with SVG ring.
// The ring is rendered inline via fitBuildCalorieRing().
function fitBuildCalorieRing(totalCal, goalCalories) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  const pct = Math.min(1, totalCal / goalCalories);
  const offset = circumference * (1 - pct);

  let strokeColor = '#22c55e';
  if (pct >= 1) strokeColor = '#ef4444';
  else if (pct >= 0.5) strokeColor = '#eab308';

  return `
    <div class="fit-ring-wrap">
      <svg class="fit-ring" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="${radius}" fill="none"
          stroke="rgba(255,255,255,0.1)" stroke-width="8" />
        <circle cx="50" cy="50" r="${radius}" fill="none"
          stroke="${strokeColor}" stroke-width="8"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${offset.toFixed(2)}"
          stroke-linecap="round"
          transform="rotate(-90 50 50)" />
        <text x="50" y="46" text-anchor="middle" class="fit-ring-cal-text" fill="white" font-size="13" font-weight="bold">${totalCal}</text>
        <text x="50" y="60" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8">kcal</text>
      </svg>
      <div class="fit-ring-goal-label">/ ${goalCalories} kcal goal</div>
      <button class="fit-ring-goal-btn" onclick="fitSetCalorieGoal()">Set Goal</button>
    </div>`;
}

function fitSetCalorieGoal() {
  const cur = localStorage.getItem('goalCalories') || localStorage.getItem('fitCalGoal') || '2000';
  const val = prompt('Daily calorie goal (kcal):', cur);
  if (val && !isNaN(val) && parseInt(val) > 0) {
    localStorage.setItem('goalCalories', parseInt(val));
    localStorage.setItem('fitCalGoal', parseInt(val));
    fitRenderToday();
  }
}
