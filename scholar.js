// ── SCHOLAR TOKEN + XP SYSTEM ────────────────────────────────────────
let _schTokens = parseInt(localStorage.getItem('schTokenBalance') || '0', 10);
let _schXP = parseInt(localStorage.getItem('schXP') || '0', 10);
const SCH_LEVELS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];
function schGetLevel() {
  for (let i = SCH_LEVELS.length - 1; i >= 0; i--) {
    if (_schXP >= SCH_LEVELS[i]) return i + 1;
  }
  return 1;
}
function schXPToNextLevel() {
  const lv = schGetLevel();
  if (lv >= SCH_LEVELS.length) return 0;
  return SCH_LEVELS[lv] - _schXP;
}
function updateSchDisplay() {
  const tc = document.getElementById('sch-token-count');
  const xc = document.getElementById('sch-xp-bar');
  const lc = document.getElementById('sch-level-badge');
  if (tc) tc.textContent = _schTokens.toLocaleString();
  const lv = schGetLevel();
  if (lc) lc.textContent = 'Lvl ' + lv;
  if (xc) {
    const cur = SCH_LEVELS[lv - 1] || 0;
    const next = SCH_LEVELS[lv] || SCH_LEVELS[SCH_LEVELS.length - 1];
    xc.style.width = ((_schXP - cur) / (next - cur) * 100).toFixed(1) + '%';
  }
}
function awardSchTokens(tokens, xp, reason) {
  _schTokens += tokens;
  _schXP += xp;
  localStorage.setItem('schTokenBalance', _schTokens);
  localStorage.setItem('schXP', _schXP);
  updateSchDisplay();
  // Trigger main app Firebase sync so tokens are saved to user's account
  if (typeof queueSync === 'function') queueSync();
  const toast = document.createElement('div');
  toast.className = 'sch-token-toast';
  toast.textContent = '+' + tokens + ' 📖  +' + xp + ' XP';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ── LESSON UNLOCK ─────────────────────────────────────────────────────
function schGetUnlocked() {
  try { return JSON.parse(localStorage.getItem('schUnlocked') || '[0,1]'); } catch { return [0, 1]; }
}
function schIsUnlocked(index) {
  if (index < 2) return true;
  return schGetUnlocked().includes(index);
}
function schUnlockLesson(index) {
  if (_schTokens < 50) {
    const toast = document.createElement('div');
    toast.className = 'sch-token-toast';
    toast.textContent = 'Not enough 📖 tokens!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
    return;
  }
  const unlocked = schGetUnlocked();
  if (!unlocked.includes(index)) {
    _schTokens -= 50;
    localStorage.setItem('schTokenBalance', _schTokens);
    unlocked.push(index);
    localStorage.setItem('schUnlocked', JSON.stringify(unlocked));
    updateSchDisplay();
    schRenderLessons();
  }
}

// ── NOTES ─────────────────────────────────────────────────────────────
function schGetNotes() {
  try { return JSON.parse(localStorage.getItem('schNotes') || '[]'); } catch { return []; }
}
function schSaveNote(lessonTitle, heading, body) {
  const notes = schGetNotes();
  notes.unshift({ lessonTitle, heading, body, date: new Date().toISOString() });
  localStorage.setItem('schNotes', JSON.stringify(notes));
  const toast = document.createElement('div');
  toast.className = 'sch-token-toast';
  toast.textContent = '📌 Saved to Notes!';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
function schDeleteNote(index) {
  const notes = schGetNotes();
  notes.splice(index, 1);
  localStorage.setItem('schNotes', JSON.stringify(notes));
  schRenderNotes();
}
function schRenderNotes() {
  const el = document.getElementById('sch-notes-list');
  if (!el) return;
  const notes = schGetNotes();
  if (!notes.length) {
    el.innerHTML = '<div class="sch-notes-empty">📌 Save quotes from lessons to build your knowledge library.</div>';
    return;
  }
  el.innerHTML = notes.map((n, i) => `
    <div class="sch-notes-card">
      <div class="sch-notes-card-header">
        <span class="sch-notes-lesson">${n.lessonTitle}</span>
        <button class="sch-notes-delete" onclick="schDeleteNote(${i})">🗑️</button>
      </div>
      <div class="sch-notes-heading">${n.heading}</div>
      <div class="sch-notes-body">${n.body}</div>
      <div class="sch-notes-date">${new Date(n.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
    </div>`).join('');
}

// ── LEADERBOARD ───────────────────────────────────────────────────────
function schGetWeeklyScore() {
  const stored = JSON.parse(localStorage.getItem('schWeeklyScore') || '{"score":0,"week":""}');
  const thisWeek = new Date().toISOString().slice(0, 10).replace(/-\d+$/, '') + '-' + getISOWeek(new Date());
  if (stored.week !== thisWeek) return { score: 0, week: thisWeek };
  return stored;
}
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7);
}
function schIncrementWeeklyScore() {
  const ws = schGetWeeklyScore();
  ws.score += 1;
  const thisWeek = new Date().toISOString().slice(0, 10).replace(/-\d+$/, '') + '-' + getISOWeek(new Date());
  ws.week = thisWeek;
  localStorage.setItem('schWeeklyScore', JSON.stringify(ws));
}
function schRenderLeaderboard() {
  const el = document.getElementById('scholar-leaderboard-content');
  if (!el) return;
  const ws = schGetWeeklyScore();
  const myName = 'You';
  const myLevel = schGetLevel();
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10);
  const friends = [
    { name: 'Alex K.', score: 8 + (seed % 5), level: 4 },
    { name: 'Jordan M.', score: 6 + (seed % 7), level: 3 },
    { name: 'Sam R.', score: 5 + (seed % 4), level: 5 },
    { name: 'Riley T.', score: 3 + (seed % 6), level: 2 },
    { name: 'Casey L.', score: 2 + (seed % 3), level: 3 },
  ];
  const myEntry = { name: myName, score: ws.score, level: myLevel, isMe: true };
  const all = [...friends, myEntry].sort((a, b) => b.score - a.score);
  const medal = ['🥇', '🥈', '🥉'];
  el.innerHTML = `
    <div class="sch-leaderboard">
      <div class="sch-leaderboard-title">🏆 Weekly Leaderboard</div>
      <div class="sch-leaderboard-week">Week of ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
      <div class="sch-leaderboard-list">
        ${all.map((p, i) => `
          <div class="sch-lb-row${p.isMe ? ' sch-lb-me' : ''}">
            <div class="sch-lb-rank">${medal[i] || (i + 1)}</div>
            <div class="sch-lb-name">${p.name}</div>
            <div class="sch-lb-level">Lvl ${p.level}</div>
            <div class="sch-lb-score">${p.score} correct</div>
          </div>`).join('')}
      </div>
      <div class="sch-lb-hint">Answer quiz questions to climb the leaderboard!</div>
    </div>`;
}

// ── DAILY CHALLENGE (QUIZ-STYLE) ──────────────────────────────────────
function schGetAllQuizQuestions() {
  const all = [];
  SCH_LESSONS.forEach(lesson => {
    lesson.quiz.forEach(q => {
      all.push({ ...q, lessonTitle: lesson.title });
    });
  });
  return all;
}
function schRenderDailyChallenge() {
  const el = document.getElementById('sch-daily-challenge-wrap');
  if (!el) return;
  const today = new Date().toISOString().split('T')[0];
  const seed = parseInt(today.replace(/-/g, ''), 10);
  const questions = schGetAllQuizQuestions();
  const q = questions[seed % questions.length];
  const done = localStorage.getItem('schDailyChallenge') === today;
  const streak = parseInt(localStorage.getItem('schDailyStreak') || '0', 10);

  if (done) {
    el.innerHTML = `
      <div class="sch-daily-challenge">
        <div class="sch-daily-challenge-header">
          <div class="sch-dc-title">Daily Challenge</div>
          <div class="sch-dc-streak">🔥 ${streak} day streak</div>
        </div>
        <div class="sch-dc-done">✅ Challenge done! Come back tomorrow.</div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="sch-daily-challenge">
      <div class="sch-daily-challenge-header">
        <div class="sch-dc-title">Daily Challenge</div>
        <div class="sch-dc-streak">🔥 ${streak} day streak</div>
      </div>
      <div class="sch-dc-lesson-tag">${q.lessonTitle}</div>
      <div class="sch-dc-question">${q.question}</div>
      <div class="sch-dc-options" id="sch-dc-options">
        ${q.options.map((opt, i) => `<button class="sch-q-option" onclick="schAnswerDailyChallenge(${i}, ${q.correct}, '${q.explanation.replace(/'/g,"&#39;")}')">${opt}</button>`).join('')}
      </div>
      <div class="sch-dc-feedback hidden" id="sch-dc-feedback"></div>
    </div>`;
}
function schAnswerDailyChallenge(idx, correct, explanation) {
  const opts = document.querySelectorAll('#sch-dc-options .sch-q-option');
  opts.forEach(b => b.disabled = true);
  opts.forEach((b, i) => {
    if (i === correct) b.classList.add('correct');
    else if (i === idx && idx !== correct) b.classList.add('wrong');
  });
  const fb = document.getElementById('sch-dc-feedback');
  const isCorrect = idx === correct;
  const today = new Date().toISOString().split('T')[0];
  if (isCorrect) {
    const streak = parseInt(localStorage.getItem('schDailyStreak') || '0', 10) + 1;
    localStorage.setItem('schDailyStreak', streak);
    localStorage.setItem('schDailyChallenge', today);
    awardSchTokens(20, 40, 'daily');
    fb.className = 'sch-dc-feedback fb-correct';
    fb.innerHTML = `✅ Correct! ${explanation}<br><strong>🔥 ${streak} day streak!</strong>`;
  } else {
    fb.className = 'sch-dc-feedback fb-wrong';
    fb.innerHTML = `❌ Not quite. ${explanation}`;
  }
  fb.classList.remove('hidden');
}

// ── SCHOLAR WORLD ────────────────────────────────────────────────────
let _schPage = 0;
let _schLessonIdx = 0;
let _schSlide = -1;
let _schQuizQ = 0;
let _schAnswers = [];
let _schAnswered = false;
let _schInitialized = false;

const SCH_LESSONS = [
  {
    id: 'habits', emoji: '🔥', title: 'The Habit Loop',
    tagline: 'Science-backed system for building lasting habits',
    slides: [
      { visual: '🧠', heading: 'Cue → Routine → Reward',
        body: 'Every habit has three parts: a <strong>cue</strong> that triggers it, a <strong>routine</strong> you perform, and a <strong>reward</strong> that reinforces it. Understanding this loop is the first step to changing any behavior.',
        tip: 'Attach a new habit to something you already do every day — like doing push-ups right after brushing your teeth.' },
      { visual: '⚡', heading: 'The 2-Minute Rule',
        body: 'If a new habit takes less than 2 minutes, do it now. For bigger habits, scale them down to a 2-minute version. "Run 3 miles" becomes "put on my running shoes." Starting is the hardest part.',
        tip: 'You\'ll almost always continue past 2 minutes once you start. The point is to make starting frictionless.' },
      { visual: '📈', heading: 'Small Gains, Big Results',
        body: 'Getting 1% better every day means you\'ll be 37× better after a year. The same goes in reverse — 1% worse daily compounds to near zero. Your habits define your trajectory, not your destination.',
        tip: 'Focus on the system, not the goal. Goals set the direction, but systems determine progress.' },
    ],
    quiz: [
      { question: 'What are the 3 parts of the habit loop?', options: ['Plan, Act, Review', 'Cue, Routine, Reward', 'Goal, Habit, Result', 'Trigger, Behavior, Outcome'], correct: 1, explanation: 'Cue triggers the routine, and the reward reinforces the loop so your brain wants to repeat it.' },
      { question: 'According to the 2-minute rule, what should you do with a big new habit?', options: ['Skip it if it takes over 2 mins', 'Scale it down to a 2-minute version', 'Do it for exactly 2 minutes then stop', 'Wait until you have 2 minutes free'], correct: 1, explanation: 'Scaling down removes the friction of starting. Once started, you\'ll usually continue.' },
      { question: 'Getting 1% better every day for a year makes you roughly how much better?', options: ['10×', '20×', '37×', '100×'], correct: 2, explanation: '1.01^365 ≈ 37.8. Tiny consistent improvements compound dramatically over time.' },
    ],
  },
  {
    id: 'sleep', emoji: '😴', title: 'Sleep Science',
    tagline: 'Why sleep is your most powerful performance tool',
    slides: [
      { visual: '🌙', heading: 'Sleep Cycles & Stages',
        body: 'Your brain cycles through 4–6 sleep cycles per night, each ~90 minutes. Deep sleep repairs your body and muscles. REM sleep consolidates memories and boosts creativity. Both are essential.',
        tip: 'Going to bed and waking up at the same time — even weekends — keeps your body clock calibrated and improves sleep quality dramatically.' },
      { visual: '🧬', heading: 'What Happens When You Sleep',
        body: 'During sleep, your brain flushes out waste products (including proteins linked to Alzheimer\'s). Growth hormone is released to repair tissue. Your immune system strengthens. Heart rate and blood pressure drop.',
        tip: 'The last 2 hours before bed — avoid bright screens, large meals, and intense exercise. Your core body temperature needs to drop to trigger sleep.' },
      { visual: '⚡', heading: 'Sleep Debt is Real',
        body: 'You can\'t truly "catch up" on lost sleep. Chronic short sleep (under 6 hrs) impairs cognition as severely as going 24 hours without sleep — but you stop noticing how impaired you are.',
        tip: 'Naps of 10–20 minutes can restore alertness. Longer naps (60–90 min) include deep sleep and improve learning and creativity.' },
    ],
    quiz: [
      { question: 'How long is one sleep cycle approximately?', options: ['30 minutes', '60 minutes', '90 minutes', '2 hours'], correct: 2, explanation: 'Each cycle is roughly 90 minutes. Most people need 4-6 cycles per night for full restoration.' },
      { question: 'Which sleep stage is most important for memory consolidation?', options: ['Light sleep', 'Deep sleep', 'REM sleep', 'All equally'], correct: 2, explanation: 'REM (Rapid Eye Movement) sleep is when your brain processes and stores memories from the day.' },
      { question: 'What is a recommended nap length for a quick alertness boost?', options: ['5 minutes', '10-20 minutes', '45 minutes', '2 hours'], correct: 1, explanation: 'A 10-20 minute "power nap" restores alertness without causing sleep inertia (grogginess).' },
    ],
  },
  {
    id: 'mindset', emoji: '🧠', title: 'Growth Mindset',
    tagline: 'Rewire how you think about ability and failure',
    slides: [
      { visual: '🔄', heading: 'Fixed vs. Growth Mindset',
        body: 'A <strong>fixed mindset</strong> believes abilities are set at birth — you\'re either smart or you\'re not. A <strong>growth mindset</strong> believes abilities can be developed through dedication and hard work.',
        tip: 'When you hit a wall, add the word "yet" to your thinking. Not "I can\'t do this" but "I can\'t do this YET."' },
      { visual: '💡', heading: 'Failure is Feedback',
        body: 'People with a growth mindset see failure as information, not judgment. Each mistake reveals what to improve. The most successful people in any field have failed more than most people have even tried.',
        tip: 'After any setback, ask: "What did I learn?" and "What would I do differently?" This reframes failure as a tool.' },
      { visual: '🌱', heading: 'The Power of "Not Yet"',
        body: 'Schools that give "Not Yet" instead of failing grades show huge improvements. Students shift from "I failed" to "I\'m on a learning curve." This one word change dramatically affects persistence and outcomes.',
        tip: 'Praise effort, strategy, and process — not talent. "You worked really hard on that" builds resilience. "You\'re so smart" makes people avoid challenges.' },
    ],
    quiz: [
      { question: 'What does a growth mindset believe about abilities?', options: ['They are set at birth', 'They can\'t be changed after childhood', 'They can be developed through effort', 'They depend mainly on genetics'], correct: 2, explanation: 'Growth mindset holds that dedication and hard work can develop any ability.' },
      { question: 'How does a growth mindset view failure?', options: ['As something to avoid at all costs', 'As a sign you\'re not talented', 'As feedback and a learning opportunity', 'As permanent proof of weakness'], correct: 2, explanation: 'Failure provides information about what to improve — it\'s not a final judgment.' },
      { question: 'What\'s the most effective way to praise someone to encourage resilience?', options: ['Praise their intelligence', 'Praise their natural talent', 'Praise their effort and process', 'Don\'t praise them at all'], correct: 2, explanation: 'Praising effort and strategy teaches that improvement comes from working hard, not from fixed talent.' },
    ],
  },
  {
    id: 'nutrition', emoji: '🥗', title: 'Nutrition Basics',
    tagline: 'Fuel your body and brain for peak performance',
    slides: [
      { visual: '🍽️', heading: 'Macronutrients Explained',
        body: '<strong>Carbohydrates</strong> are your body\'s preferred energy source. <strong>Protein</strong> builds and repairs muscle. <strong>Fats</strong> support hormones, brain function, and absorbing vitamins. You need all three.',
        tip: 'A simple plate: half vegetables, a quarter lean protein, a quarter complex carbs. No need to count calories — just balance the plate.' },
      { visual: '💧', heading: 'Hydration & Performance',
        body: 'Even mild dehydration (1-2% body weight) causes measurable drops in cognitive function, mood, and physical performance. Your brain is 75% water. Most people are chronically mildly dehydrated.',
        tip: 'Start every morning with a full glass of water before coffee. Coffee is a diuretic — you\'re already dehydrated when you wake up.' },
      { visual: '⏰', heading: 'Meal Timing Matters',
        body: 'Eating protein within 30-60 minutes of strength training maximizes muscle protein synthesis. Eating large meals close to bedtime disrupts sleep quality. Going too long without eating spikes cortisol.',
        tip: 'You don\'t need to eat every 2 hours — that\'s a myth. Focus on eating whole foods when you\'re actually hungry and stopping when satisfied.' },
    ],
    quiz: [
      { question: 'What is the primary role of protein in your diet?', options: ['Quick energy source', 'Building and repairing muscle', 'Supporting hormone production', 'Providing insulation'], correct: 1, explanation: 'Protein is the building block for muscle tissue and is also used to repair cells throughout the body.' },
      { question: 'By how much does mild dehydration reduce cognitive performance?', options: ['Not at all', '1-2% body weight causes drops', '5% is needed to notice effects', 'Only extreme dehydration matters'], correct: 1, explanation: 'Just 1-2% dehydration (by body weight) measurably impairs memory, concentration, and mood.' },
      { question: 'When is the ideal time to consume protein for muscle building?', options: ['First thing in the morning', 'Only at dinner', 'Within 30-60 minutes after training', 'Evenly spread every 2 hours'], correct: 2, explanation: 'Your muscles are most receptive to protein in the post-workout window, maximizing repair and growth.' },
    ],
  },
  {
    id: 'focus', emoji: '🎯', title: 'Deep Focus',
    tagline: 'Master your attention in the age of distraction',
    slides: [
      { visual: '🧘', heading: 'Your Attention is Finite',
        body: 'Every decision, notification, and task switch costs mental energy. Decision fatigue is real — your best focus is in the morning before your brain is depleted. Successful people guard their first hours like gold.',
        tip: 'Do your most important work first, before checking email or social media. These activities consume attention without producing much of value.' },
      { visual: '📵', heading: 'The Cost of Multitasking',
        body: 'Your brain can\'t truly multitask — it rapidly switches between tasks. Each switch costs 15-20 minutes to regain deep focus. Feeling busy isn\'t the same as being productive. Focus on one thing at a time.',
        tip: 'Try the Pomodoro Technique: 25 minutes of single-focus work, then a 5-minute break. Four rounds, then a longer break. Your output quality will surprise you.' },
      { visual: '🌊', heading: 'Flow State',
        body: 'Flow is a state of total absorption where you perform at your peak and time seems to stop. It requires a task that\'s just slightly beyond your current skill level, clear goals, and no interruptions for 15+ minutes.',
        tip: 'To enter flow: put your phone in another room, close all browser tabs except what you need, set a timer, and start. The first 10 minutes are always the hardest.' },
    ],
    quiz: [
      { question: 'How long does it take to regain deep focus after a task switch?', options: ['2-3 minutes', '5 minutes', '15-20 minutes', 'You regain it immediately'], correct: 2, explanation: 'Each context switch costs roughly 15-20 minutes to fully re-engage with your previous task.' },
      { question: 'When during the day is your focus generally best?', options: ['After lunch', 'Late at night', 'In the morning before decisions deplete you', 'It\'s the same all day'], correct: 2, explanation: 'Decision fatigue builds throughout the day. Your peak cognitive state is usually in the morning.' },
      { question: 'What does flow state require?', options: ['A very easy task with no pressure', 'A task just beyond your skill with no interruptions', 'Background music and company', 'Caffeine and energy drinks'], correct: 1, explanation: 'Flow requires a challenge that slightly exceeds your skill level, clear goals, and uninterrupted focus.' },
    ],
  },
];

// ── Progress ──────────────────────────────────────────────────────────
function schGetProgress() {
  try { return JSON.parse(localStorage.getItem('scholarProgress') || '{}'); } catch { return {}; }
}
function schSaveProgress(lessonId, score, total) {
  const p = schGetProgress();
  const passed = score === total;
  if (!p[lessonId] || (!p[lessonId].passed && score > (p[lessonId].score || 0))) {
    p[lessonId] = { score, total, passed, date: new Date().toISOString() };
  }
  localStorage.setItem('scholarProgress', JSON.stringify(p));
}
function schIsPassed(lessonId) {
  const p = schGetProgress();
  return !!(p[lessonId] && p[lessonId].passed);
}

// ── Screen management ─────────────────────────────────────────────────
function schShowScreen(id) {
  document.querySelectorAll('.sch-screen').forEach(s => s.classList.remove('sch-active'));
  if (id) {
    const el = document.getElementById('sch-screen-' + id);
    if (el) { el.classList.add('sch-active'); el.scrollTop = 0; }
  }
}

// ── Init ──────────────────────────────────────────────────────────────
function schInit() {
  if (!_schInitialized) {
    _schInitialized = true;
  }
  requestAnimationFrame(() => { schGoTo(0); schRenderLessons(); updateSchDisplay(); });
}

function schGoHome() {
  schShowScreen(null);
  schRenderLessons();
}

function schGoTo(n) {
  _schPage = n;
  const pages = document.getElementById('pages-scholar');
  if (pages) pages.style.transform = `translateX(${-n * 100}vw)`;
  [0,1,2,3].forEach(i => {
    const btn = document.getElementById('snav-' + i);
    if (btn) btn.classList.toggle('active', i === n);
  });
  const ind = document.getElementById('nav-indicator-scholar');
  if (ind) ind.style.left = (n * 25 + 25 * 0.2) + '%';
  if (n === 0) { const sp = document.getElementById('scholar-lesson-list'); if (sp && !sp.children.length) schRenderLessons(); }
  if (n === 1) schRenderExplore();
  if (n === 2) schRenderDaily();
  if (n === 3) schRenderSchProgress();
}

// ── Lesson List ───────────────────────────────────────────────────────
function schRenderLessons() {
  const p = schGetProgress();
  const passed = SCH_LESSONS.filter(l => schIsPassed(l.id)).length;
  const total = SCH_LESSONS.length;

  const pill = document.getElementById('scholar-progress-pill');
  if (pill) {
    if (passed === 0) pill.textContent = '👋 Tap a lesson to begin';
    else if (passed >= total) pill.textContent = '🏆 All lessons complete!';
    else pill.textContent = `✅ ${passed} of ${total} complete`;
  }

  // Inject header bar once
  const headerTarget = document.getElementById('sch-header-bar-host');
  if (headerTarget && !document.getElementById('sch-token-count')) {
    headerTarget.innerHTML = `
      <div class="sch-header-bar">
        <div class="sch-token-display">📖 <span id="sch-token-count">0</span></div>
        <div class="sch-level-display"><span id="sch-level-badge">Lvl 1</span></div>
        <div class="sch-xp-track"><div class="sch-xp-bar" id="sch-xp-bar"></div></div>
      </div>`;
    updateSchDisplay();
  }

  // Inject daily challenge card once
  const dcHost = document.getElementById('sch-daily-challenge-host');
  if (dcHost) schRenderDailyChallenge();

  const list = document.getElementById('scholar-lesson-list');
  if (!list) return;
  list.innerHTML = SCH_LESSONS.map((lesson, i) => {
    const lp = p[lesson.id];
    const isComplete = schIsPassed(lesson.id);
    const tokenUnlocked = schIsUnlocked(i);
    const progressUnlocked = i === 0 || schIsPassed(SCH_LESSONS[i-1]?.id);
    const isUnlocked = tokenUnlocked && progressUnlocked;
    const isCurrent = !isComplete && isUnlocked;
    const cls = isComplete ? 'complete' : isCurrent ? 'current' : 'locked';
    const statusIcon = isComplete ? '✅' : isCurrent ? '▶️' : '🔒';

    if (!tokenUnlocked && i >= 2) {
      return `
        <div class="sch-lesson-card locked sch-lesson-token-locked">
          <div class="sch-lesson-emoji">${lesson.emoji}</div>
          <div class="sch-lesson-body">
            <div class="sch-lesson-num">Lesson ${i+1}</div>
            <div class="sch-lesson-title">${lesson.title}</div>
            <div class="sch-lesson-tagline">${lesson.tagline}</div>
          </div>
          <div class="sch-lock-overlay">
            <div class="sch-lock-msg">🔒 50 📖 to unlock</div>
            <button class="sch-unlock-btn" onclick="schUnlockLesson(${i})">Unlock</button>
          </div>
        </div>`;
    }

    return `
      <div class="sch-lesson-card ${cls}" ${isUnlocked ? `onclick="schStartLesson(${i})"` : ''}>
        ${lp ? `<div class="sch-lesson-score">${lp.score}/${lp.total}</div>` : ''}
        <div class="sch-lesson-emoji">${lesson.emoji}</div>
        <div class="sch-lesson-body">
          <div class="sch-lesson-num">Lesson ${i+1}</div>
          <div class="sch-lesson-title">${lesson.title}</div>
          <div class="sch-lesson-tagline">${lesson.tagline}</div>
        </div>
        <div class="sch-lesson-arrow">${statusIcon}</div>
      </div>`;
  }).join('');

  // Render notes section
  const notesHost = document.getElementById('sch-notes-host');
  if (notesHost) {
    notesHost.innerHTML = `
      <div class="sch-notes-section">
        <div class="sch-notes-title">📌 My Notes</div>
        <div id="sch-notes-list"></div>
      </div>`;
    schRenderNotes();
  }
}

// ── Lesson ────────────────────────────────────────────────────────────
function schStartLesson(idx) {
  _schLessonIdx = idx;
  _schSlide = -1;
  schRenderLesson();
  schShowScreen('lesson');
}

function schRenderLesson() {
  const lesson = SCH_LESSONS[_schLessonIdx];
  document.getElementById('sch-lesson-num').textContent = `Lesson ${_schLessonIdx+1} of ${SCH_LESSONS.length}`;

  const dotsEl = document.getElementById('sch-slide-dots');
  if (_schSlide === -1) {
    dotsEl.innerHTML = '';
  } else {
    dotsEl.innerHTML = lesson.slides.map((_, i) =>
      `<div class="sch-slide-dot ${i < _schSlide ? 'done' : i === _schSlide ? 'active' : ''}"></div>`
    ).join('');
  }

  const content = document.getElementById('sch-lesson-content');
  if (_schSlide === -1) {
    content.innerHTML = `
      <div class="sch-intro">
        <div class="sch-intro-emoji">${lesson.emoji}</div>
        <div class="sch-intro-num">Lesson ${_schLessonIdx+1}</div>
        <h2 class="sch-intro-title">${lesson.title}</h2>
        <p class="sch-intro-tagline">${lesson.tagline}</p>
        <div class="sch-learn-list">
          <div class="sch-learn-title">In this lesson:</div>
          ${lesson.slides.map(s => `<div class="sch-learn-item">→ ${s.heading}</div>`).join('')}
        </div>
      </div>`;
  } else {
    const s = lesson.slides[_schSlide];
    const safeHeading = s.heading.replace(/'/g, "&#39;");
    const safeBody = s.tip.replace(/'/g, "&#39;");
    const safeTitle = lesson.title.replace(/'/g, "&#39;");
    content.innerHTML = `
      <div class="sch-slide-visual">${s.visual}</div>
      <h2 class="sch-slide-heading">${s.heading}</h2>
      <div class="sch-slide-body">${s.body}</div>
      <div class="sch-tip-card">
        <div class="sch-tip-icon">💡</div>
        <div class="sch-tip-text">${s.tip}</div>
      </div>
      <button class="sch-save-quote-btn" onclick="schSaveNote('${safeTitle}','${safeHeading}','${safeBody}')">📌 Save to Notes</button>`;
  }

  const prevBtn = document.getElementById('sch-btn-prev');
  const nextBtn = document.getElementById('sch-btn-next');
  prevBtn.style.display = _schSlide === -1 ? 'none' : 'block';
  const isLast = _schSlide === lesson.slides.length - 1;
  nextBtn.textContent = isLast ? 'Take the Quiz! 🎯' : _schSlide === -1 ? 'Start Lesson →' : 'Next →';
  nextBtn.className = isLast ? 'sch-btn-primary sch-btn-green' : 'sch-btn-primary';
}

function schNextSlide() {
  const lesson = SCH_LESSONS[_schLessonIdx];
  if (_schSlide === lesson.slides.length - 1) {
    awardSchTokens(30, 60, 'lesson');
    schStartQuiz();
  } else {
    _schSlide++;
    schRenderLesson();
    document.getElementById('sch-lesson-content').scrollTop = 0;
  }
}
function schPrevSlide() {
  if (_schSlide > -1) { _schSlide--; schRenderLesson(); document.getElementById('sch-lesson-content').scrollTop = 0; }
}

// ── Quiz ──────────────────────────────────────────────────────────────
function schStartQuiz() {
  _schQuizQ = 0; _schAnswers = []; _schAnswered = false;
  schRenderQuizQ();
  schShowScreen('quiz');
}

function schRenderQuizQ() {
  const lesson = SCH_LESSONS[_schLessonIdx];
  const q = lesson.quiz[_schQuizQ];
  const total = lesson.quiz.length;
  _schAnswered = false;
  document.getElementById('sch-quiz-label').textContent = `Q${_schQuizQ+1} of ${total}`;
  const pct = Math.round((_schQuizQ + 1) / total * 100);
  document.getElementById('sch-quiz-body').innerHTML = `
    <div class="sch-quiz-bar"><div id="sch-quiz-fill" style="width:${pct}%"></div></div>
    <div class="sch-q-num">Question ${_schQuizQ+1} of ${total}</div>
    <div class="sch-q-text">${q.question}</div>
    <div class="sch-q-options">
      ${q.options.map((opt, i) => `<button class="sch-q-option" data-idx="${i}" onclick="schSelectOpt(${i})">${opt}</button>`).join('')}
    </div>
    <div class="sch-q-feedback hidden" id="sch-q-feedback">
      <div class="sch-fb-icon" id="sch-fb-icon"></div>
      <div class="sch-fb-text" id="sch-fb-text"></div>
    </div>
    <button class="sch-q-next hidden" id="sch-q-next" onclick="schNextQ()">
      ${_schQuizQ === total - 1 ? 'See Results 🎉' : 'Next Question →'}
    </button>`;
}

function schSelectOpt(idx) {
  if (_schAnswered) return;
  _schAnswered = true;
  const q = SCH_LESSONS[_schLessonIdx].quiz[_schQuizQ];
  const isCorrect = idx === q.correct;
  _schAnswers.push({ isCorrect });
  document.querySelectorAll('.sch-q-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx && !isCorrect) btn.classList.add('wrong');
  });
  if (isCorrect) {
    awardSchTokens(10, 20, 'correct');
    schIncrementWeeklyScore();
  }
  const fb = document.getElementById('sch-q-feedback');
  fb.className = 'sch-q-feedback ' + (isCorrect ? 'fb-correct' : 'fb-wrong');
  document.getElementById('sch-fb-icon').textContent = isCorrect ? '✅  Correct!' : '❌  Not quite...';
  document.getElementById('sch-fb-text').textContent = q.explanation;
  const next = document.getElementById('sch-q-next');
  next.classList.remove('hidden');
  setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
}

function schNextQ() {
  const lesson = SCH_LESSONS[_schLessonIdx];
  if (_schQuizQ === lesson.quiz.length - 1) { schShowResults(); }
  else { _schQuizQ++; schRenderQuizQ(); document.getElementById('sch-screen-quiz').scrollTop = 0; }
}

// ── Results ───────────────────────────────────────────────────────────
function schShowResults() {
  const lesson = SCH_LESSONS[_schLessonIdx];
  const correct = _schAnswers.filter(a => a.isCorrect).length;
  const total = _schAnswers.length;
  const pct = Math.round(correct / total * 100);
  schSaveProgress(lesson.id, correct, total);

  if (pct === 100) awardSchTokens(50, 100, 'perfect');

  let trophy, title, subtitle;
  if (pct === 100) { trophy = '🏆'; title = 'Perfect Score!'; subtitle = 'Incredible — you nailed every question!'; }
  else if (pct >= 67) { trophy = '🌟'; title = 'Great Job!'; subtitle = 'Well done! Review any missed questions below.'; }
  else { trophy = '💪'; title = 'Keep Going!'; subtitle = "Review the lesson and try again — you've got this!"; }

  const stars = [1,2,3].map(s => {
    const filled = (pct===100&&s<=3)||(pct>=67&&s<=2)||(pct>=34&&s<=1);
    return `<span class="sch-star${filled?' filled':''}">⭐</span>`;
  }).join('');

  const nextIdx = _schLessonIdx + 1;
  const hasNext = nextIdx < SCH_LESSONS.length;

  document.getElementById('sch-results-body').innerHTML = `
    <div style="padding:32px 18px 60px;text-align:center;max-width:500px;margin:0 auto">
      <div style="font-size:5rem;margin-bottom:12px">${trophy}</div>
      <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:10px">${title}</h2>
      <div style="display:flex;gap:6px;justify-content:center;margin-bottom:12px">${stars}</div>
      <div style="font-size:3rem;font-weight:900;margin-bottom:10px;color:${pct===100?'#f59e0b':pct>=67?'#4ade80':'#8b5cf6'}">${correct}/${total}</div>
      <p style="color:#7a829c;margin-bottom:24px;line-height:1.6">${subtitle}</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${hasNext
          ? pct===100
            ? `<button class="sch-btn-primary sch-btn-green" onclick="schStartLesson(${nextIdx})">Next: ${SCH_LESSONS[nextIdx].title} ${SCH_LESSONS[nextIdx].emoji}</button>`
            : `<div class="sch-locked-hint"><div style="font-size:1rem;font-weight:800;color:#f87171;margin-bottom:6px">🔒 Next lesson locked</div><div style="font-size:0.85rem;color:#fca5a5">Get every question right to unlock the next lesson</div></div>`
          : `<div class="sch-all-done">🎓 <strong>Scholar Complete!</strong><p>You've finished all 5 lessons!</p></div>`
        }
        <button class="sch-btn-secondary" onclick="schStartLesson(${_schLessonIdx})">Redo Lesson 🔄</button>
        <button class="sch-btn-secondary" onclick="schGoHome()">Back to Lessons 🏠</button>
      </div>
    </div>`;
  schShowScreen('results');
}

// ── Progress Tab ──────────────────────────────────────────────────────
let _schProgressTab = 'progress'; // 'progress' | 'leaderboard'
function schRenderSchProgress() {
  const p = schGetProgress();
  const passed = SCH_LESSONS.filter(l => schIsPassed(l.id)).length;
  const el = document.getElementById('scholar-progress-content');
  if (!el) return;
  el.innerHTML = `
    <div class="sch-prog-tabs">
      <button class="sch-prog-tab-btn${_schProgressTab === 'progress' ? ' active' : ''}" onclick="schSwitchProgressTab('progress')">📊 Progress</button>
      <button class="sch-prog-tab-btn${_schProgressTab === 'leaderboard' ? ' active' : ''}" onclick="schSwitchProgressTab('leaderboard')">🏆 Leaderboard</button>
    </div>
    <div id="sch-prog-tab-content"></div>`;
  schRenderProgressTabContent();
}
function schSwitchProgressTab(tab) {
  _schProgressTab = tab;
  const btns = document.querySelectorAll('.sch-prog-tab-btn');
  btns.forEach((b, i) => b.classList.toggle('active', (i === 0 && tab === 'progress') || (i === 1 && tab === 'leaderboard')));
  schRenderProgressTabContent();
}
function schRenderProgressTabContent() {
  const content = document.getElementById('sch-prog-tab-content');
  if (!content) return;
  if (_schProgressTab === 'leaderboard') {
    content.innerHTML = '<div id="scholar-leaderboard-content"></div>';
    schRenderLeaderboard();
    return;
  }
  const p = schGetProgress();
  const passed = SCH_LESSONS.filter(l => schIsPassed(l.id)).length;
  content.innerHTML = `
    <div class="sch-stat-row">
      <div class="sch-stat-card"><div class="sch-stat-icon">🏆</div><div class="sch-stat-val">${passed}/${SCH_LESSONS.length}</div><div class="sch-stat-lbl">Passed</div></div>
      <div class="sch-stat-card"><div class="sch-stat-icon">⭐</div><div class="sch-stat-val">${SCH_LESSONS.filter(l=>{const lp=p[l.id];return lp&&lp.score===lp.total;}).length}</div><div class="sch-stat-lbl">Perfect</div></div>
    </div>
    <div style="margin-top:16px">
      ${SCH_LESSONS.map((lesson,i) => {
        const lp = p[lesson.id];
        const isPassed = lp && lp.passed;
        return `
          <div class="sch-prog-row${isPassed?' passed':''}">
            <span style="font-size:1.6rem">${lesson.emoji}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.9rem">${lesson.title}</div>
              <div style="font-size:0.75rem;color:#7a829c">${lp ? `Score: ${lp.score}/${lp.total}` : 'Not started'}</div>
            </div>
            <div class="sch-prog-badge${!lp?' locked':''}">${isPassed?'✅ Passed':lp?`${lp.score}/${lp.total}`:'🔒'}</div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── EXPLORE TAB ──────────────────────────────────────────────────────
const SCH_EXPLORE_TOPICS = [
  {
    emoji: '🧬', title: 'Neuroplasticity',
    sub: 'Your brain rewires itself throughout life',
    body: 'For decades, scientists believed the adult brain was fixed. We now know it continuously forms new neural connections — a property called neuroplasticity. Learning a new skill, forming habits, or recovering from injury all involve physical changes in brain structure.\n\nEvery time you practice something, the neural pathway for that activity gets stronger and faster — like widening a path through a forest. This is why repetition matters in habit building.\n\nThe flip side: neural pathways you stop using weaken over time. "Use it or lose it" is neurologically accurate.',
    fact: 'London taxi drivers have measurably larger hippocampi (memory/navigation brain region) than non-taxi drivers.'
  },
  {
    emoji: '⏰', title: 'Time Perception',
    sub: 'Why time feels faster as you get older',
    body: 'Children experience time slowly because each day is packed with new experiences — and novelty requires the brain to process more information, making time feel longer. Adults with routine-heavy lives have less novel input, so the brain "compresses" time.\n\nThis is why a two-week vacation feels long at first but short in memory — the beginning is novel and rich, the end becomes routine.\n\nThe practical takeaway: regularly seek new experiences, skills, and environments. It literally makes your life feel longer.',
    fact: 'Your brain timestamps memories differently based on how emotionally significant they are — not how much clock time passed.'
  },
  {
    emoji: '🎯', title: 'Deep Work',
    sub: 'The skill that separates high performers',
    body: 'Cal Newport defines deep work as "professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit." The ability to focus without distraction is becoming rare and increasingly valuable.\n\nThe average knowledge worker checks email every 6 minutes. Each interruption takes an average of 23 minutes to fully recover from cognitively — meaning constant interruptions virtually eliminate deep focus.\n\nBuilding a deep work practice — even 1-2 hours daily — can double or triple your output of complex, valuable work.',
    fact: 'Elite musicians, chess players, and athletes all practice "deliberate practice" — focused, uncomfortable, feedback-rich sessions. Not just repetition.'
  },
  {
    emoji: '💤', title: 'The Glymphatic System',
    sub: 'How your brain cleans itself while you sleep',
    body: 'Discovered in 2012, the glymphatic system is your brain\'s waste-clearance mechanism. During deep sleep, cerebrospinal fluid flushes through the brain, washing away toxic proteins — including beta-amyloid, which accumulates in Alzheimer\'s disease.\n\nThe system is nearly 10× more active during sleep than when awake. This is one reason chronic sleep deprivation is so damaging — waste accumulates faster than it can be cleared.\n\nSide sleeping appears to improve glymphatic drainage compared to sleeping on your back or stomach.',
    fact: 'The brain shrinks slightly during sleep to allow more cerebrospinal fluid to flow through it — expanding again upon waking.'
  },
  {
    emoji: '🫀', title: 'Zone 2 Cardio',
    sub: 'The most important exercise almost nobody does',
    body: 'Zone 2 cardio — sustained low-intensity exercise where you can hold a conversation but feel slightly breathless — is where most of your aerobic adaptation happens. It builds your mitochondrial density, the number of energy-producing units in your cells.\n\nElite endurance athletes spend 80% of their training in zone 2 and only 20% at high intensity. Most recreational exercisers do the opposite — and miss most of the benefit.\n\nBenefits: improved fat metabolism, better insulin sensitivity, longevity markers, reduced resting heart rate, and a larger aerobic base for all other exercise.',
    fact: 'Peter Attia, a longevity physician, calls VO2 max (peak aerobic capacity) the single strongest predictor of long-term health and lifespan.'
  },
  {
    emoji: '🌿', title: 'Nature & Stress',
    sub: "Why spending time outdoors actually changes your brain",
    body: "Research consistently shows that spending time in natural environments reduces cortisol, lowers heart rate and blood pressure, and improves mood more than urban environments — even when controlling for exercise.\n\nA study by Stanford found that walking in nature for 90 minutes reduced activity in the brain's rumination circuit (associated with depression and anxiety) compared to walking in an urban setting.\n\nEven small doses help: a view of trees from a hospital window has been shown to speed recovery and reduce painkiller usage. Indoor plants measurably reduce stress markers in office environments.",
    fact: 'Japan has a practice called "Shinrin-yoku" (forest bathing) — simply being present in a forest. Studies show it increases natural killer cell activity (immune defense) for up to 30 days.'
  },
  {
    emoji: '🔄', title: 'Stress Inoculation',
    sub: 'Why some stress makes you stronger',
    body: 'Not all stress is harmful. Hormetic stress — short, controlled doses of stress followed by recovery — actually makes you more resilient. Exercise is the most obvious example: you stress your muscles, they repair stronger.\n\nPsychologically, the same principle applies. People who experience moderate adversity in life show better resilience than those who experienced either no adversity or severe trauma. The dose matters.\n\nPractical applications: cold exposure, exercise, intermittent fasting, hard conversations, deliberate skill challenges — all create stress that, with adequate recovery, builds capacity.',
    fact: 'The stress response (cortisol + adrenaline) was originally designed to help you survive a predator — not to respond to emails for 8 hours straight.'
  },
  {
    emoji: '🧠', title: 'Working Memory',
    sub: 'Your brain\'s RAM — and how to expand it',
    body: 'Working memory is the cognitive system that temporarily holds information while you use it. Most adults can hold 4–7 chunks of information at once. It\'s closely linked to IQ, learning speed, and executive function.\n\nUnlike long-term memory, working memory can be improved with training. Dual N-back tasks, meditation, and regular aerobic exercise all increase working memory capacity over time.\n\nReducing cognitive load helps too: writing things down, clearing notifications, keeping your environment organized — all free up working memory capacity for the task at hand.',
    fact: 'Sleep deprivation impairs working memory more severely than almost any other cognitive function — making it harder to think clearly, remember instructions, and regulate emotions.'
  },
];

let _schExploreOpen = null;

function schRenderExplore() {
  const el = document.getElementById('scholar-explore-content');
  if (!el) return;
  el.innerHTML = `
    <div class="sch-explore-grid">
      ${SCH_EXPLORE_TOPICS.map((t, i) => `
        <div class="sch-explore-card${_schExploreOpen === i ? ' open' : ''}" onclick="schToggleExplore(${i})">
          <div class="sch-explore-card-header">
            <span class="sch-explore-emoji">${t.emoji}</span>
            <div class="sch-explore-card-info">
              <div class="sch-explore-title">${t.title}</div>
              <div class="sch-explore-sub">${t.sub}</div>
            </div>
            <span class="sch-explore-arrow">${_schExploreOpen === i ? '▲' : '▼'}</span>
          </div>
          ${_schExploreOpen === i ? `
            <div class="sch-explore-body">
              ${t.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
              <div class="sch-explore-fact"><span class="sch-explore-fact-label">⚡ Key Fact</span>${t.fact}</div>
            </div>` : ''}
        </div>`).join('')}
    </div>`;
}

function schToggleExplore(i) {
  _schExploreOpen = _schExploreOpen === i ? null : i;
  schRenderExplore();
}

// ── DAILY TAB ────────────────────────────────────────────────────────
const SCH_DAILY_CHALLENGES = [
  { q: 'What is the "cue" in a habit loop?', a: 'The trigger that initiates the habit — a time, place, emotion, or person that signals your brain to start the routine.', topic: 'Habit Loop' },
  { q: 'How long is one complete sleep cycle?', a: 'Approximately 90 minutes. A full night typically contains 4–6 complete cycles.', topic: 'Sleep Science' },
  { q: 'What does a growth mindset believe that a fixed mindset does not?', a: 'That abilities and intelligence can be developed through effort, learning, and persistence.', topic: 'Growth Mindset' },
  { q: 'Which macronutrient is primarily responsible for building and repairing muscle?', a: 'Protein. It provides amino acids — the building blocks used to repair and grow muscle tissue.', topic: 'Nutrition' },
  { q: 'What is the recommended minimum daily deep focus work time for high performers?', a: '1–4 hours of uninterrupted, high-concentration work. Quality beats quantity.', topic: 'Deep Focus' },
  { q: 'What does the glymphatic system do?', a: 'It clears toxic waste products (like beta-amyloid) from your brain — primarily during deep sleep.', topic: 'Sleep' },
  { q: 'What is Zone 2 cardio?', a: 'Sustained low-intensity exercise where you can talk but feel slightly breathless. Builds mitochondrial density and aerobic base.', topic: 'Fitness' },
  { q: 'What is neuroplasticity?', a: "The brain's ability to reorganize itself by forming new neural connections throughout life — in response to learning, experience, or injury.", topic: 'Neuroscience' },
  { q: 'What happens to your working memory when you are sleep-deprived?', a: 'It is severely impaired — making it harder to think clearly, learn new information, and regulate emotions.', topic: 'Cognitive Science' },
  { q: 'What is "hormetic stress"?', a: 'Short, controlled doses of stress (exercise, cold, fasting) followed by recovery that make you more resilient over time.', topic: 'Stress & Resilience' },
  { q: 'What does "Shinrin-yoku" mean?', a: 'Forest bathing — the Japanese practice of spending mindful time in a forest, which reduces stress hormones for up to 30 days.', topic: 'Nature' },
  { q: 'What is the 2-minute rule for habits?', a: 'Scale any new habit down to a version that takes 2 minutes or less to make starting frictionless.', topic: 'Habit Formation' },
  { q: 'How much better does getting 1% better daily make you after one year?', a: 'Approximately 37× better. Small daily improvements compound dramatically over time.', topic: 'Atomic Habits' },
  { q: 'What is deliberate practice?', a: 'Focused, uncomfortable, feedback-rich practice sessions — the key to expert-level skill development in any field.', topic: 'Mastery' },
];

let _schDailyFlipped = false;

function schRenderDaily() {
  const el = document.getElementById('scholar-daily-content');
  if (!el) return;

  // Pick challenge based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const challenge = SCH_DAILY_CHALLENGES[dayOfYear % SCH_DAILY_CHALLENGES.length];

  el.innerHTML = `
    <div class="sch-daily-wrap">
      <div class="sch-daily-label">Daily Challenge</div>
      <div class="sch-daily-topic-pill">${challenge.topic}</div>

      <div class="sch-daily-card${_schDailyFlipped ? ' flipped' : ''}" onclick="schFlipDaily()">
        <div class="sch-daily-front">
          <div class="sch-daily-q-label">Question</div>
          <div class="sch-daily-question">${challenge.q}</div>
          <div class="sch-daily-hint">Tap to reveal answer</div>
        </div>
        <div class="sch-daily-back">
          <div class="sch-daily-a-label">Answer</div>
          <div class="sch-daily-answer">${challenge.a}</div>
        </div>
      </div>

      <div class="sch-daily-nav-row">
        <span class="sch-daily-date">${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</span>
        <span class="sch-daily-num">#${(dayOfYear % SCH_DAILY_CHALLENGES.length) + 1} of ${SCH_DAILY_CHALLENGES.length}</span>
      </div>

      <div class="sch-daily-streak-card">
        <div class="sch-daily-streak-icon">🔥</div>
        <div>
          <div class="sch-daily-streak-label">Keep learning every day</div>
          <div class="sch-daily-streak-sub">Visit Daily to maintain your knowledge streak</div>
        </div>
      </div>
    </div>`;
}

function schFlipDaily() {
  _schDailyFlipped = !_schDailyFlipped;
  const card = document.querySelector('.sch-daily-card');
  if (card) card.classList.toggle('flipped', _schDailyFlipped);
}
