// ── TOKEN SYSTEM ─────────────────────────────────────────
let _tokens = parseInt(localStorage.getItem('tokenBalance') || '0', 10);

function updateTokenDisplay() {
  const el = document.getElementById('token-bank-count');
  if (el) el.textContent = _tokens.toLocaleString();
}

// ── WORLD TOKEN BOX (drawer) ──────────────────────────────
function _renderWorldTokenBox() {
  const world = typeof _currentWorld !== 'undefined' ? _currentWorld : 'habit';

  if (world === 'fitness') {
    const fitBal = parseInt(localStorage.getItem('fitTokenBalance') || '0', 10);
    return `<div class="world-token-box wtb-fitness">
      <div class="world-token-icon">
        <svg class="fit-token-svg" viewBox="0 0 48 48" width="46" height="46">
          <defs>
            <linearGradient id="fitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff6b6b"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#dc2626"/>
            </linearGradient>
            <linearGradient id="fitShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(255,200,180,0)"/><stop offset="50%" stop-color="rgba(255,200,180,0.35)"/><stop offset="100%" stop-color="rgba(255,200,180,0)"/>
              <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="2 0" dur="2.5s" repeatCount="indefinite"/>
            </linearGradient>
          </defs>
          <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#fitGrad)" stroke="#ff6b6b" stroke-width="1.2"/>
          <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#fitShimmer)"/>
          <text x="24" y="29" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.9)">💪</text>
        </svg>
      </div>
      <div class="world-token-info">
        <div class="world-token-label">Fitness Tokens</div>
        <div class="world-token-balance"><span id="token-bank-count">${fitBal.toLocaleString()}</span><span class="world-token-unit"> tokens</span></div>
      </div>
    </div>`;
  }

  if (world === 'scholar') {
    const schBal = parseInt(localStorage.getItem('schTokenBalance') || '0', 10);
    const schXP  = parseInt(localStorage.getItem('schXP') || '0', 10);
    return `<div class="world-token-box wtb-scholar">
      <div class="world-token-icon">
        <svg class="sch-token-svg" viewBox="0 0 48 48" width="46" height="46">
          <defs>
            <radialGradient id="schGrad" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stop-color="#e9d5ff"/><stop offset="45%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6b21a8"/>
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill="url(#schGrad)" stroke="#c084fc" stroke-width="1.2"/>
          <text x="24" y="29" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.9)">📖</text>
        </svg>
      </div>
      <div class="world-token-info">
        <div class="world-token-label">Scholar Tokens · ${schXP.toLocaleString()} XP</div>
        <div class="world-token-balance"><span id="token-bank-count">${schBal.toLocaleString()}</span><span class="world-token-unit"> tokens</span></div>
      </div>
    </div>`;
  }

  // Default: habit world — gold hex
  return `<div class="world-token-box wtb-habit">
    <div class="world-token-icon">
      <svg viewBox="0 0 48 48" width="46" height="46">
        <defs>
          <radialGradient id="habGrad" cx="38%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#fef9c3"/><stop offset="45%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#78350f"/>
          </radialGradient>
        </defs>
        <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#habGrad)" stroke="#fde68a" stroke-width="1.5"/>
        <text x="24" y="29" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.9)">🔥</text>
      </svg>
    </div>
    <div class="world-token-info">
      <div class="world-token-label">Habit Tokens</div>
      <div class="world-token-balance"><span id="token-bank-count">${_tokens.toLocaleString()}</span><span class="world-token-unit"> tokens</span></div>
    </div>
  </div>`;
}

function awardTokens(count, sourceEl) {
  if (!sourceEl) return;
  const rect = sourceEl.getBoundingClientRect();
  const bankEl = document.getElementById('profile-avatar-btn');
  const bankRect = bankEl ? bankEl.getBoundingClientRect() : { left: window.innerWidth - 60, top: 20, width: 40, height: 40 };

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const tx = bankRect.left + bankRect.width / 2;
  const ty = bankRect.top + bankRect.height / 2;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const coin = document.createElement('div');
      coin.className = 'token-coin';
      coin.style.left = cx + 'px';
      coin.style.top = cy + 'px';
      coin.innerHTML = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
        <defs>
          <radialGradient id="tcg${i}" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#fef9c3"/>
            <stop offset="45%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#78350f"/>
          </radialGradient>
        </defs>
        <polygon points="16,1.5 28.5,8.5 28.5,23.5 16,30.5 3.5,23.5 3.5,8.5" fill="url(#tcg${i})" stroke="#fde68a" stroke-width="1"/>
        <line x1="16" y1="16" x2="10" y2="11" stroke="rgba(180,40,40,0.85)" stroke-width="0.9"/>
        <line x1="16" y1="16" x2="22" y2="11" stroke="rgba(180,40,40,0.85)" stroke-width="0.9"/>
        <line x1="16" y1="16" x2="10" y2="21" stroke="rgba(180,40,40,0.85)" stroke-width="0.9"/>
        <line x1="16" y1="16" x2="22" y2="21" stroke="rgba(180,40,40,0.85)" stroke-width="0.9"/>
        <line x1="10" y1="11" x2="22" y2="11" stroke="rgba(10,10,10,0.8)" stroke-width="0.7"/>
        <line x1="10" y1="21" x2="22" y2="21" stroke="rgba(10,10,10,0.8)" stroke-width="0.7"/>
        <circle cx="16" cy="16" r="2.8" fill="#c0392b"/>
        <circle cx="10" cy="11" r="1.6" fill="#1a1a1a"/>
        <circle cx="22" cy="11" r="1.6" fill="#1a1a1a"/>
        <circle cx="10" cy="21" r="1.6" fill="#1a1a1a"/>
        <circle cx="22" cy="21" r="1.6" fill="#1a1a1a"/>
        <polygon points="16,1.5 28.5,8.5 28.5,23.5 16,30.5 3.5,23.5 3.5,8.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.6"/>
      </svg>`;
      document.body.appendChild(coin);

      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
      const dist = 24 + Math.random() * 22;
      const ox = Math.cos(angle) * dist;
      const oy = Math.sin(angle) * dist;

      coin.animate([
        { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 0 },
        { transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(1.4) rotate(300deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(1.1) rotate(540deg)`, opacity: 1, offset: 0.65 },
        { transform: `translate(${tx - cx}px, ${ty - cy}px) scale(0.15) rotate(900deg)`, opacity: 0.5 }
      ], {
        duration: 1100 + i * 80,
        easing: 'cubic-bezier(0.4,0,0.2,1)',
        fill: 'forwards'
      }).onfinish = () => {
        coin.remove();
        if (i === count - 1) {
          _tokens += count;
          localStorage.setItem('tokenBalance', _tokens);
          updateTokenDisplay();
          if (bankEl) {
            bankEl.classList.add('token-bank-pulse');
            setTimeout(() => bankEl.classList.remove('token-bank-pulse'), 600);
          }
        }
      };
    }, i * 120);
  }
}

// ── WORLD SWITCHING ──────────────────────────────────────
let _currentWorld = 'habit';
let _worldDropdownOpen = false;

function toggleWorldDropdown() {
  _worldDropdownOpen = !_worldDropdownOpen;
  document.getElementById('world-tab').classList.toggle('open', _worldDropdownOpen);
  document.getElementById('world-dropdown').classList.toggle('open', _worldDropdownOpen);
}

function selectWorld(name) {
  _worldDropdownOpen = false;
  document.getElementById('world-tab').classList.remove('open');
  document.getElementById('world-dropdown').classList.remove('open');
  switchWorld(name);
}

// Close dropdown on outside tap
document.addEventListener('click', e => {
  if (_worldDropdownOpen && !e.target.closest('#world-tab') && !e.target.closest('#world-dropdown')) {
    _worldDropdownOpen = false;
    document.getElementById('world-tab').classList.remove('open');
    document.getElementById('world-dropdown').classList.remove('open');
  }
});

const _worldMeta = {
  habit:   { label: 'Habit World',   color: '#f59e0b' },
  fitness: { label: 'Fitness World', color: '#e53e3e' },
  scholar: { label: 'Scholar World', color: '#a78bfa' },
};

function switchWorld(name) {
  _currentWorld = name;
  ['habit','fitness','scholar'].forEach(w => {
    const el = document.getElementById('world-' + w);
    if (el) el.style.display = (w === name) ? 'flex' : 'none';
  });
  const tabName = document.getElementById('world-tab-name');
  if (tabName) {
    tabName.textContent = _worldMeta[name].label;
    tabName.style.color = _worldMeta[name].color;
  }
  closeDrawer();
  if (name === 'fitness' && typeof fitInit === 'function') fitInit();
  if (name === 'scholar' && typeof schInit === 'function') schInit();
}

// ── FIREBASE / AUTH / SYNC ───────────────────────────────
let _fbAuth = null;
let _fbDb   = null;
let _currentUser = null;
let _syncTimer = null;
let _isOnline      = navigator.onLine;
let _hasPendingSync = false;
let _accountMode = 'signin';
let _allHabitsDonePrev = false;

function _hideAuthGate() {
  const gate = document.getElementById('auth-gate');
  if (!gate) return;
  gate.style.opacity = '0';
  gate.style.pointerEvents = 'none';
  setTimeout(() => { gate.style.display = 'none'; }, 450);
  updateProfileAvatarBtn();
  _updateHamburgerBadge();
}

function _showAuthGate() {
  const gate = document.getElementById('auth-gate');
  if (!gate) return;
  // Always start hidden, then fade in so there's no flash
  gate.style.display = 'flex';
  gate.style.opacity = '0';
  gate.style.pointerEvents = 'all';
  // Show landing state (title + buttons), not the form
  _showAuthGateLanding();
  // Fade in on next frame after display:flex is applied
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { gate.style.opacity = '1'; });
  });
}

function _showAuthGateLanding() {
  const landing = document.getElementById('auth-gate-landing');
  const formEl  = document.getElementById('auth-gate-form');
  if (landing) landing.style.display = 'flex';
  if (formEl)  { formEl.classList.add('auth-gate-form-hidden'); formEl.innerHTML = ''; }
}

function showAuthGateForm(mode) {
  _accountMode = mode || 'signin';
  const landing = document.getElementById('auth-gate-landing');
  const formEl  = document.getElementById('auth-gate-form');
  if (landing) landing.style.display = 'none';
  if (formEl)  formEl.classList.remove('auth-gate-form-hidden');
  renderAuthGateForm();
}

async function authGoogleSignIn() {
  if (!_fbAuth) { alert('Firebase not configured yet. Fill in firebase-config.js first.'); return; }
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await _fbAuth.signInWithPopup(provider);
  } catch(e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-cancelled-by-user') {
      await _fbAuth.signInWithRedirect(provider);
    } else if (e.code === 'auth/popup-closed-by-user') {
      // user dismissed — do nothing
    } else {
      alert('Google sign-in error: ' + (e.code || e.message));
    }
  }
}

async function authAppleSignIn() {
  if (!_fbAuth) { alert('Firebase not configured yet. Fill in firebase-config.js first.'); return; }
  const provider = new firebase.auth.OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  try {
    await _fbAuth.signInWithPopup(provider);
  } catch(e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-cancelled-by-user') {
      await _fbAuth.signInWithRedirect(provider);
    } else if (e.code !== 'auth/popup-closed-by-user') {
      showAuthError(e.code);
    }
  }
}

let _loadingScreenStart = Date.now();

function _hideLoadingScreen() {
  const ls = document.getElementById('app-loading-screen');
  if (!ls) return;
  // Ensure loading screen shows for at least 800ms so there's no flash
  const elapsed = Date.now() - _loadingScreenStart;
  const delay   = Math.max(0, 800 - elapsed);
  setTimeout(() => {
    ls.classList.add('hidden');
    setTimeout(() => ls.remove(), 700);
  }, delay);
}

function initFirebase() {
  // Do NOT show auth gate yet — wait for Firebase to check if user is logged in
  if (typeof FIREBASE_CONFIG === 'undefined' || FIREBASE_CONFIG.apiKey.startsWith('PASTE')) {
    _hideLoadingScreen();
    _showAuthGate();  // shows landing with buttons
    return;
  }

  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    _fbAuth = firebase.auth();
    _fbDb = firebase.firestore();
    _fbDb.settings({ cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED });
    _fbDb.enablePersistence({ synchronizeTabs: false }).catch(err => {
      if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
        console.warn('Offline persistence unavailable:', err.code);
      }
    });

    // Force auth state to persist across page reloads (critical for iOS)
    _fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

    // Handle redirect result — iOS often converts popups to redirects
    _fbAuth.getRedirectResult().then(result => {
      if (result && result.user) {
        _currentUser = result.user;
        _hideAuthGate();
        loadFromCloud();
        refreshAccountArea();
      }
    }).catch(e => {
      if (e.code && e.code !== 'auth/no-current-user') {
        showAuthError(e.code);
      }
    });

    // Save ?add= param to localStorage before it gets wiped by auth redirects
    const params = new URLSearchParams(window.location.search);
    const addUidParam = params.get('add');
    const joinGroupParam = params.get('joingroup');
    if (addUidParam) {
      localStorage.setItem('pendingFriendAdd', addUidParam);
      window.history.replaceState({}, '', window.location.href.split('?')[0]);
    }
    if (joinGroupParam) {
      localStorage.setItem('pendingGroupJoin', joinGroupParam);
      window.history.replaceState({}, '', window.location.href.split('?')[0]);
    }

    _fbAuth.onAuthStateChanged(async user => {
      _currentUser = user;
      if (user) {
        // Logged in — hide loading screen, never show login
        _hideLoadingScreen();
        _hideAuthGate();
        loadFromCloud();
        // session start banner disabled
        const pendingUid = localStorage.getItem('pendingFriendAdd');
        if (pendingUid && pendingUid !== user.uid) {
          localStorage.removeItem('pendingFriendAdd');
          await _handleFriendAdd(pendingUid);
        }
        const pendingGroup = localStorage.getItem('pendingGroupJoin');
        if (pendingGroup) {
          localStorage.removeItem('pendingGroupJoin');
          await joinGroup(pendingGroup);
          alert('You joined the group! Check the Friends tab.');
        }
      } else {
        // Not logged in — hide loading, show login
        _hideLoadingScreen();
        _showAuthGate();
      }
      refreshAccountArea();
    });
  } catch(e) {
    _hideLoadingScreen();
    _showAuthGate();
  }
}

async function _handleFriendAdd(friendUid) {
  if (!_currentUser || !_fbDb) { alert('Friend add failed: not logged in or database unavailable.'); return; }
  try {
    const myUid = _currentUser.uid;
    await _fbDb.collection('users').doc(myUid).set({
      friends: firebase.firestore.FieldValue.arrayUnion(friendUid)
    }, { merge: true });
    await _fbDb.collection('users').doc(friendUid).set({
      friends: firebase.firestore.FieldValue.arrayUnion(myUid)
    }, { merge: true });
    renderFriends();
  } catch(e) {
    alert('Friend add failed: ' + (e.code || e.message));
    console.error('Friend add failed:', e);
  }
}

async function removeFriend(friendUid) {
  if (!_currentUser || !_fbDb) return;
  if (!confirm('Remove this friend?')) return;
  try {
    await _fbDb.collection('users').doc(_currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayRemove(friendUid)
    });
    renderFriends();
  } catch(e) {
    alert('Could not remove friend: ' + (e.code || e.message));
  }
}

function queueSync() {
  if (!_currentUser || !_fbDb) return;
  if (!_isOnline) {
    _hasPendingSync = true;
    _updateSyncLabel();
    return;
  }
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(syncToCloud, 2500);
}

// Sync immediately when app goes to background or closes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && _currentUser && _fbDb) {
    clearTimeout(_syncTimer);
    syncToCloud();
  }
});
window.addEventListener('pagehide', () => {
  if (_currentUser && _fbDb) syncToCloud();
});

async function syncToCloud() {
  if (!_currentUser || !_fbDb || !_isOnline) return;
  const lbl = document.getElementById('sync-label');
  if (lbl) lbl.textContent = 'Syncing…';
  try {
    // Only sync customHabits if user has actually saved some — prevents
    // an empty localStorage (fresh browser / new device) from wiping cloud habits
    const _rawCustomHabits = JSON.parse(localStorage.getItem('customHabits') || 'null');
    const _customHabitsToSync = (_rawCustomHabits && _rawCustomHabits.length > 0)
      ? _rawCustomHabits : null;
    await _fbDb.collection('users').doc(_currentUser.uid).set({
      habitData:          JSON.parse(localStorage.getItem('habitData')    || '{}'),
      grateful:           JSON.parse(localStorage.getItem('grateful')     || '{}'),
      ...((_customHabitsToSync !== null) ? { customHabits: _customHabitsToSync } : {}),
      habitOrder:         JSON.parse(localStorage.getItem('habitOrder')   || '[]'),
      colorTheme:         localStorage.getItem('colorTheme') || 'default',
      lightMode:          localStorage.getItem('lightMode') || 'false',
      email:              _currentUser.email || '',
      displayName:        localStorage.getItem('displayName') || '',
      bio:                localStorage.getItem('bio') || '',
      photoDataUrl:       localStorage.getItem('photoDataUrl') || '',
      exerciseOptimalMins: parseFloat(localStorage.getItem('exerciseOptimalMins')) || null,
      sleepOptimalHours:   parseFloat(localStorage.getItem('sleepOptimalHours'))   || null,
      goalExerciseMins:    parseFloat(localStorage.getItem('goalExerciseMins'))    || null,
      goalSleepHours:      parseFloat(localStorage.getItem('goalSleepHours'))      || null,
      goalHabitsPerDay:    parseInt(localStorage.getItem('goalHabitsPerDay'))      || null,
      onboardingDone:      localStorage.getItem('onboardingDone') || '',
      exercise_locked:     localStorage.getItem('exercise_locked') || 'false',
      sleep_locked:        localStorage.getItem('sleep_locked') || 'false',
      tokenBalance:        _tokens,
      fitTokenBalance:     parseInt(localStorage.getItem('fitTokenBalance') || '0', 10),
      schTokenBalance:     parseInt(localStorage.getItem('schTokenBalance') || '0', 10),
      schXP:               parseInt(localStorage.getItem('schXP') || '0', 10),
      habitsVisible:       localStorage.getItem('habitsVisible') !== 'false',
      username:            localStorage.getItem('username') || '',
      lastSync:            firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    _hasPendingSync = false;
    _updateSyncLabel();
  } catch(e) {
    console.warn('Sync failed:', e);
    _hasPendingSync = true;
    _updateSyncLabel();
  }
}

function _updateSyncLabel() {
  const lbl = document.getElementById('sync-label');
  const banner = document.getElementById('offline-banner');
  if (!_isOnline) {
    if (lbl) lbl.textContent = _hasPendingSync ? '⚡ Offline · changes saved locally' : '⚡ Offline';
    if (banner) banner.classList.remove('hidden');
  } else {
    if (lbl) lbl.textContent = _hasPendingSync ? 'Syncing…' : '✓ Synced';
    if (banner) banner.classList.add('hidden');
  }
}

async function loadFromCloud() {
  if (!_currentUser || !_fbDb) return;
  try {
    const doc = await _fbDb.collection('users').doc(_currentUser.uid).get();
    if (!doc.exists) { syncToCloud(); _checkOnboarding(null); return; }
    const d = doc.data();
    if (d.habitData)    localStorage.setItem('habitData',    JSON.stringify(d.habitData));
    if (d.grateful)     localStorage.setItem('grateful',     JSON.stringify(d.grateful));
    // Only restore customHabits if cloud has real habits (non-empty array)
    // This prevents empty-array syncs from wiping the user's habit list
    if (d.customHabits && d.customHabits.length > 0) {
      localStorage.setItem('customHabits', JSON.stringify(d.customHabits));
    }
    if (d.habitOrder)   localStorage.setItem('habitOrder',   JSON.stringify(d.habitOrder));
    if (d.colorTheme)   localStorage.setItem('colorTheme',   d.colorTheme);
    if (d.lightMode)    localStorage.setItem('lightMode',    d.lightMode);
    localStorage.setItem('displayName',  d.displayName  || '');
    localStorage.setItem('bio',          d.bio          || '');
    localStorage.setItem('photoDataUrl', d.photoDataUrl || '');
    if (d.exerciseOptimalMins) localStorage.setItem('exerciseOptimalMins', d.exerciseOptimalMins);
    if (d.sleepOptimalHours)   localStorage.setItem('sleepOptimalHours',   d.sleepOptimalHours);
    if (d.goalExerciseMins)    localStorage.setItem('goalExerciseMins',    d.goalExerciseMins);
    if (d.goalSleepHours)      localStorage.setItem('goalSleepHours',      d.goalSleepHours);
    if (d.goalHabitsPerDay)    localStorage.setItem('goalHabitsPerDay',    d.goalHabitsPerDay);
    if (d.onboardingDone)      localStorage.setItem('onboardingDone',      d.onboardingDone);
    if (d.exercise_locked)     localStorage.setItem('exercise_locked',     d.exercise_locked);
    if (d.sleep_locked)        localStorage.setItem('sleep_locked',        d.sleep_locked);
    if (d.favoriteFriends)     localStorage.setItem('favoriteFriends',     JSON.stringify(d.favoriteFriends));
    if (d.tokenBalance !== undefined) { _tokens = d.tokenBalance; localStorage.setItem('tokenBalance', _tokens); updateTokenDisplay(); }
    // Restore fitness + scholar tokens — never overwrite local with a lower value to prevent resets
    if (d.fitTokenBalance !== undefined) {
      const localFit = parseInt(localStorage.getItem('fitTokenBalance') || '0', 10);
      const cloudFit = d.fitTokenBalance;
      const bestFit = Math.max(localFit, cloudFit);
      localStorage.setItem('fitTokenBalance', bestFit);
      // notify fitness.js if it's loaded
      if (typeof updateFitTokenDisplay === 'function') { window._fitTokens = bestFit; updateFitTokenDisplay(); }
    }
    if (d.schTokenBalance !== undefined) {
      const localSch = parseInt(localStorage.getItem('schTokenBalance') || '0', 10);
      const cloudSch = d.schTokenBalance;
      const bestSch = Math.max(localSch, cloudSch);
      localStorage.setItem('schTokenBalance', bestSch);
      if (typeof updateSchDisplay === 'function') { window._schTokens = bestSch; updateSchDisplay(); }
    }
    if (d.schXP !== undefined) {
      const localXP = parseInt(localStorage.getItem('schXP') || '0', 10);
      const bestXP = Math.max(localXP, d.schXP);
      localStorage.setItem('schXP', bestXP);
      if (typeof updateSchDisplay === 'function') { window._schXP = bestXP; updateSchDisplay(); }
    }
    if (d.habitsVisible !== undefined) localStorage.setItem('habitsVisible', d.habitsVisible);
    if (d.username) localStorage.setItem('username', d.username);
    _checkOnboarding(d);
    applyTheme();
    buildHabitCards();
    render();
    renderJournal();
    if (currentPage === 0) renderProgress();
    refreshAccountArea();
    updateProfileAvatarBtn();
  } catch(e) { console.warn('Load from cloud failed:', e); }
}

function getAuthErrorMsg(code) {
  const msgs = {
    'auth/user-not-found':            'No account with that email.',
    'auth/wrong-password':            'Incorrect password.',
    'auth/email-already-in-use':      'Email already has an account.',
    'auth/weak-password':             'Password must be at least 6 characters.',
    'auth/invalid-email':             'Invalid email address.',
    'auth/invalid-credential':        'Wrong email or password.',
    'auth/operation-not-allowed':     'Email sign-in is not enabled. Contact support.',
    'auth/too-many-requests':         'Too many attempts. Try again later.',
    'auth/network-request-failed':    'Network error. Check your connection.',
    'auth/unauthorized-continue-uri': 'Reset email config error. Contact support.',
  };
  return msgs[code] || `Something went wrong (${code}). Try again.`;
}

function renderAuthGateForm() {
  const el = document.getElementById('auth-gate-form');
  if (!el) return;
  const isCreate = _accountMode === 'create';
  el.innerHTML = `
    <div class="account-form-toggle">
      <button type="button" class="${!isCreate ? 'active' : ''}" onclick="setAuthMode('signin');renderAuthGateForm()">Sign In</button>
      <button type="button" class="${isCreate ? 'active' : ''}" onclick="setAuthMode('create');renderAuthGateForm()">Create Account</button>
    </div>
    <form id="gate-form" autocomplete="on" onsubmit="submitGateAuth();return false;">
      ${isCreate ? `<input type="text" id="gate-name" name="name" class="account-input" placeholder="Your name"
             autocomplete="name" autocapitalize="words" autocorrect="off" spellcheck="false"/>` : ''}
      <input type="email" id="gate-email" name="email" class="account-input" placeholder="Gmail address"
             autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false"/>
      <input type="password" id="gate-password" name="password" class="account-input" placeholder="Password"
             autocomplete="${isCreate ? 'new-password' : 'current-password'}"/>
      <div class="auth-error" id="gate-error"></div>
      <button type="submit" class="account-submit-btn" id="gate-submit-btn">${isCreate ? 'Create Account' : 'Sign In'}</button>
    </form>
    ${!isCreate ? `<button type="button" class="auth-gate-back-link" style="color:#666;font-size:0.8rem;margin-top:2px" onclick="sendPasswordReset()">Forgot password?</button>` : ''}
    <button type="button" class="auth-gate-back-link" onclick="_showAuthGateLanding()">← Back</button>
  `;
}

function submitGateAuth() {
  if (!_fbAuth) return;
  const isCreate = _accountMode === 'create';
  const name   = document.getElementById('gate-name')?.value.trim();
  const email  = document.getElementById('gate-email')?.value.trim();
  const pw     = document.getElementById('gate-password')?.value;
  const errEl  = document.getElementById('gate-error');
  const btn    = document.getElementById('gate-submit-btn');
  if (isCreate && !name) { if (errEl) errEl.textContent = 'Please enter your name.'; return; }
  if (!email || !pw) { if (errEl) errEl.textContent = 'Please enter email and password.'; return; }
  if (btn) { btn.textContent = 'Please wait…'; btn.disabled = true; }
  if (errEl) errEl.textContent = '';
  if (isCreate) {
    _fbAuth.createUserWithEmailAndPassword(email, pw).then(cred => {
      // Save display name to Firebase Auth profile
      return cred.user.updateProfile({ displayName: name }).then(() => {
        // Save to localStorage and Firestore
        localStorage.setItem('displayName', name);
        if (_fbDb) {
          _fbDb.collection('users').doc(cred.user.uid).set({ displayName: name, email }, { merge: true });
        }
        updateProfileAvatarBtn();
      });
    }).catch(e => {
      if (errEl) errEl.textContent = getAuthErrorMsg(e.code);
      if (btn) { btn.textContent = 'Create Account'; btn.disabled = false; }
    });
  } else {
    _fbAuth.signInWithEmailAndPassword(email, pw).catch(e => {
      if (errEl) errEl.textContent = getAuthErrorMsg(e.code);
      if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
    });
  }
}

function sendPasswordReset() {
  if (!_fbAuth) return;
  const email = document.getElementById('gate-email')?.value.trim();
  const errEl = document.getElementById('gate-error');
  if (!email) { if (errEl) { errEl.style.color = ''; errEl.textContent = 'Enter your email above first.'; } return; }
  if (errEl) { errEl.style.color = '#888'; errEl.textContent = 'Sending…'; }
  _fbAuth.sendPasswordResetEmail(email)
    .then(() => { if (errEl) { errEl.style.color = '#4ade80'; errEl.textContent = 'Reset email sent! Check your inbox (and spam).'; } })
    .catch(e => { console.error('Reset error:', e.code, e.message); if (errEl) { errEl.style.color = '#f87171'; errEl.textContent = getAuthErrorMsg(e.code); } });
}

async function authSignIn(email, password) {
  if (!_fbAuth) return;
  try { await _fbAuth.signInWithEmailAndPassword(email, password); }
  catch(e) { showAuthError(e.code); }
}

async function authCreate(email, password) {
  if (!_fbAuth) return;
  try { await _fbAuth.createUserWithEmailAndPassword(email, password); }
  catch(e) { showAuthError(e.code); }
}

async function authSignOut() {
  if (_fbAuth) await _fbAuth.signOut();
  _currentUser = null;
  closeDrawer();
  updateProfileAvatarBtn();
  // Let drawer close before gate appears
  setTimeout(() => _showAuthGate(), 250);
}

function showAuthError(code) {
  const el = document.getElementById('auth-error');
  if (el) el.textContent = getAuthErrorMsg(code);
}

function refreshAccountArea() {
  if (document.getElementById('drawer-title')?.textContent === 'Profile') {
    _renderProfileTop();
    return;
  }
  const area = document.getElementById('account-status-area');
  if (area) renderAccountStatus(area);
}

function _getProfileInitial() {
  const displayName = localStorage.getItem('displayName') || '';
  if (displayName) return displayName.charAt(0).toUpperCase();
  if (_currentUser && _currentUser.email) return _currentUser.email.charAt(0).toUpperCase();
  return '?';
}

function updateProfileAvatarBtn() {
  const btn = document.getElementById('profile-avatar-btn');
  if (!btn) return;
  if (!_currentUser) {
    btn.classList.remove('visible');
    return;
  }
  btn.classList.add('visible');
  const photoDataUrl = localStorage.getItem('photoDataUrl') || '';
  if (photoDataUrl) {
    btn.innerHTML = `<img src="${photoDataUrl}" alt="profile" />`;
  } else {
    btn.innerHTML = _getProfileInitial();
  }
}

function renderAccountStatus(container) {
  if (_currentUser) {
    const email = _currentUser.email;
    const displayName = localStorage.getItem('displayName') || '';
    const bio = localStorage.getItem('bio') || '';
    const photoDataUrl = localStorage.getItem('photoDataUrl') || '';
    const initial = _getProfileInitial();
    const created = _currentUser.metadata?.creationTime
      ? new Date(_currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    const avatarContent = photoDataUrl
      ? `<img src="${photoDataUrl}" alt="profile" /><span class="avatar-edit-hint">CHANGE</span>`
      : `${initial}<span class="avatar-edit-hint">CHANGE</span>`;
    container.innerHTML = `
      <div class="account-profile">
        <div class="account-avatar-large" onclick="document.getElementById('profile-photo-input').click()">
          ${avatarContent}
        </div>
        <div class="account-display-name" id="account-display-name-view"
          onclick="editProfileField('displayName')"
        >${displayName ? _escHtml(displayName) : ''}</div>
        <div class="account-bio" id="account-bio-view"
          onclick="editProfileField('bio')"
        >${bio ? _escHtml(bio) : ''}</div>
        <div class="account-email-label">${_escHtml(email)}</div>
        ${created ? `<div class="account-meta">Member since ${created}</div>` : ''}
        <div class="account-sync-status" id="sync-label">✓ All data synced to cloud</div>
      </div>
      <div class="account-actions">
        <button class="account-signout-btn" onclick="authSignOut()">Sign Out</button>
      </div>`;
  } else {
    const isCreate = _accountMode === 'create';
    container.innerHTML = `
      <div class="account-form">
        <div class="account-form-toggle">
          <button class="${!isCreate ? 'active' : ''}" onclick="setAuthMode('signin')">Sign In</button>
          <button class="${isCreate ? 'active' : ''}" onclick="setAuthMode('create')">Create Account</button>
        </div>
        <input type="email" id="auth-email" class="account-input" placeholder="Email address" autocomplete="email"/>
        <input type="password" id="auth-password" class="account-input" placeholder="Password" autocomplete="${isCreate ? 'new-password' : 'current-password'}"/>
        <div class="auth-error" id="auth-error"></div>
        <button class="account-submit-btn" onclick="submitAuth()">${isCreate ? 'Create Account' : 'Sign In'}</button>
      </div>`;
  }
}

function _escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function editProfileField(field) {
  if (field === 'displayName') {
    const view = document.getElementById('account-display-name-view');
    if (!view) return;
    const current = localStorage.getItem('displayName') || '';
    view.innerHTML = `<input class="account-profile-edit-input" id="edit-displayName" type="text" value="${_escHtml(current)}" placeholder="Add your name" maxlength="40" />`;
    const inp = document.getElementById('edit-displayName');
    inp.focus();
    inp.select();
    const save = () => {
      const val = inp.value.trim();
      localStorage.setItem('displayName', val);
      queueSync();
      updateProfileAvatarBtn();
      refreshAccountArea();
    };
    inp.addEventListener('blur', save);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { inp.blur(); } });
  } else if (field === 'bio') {
    const view = document.getElementById('account-bio-view');
    if (!view) return;
    const current = localStorage.getItem('bio') || '';
    view.innerHTML = `<textarea class="account-profile-edit-input" id="edit-bio" placeholder="Add a bio..." maxlength="160" style="resize:none;height:64px">${_escHtml(current)}</textarea>`;
    const ta = document.getElementById('edit-bio');
    ta.focus();
    const save = () => {
      const val = ta.value.trim();
      localStorage.setItem('bio', val);
      queueSync();
      refreshAccountArea();
    };
    ta.addEventListener('blur', save);
  }
}

function handleProfilePhotoSelect(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      localStorage.setItem('photoDataUrl', dataUrl);
      queueSync();
      updateProfileAvatarBtn();
      refreshAccountArea();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  input.value = '';
}

function openDrawerToAccount() {
  const drawer = document.getElementById('side-drawer');
  if (!drawer.classList.contains('open')) {
    openDrawer();
  }
  showAccount();
}

function setAuthMode(mode) {
  _accountMode = mode;
  refreshAccountArea();
}

function submitAuth() {
  const email = document.getElementById('auth-email')?.value.trim();
  const password = document.getElementById('auth-password')?.value;
  if (!email || !password) {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = 'Please enter email and password.';
    return;
  }
  if (_accountMode === 'create') authCreate(email, password);
  else authSignIn(email, password);
}

function _renderProfileTop() {
  const area = document.getElementById('profile-top-area');
  if (!area) return;
  const displayName = localStorage.getItem('displayName') || '';
  const bio = localStorage.getItem('bio') || '';
  const photoDataUrl = localStorage.getItem('photoDataUrl') || '';
  const initial = _getProfileInitial();
  const avatarContent = photoDataUrl
    ? `<img src="${photoDataUrl}" alt="profile" /><span class="avatar-edit-hint">CHANGE</span>`
    : `${initial}<span class="avatar-edit-hint">CHANGE</span>`;
  area.innerHTML = `
    <div class="account-avatar-large" onclick="document.getElementById('profile-photo-input').click()">
      ${avatarContent}
    </div>
    <div class="account-display-name" id="account-display-name-view"
      onclick="editProfileField('displayName')"
    >${displayName ? _escHtml(displayName) : ''}</div>
    <div class="account-bio" id="account-bio-view"
      onclick="editProfileField('bio')"
    >${bio ? _escHtml(bio) : ''}</div>
    <div class="account-sync-status" id="sync-label">✓ Synced</div>
  `;
}

function showAccount() {
  document.getElementById('drawer-title').textContent = 'Profile';
  const userEmail = _currentUser ? _currentUser.email : null;

  if (!userEmail) {
    document.getElementById('drawer-body').innerHTML = `
      <button class="drawer-back" onclick="renderDrawerMenu()">‹ Back</button>
      <div id="account-status-area"></div>
    `;
    renderAccountStatus(document.getElementById('account-status-area'));
    return;
  }

  const created = _currentUser?.metadata?.creationTime
    ? new Date(_currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="renderDrawerMenu()">‹ Back</button>
    <div class="account-profile" id="profile-top-area"></div>
    <div class="drawer-divider" style="margin-top:4px"></div>
    <div class="drawer-section-label">Kudos Inbox</div>
    <div id="kudos-inbox-area"><div class="fmgr-loading" style="padding:12px 20px">Loading…</div></div>
    <div class="drawer-divider"></div>
    <div class="profile-bottom-info">
      ${userEmail ? `<div class="account-email-label">${_escHtml(userEmail)}</div>` : ''}
      ${created ? `<div class="account-meta">Member since ${created}</div>` : ''}
    </div>
    <button class="account-signout-btn profile-signout" onclick="authSignOut()">Sign Out</button>
  `;
  _renderProfileTop();
  renderKudosInbox();
}

function showAccountSettings() {
  document.getElementById('drawer-title').textContent = 'Account Settings';
  const userEmail = _currentUser ? _currentUser.email : null;
  const habitsVisible = localStorage.getItem('habitsVisible') !== 'false';
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="showSettings()">‹ Back</button>
    <div id="account-status-area"></div>

    <div class="drawer-divider" style="margin-top:16px"></div>
    <div style="padding:12px 16px">
      <div class="drawer-section-label" style="margin-bottom:12px">Privacy</div>
      <div class="habit-visibility-row">
        <div>
          <div class="habit-visibility-label">Habits visible to friends</div>
          <div class="habit-visibility-sub">When off, friends see "🔒 Habits hidden" on your card</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${habitsVisible ? 'checked' : ''} onchange="toggleHabitsVisible(this.checked)" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    ${userEmail ? `
    <div class="drawer-divider"></div>
    <button class="drawer-item danger" onclick="authSignOut()">
      <span class="drawer-item-text">Sign Out</span>
    </button>` : ''}
  `;
  renderAccountStatus(document.getElementById('account-status-area'));
}

function toggleHabitsVisible(visible) {
  localStorage.setItem('habitsVisible', visible);
  if (_currentUser && _fbDb) {
    _fbDb.collection('users').doc(_currentUser.uid).update({ habitsVisible: visible }).catch(() => {});
  }
}

async function renderKudosInbox() {
  const area = document.getElementById('kudos-inbox-area');
  if (!area) return;
  if (!_currentUser || !_fbDb) {
    area.innerHTML = `<div class="fmgr-empty" style="padding:8px 20px">Sign in to see kudos.</div>`;
    return;
  }
  try {
    const myDoc = await _fbDb.collection('users').doc(_currentUser.uid).get();
    const myData = myDoc.exists ? myDoc.data() : {};
    const all = (myData.kudosReceived || []).slice().reverse(); // newest first
    if (all.length === 0) {
      area.innerHTML = `<div class="kudos-inbox-empty">No kudos yet — complete all your habits and let friends cheer you on!</div>`;
      return;
    }
    // Group by date
    const byDate = {};
    all.forEach(k => {
      if (!byDate[k.date]) byDate[k.date] = [];
      byDate[k.date].push(k);
    });
    const today = getToday();
    let html = '';
    Object.keys(byDate).sort((a,b) => b.localeCompare(a)).forEach(date => {
      const label = date === today ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      html += `<div class="kudos-inbox-date">${label}</div>`;
      byDate[date].forEach(k => {
        html += `
          <div class="kudos-inbox-row">
            <span class="kudos-inbox-icon">🎉</span>
            <span class="kudos-inbox-msg"><strong>${k.fromName}</strong> gave you kudos for completing all daily habits!</span>
          </div>`;
      });
    });
    area.innerHTML = html;
  } catch(e) {
    area.innerHTML = `<div class="fmgr-empty" style="padding:8px 20px">Could not load kudos.</div>`;
  }
}

// ── HABITS CONFIG ────────────────────────────────────────
const HABITS = [
  { id: 'wake-early',  name: 'Wake Up Early',      emoji: '☀️', color: '#fbbf24', mins: 5  },
  { id: 'clean-room',  name: 'Clean Room & Bed',   emoji: '🛏️', color: '#4ade80', mins: 15 },
  { id: 'cold-shower', name: 'Cold Shower',        emoji: '🚿', color: '#38bdf8', mins: 5  },
  { id: 'brush-teeth', name: 'Brush Teeth',        emoji: '🦷', color: '#60a5fa', mins: 2  },
  { id: 'bed-early',   name: 'Go to Bed Early',    emoji: '🌙', color: '#a78bfa', mins: 0  },
];

// Rainbow spectrum: red → orange → yellow → green → teal → sky → blue → purple → pink
const HABIT_COLORS = ['#f87171','#fb923c','#fbbf24','#a3e635','#4ade80','#34d399','#38bdf8','#60a5fa','#a78bfa','#e879f9'];
let habitEditMode = false;
let selectedEmoji = '🌟';

const EMOJI_SEARCH_DATA = [
  // Health & Fitness
  {e:'💪',k:'muscle strong workout gym fitness strength'},
  {e:'🏃',k:'run running jog exercise fitness health'},
  {e:'🧘',k:'yoga meditate relax mindfulness stretch'},
  {e:'🏋️',k:'weightlifting gym strength lift workout'},
  {e:'🚴',k:'bike cycling ride exercise cardio'},
  {e:'🤸',k:'gymnastics stretch exercise flexibility'},
  {e:'🧗',k:'climb climbing workout strength'},
  {e:'🏊',k:'swim swimming pool exercise'},
  {e:'🤾',k:'sport exercise active play'},
  {e:'⚽',k:'soccer football sport exercise play'},
  {e:'🏀',k:'basketball sport exercise play'},
  {e:'🎾',k:'tennis sport exercise play'},
  {e:'🏈',k:'football sport exercise play'},
  {e:'🥊',k:'boxing fight workout punch'},
  {e:'🧠',k:'brain mind think mental health focus'},
  {e:'❤️',k:'heart love health care'},
  {e:'💊',k:'medicine vitamin pill supplement health'},
  {e:'🦷',k:'teeth dental brush clean health'},
  {e:'🩺',k:'doctor health check medical'},
  // Food & Drink
  {e:'💧',k:'water drink hydrate hydration liquid'},
  {e:'🥗',k:'salad healthy food eat vegetable'},
  {e:'🍎',k:'apple fruit healthy food eat'},
  {e:'🥑',k:'avocado healthy food eat'},
  {e:'🫐',k:'blueberry fruit healthy eat'},
  {e:'🍌',k:'banana fruit healthy eat'},
  {e:'🥦',k:'broccoli vegetable healthy eat'},
  {e:'🥕',k:'carrot vegetable healthy eat'},
  {e:'🍳',k:'egg breakfast cook food eat'},
  {e:'☕',k:'coffee morning drink caffeine'},
  {e:'🍵',k:'tea drink healthy relax'},
  {e:'🥤',k:'drink smoothie juice healthy'},
  {e:'🍕',k:'pizza food eat meal'},
  {e:'🍜',k:'noodle food eat meal cook'},
  {e:'🥩',k:'meat protein food eat'},
  {e:'🫙',k:'meal prep food cook healthy'},
  // Mind & Learning
  {e:'📚',k:'book read study learn education'},
  {e:'✏️',k:'write pen study learn journal'},
  {e:'📝',k:'note journal write study'},
  {e:'🎯',k:'goal target focus aim achieve'},
  {e:'💡',k:'idea think learn creative'},
  {e:'🔬',k:'science study learn research'},
  {e:'📖',k:'read book study learn'},
  {e:'🎓',k:'graduate learn study education school'},
  {e:'🗣️',k:'speak language learn practice'},
  {e:'🧩',k:'puzzle think problem solve'},
  // Lifestyle & Home
  {e:'🛏️',k:'sleep bed rest night routine'},
  {e:'😴',k:'sleep rest night relax tired'},
  {e:'🌙',k:'night sleep moon rest routine'},
  {e:'☀️',k:'morning sun wake up early start'},
  {e:'🚿',k:'shower clean wash hygiene routine'},
  {e:'🧹',k:'clean tidy organize declutter house'},
  {e:'🧺',k:'laundry clean wash organize'},
  {e:'🪴',k:'plant water grow garden care'},
  {e:'🏠',k:'home house clean organize'},
  {e:'🛁',k:'bath clean relax routine'},
  // Finance & Productivity
  {e:'💰',k:'money save budget finance spend'},
  {e:'💳',k:'spend budget finance money'},
  {e:'📊',k:'track progress chart data finance'},
  {e:'⏰',k:'alarm wake up time schedule'},
  {e:'🕐',k:'time schedule routine clock'},
  {e:'📅',k:'calendar plan schedule organize'},
  {e:'✅',k:'done complete check task finish'},
  {e:'📌',k:'pin task organize plan'},
  {e:'🗂️',k:'organize file work plan'},
  {e:'💼',k:'work job business professional'},
  // Social & Emotions
  {e:'😊',k:'smile happy positive mood'},
  {e:'🙏',k:'grateful thankful pray meditate'},
  {e:'❤️‍🔥',k:'love passion heart energy'},
  {e:'🫶',k:'care love support heart'},
  {e:'😤',k:'focus determined push work'},
  {e:'🤝',k:'connect social friend network'},
  {e:'👨‍👩‍👧',k:'family connect social love'},
  {e:'📞',k:'call connect social family friend'},
  // Creative
  {e:'🎨',k:'art draw create paint creative'},
  {e:'🎵',k:'music listen practice sing play'},
  {e:'🎸',k:'guitar music practice play instrument'},
  {e:'🎹',k:'piano music practice play instrument'},
  {e:'🎭',k:'act theater creative perform'},
  {e:'📸',k:'photo camera capture creative'},
  {e:'✍️',k:'write journal blog creative'},
  {e:'🖌️',k:'paint draw art creative'},
  // Nature & Outdoors
  {e:'🌱',k:'grow plant nature garden green'},
  {e:'🌸',k:'flower nature spring bloom'},
  {e:'🌊',k:'ocean wave surf nature outdoor'},
  {e:'🌍',k:'world earth nature environment'},
  {e:'🌲',k:'tree nature forest outdoor hike'},
  {e:'🏔️',k:'mountain hike climb outdoor nature'},
  {e:'🌅',k:'sunrise morning outdoors nature'},
  {e:'🐶',k:'dog pet walk animal'},
  {e:'🐱',k:'cat pet animal'},
  // Symbols & Stars
  {e:'⭐',k:'star goal reward win'},
  {e:'🌟',k:'star shine great reward win'},
  {e:'🔥',k:'fire streak hot motivation'},
  {e:'⚡',k:'energy power fast lightning'},
  {e:'💎',k:'gem value precious diamond'},
  {e:'🏆',k:'trophy win achieve reward'},
  {e:'🏅',k:'medal achieve reward win'},
  {e:'🎉',k:'celebrate party win achieve'},
  {e:'🚀',k:'rocket launch fast growth'},
  {e:'🌈',k:'rainbow positive happy color'},
  {e:'💫',k:'sparkle star shine great'},
  {e:'✨',k:'sparkle shine great new'},
  {e:'🎊',k:'celebrate win achieve party'},
  {e:'🥇',k:'first win gold medal achieve'},
  // Wake & Sleep
  {e:'🫁',k:'breathe breathing lungs health'},
  {e:'🧖',k:'spa relax self care routine'},
  {e:'🪥',k:'brush teeth hygiene routine clean'},
  {e:'💤',k:'sleep rest night routine zzz'},
  {e:'🌄',k:'morning early rise sunrise routine'},
  {e:'🧊',k:'cold shower ice bath recovery'},
  {e:'🪑',k:'sit posture desk work study'},
  {e:'🧴',k:'skincare routine face clean'},
  {e:'🪞',k:'mirror routine self reflect'},
  {e:'🫀',k:'heart health cardio exercise'},
];

function openEmojiSearch() {
  // Remove any existing panel
  document.getElementById('emoji-search-panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'emoji-search-panel';
  panel.className = 'emoji-search-panel';
  panel.innerHTML = `
    <div class="emoji-search-header">
      <div class="emoji-native-row">
        <span class="emoji-native-label">Tap field, switch to emoji keyboard 👇</span>
        <input type="text"
               id="emoji-native-input"
               class="emoji-native-input"
               placeholder="😀 type an emoji..."
               autocomplete="off"
               autocorrect="off"
               spellcheck="false"
               oninput="handleNativeEmojiInput(this)" />
      </div>
      <div class="emoji-search-divider">— or search —</div>
      <div class="emoji-search-row">
        <input type="text" id="emoji-search-input" class="emoji-search-input" placeholder="Search emoji..." oninput="filterEmojis(this.value)" autocomplete="off"/>
        <button class="emoji-search-close" onclick="document.getElementById('emoji-search-panel')?.remove()">✕</button>
      </div>
    </div>
    <div class="emoji-search-grid" id="emoji-search-grid"></div>
  `;
  const wrap = document.querySelector('.emoji-picker-wrap');
  if (wrap) wrap.appendChild(panel);
  // Focus the native input to trigger phone keyboard
  setTimeout(() => {
    const ni = document.getElementById('emoji-native-input');
    if (ni) ni.focus();
    filterEmojis('');
  }, 80);
}

function handleNativeEmojiInput(input) {
  const val = input.value;
  if (!val) return;
  // Extract the first emoji-like character using Unicode emoji range
  // Works by checking each grapheme cluster
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  const matches = val.match(emojiRegex);
  if (matches && matches[0]) {
    selectEmoji(matches[0]);
    input.value = '';
    document.getElementById('emoji-search-panel')?.remove();
  }
}

function filterEmojis(query) {
  const grid = document.getElementById('emoji-search-grid');
  if (!grid) return;
  const q = query.toLowerCase().trim();
  const results = q
    ? EMOJI_SEARCH_DATA.filter(d => d.k.includes(q) || d.e === q)
    : EMOJI_SEARCH_DATA;
  grid.innerHTML = results.map(d =>
    `<button class="emoji-search-btn" onclick="selectEmoji('${d.e}')">${d.e}</button>`
  ).join('');
}

function selectEmoji(emoji) {
  selectedEmoji = emoji;
  const btn = document.getElementById('emoji-picker-btn');
  if (btn) btn.textContent = emoji;
  document.getElementById('emoji-search-panel')?.remove();
  const dd = document.getElementById('emoji-dropdown');
  if (dd) dd.classList.add('hidden');
}

function getHabits() {
  const saved = localStorage.getItem('customHabits');
  if (saved) {
    const custom = JSON.parse(saved);
    if (custom.length > 0) return custom;
  }
  return [...HABITS];
}

function saveHabitsConfig(habits) {
  localStorage.setItem('customHabits', JSON.stringify(habits));
  // Sync habit structure immediately (not debounced) so habits are
  // never lost if the user closes the app quickly after editing
  clearTimeout(_syncTimer);
  syncToCloud();
}

function toggleHabitEditMode() {
  habitEditMode = !habitEditMode;
  const btn = document.getElementById('habit-edit-btn');
  if (btn) btn.classList.toggle('active', habitEditMode);
  buildHabitCards();
  render();
}

function openHabitEditPopup(habitId) {
  document.getElementById('hep-overlay')?.remove();
  const habits = getHabits();
  const h = habits.find(x => x.id === habitId);
  if (!h) return;
  const CATS = HABIT_CATEGORY_LIST ? HABIT_CATEGORY_LIST() : ['Daily','Morning','Evening'];
  const othHabits = habits.filter(oh => oh.id !== habitId);
  window._hepEdits = window._hepEdits || {};
  window._hepEdits[habitId] = { difficulty: h.difficulty||'medium', category: h.category||'Daily', stackAfter: h.stackAfter||'', emoji: h.emoji };

  const overlay = document.createElement('div');
  overlay.id = 'hep-overlay';
  overlay.className = 'hep-overlay';
  overlay.innerHTML = `
    <div class="hep-modal">
      <div class="hep-header">
        <button class="hep-close-btn" onclick="document.getElementById('hep-overlay')?.remove()">✕</button>
        <span class="hep-title" id="hep-preview-${habitId}">${h.emoji} ${h.name}</span>
        <button class="hep-save-btn" onclick="saveHabitEditPopup('${habitId}')">Save ✓</button>
      </div>
      <div class="hep-tabs">
        <button class="hep-tab hep-tab-active" onclick="hepTab(this,'hep-info-${habitId}')">Info</button>
        <button class="hep-tab" onclick="hepTab(this,'hep-diff-${habitId}')">Level</button>
        <button class="hep-tab" onclick="hepTab(this,'hep-cat-${habitId}')">Category</button>
        <button class="hep-tab" onclick="hepTab(this,'hep-stack-${habitId}')">Stack</button>
      </div>
      <div class="hep-panels">
        <div class="hep-panel" id="hep-info-${habitId}">
          <div class="hep-row">
            <label class="hep-lbl">Emoji</label>
            <button class="hep-emoji-show" id="hep-emj-${habitId}" onclick="openHabitEmojiPopup('${habitId}')">${h.emoji}</button>
          </div>
          <div class="hep-row">
            <label class="hep-lbl">Name</label>
            <input class="hep-name-inp" id="hep-nm-${habitId}" type="text" value="${h.name.replace(/"/g,'&quot;')}" maxlength="40" oninput="document.getElementById('hep-preview-${habitId}').textContent=document.getElementById('hep-emj-${habitId}').textContent+' '+this.value"/>
          </div>
          <div class="hep-row">
            <label class="hep-lbl">Time</label>
            <input class="hep-mins-inp" id="hep-min-${habitId}" type="number" value="${h.mins||''}" min="1" max="999" placeholder="— mins"/>
          </div>
        </div>
        <div class="hep-panel hep-hidden" id="hep-diff-${habitId}">
          <div class="hep-diff-grid">
            <button class="hep-diff-btn${(h.difficulty||'medium')==='easy'?' hep-diff-on':''}" onclick="hepDiff('${habitId}','easy',this)">🟢<br><b>Easy</b><br><small>×1 token</small></button>
            <button class="hep-diff-btn${(h.difficulty||'medium')==='medium'?' hep-diff-on':''}" onclick="hepDiff('${habitId}','medium',this)">🟡<br><b>Medium</b><br><small>×2 tokens</small></button>
            <button class="hep-diff-btn${(h.difficulty||'medium')==='hard'?' hep-diff-on':''}" onclick="hepDiff('${habitId}','hard',this)">🔴<br><b>Hard</b><br><small>×3 tokens</small></button>
          </div>
          <button class="hep-challenge-link" onclick="startChallenge('${habitId}');document.getElementById('hep-overlay')?.remove()">🎯 Start 30-Day Challenge</button>
        </div>
        <div class="hep-panel hep-hidden" id="hep-cat-${habitId}">
          <div class="hep-cat-grid" id="hep-catg-${habitId}">
            ${CATS.map(c=>`<button class="hep-cat-btn${(h.category||'Daily')===c?' hep-cat-on':''}" onclick="hepCat('${habitId}','${c}',this)">${c}</button>`).join('')}
            <button class="hep-cat-btn hep-cat-new" onclick="hepNewCat('${habitId}')">+ New…</button>
          </div>
        </div>
        <div class="hep-panel hep-hidden" id="hep-stack-${habitId}">
          <p class="hep-stack-hint">Run right after another habit</p>
          <div class="hep-stack-list">
            <button class="hep-stack-item${!h.stackAfter?' hep-stack-on':''}" onclick="hepStack('${habitId}','',this)">None</button>
            ${othHabits.map(oh=>`<button class="hep-stack-item${h.stackAfter===oh.id?' hep-stack-on':''}" onclick="hepStack('${habitId}','${oh.id}',this)">${oh.emoji} ${oh.name}</button>`).join('')}
          </div>
        </div>
      </div>
      <button class="hep-delete-btn" onclick="if(confirm('Delete this habit?')){removeHabit('${habitId}');document.getElementById('hep-overlay')?.remove();}">🗑 Delete Habit</button>
    </div>`;
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function hepTab(btn, panelId) {
  btn.closest('.hep-modal').querySelectorAll('.hep-tab').forEach(t=>t.classList.remove('hep-tab-active'));
  btn.closest('.hep-modal').querySelectorAll('.hep-panel').forEach(p=>p.classList.add('hep-hidden'));
  btn.classList.add('hep-tab-active');
  document.getElementById(panelId)?.classList.remove('hep-hidden');
}
function hepDiff(id,val,btn){
  window._hepEdits=window._hepEdits||{};window._hepEdits[id]=window._hepEdits[id]||{};window._hepEdits[id].difficulty=val;
  btn.closest('.hep-diff-grid').querySelectorAll('.hep-diff-btn').forEach(b=>b.classList.remove('hep-diff-on'));
  btn.classList.add('hep-diff-on');
}
function hepCat(id,val,btn){
  window._hepEdits=window._hepEdits||{};window._hepEdits[id]=window._hepEdits[id]||{};window._hepEdits[id].category=val;
  btn.closest('.hep-cat-grid').querySelectorAll('.hep-cat-btn').forEach(b=>b.classList.remove('hep-cat-on'));
  btn.classList.add('hep-cat-on');
}
function hepStack(id,val,btn){
  window._hepEdits=window._hepEdits||{};window._hepEdits[id]=window._hepEdits[id]||{};window._hepEdits[id].stackAfter=val;
  btn.closest('.hep-stack-list').querySelectorAll('.hep-stack-item').forEach(b=>b.classList.remove('hep-stack-on'));
  btn.classList.add('hep-stack-on');
}
function hepNewCat(id){
  const n=prompt('New category:');if(!n||!n.trim())return;
  if(typeof addCustomCategory==='function')addCustomCategory(n.trim());
  hepCat(id,n.trim(),null);
}
function saveHabitEditPopup(habitId){
  const edits=window._hepEdits?.[habitId]||{};
  const nm=document.getElementById('hep-nm-'+habitId)?.value.trim();
  const mn=parseInt(document.getElementById('hep-min-'+habitId)?.value)||0;
  const em=document.getElementById('hep-emj-'+habitId)?.textContent;
  const habits=getHabits().map(h=>{
    if(h.id!==habitId)return h;
    return{...h,...(nm?{name:nm}:{}),...(em?{emoji:em}:{}),mins:mn||undefined,
      difficulty:edits.difficulty||h.difficulty,category:edits.category||h.category,
      stackAfter:edits.stackAfter!==undefined?edits.stackAfter:h.stackAfter};
  });
  saveHabitsConfig(habits);buildHabitCards();
  document.getElementById('hep-overlay')?.remove();
}
function openHabitEmojiPopup(habitId){
  document.getElementById('hep-emj-overlay')?.remove();
  const overlay=document.createElement('div');
  overlay.id='hep-emj-overlay';overlay.className='hep-overlay';
  overlay.innerHTML=`<div class="hep-modal hep-emj-modal">
    <div class="hep-header">
      <button class="hep-close-btn" onclick="document.getElementById('hep-emj-overlay')?.remove()">✕</button>
      <span class="hep-title">Choose Emoji</span>
      <span></span>
    </div>
    <div class="hep-emj-native-wrap">
      <span class="hep-emj-native-lbl">Switch to emoji keyboard 👇</span>
      <input type="text" class="hep-emj-native-inp" placeholder="😀 tap here..." autocomplete="off" autocorrect="off" spellcheck="false"
        oninput="(function(v){const m=v.match(/\\p{Emoji_Presentation}|\\p{Extended_Pictographic}/gu);if(m&&m[0]){window._hepEdits=window._hepEdits||{};window._hepEdits['${habitId}']=window._hepEdits['${habitId}']||{};window._hepEdits['${habitId}'].emoji=m[0];const b=document.getElementById('hep-emj-${habitId}');if(b)b.textContent=m[0];const p=document.getElementById('hep-preview-${habitId}');if(p)p.textContent=m[0]+' '+(document.getElementById('hep-nm-${habitId}')?.value||'');document.getElementById('hep-emj-overlay')?.remove();}this.value=''})(this.value)"/>
    </div>
    <input type="text" class="hep-emj-search" placeholder="Search emoji..." oninput="hepEmojiFilter(this.value,'${habitId}')" autocomplete="off"/>
    <div class="hep-emj-grid" id="hep-emj-grid-${habitId}"></div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
  setTimeout(()=>hepEmojiFilter('',habitId),50);
}
function hepEmojiFilter(q,id){
  const grid=document.getElementById('hep-emj-grid-'+id);if(!grid)return;
  const results=q?(EMOJI_SEARCH_DATA||[]).filter(d=>d.k.includes(q.toLowerCase())||d.e===q):EMOJI_SEARCH_DATA||[];
  grid.innerHTML=results.map(d=>`<button class="hep-emj-item" onclick="(function(){window._hepEdits=window._hepEdits||{};window._hepEdits['${id}']=window._hepEdits['${id}']||{};window._hepEdits['${id}'].emoji='${d.e}';const b=document.getElementById('hep-emj-${id}');if(b)b.textContent='${d.e}';const p=document.getElementById('hep-preview-${id}');if(p)p.textContent='${d.e} '+(document.getElementById('hep-nm-${id}')?.value||'');document.getElementById('hep-emj-overlay')?.remove();})()">${d.e}</button>`).join('');
}

// ── CONFIRM MODAL ─────────────────────────────────────────
let _confirmCallback = null;

function showConfirmModal({ icon, title, message, confirmLabel }) {
  closeConfirmModal();
  const overlay = document.createElement('div');
  overlay.className = 'confirm-modal-overlay';
  overlay.id = 'confirm-modal-overlay';
  overlay.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-modal-icon">${icon}</div>
      <div class="confirm-modal-title">${title}</div>
      ${message ? `<div class="confirm-modal-message">${message}</div>` : ''}
      <div class="confirm-modal-btns">
        <button class="confirm-modal-cancel" onclick="closeConfirmModal()">Cancel</button>
        <button class="confirm-modal-confirm" onclick="executeConfirmModal()">${confirmLabel}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeConfirmModal() {
  _confirmCallback = null;
  document.getElementById('confirm-modal-overlay')?.remove();
}

function executeConfirmModal() {
  const cb = _confirmCallback;
  closeConfirmModal();
  if (cb) cb();
}

function removeHabit(id) {
  const habit = getHabits().find(h => h.id === id);
  const name = habit ? habit.name : 'this habit';
  showConfirmModal({
    icon: habit?.emoji || '🗑️',
    title: `Delete "${name}"?`,
    message: 'This habit and all its history will be removed.',
    confirmLabel: 'Delete',
  });
  _confirmCallback = () => {
    const habits = getHabits().filter(h => h.id !== id);
    saveHabitsConfig(habits);
    buildHabitCards();
    render();
  };
}

function updateHabitMins(id, rawValue) {
  const mins = parseInt(rawValue, 10);
  if (isNaN(mins) || mins < 1) return;
  const habits = getHabits().map(h => h.id === id ? { ...h, mins } : h);
  saveHabitsConfig(habits);
  // Update just the input value without full re-render (avoids losing focus)
  const card = document.querySelector(`[data-habit="${id}"]`);
  if (card) {
    const inp = card.querySelector('.habit-mins-edit-input');
    if (inp && parseInt(inp.value) !== mins) inp.value = mins;
  }
}

function removeHabitMins(id) {
  const habits = getHabits().map(h => {
    if (h.id !== id) return h;
    const { mins, ...rest } = h;
    return rest;
  });
  saveHabitsConfig(habits);
  buildHabitCards();
}

function addHabitMins(id) {
  const habits = getHabits().map(h => h.id === id ? { ...h, mins: 10 } : h);
  saveHabitsConfig(habits);
  buildHabitCards();
  // Auto-focus the newly created input
  requestAnimationFrame(() => {
    const card = document.querySelector(`[data-habit="${id}"]`);
    const inp = card?.querySelector('.habit-mins-edit-input');
    if (inp) { inp.select(); inp.focus(); }
  });
}

function updateHabitCategory(id, category) {
  const habits = getHabits().map(h => h.id === id ? { ...h, category } : h);
  saveHabitsConfig(habits);
}

const HABIT_PRESETS = [
  { emoji: '💧', name: 'Drink Water',   category: 'Health' },
  { emoji: '🏃', name: 'Morning Run',   category: 'Health' },
  { emoji: '📚', name: 'Read 30 min',   category: 'Mind'   },
  { emoji: '🧘', name: 'Meditate',      category: 'Mind'   },
  { emoji: '💊', name: 'Take Vitamins', category: 'Health' },
  { emoji: '✏️', name: 'Journal',       category: 'Mind'   },
  { emoji: '🧹', name: 'Tidy Up',       category: 'Home'   },
  { emoji: '🥗', name: 'Eat Healthy',   category: 'Health' },
  { emoji: '😴', name: 'Sleep by 10pm', category: 'Health' },
  { emoji: '💰', name: 'No Spending',   category: 'Work'   },
  { emoji: '📝', name: 'Plan Tomorrow', category: 'Work'   },
  { emoji: '🚴', name: 'Bike/Walk',     category: 'Health' },
];

function showAddHabitForm() {
  const existing = document.getElementById('add-habit-form');
  if (existing) { existing.remove(); return; }
  selectedEmoji = '🌟';
  const presetsHtml = HABIT_PRESETS.map(p =>
    `<button class="preset-habit-btn" onclick="applyHabitPreset('${p.emoji}','${p.name.replace(/'/g,"\\'")}','${p.category}')">${p.emoji} ${p.name}</button>`
  ).join('');
  const form = document.createElement('div');
  form.id = 'add-habit-form';
  form.className = 'add-habit-form';
  form.innerHTML = `
    <div class="add-habit-inputs">
      <div class="emoji-picker-wrap">
        <button id="emoji-picker-btn" class="emoji-picker-btn" onclick="openEmojiSearch()" title="Pick an emoji">🌟</button>
      </div>
      <input type="text" id="new-habit-name" class="add-habit-name-input" placeholder="Habit name...">
      <input type="number" id="new-habit-mins" class="add-habit-mins-input" placeholder="min" min="0" max="999" title="How many minutes?">
    </div>
    <div class="preset-habits-dropdown" id="preset-habits-dropdown">
      <button class="preset-habits-toggle" onclick="togglePresetHabits()" id="preset-habits-toggle">
        <span>More Common Habits <span class="preset-habits-arrow" id="preset-habits-arrow">▼</span></span>
      </button>
      <div class="preset-habits-body hidden" id="preset-habits-body">
        <div class="preset-habits-grid">${presetsHtml}</div>
      </div>
    </div>
    <button class="add-habit-save" onclick="saveNewHabit()">Add Habit</button>
  `;
  const list = document.getElementById('habit-list');
  // Insert form above the habit list (below the add button)
  if (list) list.insertAdjacentElement('beforebegin', form);
  document.getElementById('new-habit-name')?.focus();
}

function togglePresetHabits() {
  const body = document.getElementById('preset-habits-body');
  const arrow = document.getElementById('preset-habits-arrow');
  if (!body) return;
  const isHidden = body.classList.toggle('hidden');
  if (arrow) arrow.textContent = isHidden ? '▼' : '▲';
}

let _presetCategory = null;
function applyHabitPreset(emoji, name, category) {
  _presetCategory = category;
  selectEmoji(emoji);
  const emojiInput = document.getElementById('emoji-picker-btn');
  if (emojiInput) emojiInput.value = emoji;
  const nameInput = document.getElementById('new-habit-name');
  if (nameInput) { nameInput.value = name; nameInput.focus(); }
}

function saveNewHabit() {
  const emoji = selectedEmoji || '⭐';
  const name = document.getElementById('new-habit-name')?.value.trim();
  if (!name) return;
  const minsRaw = document.getElementById('new-habit-mins')?.value;
  const mins = minsRaw !== '' && minsRaw !== undefined ? parseInt(minsRaw, 10) : undefined;
  const habits = getHabits();
  const id = 'habit-' + Date.now();
  const color = HABIT_COLORS[habits.length % HABIT_COLORS.length];
  const habitObj = { id, name, emoji, color };
  if (mins !== undefined && !isNaN(mins)) habitObj.mins = mins;
  if (_presetCategory) { habitObj.category = _presetCategory; _presetCategory = null; }
  // Insert at beginning so new habit appears at top of the list
  habits.unshift(habitObj);
  saveHabitsConfig(habits);
  buildHabitCards();
  render();
  const newCard = document.querySelector(`[data-habit="${id}"]`);
  if (newCard) {
    newCard.classList.add('new-card');
    newCard.addEventListener('animationend', () => newCard.classList.remove('new-card'), { once: true });
  }
}

// ── HABIT CATEGORIES ─────────────────────────────────────
const HABIT_CATEGORY_LIST_DEFAULT = ['Daily', 'Health', 'Mind', 'Work', 'Home', 'Morning', 'Evening', 'Finance', 'Social', 'Custom'];
function HABIT_CATEGORY_LIST() {
  try {
    const custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
    return [...new Set([...HABIT_CATEGORY_LIST_DEFAULT, ...custom])];
  } catch { return HABIT_CATEGORY_LIST_DEFAULT; }
}
function addCustomCategory(name) {
  if (!name || !name.trim()) return;
  const custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
  if (!custom.includes(name.trim())) {
    custom.push(name.trim());
    localStorage.setItem('customCategories', JSON.stringify(custom));
  }
}

// ── QUOTES ───────────────────────────────────────────────
const QUOTES = [
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Your health is an investment, not an expense.", author: "Unknown" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The groundwork of all happiness is health.", author: "Leigh Hunt" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "It is not enough to take steps which may someday lead to a goal; each step must be itself a goal.", author: "Goethe" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Sleep is the best meditation.", author: "Dalai Lama" },
  { text: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", author: "Benjamin Franklin" },
  { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong.", author: "Buddha" },
  { text: "Gratitude turns what we have into enough.", author: "Aesop" },
  { text: "The more you praise and celebrate your life, the more there is in life to celebrate.", author: "Oprah Winfrey" },
  { text: "Gratitude is not only the greatest of virtues, but the parent of all others.", author: "Cicero" },
  { text: "Be grateful for what you have; you'll end up having more.", author: "Oprah Winfrey" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "Winning is a habit. Unfortunately, so is losing.", author: "Vince Lombardi" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "In essence, if we want to direct our lives, we must take control of our consistent actions.", author: "Tony Robbins" },
  { text: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "A man who masters patience masters everything else.", author: "George Savile" },
  { text: "You will never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
];

// ── GRATITUDE HEALTH QUOTES (rotate daily, shown below the gratitude section) ──
const GRATITUDE_HEALTH_QUOTES = [
  { text: "Gratitude reduces toxic emotions like envy and resentment while amplifying positive ones — directly lowering your stress hormones.", author: "Robert Emmons, UC Davis" },
  { text: "People who write down three things they're grateful for every day report 25% higher energy levels and better sleep quality.", author: "Dr. Martin Seligman" },
  { text: "Gratitude activates the hypothalamus, which controls sleep, metabolism, and stress — making it one of the most powerful wellness habits.", author: "NIH Research, 2009" },
  { text: "A daily gratitude practice lowers cortisol by 23%, measurably reducing anxiety and improving heart rate variability.", author: "HeartMath Institute" },
  { text: "People who regularly practice gratitude have stronger immune systems and report fewer physical complaints like headaches and illness.", author: "Dr. Alex Wood, University of Manchester" },
  { text: "Grateful people exercise more, eat better, and are more likely to attend regular medical checkups.", author: "Emmons & McCullough, Journal of Personality and Social Psychology" },
  { text: "Gratitude rewires the brain's reward pathways, releasing dopamine and serotonin — the same chemicals targeted by antidepressants.", author: "Greater Good Science Center, Berkeley" },
  { text: "Writing gratitude just before bed helps you fall asleep faster and wake up feeling more refreshed.", author: "Dr. Michael Scullin, Baylor University" },
  { text: "People who keep a gratitude journal report 10% fewer physical pain symptoms over a 3-week period.", author: "University of Miami Study, 2003" },
  { text: "Gratitude strengthens relationships — and having strong social connections is one of the top predictors of longevity.", author: "Harvard Study of Adult Development" },
  { text: "The simple act of counting blessings for 15 minutes a day boosts energy, reduces fatigue, and lifts mood.", author: "Dr. Sonja Lyubomirsky, UC Riverside" },
  { text: "Gratitude practice lowers blood pressure and improves heart health by keeping the nervous system in a calmer, parasympathetic state.", author: "American Psychological Association" },
  { text: "Grateful people report sleeping an average of 30 more minutes per night and wake feeling more alert and refreshed.", author: "Journal of Psychosomatic Research" },
  { text: "Chronic gratitude builds psychological resilience — grateful people bounce back from illness, trauma, and stress significantly faster.", author: "Journal of Positive Psychology" },
];

function getDailyGratitudeQuote() {
  const day = getDayNumber();
  return GRATITUDE_HEALTH_QUOTES[((day % GRATITUDE_HEALTH_QUOTES.length) + GRATITUDE_HEALTH_QUOTES.length) % GRATITUDE_HEALTH_QUOTES.length];
}

function getDayNumber() {
  const today = getToday();
  const start = new Date('2025-01-01T12:00:00');
  const d = new Date(today + 'T12:00:00');
  return Math.floor((d - start) / (1000 * 60 * 60 * 24));
}

function getDailyQuote() {
  const day = getDayNumber();
  return QUOTES[((day % QUOTES.length) + QUOTES.length) % QUOTES.length];
}

// ── NAVIGATION ───────────────────────────────────────────
let currentPage = 1;
let startX = 0;

function goTo(index) {
  // Exit habit edit mode when leaving the habits page
  if (index !== 1 && habitEditMode) {
    habitEditMode = false;
    const btn = document.getElementById('habit-edit-btn');
    if (btn) btn.classList.remove('active');
    buildHabitCards();
  }
  currentPage = index;

  // Pop menu + profile back down on tab switch
  document.getElementById('hamburger-btn')?.classList.remove('scrolled-away');
  document.getElementById('profile-avatar-btn')?.classList.remove('scrolled-away');

  // Smoothly return background to top
  const _bg = document.getElementById('progress-bg');
  if (_bg) {
    _bg.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    _bg.style.transform = 'translateY(0)';
    setTimeout(() => { _bg.style.transition = ''; }, 520);
  }

  document.getElementById('pages').style.transform = `translateX(-${index * 100}vw)`;
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  // Slide the gold indicator bar (centered under each tab)
  const indicator = document.getElementById('nav-indicator');
  if (indicator) indicator.style.left = `${index * 25 + 5.5}%`;
  // Toggle progress background visibility (avoid bleed-through on other pages)
  // Always restore nav when switching pages
  document.querySelector('.bottom-nav').classList.remove('hidden');
  if (index === 0) renderProgress(true);
  if (index === 1) render();
  if (index === 2) renderJournal();
  if (index === 3) renderFriends();
}

// ── DATA ─────────────────────────────────────────────────
function getToday() {
  const now = new Date();
  // Day resets at 4am — before 4am counts as the previous day
  if (now.getHours() < 4) now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadData() {
  const raw = localStorage.getItem('habitData');
  return raw ? JSON.parse(raw) : {};
}

function saveData(data) {
  localStorage.setItem('habitData', JSON.stringify(data));
  queueSync();
}

function getStreak(habitId, data) {
  let streak = 0;
  const today = getToday();
  // Use a date object but build the key string manually (avoids UTC offset bugs with toISOString)
  const todayParts = today.split('-');
  let d = new Date(parseInt(todayParts[0]), parseInt(todayParts[1]) - 1, parseInt(todayParts[2]));

  while (true) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    if (key === today) {
      d.setDate(d.getDate() - 1);
      continue;
    }
    if (data[key] && data[key][habitId]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  if (data[today] && data[today][habitId]) streak++;
  return streak;
}

function getBestStreak(habitId) {
  const data = loadData();
  const today = getToday();
  const todayParts = today.split('-');
  // Collect all dates with data, sorted
  const allDates = Object.keys(data).sort();
  if (allDates.length === 0) return 0;
  let best = 0;
  let current = 0;
  let prevDate = null;
  allDates.forEach(dateStr => {
    if (dateStr > today) return;
    if (data[dateStr] && data[dateStr][habitId]) {
      if (prevDate) {
        // Check if consecutive
        const prev = new Date(prevDate + 'T12:00:00');
        const curr = new Date(dateStr + 'T12:00:00');
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          current++;
        } else {
          current = 1;
        }
      } else {
        current = 1;
      }
      prevDate = dateStr;
      if (current > best) best = current;
    } else {
      prevDate = null;
      current = 0;
    }
  });
  return best;
}

function _getBestWeekScore() {
  const data = loadData();
  const habits = getHabits();
  if (!habits.length) return 0;
  const today = getToday();
  let best = 0;
  for (let w = 0; w < 52; w++) {
    let total = 0, hasAny = false;
    for (let d = 0; d < 7; d++) {
      const dt = new Date(today + 'T12:00:00');
      dt.setDate(dt.getDate() - (w * 7 + d));
      const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
      const dd = data[key];
      if (dd) { hasAny = true; total += habits.filter(h => !!dd[h.id]).length; }
    }
    if (total > best) best = total;
    if (w > 3 && !hasAny) break;
  }
  return best;
}

function getGratitudeStreak() {
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const today = getToday();
  let streak = 0;
  // Build date manually to avoid UTC offset bugs
  const todayParts = today.split('-');
  let d = new Date(parseInt(todayParts[0]), parseInt(todayParts[1]) - 1, parseInt(todayParts[2]));

  while (true) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    if (key === today) {
      d.setDate(d.getDate() - 1);
      continue;
    }
    const e = journals[key];
    if (e && e.s1 && e.s2 && e.s3) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  const todayEntry = journals[today];
  if (todayEntry && todayEntry.s1 && todayEntry.s2 && todayEntry.s3) streak++;
  return streak;
}

// ── HABITS ───────────────────────────────────────────────
function getOrderedHabits() {
  const habits = getHabits();
  const saved = localStorage.getItem('habitOrder');
  let ordered;
  if (!saved) {
    ordered = habits;
  } else {
    const order = JSON.parse(saved);
    ordered = order.map(id => habits.find(h => h.id === id)).filter(Boolean);
    habits.forEach(h => { if (!ordered.find(o => o.id === h.id)) ordered.push(h); });
  }
  // Remap colors by rainbow position so dots always go red→orange→yellow→…
  return ordered.map((h, i) => ({ ...h, color: HABIT_COLORS[i % HABIT_COLORS.length] }));
}

function saveHabitOrder() {
  const cards = document.querySelectorAll('#habit-list .habit-card');
  const order = [...cards].map(c => c.dataset.habit);
  localStorage.setItem('habitOrder', JSON.stringify(order));
  queueSync();
}

function initSmoothDrag(list) {
  let dragEl=null,startY=0,cardH=0,originIdx=-1,curIdx=-1;
  function cards(){return[...list.querySelectorAll('.habit-card')];}
  function shiftCards(){
    cards().forEach((c,i)=>{
      if(c===dragEl)return;
      c.style.transition='transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
      let s=0;
      if(originIdx<curIdx&&i>originIdx&&i<=curIdx)s=-(cardH+8);
      else if(originIdx>curIdx&&i>=curIdx&&i<originIdx)s=(cardH+8);
      c.style.transform=`translateY(${s}px)`;
    });
  }
  function reset(){cards().forEach(c=>{c.style.transition='transform 0.2s ease';c.style.transform='';});}
  function onDown(e){
    const h=e.target.closest('.drag-handle');if(!h)return;
    const card=h.closest('.habit-card');if(!card)return;
    e.preventDefault();
    dragEl=card;const cs=cards();originIdx=cs.indexOf(dragEl);curIdx=originIdx;
    cardH=dragEl.getBoundingClientRect().height;
    const touch=e.touches?e.touches[0]:e;startY=touch.clientY;
    dragEl.style.transition='none';dragEl.style.transform='scale(1.02)';
    dragEl.style.boxShadow='0 8px 32px rgba(0,0,0,0.5)';dragEl.style.zIndex='500';dragEl.style.position='relative';
    document.addEventListener('touchmove',onMove,{passive:false});
    document.addEventListener('touchend',onUp);
    document.addEventListener('mousemove',onMove);
    document.addEventListener('mouseup',onUp);
  }
  function onMove(e){
    if(!dragEl)return;e.preventDefault();
    const touch=e.touches?e.touches[0]:e;
    const dy=touch.clientY-startY;
    dragEl.style.transform=`translateY(${dy}px) scale(1.02)`;
    const mid=dragEl.getBoundingClientRect().top+cardH/2;
    let ni=originIdx;
    cards().forEach((c,i)=>{
      if(c===dragEl)return;
      const r=c.getBoundingClientRect();
      if(originIdx<i&&mid>r.top+r.height/2)ni=i;
      if(originIdx>i&&mid<r.top+r.height/2)ni=i;
    });
    if(ni!==curIdx){curIdx=ni;shiftCards();}
  }
  function onUp(){
    if(!dragEl)return;
    document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onUp);
    document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);
    if(originIdx!==curIdx){
      dragEl.parentNode.removeChild(dragEl);
      const bubble=list.querySelector('.habit-category-bubble');
      if(bubble){const tgts=[...bubble.querySelectorAll('.habit-card')];
        if(curIdx<tgts.length)bubble.insertBefore(dragEl,tgts[curIdx]);else bubble.appendChild(dragEl);}
    }
    dragEl.style.cssText='';reset();
    setTimeout(()=>saveHabitOrder(),80);
    dragEl=null;originIdx=-1;curIdx=-1;
  }
  list.addEventListener('touchstart',onDown,{passive:false});
  list.addEventListener('mousedown',onDown);
}

function buildHabitCards() {
  const list = document.getElementById('habit-list');
  if (!list) return;
  const ordered = getOrderedHabits();

  function _buildCard(h) {
    const hasMins = h.mins !== undefined && h.mins > 0;
    const minsLabel = '';
    const minsEditControl = '';
    const categoryEditControl = '';
    const difficultyEditControl = '';
    const colorEditControl = '';
    const stackEditControl = '';
    const challengeEditControl = '';
    const editBtn = habitEditMode
      ? `<button class="habit-edit-popup-btn" onclick="openHabitEditPopup('${h.id}')" title="Edit">✏️</button>`
      : '';
    return `
    <div class="habit-card" data-habit="${h.id}" ${habitEditMode ? 'draggable="true"' : ''}>
      <button class="remove-habit-btn" onclick="removeHabit('${h.id}')" title="Remove habit">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="drag-handle">⠿</div>
      <div class="habit-info">
        <span class="emoji">${h.emoji}</span>
        <span class="habit-name">${h.name}</span>
        <span class="habit-difficulty-badge ${h.difficulty || 'medium'}">${(h.difficulty || 'medium') === 'easy' ? '🟢' : (h.difficulty || 'medium') === 'hard' ? '🔴' : '🟡'}</span>
      </div>
      ${editBtn}
      <div class="habit-right">
        <span class="streak" id="streak-${h.id}">0 days</span>
        ${habitEditMode ? '' : `<button class="check-btn" id="btn-${h.id}" onclick="toggleHabit('${h.id}')">✓</button>`}
      </div>
    </div>`;
  }

  if (habitEditMode) {
    list.innerHTML = `<div class="habit-category-bubble">${ordered.map(_buildCard).join('')}</div>`;
  } else {
    // Group by category in normal mode
    const groups = {};
    const groupOrder = [];
    ordered.forEach(h => {
      const cat = h.category || 'Daily';
      if (!groups[cat]) { groups[cat] = []; groupOrder.push(cat); }
      groups[cat].push(h);
    });
    const hasCategories = true;
    if (hasCategories) {
      list.innerHTML = groupOrder.map(cat => {
        const label = `<div class="habit-category-label">${cat}</div>`;
        const cards = groups[cat].map(_buildCard).join('');
        return `<div class="habit-category-bubble">${label}${cards}</div>`;
      }).join('');
    } else {
      list.innerHTML = ordered.map(_buildCard).join('');
    }
  }

  list.classList.toggle('edit-mode', habitEditMode);

  // Remove old add button/form
  document.getElementById('add-habit-btn')?.remove();
  document.getElementById('add-habit-form')?.remove();

  if (habitEditMode) {
    const addBtn = document.createElement('button');
    addBtn.className = 'add-habit-btn';
    addBtn.id = 'add-habit-btn';
    addBtn.innerHTML = '＋ Add Habit';
    addBtn.onclick = showAddHabitForm;
    // Insert above the habit list
    list.insertAdjacentElement('beforebegin', addBtn);
  }

  if (habitEditMode) initSmoothDrag(list);
}

function _getDifficultyMultiplier(habit) {
  const d = habit.difficulty || 'medium';
  if (d === 'easy') return 1;
  if (d === 'hard') return 3;
  return 2; // medium default
}

function toggleHabit(habitId) {
  const data = loadData();
  const today = getToday();
  if (!data[today]) data[today] = {};

  // One-time only — once checked, can't un-check
  if (data[today][habitId]) {
    _showBriefToast('✓ Already completed — great work!');
    return;
  }

  // Show promise verification before marking done
  const habit = getHabits().find(h => h.id === habitId);
  if (!habit) return;
  _showPromiseModal(habit, () => {
    data[today][habitId] = true;
    if (navigator.vibrate) navigator.vibrate(50);
    const btn = document.getElementById('btn-' + habitId);
    const multiplier = _getDifficultyMultiplier(habit);
    const tokenCount = 2 * multiplier;
    if (btn) awardTokens(tokenCount, btn);
    _tokens += tokenCount;
    localStorage.setItem('tokenBalance', _tokens);
    updateTokenDisplay();
    saveData(data);

    // Check habit stacking — if any habit has stackAfter === this habitId, show toast
    const allHabits = getHabits();
    allHabits.forEach(h => {
      if (h.stackAfter === habitId) {
        setTimeout(() => _showBriefToast(`⚡ Stack: Time for ${h.emoji} ${h.name}!`), 400);
      }
    });

    queueSync();
    render();

    // Daily recap — check if all habits done now
    const reloadedData = loadData();
    const todayData = reloadedData[today] || {};
    const allNowDone = allHabits.length > 0 && allHabits.every(h => !!todayData[h.id]);
    if (allNowDone && !_allHabitsDonePrev) {
      // daily recap popup disabled
    }
  });
}

function _showPromiseModal(habit, onConfirm) {
  document.getElementById('promise-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'promise-overlay';
  overlay.className = 'promise-overlay';
  overlay.innerHTML = `
    <div class="promise-modal">
      <div class="promise-modal-emoji">${habit.emoji}</div>
      <div class="promise-modal-title">Did you really do it?</div>
      <div class="promise-modal-text">I promise I completed <strong>${habit.name}</strong> fully and honestly. (This can't be undone!)</div>
      <div class="promise-modal-btns">
        <button class="promise-modal-cancel" onclick="document.getElementById('promise-overlay').remove()">Not yet</button>
        <button class="promise-modal-confirm" id="promise-confirm-btn">✓ I Promise</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('promise-confirm-btn').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function showDailyRecap() {
  document.getElementById('daily-recap-overlay')?.remove();
  const today = getToday();
  const data = loadData();
  const todayData = data[today] || {};
  const habits = getHabits();
  const completedHabits = habits.filter(h => !!todayData[h.id]);
  const totalTokensEarned = completedHabits.reduce((sum, h) => sum + 2 * _getDifficultyMultiplier(h), 0);

  // Calculate current all-habits streak
  let allDoneStreak = 0;
  const todayParts = today.split('-');
  let d = new Date(parseInt(todayParts[0]), parseInt(todayParts[1]) - 1, parseInt(todayParts[2]));
  for (let i = 0; i < 365; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    const dayData = data[key] || {};
    if (habits.every(h => !!dayData[h.id])) {
      allDoneStreak++;
      d.setDate(d.getDate() - 1);
    } else if (key !== today) {
      break;
    } else {
      d.setDate(d.getDate() - 1);
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'daily-recap-overlay';
  overlay.className = 'daily-recap-overlay';
  overlay.innerHTML = `
    <div class="daily-recap-modal">
      <div class="daily-recap-heading">✅ Day Complete!</div>
      <div class="daily-recap-stat">
        <span class="daily-recap-stat-num">${completedHabits.length}</span>
        <span class="daily-recap-stat-label">habits done today</span>
      </div>
      <div class="daily-recap-stat">
        <span class="daily-recap-stat-num">🔥 ${totalTokensEarned}</span>
        <span class="daily-recap-stat-label">tokens earned today</span>
      </div>
      ${allDoneStreak > 0 ? `<div class="daily-recap-stat">
        <span class="daily-recap-stat-num">${allDoneStreak}</span>
        <span class="daily-recap-stat-label">day streak — all habits done!</span>
      </div>` : ''}
      <div class="daily-recap-motivate">🔥 Keep it up!</div>
      <button class="daily-recap-close" onclick="document.getElementById('daily-recap-overlay').remove()">Close</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function _showBriefToast(msg) {
  document.getElementById('brief-toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'brief-toast';
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 20px;border-radius:20px;font-size:0.85rem;z-index:9999;pointer-events:none;white-space:nowrap;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function render() {
  const data = loadData();
  const today = getToday();
  const todayData = data[today] || {};

  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  // Render weekly focus section
  _renderWeeklyFocus();

  // Build cards if not yet rendered
  const list = document.getElementById('habit-list');
  if (list && !list.querySelector('.habit-card')) buildHabitCards();

  // Build a lookup map once instead of querying per-habit
  const cardMap = {};
  document.querySelectorAll('[data-habit]').forEach(el => { cardMap[el.dataset.habit] = el; });

  getHabits().forEach(h => {
    const card = cardMap[h.id];
    const streakEl = document.getElementById(`streak-${h.id}`);
    const done = !!todayData[h.id];
    const streak = getStreak(h.id, data);
    if (card) card.classList.toggle('done', done);
    if (streakEl) {
      streakEl.textContent = streak > 0
        ? `🔥 ${streak} day${streak !== 1 ? 's' : ''}`
        : '0 days';
    }
  });

  // Move completed habits to bottom of their category group
  _sortDoneHabitsToBottom();

  updateHabitsNavTab();
  renderWellnessSliders();
  if (document.getElementById('streak-grid')) renderProgress();

  // Confetti when all habits newly completed
  const _habits = getHabits();
  const allNowDone = _habits.length > 0 && _habits.every(h => !!todayData[h.id]);
  if (allNowDone && !_allHabitsDonePrev && localStorage.getItem('confettiDate') !== getToday()) {
    localStorage.setItem('confettiDate', getToday());
    _triggerConfetti();
  }
  _allHabitsDonePrev = allNowDone;
}

function _sortDoneHabitsToBottom() {
  document.querySelectorAll('#habit-list .habit-category-bubble').forEach(bubble => {
    const label = bubble.querySelector('.habit-category-label');
    const cards = [...bubble.querySelectorAll('.habit-card')];
    if (cards.length < 2) return;
    cards.sort((a, b) => (a.classList.contains('done') ? 1 : 0) - (b.classList.contains('done') ? 1 : 0));
    cards.forEach(c => bubble.appendChild(c));
    if (label) bubble.insertAdjacentElement('afterbegin', label);
  });
}

function _triggerConfetti() {
  const colors = ['#f59e0b','#fbbf24','#f87171','#4ade80','#60a5fa','#a78bfa','#fb923c','#34d399'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(wrap);
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    const size = 5 + Math.random() * 9;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.7;
    const dur   = 1.4 + Math.random() * 1.4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    el.style.cssText = `position:absolute;left:${left}%;top:-20px;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>.5?'50%':'3px'};animation:confetti-fall ${dur}s ${delay}s ease-in forwards;`;
    wrap.appendChild(el);
  }
  setTimeout(() => wrap.remove(), 3800);
}

// ── WELLNESS SLIDERS ─────────────────────────────────────

function fmtExerciseMins(v) {
  if (v === undefined || v === null) return '—';
  const r = Math.round(v);
  if (r < 60) return `${r}m`;
  const h = Math.floor(r / 60);
  const m = r % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function renderWellnessSliders() {
  const data = loadData();
  const today = getToday();
  const todayData = data[today] || {};

  const exSlider = document.getElementById('exercise-slider');
  const slSlider = document.getElementById('sleep-slider');
  const exVal    = document.getElementById('exercise-val');
  const slVal    = document.getElementById('sleep-val');

  const ex = todayData.wellness_exercise;
  const sl = todayData.wellness_sleep;

  if (exSlider) exSlider.value = ex !== undefined ? Math.min(90, ex) : 5;
  if (slSlider) slSlider.value = sl !== undefined ? sl : 0;
  if (exVal) {
    exVal.textContent = ex !== undefined ? fmtExerciseMins(ex) : '—';
    exVal.title = 'Tap to enter any duration';
    exVal.style.cursor = 'pointer';
    exVal.style.textDecoration = 'underline dotted';
    exVal.onclick = openExerciseInput;
  }
  if (slVal) slVal.textContent = sl !== undefined ? `${sl}h` : '—';

  _updateSliderFill(exSlider, ex !== undefined ? Math.min(1, (Math.min(ex, 90) - 5) / 85) : 0);
  _updateSliderFill(slSlider, sl !== undefined ? sl / 12 : 0);

  _applySliderLockState('exercise');
  _applySliderLockState('sleep');

  // Goal markers — show optimal target on the slider track
  const exOptimalRaw = parseFloat(localStorage.getItem('exerciseOptimalMins')) || null;
  const slOptimalRaw = parseFloat(localStorage.getItem('sleepOptimalHours'))   || null;
  // Fallback to goal if survey not taken
  const exTarget = exOptimalRaw || (parseFloat(localStorage.getItem('goalExerciseMins')) / 5) || null;
  const slTarget = slOptimalRaw || parseFloat(localStorage.getItem('goalSleepHours')) || null;

  _updateSliderGoalMarker('exercise-goal-marker', exTarget, 5, 90);
  _updateSliderGoalMarker('sleep-goal-marker', slTarget, 0, 12);
}

function openEditSleepGoal() {
  const current = parseFloat(localStorage.getItem('sleepOptimalHours') || localStorage.getItem('goalSleepHours') || '8');
  document.getElementById('promise-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'promise-overlay';
  overlay.className = 'promise-overlay';
  overlay.innerHTML = `
    <div class="promise-modal">
      <div class="promise-modal-emoji">😴</div>
      <div class="promise-modal-title">Sleep Goal</div>
      <div class="promise-modal-text">How many hours of sleep do you aim for each night?</div>
      <input type="number" id="sleep-goal-input" value="${current}" min="4" max="12" step="0.5"
        style="width:100%;padding:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;color:#fff;font-size:1.1rem;text-align:center;margin-bottom:16px" />
      <div class="promise-modal-btns">
        <button class="promise-modal-cancel" onclick="document.getElementById('promise-overlay').remove()">Cancel</button>
        <button class="promise-modal-confirm" onclick="
          const v = parseFloat(document.getElementById('sleep-goal-input').value);
          if (v >= 4 && v <= 12) {
            localStorage.setItem('sleepOptimalHours', v);
            localStorage.setItem('goalSleepHours', v);
            if (window._currentUser && window._fbDb) {
              window._fbDb.collection('users').doc(window._currentUser.uid).update({sleepOptimalHours:v,goalSleepHours:v}).catch(()=>{});
            }
            renderWellnessSliders();
          }
          document.getElementById('promise-overlay').remove();
        ">Save Goal</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  setTimeout(() => document.getElementById('sleep-goal-input')?.select(), 100);
}

function _updateSliderGoalMarker(markerId, target, minVal, maxVal) {
  const marker = document.getElementById(markerId);
  if (!marker) return;
  if (target === null || isNaN(target) || target < minVal || target > maxVal) {
    marker.style.display = 'none';
    return;
  }
  const frac = (target - minVal) / (maxVal - minVal);
  // Correct for thumb width (22px) so marker aligns with thumb center
  marker.style.left = `calc(${(frac * 100).toFixed(2)}% + ${(11 - 22 * frac).toFixed(2)}px)`;
  marker.style.display = 'block';
}

function _updateSliderFill(input, fraction) {
  if (!input) return;
  const pct = Math.round(fraction * 100);
  input.style.setProperty('--fill', `${pct}%`);
}

function onWellnessInput(type, rawValue) {
  const value = parseFloat(rawValue);
  const data  = loadData();
  const today = getToday();
  if (!data[today]) data[today] = {};

  if (type === 'exercise') {
    data[today].wellness_exercise = value;
    const el = document.getElementById('exercise-val');
    if (el) el.textContent = fmtExerciseMins(value);
    _updateSliderFill(document.getElementById('exercise-slider'), Math.min(1, (value - 5) / 85));
  } else {
    data[today].wellness_sleep = value;
    const el = document.getElementById('sleep-val');
    if (el) el.textContent = `${value}h`;
    _updateSliderFill(document.getElementById('sleep-slider'), value / 12);
  }
  saveData(data);
}

function _applySliderLockState(type) {
  const locked  = localStorage.getItem(`${type}_locked`) === getToday();
  const card    = document.getElementById(`${type}-slider-card`);
  const slider  = document.getElementById(`${type}-slider`);
  const lockBtn = document.getElementById(`${type}-lock-btn`);
  if (!card || !slider || !lockBtn) return;
  if (locked) {
    card.classList.add('locked');
    slider.disabled = true;
    lockBtn.classList.add('locked');
    lockBtn.setAttribute('data-tip', 'Unlock');
  } else {
    card.classList.remove('locked');
    slider.disabled = false;
    lockBtn.classList.remove('locked');
    lockBtn.setAttribute('data-tip', 'Finish');
  }
}

function toggleSliderInfo(id) {
  const box = document.getElementById(id);
  if (!box) return;
  // Close any other open info boxes first
  document.querySelectorAll('.slider-info-box.open').forEach(b => {
    if (b.id !== id) b.classList.remove('open');
  });
  box.classList.toggle('open');
}

function toggleWellnessLock(type) {
  const wasLocked = localStorage.getItem(`${type}_locked`) === getToday();
  localStorage.setItem(`${type}_locked`, wasLocked ? 'false' : getToday());
  _applySliderLockState(type);
}

function onLockedSliderClick(type, slider) {
  if (!slider.disabled) return;
  // Locked — flash red briefly
  const card = document.getElementById(`${type}-slider-card`);
  if (!card) return;
  card.classList.add('lock-denied');
  setTimeout(() => card.classList.remove('lock-denied'), 600);
}

function openExerciseInput() {
  const valEl = document.getElementById('exercise-val');
  if (!valEl) return;
  const data = loadData();
  const today = getToday();
  const current = (data[today] || {}).wellness_exercise || '';
  valEl.style.textDecoration = 'none';
  valEl.onclick = null;
  valEl.innerHTML = `<input id="ex-manual-inp"
    type="number" min="5" max="1440" step="5"
    value="${current || ''}"
    placeholder="min"
    style="width:58px;background:#111;border:1.5px solid #f59e0b;border-radius:7px;color:#f59e0b;font-size:0.85rem;font-weight:700;text-align:center;padding:3px 4px;-moz-appearance:textfield;appearance:textfield;"
  />`;
  const inp = document.getElementById('ex-manual-inp');
  if (inp) {
    inp.focus();
    inp.select();
    inp.addEventListener('blur', () => saveExerciseManual(inp.value));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
  }
}

function saveExerciseManual(rawVal) {
  const mins = parseInt(rawVal, 10);
  const valEl = document.getElementById('exercise-val');
  if (isNaN(mins) || mins < 1) {
    // cancelled — just restore display
    renderWellnessSliders();
    return;
  }
  const value = Math.min(600, Math.max(5, mins));
  const data = loadData();
  const today = getToday();
  if (!data[today]) data[today] = {};
  data[today].wellness_exercise = value;
  saveData(data);
  // Restore val display
  if (valEl) {
    valEl.innerHTML = '';
    valEl.textContent = fmtExerciseMins(value);
    valEl.style.cursor = 'pointer';
    valEl.style.textDecoration = 'underline dotted';
    valEl.onclick = openExerciseInput;
  }
  // Snap slider to its range
  const slider = document.getElementById('exercise-slider');
  if (slider) {
    slider.value = Math.min(90, value);
    _updateSliderFill(slider, Math.min(1, (Math.min(value, 90) - 5) / 85));
  }
}

// ── WELLNESS CHARTS ───────────────────────────────────────

let _wellnessWeekOffset = 0; // 0 = this week, 1 = last week, 2 = two weeks ago, …

function wellnessWeekPrev() { _wellnessWeekOffset++; renderWellnessCharts(); }
function wellnessWeekNext() { if (_wellnessWeekOffset > 0) { _wellnessWeekOffset--; renderWellnessCharts(); } }

function renderWellnessCharts() {
  const container = document.getElementById('wellness-charts');
  if (!container) return;
  const data  = loadData();
  const today = getToday();

  // Build the 7-day window for the current week offset (oldest → newest)
  const days = [];
  const hi = _wellnessWeekOffset * 7;        // days-ago for the newest day in the window
  for (let i = hi + 6; i >= hi; i--) {
    const d = new Date(today + 'T12:00:00');
    d.setDate(d.getDate() - i);
    const y  = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key   = `${y}-${mo}-${dd}`;
    const label = d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2); // Mo Tu We…
    days.push({ key, label, dayData: data[key] || {} });
  }

  // Week label
  const endDate   = new Date(today + 'T12:00:00');
  endDate.setDate(endDate.getDate() - hi);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);
  const dateRange =
    startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' – ' +
    endDate.toLocaleDateString('en-US',   { month: 'short', day: 'numeric' });
  let weekLabel;
  if (_wellnessWeekOffset === 0)      weekLabel = 'This Week';
  else if (_wellnessWeekOffset === 1) weekLabel = 'Last Week';
  else weekLabel = dateRange;

  const canGoForward = _wellnessWeekOffset > 0;
  const navHtml = `
    <div class="wc-week-nav">
      <button class="wc-week-btn" onclick="wellnessWeekPrev()">‹</button>
      <div class="wc-week-center">
        <span class="wc-week-label">Week</span>
        <span class="wc-week-range">${dateRange}</span>
      </div>
      <button class="wc-week-btn" onclick="wellnessWeekNext()" ${canGoForward ? '' : 'disabled'}>›</button>
    </div>`;

  const exValues = days.map(d => d.dayData.wellness_exercise);
  const slValues = days.map(d => d.dayData.wellness_sleep);

  const exOptimal = parseFloat(localStorage.getItem('exerciseOptimalMins')) || null;
  const slOptimal = parseFloat(localStorage.getItem('sleepOptimalHours'))   || null;

  const goalExMins  = parseFloat(localStorage.getItem('goalExerciseMins')) || null;
  const goalSlHours = parseFloat(localStorage.getItem('goalSleepHours'))   || null;
  const exMax = 90;
  const goalExSession = goalExMins ? goalExMins / 5 : exOptimal;

  // Compute trend vs last week (only for current week view)
  function _weekAvg(vals) {
    const def = vals.filter(v => v !== undefined && v !== null);
    return def.length ? def.reduce((a,b) => a+b, 0) / def.length : null;
  }
  function _trendPct(curr, prev) {
    const ca = _weekAvg(curr), pa = _weekAvg(prev);
    if (ca === null || pa === null || pa === 0) return null;
    return ((ca - pa) / pa) * 100;
  }
  let exTrend = null, slTrend = null;
  if (_wellnessWeekOffset === 0) {
    const lastWeekEx = [], lastWeekSl = [];
    for (let i = 13; i >= 7; i--) {
      const d = new Date(today + 'T12:00:00');
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dd = data[key] || {};
      lastWeekEx.push(dd.wellness_exercise);
      lastWeekSl.push(dd.wellness_sleep);
    }
    exTrend = _trendPct(exValues, lastWeekEx);
    slTrend = _trendPct(slValues, lastWeekSl);
  }

  container.innerHTML = navHtml +
    _buildWellnessChart('Exercise', '🏃', exValues, days, exMax, fmtExerciseMins, '#c96820', today, goalExSession, exTrend) +
    _buildWellnessChart('Sleep',    '😴', slValues, days, 12,    v => `${v}h`,    '#1a52a8', today, goalSlHours,   slTrend);
}

function _buildWellnessChart(title, emoji, values, days, maxVal, fmt, color, todayKey, goalLine, trendPct) {
  const defined  = values.filter(v => v !== undefined && v !== null);
  const avg      = defined.length ? (defined.reduce((a, b) => a + b, 0) / defined.length) : null;
  const avgLabel = avg !== null ? fmt(Math.round(avg * 10) / 10) : '—';

  const bars = days.map((d, i) => {
    const v = values[i];
    const hasPct = v !== undefined && v !== null;
    const pct = hasPct ? Math.round((v / maxVal) * 100) : 0;
    const isToday = todayKey ? d.key === todayKey : d.key === days[days.length - 1].key;
    return `
      <div class="wc-bar-col">
        <div class="wc-bar-wrap">
          <div class="wc-bar ${hasPct ? '' : 'empty'} ${isToday ? 'today' : ''}"
               style="height:${pct}%;background:${color};"
               title="${hasPct ? fmt(v) : 'No data'}"></div>
        </div>
        <div class="wc-bar-label ${isToday ? 'today' : ''}">${d.label}</div>
      </div>`;
  }).join('');

  // Horizontal dotted grid lines — max (top) and average
  const maxLine = `
    <div class="wc-grid-line" style="top:0">
      <span class="wc-grid-label">max</span>
    </div>`;

  const avgPct = avg !== null ? ((avg / maxVal) * 100).toFixed(1) : null;
  const avgLine = avgPct !== null ? `
    <div class="wc-grid-line wc-grid-avg" style="bottom:${avgPct}%">
      <span class="wc-grid-label">avg · ${fmt(Math.round(avg * 10) / 10)}</span>
    </div>` : '';

  const goalLineHtml = (goalLine !== null && goalLine !== undefined && goalLine > 0 && goalLine <= maxVal) ? `
    <div class="wc-goal-line" style="bottom:${((goalLine / maxVal) * 100).toFixed(1)}%">
      <span class="wc-goal-label">Goal · ${fmt(goalLine)}</span>
    </div>` : '';

  return `
    <div class="wellness-chart-card">
      <div class="wc-header">
        <div class="wc-title"><span class="wc-emoji">${emoji}</span>${title}</div>
        <div class="wc-avg">7-day avg <strong>${avgLabel}</strong></div>
        ${trendPct > 5 ? `<span class="wc-trend up">↑ ${Math.round(trendPct)}%</span>` : trendPct < -5 ? `<span class="wc-trend down">↓ ${Math.round(Math.abs(trendPct))}%</span>` : ''}
      </div>
      <div class="wc-bars-wrap">
        <div class="wc-bars">${bars}</div>
        ${maxLine}
        ${avgLine}
        ${goalLineHtml}
      </div>
    </div>`;
}

// ── DRAG & DROP ──────────────────────────────────────────
function initDragAndDrop() {
  const list = document.getElementById('habit-list');
  if (!list) return;

  let dragEl = null;
  let touchClone = null;

  // ── Desktop drag ──
  list.addEventListener('dragstart', e => {
    dragEl = e.target.closest('.habit-card');
    if (!dragEl) return;
    e.dataTransfer.effectAllowed = 'move';
    // Delay so browser captures element before we style it
    setTimeout(() => {
      dragEl.classList.add('dragging');
      list.classList.add('is-dragging');
    }, 0);
  });

  list.addEventListener('dragover', e => {
    e.preventDefault();
    const over = e.target.closest('.habit-card');
    if (!over || over === dragEl) return;
    const rect = over.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      list.insertBefore(dragEl, over);
    } else {
      list.insertBefore(dragEl, over.nextSibling);
    }
  });

  list.addEventListener('dragend', () => {
    if (!dragEl) return;
    dragEl.classList.remove('dragging');
    list.classList.remove('is-dragging');
    saveHabitOrder();
    dragEl = null;
  });

  // ── Touch drag (mobile) ──
  list.addEventListener('touchstart', e => {
    const handle = e.target.closest('.drag-handle');
    if (!handle) return;
    dragEl = handle.closest('.habit-card');
    const rect = dragEl.getBoundingClientRect();
    touchClone = dragEl.cloneNode(true);
    touchClone.style.cssText = `
      position: fixed; left: ${rect.left}px; top: ${rect.top}px;
      width: ${rect.width}px; opacity: 0.85; pointer-events: none;
      z-index: 999; border-radius: 14px; background: #2a1a00;
      border: 1.5px solid #f59e0b;
    `;
    document.body.appendChild(touchClone);
    dragEl.style.opacity = '0.3';
  }, { passive: true });

  list.addEventListener('touchmove', e => {
    if (!dragEl || !touchClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchClone.style.top = (touch.clientY - dragEl.offsetHeight / 2) + 'px';

    const cards = [...list.querySelectorAll('.habit-card')].filter(c => c !== dragEl);
    const over = cards.find(c => {
      const r = c.getBoundingClientRect();
      return touch.clientY >= r.top && touch.clientY <= r.bottom;
    });
    if (over) {
      const r = over.getBoundingClientRect();
      if (touch.clientY < r.top + r.height / 2) {
        list.insertBefore(dragEl, over);
      } else {
        list.insertBefore(dragEl, over.nextSibling);
      }
    }
  }, { passive: false });

  list.addEventListener('touchend', () => {
    if (!dragEl) return;
    dragEl.style.opacity = '';
    if (touchClone) { touchClone.remove(); touchClone = null; }
    saveHabitOrder();
    dragEl = null;
  }, { passive: true });
}

// ── PROGRESS ─────────────────────────────────────────────
let viewYear  = new Date().getFullYear();
let viewMonth = new Date().getMonth();

// Nature photos — curated list, rotates daily
const NATURE_PHOTOS = [
  'photo-1506905489-9ba3d02c0b37', // mountain lake reflection
  'photo-1469474968028-56623f02e42e', // forest path sunlight
  'photo-1447752875215-b2761acb3c5d', // misty forest
  'photo-1501854140801-50d01698950b', // mountain landscape
  'photo-1439853672-1e736eda7c9b', // snow mountain
  'photo-1476673160081-cf065607f449', // lake mountain blue
  'photo-1500534314209-a25ddb2bd429', // forest walk trail
  'photo-1518495973542-4542c06a5843', // sunlight through trees
  'photo-1504701954957-2010ec3bcec1', // ocean waves rocks
  'photo-1433086966358-54859d0ed716', // waterfall forest
  'photo-1507003211169-0a1dd7228f2d', // mountain sunrise
  'photo-1464822759023-fed622ff2c3b', // green mountain valley
  'photo-1511884642898-4c92249e20b6', // misty mountains
  'photo-1465146344425-f00d5f5c8f07', // green meadow mountains
  'photo-1486870591958-9b9d0d1dda99', // winter mountain peaks
  'photo-1490750967868-88df5691cc51', // cherry blossoms nature
  'photo-1470770903676-69b98201ea1c', // lake cabin forest
  'photo-1448375240586-882707db888b', // dense forest green
  'photo-1505118380757-91f5f5632de0', // road through forest
  'photo-1419242902214-272b3f66ee7a', // night sky stars mountain
  'photo-1532274402911-5a369e4c4bb5', // autumn lake reflection
  'photo-1507525428034-b723cf961d3e', // tropical beach clear water
  'photo-1455156218388-5e61b526818b', // desert sand dunes
  'photo-1497449493050-aad1e7cad165', // canyon rocks golden
  'photo-1559827260-dc66d52bef19', // ocean cliff sunset
  'photo-1501630834273-4b5604d2ee31', // snowy pine trees
  'photo-1441974231531-c6227db76b6e', // forest light rays
  'photo-1475924156734-496f6cac6ec1', // green rolling hills
  'photo-1490730141103-6cac27aaab94', // sunrise over mountains
  'photo-1519681393784-d120267933ba', // mountain snow storm
];

function setProgressBg() {
  const bg = document.getElementById('progress-bg');
  if (!bg) return;
  const day = getDayNumber();
  const photoId = NATURE_PHOTOS[((( day + 1) % NATURE_PHOTOS.length) + NATURE_PHOTOS.length) % NATURE_PHOTOS.length];
  bg.style.backgroundImage = `url(https://images.unsplash.com/${photoId}?w=1200&q=75&auto=format&fit=crop)`;
}

function renderProgress() {
  const data = loadData();

  setProgressBg();

  const el = document.getElementById('progress-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const grid = document.getElementById('streak-grid');
  if (grid) {
    const habitCards = getOrderedHabits().map(h => {
      const s = getStreak(h.id, data);
      return `
        <div class="streak-card">
          <div class="streak-card-emoji">${h.emoji}</div>
          <div class="streak-card-name">${h.name}</div>
          <div class="streak-card-fire-row">
            <span class="streak-card-count">${s}</span>
            <span class="streak-fire">🔥</span>
          </div>
          <div class="streak-card-label">day streak</div>
          ${getBestStreak(h.id) > 0 ? `<div class="streak-best-label">🏆 best: ${getBestStreak(h.id)}d</div>` : ''}
        </div>`;
    }).join('');
    const gratStreak = getGratitudeStreak();
    const gratCard = `
      <div class="streak-card streak-card-gratitude">
        <div class="streak-card-emoji">🙏</div>
        <div class="streak-card-name">Gratitude</div>
        <div class="streak-card-fire-row">
          <span class="streak-card-count">${gratStreak}</span>
          <span class="streak-fire">🔥</span>
        </div>
        <div class="streak-card-label">day streak</div>
      </div>`;
    const bestScore = _getBestWeekScore();
    const maxPossible = getHabits().length * 7;
    const bestWeekCard = `
      <div class="streak-card streak-card-bestweek">
        <div class="streak-card-emoji">🏆</div>
        <div class="streak-card-name">Best Week</div>
        <div class="streak-card-fire-row">
          <span class="streak-card-count">${bestScore}</span>
          <span class="streak-fire" style="font-size:0.75rem;color:#888">/${maxPossible}</span>
        </div>
        <div class="streak-card-label">habits done</div>
      </div>`;
    grid.innerHTML = habitCards + gratCard + bestWeekCard;
  }

  const legend = document.getElementById('legend');
  if (legend) {
    legend.innerHTML = getOrderedHabits().map(h => `
      <div class="legend-item">
        <div class="legend-dot" style="background:${h.color}"></div>
        <span>${h.name}</span>
      </div>`).join('');
  }

  updateCalHeader();
  renderCalendar(data);
  renderHistory();
  renderWellnessCharts();
  _renderPastEntries();

  document.getElementById('prev-month').onclick = () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderProgress();
  };
  document.getElementById('next-month').onclick = () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderProgress();
  };
}

function renderHistory() {
  const habitData = loadData();
  const journals  = JSON.parse(localStorage.getItem('grateful') || '{}');
  const today     = getToday();

  const container = document.getElementById('history-list');
  if (!container) return;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa']
    .map(d => `<div class="flame-day-header">${d}</div>`).join('');

  // Empty spacer cells before the 1st
  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="flame-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday  = dateStr === today;
    const isFuture = dateStr > today;

    const dayHabits      = habitData[dateStr] || {};
    const dayJournal     = journals[dateStr]  || {};
    const habitsCompleted = getHabits().filter(h => dayHabits[h.id]).length;
    const gratitudeDone   = [1,2,3].filter(n => dayJournal[`s${n}`]).length;
    const hasActivity     = habitsCompleted > 0 || gratitudeDone > 0;
    const isPerfect       = habitsCompleted === getHabits().length && gratitudeDone === 3;

    let cls = 'flame-cell';
    if (isFuture)       cls += ' future';
    else if (isPerfect) cls += ' perfect';
    else if (hasActivity) cls += ' active';
    else                cls += ' no-data';
    if (isToday) cls += ' today';

    const score = habitsCompleted + gratitudeDone;
    cells += `
      <div class="${cls}">
        <span class="flame-cell-fire">🔥</span>
        ${hasActivity ? `<span class="flame-cell-score">${score}</span>` : ''}
      </div>`;
  }

  container.innerHTML = `
    <div class="flame-grid-headers">${dayHeaders}</div>
    <div class="flame-grid">${cells}</div>
  `;
}

function updateCalHeader() {
  const monthLabel = document.getElementById('month-label');
  if (!monthLabel) return;
  monthLabel.textContent = new Date(viewYear, viewMonth)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function renderCalendar(data) {
  renderMonthlyCalendar(data);
}

function renderWeeklyCalendar(data) {
  const cal = document.getElementById('calendar');
  if (!cal) return;
  const today = getToday();
  const now = new Date();
  const wStart = new Date(now);
  wStart.setDate(now.getDate() - now.getDay() + viewWeekOffset * 7);
  wStart.setHours(0,0,0,0);

  const allCells = Array.from({length: 7}, (_, i) => {
    const d = new Date(wStart);
    d.setDate(wStart.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const isToday = dateStr === today;
    const isFuture = dateStr > today;
    const dayData = data[dateStr] || {};
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const habits = getOrderedHabits();
    const dots = habits.map(h =>
      `<div class="cal-dot" style="background:${dayData[h.id] && !isFuture ? h.color : '#2a2a2a'}"></div>`
    ).join('');
    return `
      <div class="cal-cell weekly-cell${isToday ? ' today' : ''}">
        <div class="weekly-day-name">${dayNames[d.getDay()]}</div>
        <div class="cal-num">${d.getDate()}</div>
        <div class="cal-dots" data-count="${habits.length}">${dots}</div>
      </div>`;
  });
  const row1 = allCells.slice(0, 4).join('');
  const row2 = allCells.slice(4).join('');
  cal.innerHTML = `
    <div class="cal-grid-weekly cal-grid-weekly-4">${row1}</div>
    <div class="cal-grid-weekly cal-grid-weekly-3">${row2}</div>`;
}

function renderMonthlyCalendar(data) {
  const cal = document.getElementById('calendar');
  if (!cal) return;
  const today = getToday();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa']
    .map(d => `<div class="cal-day-header">${d}</div>`).join('');

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-cell"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday = dateStr === today;
    const dayData = data[dateStr] || {};

    const dots = getOrderedHabits().map(h =>
      `<div class="cal-dot" style="background:${dayData[h.id] ? h.color : '#252525'}"></div>`
    ).join('');

    cells += `
      <div class="cal-cell${isToday ? ' today' : ''}">
        <div class="cal-num">${day}</div>
        <div class="cal-dots">${dots}</div>
      </div>`;
  }

  cal.innerHTML = `
    <div class="cal-day-headers">${dayHeaders}</div>
    <div class="cal-grid">${cells}</div>`;
}

// ── JOURNAL / GRATITUDE ───────────────────────────────────

function renderJournal() {
  const today = getToday();
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const entry = journals[today] || { g1: '', g2: '', g3: '', s1: false, s2: false, s3: false };

  const dateEl = document.getElementById('journal-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  // Mood tracker
  const savedMood = entry.mood || null;
  const moodEl = document.getElementById('mood-tracker');
  if (moodEl) {
    const moods = ['😢','😕','😐','🙂','😄'];
    moodEl.innerHTML = `<div class="mood-label">How's your mood today?</div><div class="mood-options">${moods.map((e,i)=>`<button class="mood-btn${savedMood===i+1?' selected':''}" onclick="saveMood(${i+1})">${e}</button>`).join('')}</div>`;
  }
  _renderPastEntries();

  const q = getDailyQuote();
  const qText = document.getElementById('quote-text');
  const qAuth = document.getElementById('quote-author');
  if (qText) qText.textContent = q.text;
  if (qAuth) qAuth.textContent = '— ' + q.author;

  // Gratitude health science quote (below the grateful list)
  const gq = getDailyGratitudeQuote();
  const gscText = document.getElementById('gsc-text');
  const gscAuth = document.getElementById('gsc-author');
  if (gscText) gscText.textContent = gq.text;
  if (gscAuth) gscAuth.textContent = '— ' + gq.author;

  [1, 2, 3].forEach(n => {
    const textarea = document.getElementById(`grateful-${n}`);
    const doneText = document.getElementById(`gdone-${n}`);
    const item = document.getElementById(`gitem-${n}`);
    const text = entry[`g${n}`] || '';
    const submitted = entry[`s${n}`] || false;

    if (textarea) textarea.value = text;
    if (doneText) doneText.textContent = 'completed';

    if (submitted && text) {
      item?.classList.add('done');
    } else {
      item?.classList.remove('done');
    }

    // Keep draft in memory while typing — only save on checkmark
    if (textarea && !submitted) {
      // Restore any in-progress draft
      if (_gratefulDrafts[n] !== undefined) textarea.value = _gratefulDrafts[n];
      textarea.oninput = () => { _gratefulDrafts[n] = textarea.value; };
      textarea.onkeydown = null;
      textarea.onblur = null;
    }
  });

  updateJournalNavTab(journals[today]);
}

const _gratefulSubmitTimes = {};
const _gratefulDrafts = {}; // in-memory drafts, cleared on submit
function submitGrateful(n) {
  const now = Date.now();
  const today = getToday();
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  if (!journals[today]) journals[today] = { g1: '', g2: '', g3: '', s1: false, s2: false, s3: false };

  const item = document.getElementById(`gitem-${n}`);
  const textarea = document.getElementById(`grateful-${n}`);
  const doneText = document.getElementById(`gdone-${n}`);
  const isAlreadyDone = item?.classList.contains('done');

  if (isAlreadyDone) {
    // Open for inline editing — checkmark button stays gold, only re-tapping saves
    if (now - (_gratefulSubmitTimes[n] || 0) < 400) return;
    item?.classList.remove('done');
    // Wire up input tracking; do NOT auto-save on blur (only save on checkmark tap)
    if (textarea) {
      textarea.onblur = null;
      textarea.oninput = () => { _gratefulDrafts[n] = textarea.value; };
      textarea.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); submitGrateful(n); }
      };
    }
    return;
  }

  const text = (textarea?.value || _gratefulDrafts[n] || '').trim();
  if (!text) return;
  _gratefulSubmitTimes[n] = now;
  delete _gratefulDrafts[n];
  journals[today][`g${n}`] = text;
  journals[today][`s${n}`] = true;
  if (doneText) doneText.textContent = 'completed';
  item?.classList.add('done');
  const gCheckBtn = document.getElementById('gcheck-' + n);
  if (gCheckBtn) awardTokens(1, gCheckBtn);

  localStorage.setItem('grateful', JSON.stringify(journals));
  queueSync();
  updateJournalNavTab(journals[today]);
}

function updateJournalNavTab(entry) {
  const journalBtn = document.getElementById('nav-2');
  if (!journalBtn) return;
  const allDone = entry && entry.s1 && entry.s2 && entry.s3;
  journalBtn.classList.toggle('completed', !!allDone);
}

function updateHabitsNavTab() {
  const habitsBtn = document.getElementById('nav-1');
  if (!habitsBtn) return;
  const habits = getHabits();
  if (!habits.length) { habitsBtn.classList.remove('completed'); return; }
  const today = getToday();
  const todayData = loadData()[today] || {};
  const allDone = habits.every(h => !!todayData[h.id]);
  habitsBtn.classList.toggle('completed', allDone);
}

// ── FRIENDS ───────────────────────────────────────────────

function renderManageFriendsSection(myData) {
  const friends = myData.friends || [];
  const mode = localStorage.getItem('habitSharingMode') || 'friends';

  const friendRows = friends.length === 0
    ? '<div class="mf-empty">No friends yet. Add one below!</div>'
    : friends.map(uid => `
        <div class="mf-friend-row" id="mf-row-${uid}">
          <span class="mf-friend-name" id="mf-name-${uid}">Loading…</span>
          <button class="mf-remove-btn" onclick="removeFriend('${uid}')">➖</button>
        </div>`).join('');

  // Load friend names asynchronously
  if (friends.length > 0 && _fbDb) {
    friends.forEach(uid => {
      _fbDb.collection('users').doc(uid).get().then(doc => {
        const el = document.getElementById('mf-name-' + uid);
        if (el) el.textContent = doc.exists ? (doc.data().displayName || 'Unknown') : 'Unknown';
      }).catch(() => {});
    });
  }

  return `
    <div class="manage-friends-card">
      <div class="mf-header" onclick="this.closest('.manage-friends-card').classList.toggle('open')">
        <span>👥 Manage Friends</span>
        <span class="mf-toggle-arrow">▾</span>
      </div>
      <div class="mf-body">
        <div class="mf-section-title">My Friends</div>
        <div class="mf-friends-list">${friendRows}</div>

        <div class="mf-section-title" style="margin-top:14px">Add Friend</div>
        <div class="mf-add-row">
          <input type="text" id="mf-username-input" class="mf-username-input" placeholder="Enter username..." autocomplete="off"/>
          <button class="mf-add-btn" onclick="addFriendByUsername()">Add</button>
        </div>
        <div class="mf-add-status" id="mf-add-status"></div>

        <div class="mf-section-title" style="margin-top:14px">Who sees my habits?</div>
        <div class="mf-sharing-btns">
          <button class="mf-share-btn${mode === 'private' ? ' active' : ''}" onclick="setHabitSharingMode('private')">🔒 Only Me</button>
          <button class="mf-share-btn${mode === 'friends' ? ' active' : ''}" onclick="setHabitSharingMode('friends')">👥 Friends</button>
          <button class="mf-share-btn${mode === 'everyone' ? ' active' : ''}" onclick="setHabitSharingMode('everyone')">🌍 Everyone</button>
        </div>
        <div class="mf-share-hint" id="mf-share-hint">${
          mode === 'private' ? 'Your habits are hidden from everyone.' :
          mode === 'friends' ? 'Your friends can see your habits.' :
          'Anyone with your profile can see your habits.'
        }</div>
      </div>
    </div>`;
}

function setHabitSharingMode(mode) {
  localStorage.setItem('habitSharingMode', mode);
  if (_currentUser && _fbDb) {
    _fbDb.collection('users').doc(_currentUser.uid).update({ habitSharingMode: mode }).catch(() => {});
  }
  // Update button states without full re-render
  document.querySelectorAll('.mf-share-btn').forEach(btn => btn.classList.remove('active'));
  const labels = { private: '🔒 Only Me', friends: '👥 Friends', everyone: '🌍 Everyone' };
  document.querySelectorAll('.mf-share-btn').forEach(btn => {
    if (btn.textContent === labels[mode]) btn.classList.add('active');
  });
  const hint = document.getElementById('mf-share-hint');
  if (hint) hint.textContent =
    mode === 'private' ? 'Your habits are hidden from everyone.' :
    mode === 'friends' ? 'Your friends can see your habits.' :
    'Anyone with your profile can see your habits.';
}

async function addFriendByUsername() {
  const input = document.getElementById('mf-username-input') || document.getElementById('add-friend-input');
  const status = document.getElementById('mf-add-status') || document.getElementById('add-friend-status');
  if (!input || !_fbDb || !_currentUser) return;
  const query = input.value.trim();
  if (!query) return;
  if (status) { status.className = 'mf-add-status'; status.textContent = 'Searching…'; }

  try {
    // Search by username exact match first, then displayName prefix
    const [byUsername, byDisplayName] = await Promise.all([
      _fbDb.collection('users').where('username', '==', query.toLowerCase()).limit(5).get(),
      _fbDb.collection('users').where('displayName', '>=', query).where('displayName', '<=', query + '\uf8ff').limit(5).get()
    ]);

    const seen = new Set();
    const results = [];
    [...byUsername.docs, ...byDisplayName.docs].forEach(doc => {
      if (!seen.has(doc.id) && doc.id !== _currentUser.uid) {
        seen.add(doc.id);
        results.push({ uid: doc.id, data: doc.data() });
      }
    });

    if (results.length === 0) {
      if (status) { status.className = 'mf-add-status err'; status.textContent = 'No users found'; }
      return;
    }

    if (results.length === 1) {
      // Auto-add single result
      const { uid, data } = results[0];
      const myData = await _fbDb.collection('users').doc(_currentUser.uid).get();
      const myFriends = myData.data()?.friends || [];
      if (myFriends.includes(uid)) {
        if (status) { status.className = 'mf-add-status err'; status.textContent = 'Already friends!'; }
        return;
      }
      await _fbDb.collection('users').doc(_currentUser.uid).update({
        friends: firebase.firestore.FieldValue.arrayUnion(uid)
      });
      if (status) { status.className = 'mf-add-status ok'; status.textContent = `✓ Added ${data.displayName || uid}`; }
      input.value = '';
      setTimeout(() => renderFriends(), 800);
    } else {
      // Show picker for multiple results
      if (status) { status.className = 'mf-add-status'; status.textContent = ''; }
      const picker = document.createElement('div');
      picker.className = 'friend-search-results';
      picker.innerHTML = results.map(r => `
        <button class="fsr-item" onclick="(async function(){
          await _fbDb.collection('users').doc('${_currentUser.uid}').update({friends:firebase.firestore.FieldValue.arrayUnion('${r.uid}')});
          document.querySelector('.friend-search-results')?.remove();
          if(document.getElementById('add-friend-status'))document.getElementById('add-friend-status').textContent='✓ Added!';
          setTimeout(()=>renderFriends(),600);
        })()">
          <span class="fsr-avatar">${(r.data.displayName||'?').charAt(0).toUpperCase()}</span>
          <span class="fsr-name">${r.data.displayName || r.uid}</span>
          ${r.data.username ? `<span class="fsr-handle">@${r.data.username}</span>` : ''}
        </button>`).join('');
      const inputParent = input.parentNode;
      document.querySelector('.friend-search-results')?.remove();
      inputParent.after(picker);
    }
  } catch(e) {
    if (status) { status.className = 'mf-add-status err'; status.textContent = 'Search failed'; }
    console.warn('Friend search error:', e);
  }
}

function toggleFriendsMenu(btn) {
  const menu = document.getElementById('friends-dropdown');
  if (!menu) return;
  const isOpen = menu.style.display !== 'none';
  menu.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.classList.toggle('fdm-open', !isOpen);
}

function openAddFriendPanel() {
  // Open the manage friends section if it exists, or scroll to it
  const mfCard = document.querySelector('.manage-friends-card');
  if (mfCard) {
    mfCard.scrollIntoView({ behavior: 'smooth' });
    const input = mfCard.querySelector('.mf-username-input');
    if (input) setTimeout(() => input.focus(), 400);
  } else {
    renderFriends();
  }
}

function toggleFriendsDropdownPanel(panelClass) {
  // Scroll to manage friends or sharing section
  const el = document.querySelector('.' + panelClass) || document.querySelector('.manage-friends-card');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function removeFriend(uid) {
  if (!_fbDb || !_currentUser) return;
  const row = document.getElementById('mf-row-' + uid);
  if (row) row.style.opacity = '0.4';
  try {
    await _fbDb.collection('users').doc(_currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayRemove(uid)
    });
    if (row) row.remove();
  } catch(e) {
    if (row) row.style.opacity = '1';
  }
}

async function renderFriends() {
  const container = document.getElementById('friends-content');
  if (!container) return;

  if (!_currentUser || !_fbDb) {
    container.innerHTML = `<div class="friends-empty">Sign in to use Friends.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="friends-fire-loading">
      <div class="friends-fire-bubble">
        <div class="friends-fire-text">Finding Fire Friends</div>
        <div class="friends-fire-dots">
          <span class="ffire-dot">🔥</span><span class="ffire-dot">🔥</span><span class="ffire-dot">🔥</span>
        </div>
      </div>
    </div>`;

  try {
    const today = getToday();

    // Fetch my doc + groups in parallel
    const [myDoc, groupSnap] = await Promise.all([
      _fbDb.collection('users').doc(_currentUser.uid).get(),
      _fbDb.collection('groups').where('members', 'array-contains', _currentUser.uid).get().catch(() => null)
    ]);

    const myData = myDoc.exists ? myDoc.data() : {};
    const friends = myData.friends || [];
    const showDemo = friends.length === 0;

    // Collect all unique UIDs to fetch (friends + group members) in one parallel batch
    const groupMemberMap = {}; // groupId -> memberUids[]
    const allUids = new Set(friends);
    if (groupSnap && !groupSnap.empty) {
      groupSnap.docs.forEach(doc => {
        const members = (doc.data().members || []).filter(uid => uid !== _currentUser.uid);
        groupMemberMap[doc.id] = { name: doc.data().name, members };
        members.forEach(uid => allUids.add(uid));
      });
    }

    // Fetch all user docs in parallel — single round trip
    const uidList = [...allUids];
    const fetchedDocs = await Promise.all(
      uidList.map(uid => _fbDb.collection('users').doc(uid).get().catch(() => null))
    );
    const userDataMap = {};
    uidList.forEach((uid, i) => {
      if (fetchedDocs[i] && fetchedDocs[i].exists) userDataMap[uid] = fetchedDocs[i].data();
    });

    // Build bubble items — favorites first, all shown, horizontally scrollable
    const favs = getFavorites();
    const sortedFriendUids = showDemo ? [] : [...friends].sort((a, b) => {
      return (favs.includes(a) ? 0 : 1) - (favs.includes(b) ? 0 : 1);
    });
    const bubbleItems = [];
    if (showDemo) {
      bubbleItems.push(`<div class="friend-bubble-wrap"><div class="friend-bubble" style="background:#444;color:#fff">C</div><div class="friend-bubble-name">Computer</div></div>`);
    } else {
      sortedFriendUids.forEach(uid => {
        const fd = userDataMap[uid];
        if (!fd) return;
        const name = fd.displayName || fd.email || uid;
        const initial = name.charAt(0).toUpperCase();
        const isFav = favs.includes(uid);
        const avatarInner = fd.photoDataUrl
          ? `<img src="${fd.photoDataUrl}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
          : initial;
        const safeUid = uid.replace(/'/g, "\\'");
        const safeName = name.replace(/'/g, "\\'");
        const safePhoto = (fd.photoDataUrl || '').replace(/'/g, "\\'");
        const safeBio = (fd.bio || '').replace(/'/g, "\\'");
        bubbleItems.push(`<div class="friend-bubble-wrap${isFav ? ' fav-bubble' : ''}" onclick="openFriendModal('${safeUid}','${safeName}','${safePhoto}','${safeBio}')" style="cursor:pointer"><div class="friend-bubble">${avatarInner}</div><div class="friend-bubble-name">${name.split(' ')[0]}</div></div>`);
      });
    }
    let html = renderManageFriendsSection(myData) + `
      <div class="friends-row-wrap">
        <div class="friends-row" id="friends-bubbles-row">
          ${bubbleItems.join('')}
        </div>
      </div>`;

    const friendDataArr = [];

    if (showDemo) {
      const demoHabits = HABITS;
      const demoToday = { wake: true, clean: true, shower: false, teeth: true, workout: false };
      const demoCompleted = demoHabits.filter(h => !!demoToday[h.id]).length;
      const demoPct = Math.round((demoCompleted / demoHabits.length) * 100);
      html += `<div class="friends-list" id="friends-list"><div class="friend-card"><div class="fcard-header"><div class="friend-avatar" style="background:#444;color:#fff;overflow:hidden">C</div><div class="fcard-header-info"><div class="fcard-name-row"><div class="friend-name">Computer <span style="font-size:0.7rem;color:#666;font-weight:400">(demo)</span></div></div><div class="fcard-meta"><span class="fcard-meta-dim">Demo account</span></div><div class="fcard-progress-bar-wrap"><div class="fcard-progress-bar" style="width:${demoPct}%"></div></div><div class="fcard-progress-label">${demoCompleted}/${demoHabits.length} habits today</div></div></div></div></div>`;
    }

    if (friends.length > 0) {
      const CARD_PREVIEW = 3;
      const favs = getFavorites();
      const sortedFriends = [...friends].sort((a, b) => {
        const aFav = favs.includes(a) ? 0 : 1;
        const bFav = favs.includes(b) ? 0 : 1;
        return aFav - bFav;
      });
      const friendCards = [];
      sortedFriends.forEach(uid => {
        const fd = userDataMap[uid];
        if (!fd) return;
        friendCards.push(_buildPersonCard(fd, uid, myData, today));
        const fName = fd.displayName || fd.email || uid;
        const fHabits = (fd.customHabits && fd.customHabits.length > 0) ? fd.customHabits : HABITS;
        const fBest = fHabits.length > 0 ? Math.max(0, ...fHabits.map(h => getStreak(h.id, fd.habitData || {}))) : 0;
        friendDataArr.push({ name: fName, photo: fd.photoDataUrl || '', initial: fName.charAt(0).toUpperCase(), bestStreak: fBest });
      });
      const visibleCards = friendCards.slice(0, CARD_PREVIEW).join('');
      const hiddenCards = friendCards.slice(CARD_PREVIEW).join('');
      html += `<div class="friends-list" id="friends-list">${visibleCards}</div>`;
      if (hiddenCards) {
        html += `
          <button class="more-friends-btn" id="more-friends-btn" onclick="toggleMoreFriends()">More Friends ▾</button>
          <div class="more-friends-list hidden" id="more-friends-list">
            <div class="friends-list">${hiddenCards}</div>
          </div>`;
      }
    }

    // Groups
    if (groupSnap && !groupSnap.empty) {
      html += `<div class="friends-groups-label">Groups</div>`;
      groupSnap.docs.forEach((groupDoc, gi) => {
        const { name: gName, members } = groupMemberMap[groupDoc.id];
        const gId = `group-members-${gi}`;
        let membersHtml = '';
        members.forEach(uid => {
          const md = userDataMap[uid];
          if (!md) return;
          membersHtml += _buildPersonCard(md, uid, myData, today);
          const mName = md.displayName || md.email || uid;
          if (!friendDataArr.find(f => f.name === mName)) {
            const mHabits = (md.customHabits && md.customHabits.length > 0) ? md.customHabits : HABITS;
            const mBest = mHabits.length > 0 ? Math.max(0, ...mHabits.map(h => getStreak(h.id, md.habitData || {}))) : 0;
            friendDataArr.push({ name: mName, photo: md.photoDataUrl || '', initial: mName.charAt(0).toUpperCase(), bestStreak: mBest });
          }
        });
        html += `
          <div class="friends-group-header" onclick="toggleGroupMembers('${gId}', this)">
            <span class="group-header-arrow">▶</span>
            <span class="group-header-name">${_escHtml(gName)}</span>
            <span class="group-member-count">${members.length}</span>
          </div>
          <div class="friends-group-members" id="${gId}">
            <div class="friends-list">${membersHtml}</div>
          </div>`;
      });
    }

    // Leaderboard
    if (friendDataArr.length > 0) {
      const ranked = [...friendDataArr].sort((a,b) => b.bestStreak - a.bestStreak);
      const medals = ['🥇','🥈','🥉'];
      const rows = ranked.map((f, i) => `
        <div class="leaderboard-row">
          <span class="leaderboard-rank">${medals[i] || (i+1)}</span>
          <div class="leaderboard-avatar">${f.photo ? `<img src="${f.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : f.initial}</div>
          <span class="leaderboard-name">${f.name}</span>
          <span class="leaderboard-streak">🔥 ${f.bestStreak} days</span>
        </div>`).join('');
      html += `<div class="leaderboard-section"><div class="leaderboard-title">🏆 Streak Leaderboard</div>${rows}</div>`;
    }

    container.innerHTML = html;

    // Auto-expand all groups
    container.querySelectorAll('.friends-group-header').forEach(header => {
      toggleGroupMembers(header.nextElementSibling.id, header);
    });
  } catch(e) {
    console.warn('renderFriends error:', e);
    container.innerHTML = `<div class="friends-empty-inline" style="padding:20px 0;color:#555;">Tap + to invite friends</div>`;
  }
}

// ── Friend Profile Modal ────────────────────────────────────────────────
let _modalUid = null;

function openFriendModal(uid, name, photo, bio) {
  _modalUid = uid;
  const isFav = getFavorites().includes(uid);
  const photoEl = document.getElementById('friend-modal-photo');
  photoEl.innerHTML = photo
    ? `<img src="${photo}" alt="${name}">`
    : `<div class="friend-modal-initial">${name.charAt(0).toUpperCase()}</div>`;
  document.getElementById('friend-modal-name').textContent = name;
  document.getElementById('friend-modal-bio').textContent = bio || 'No bio yet.';
  const favBtn = document.getElementById('friend-modal-fav');
  favBtn.textContent = isFav ? '⭐ Favorited' : '☆ Add to Favorites';
  favBtn.classList.toggle('active', isFav);
  document.getElementById('friend-modal').classList.remove('hidden');
  document.getElementById('friend-modal-backdrop').classList.remove('hidden');
}

function closeFriendModal() {
  document.getElementById('friend-modal').classList.add('hidden');
  document.getElementById('friend-modal-backdrop').classList.add('hidden');
  _modalUid = null;
}

function toggleFavoriteFromModal() {
  if (!_modalUid) return;
  toggleFavorite(_modalUid);
  // Update button state without closing modal
  const isFav = getFavorites().includes(_modalUid);
  const favBtn = document.getElementById('friend-modal-fav');
  favBtn.textContent = isFav ? '⭐ Favorited' : '☆ Add to Favorites';
  favBtn.classList.toggle('active', isFav);
}

function toggleMoreFriends() {
  const list = document.getElementById('more-friends-list');
  const btn = document.getElementById('more-friends-btn');
  if (!list) return;
  const isOpen = !list.classList.contains('hidden');
  if (isOpen) {
    list.classList.add('hidden');
    btn.textContent = 'More Friends ▾';
  } else {
    list.classList.remove('hidden');
    btn.textContent = 'Less ▴';
  }
}

function toggleFriendBubbles() {
  const extra = document.getElementById('friend-bubbles-extra');
  const fade = document.getElementById('friends-row-fade');
  const btn = document.getElementById('friends-more-btn');
  if (!extra) return;
  const isOpen = !extra.classList.contains('hidden');
  if (isOpen) {
    extra.classList.add('hidden');
    if (fade) fade.style.display = '';
    if (btn) btn.textContent = 'More ▾';
  } else {
    extra.classList.remove('hidden');
    if (fade) fade.style.display = 'none';
    if (btn) btn.textContent = 'Less ▴';
  }
}

function toggleGroupMembers(id, headerEl) {
  const el = document.getElementById(id);
  if (!el) return;
  const arrow = headerEl.querySelector('.group-header-arrow');
  const isOpen = el.classList.contains('open');
  if (isOpen) {
    el.style.maxHeight = el.scrollHeight + 'px';
    requestAnimationFrame(() => {
      el.style.maxHeight = '0';
      el.classList.remove('open');
      if (arrow) arrow.classList.remove('open');
    });
  } else {
    el.classList.add('open');
    if (arrow) arrow.classList.add('open');
    el.style.maxHeight = el.scrollHeight + 'px';
    setTimeout(() => { el.style.maxHeight = 'none'; }, 420);
  }
}

function toggleFriendHabits(toggleEl) {
  const card = toggleEl.closest('.friend-card');
  if (!card) return;
  const habitsEl = card.querySelector('.fcard-habits');
  const isOpen = habitsEl.classList.contains('expanded');
  if (isOpen) {
    habitsEl.classList.remove('expanded');
    toggleEl.classList.remove('open');
    const label = toggleEl.querySelector('.fcard-toggle-label');
    if (label) {
      const match = label.textContent.match(/\d+\/\d+/);
      if (match) label.textContent = `${match[0]} habits — tap to expand`;
    }
  } else {
    habitsEl.classList.add('expanded');
    toggleEl.classList.add('open');
    const label = toggleEl.querySelector('.fcard-toggle-label');
    if (label) {
      const match = label.textContent.match(/\d+\/\d+/);
      if (match) label.textContent = `${match[0]} habits`;
    }
  }
}

// ── KUDOS ────────────────────────────────────────────────
async function sendKudos(friendUid, friendName) {
  if (!_currentUser || !_fbDb) return;
  const myName = _currentUser.displayName || _currentUser.email.split('@')[0] || 'Someone';
  const today = getToday();

  // Optimistically update the button right away
  const btn = document.querySelector(`.fcard-kudos-btn[onclick*="${friendUid}"]`);
  if (btn) {
    btn.textContent = '✓ Kudos Sent';
    btn.classList.add('sent');
    btn.disabled = true;
  }

  try {
    // Record that I sent kudos today
    await _fbDb.collection('users').doc(_currentUser.uid).update({
      [`kudosSent.${today}`]: firebase.firestore.FieldValue.arrayUnion(friendUid)
    });
    // Drop a kudos entry into the friend's doc
    await _fbDb.collection('users').doc(friendUid).update({
      kudosReceived: firebase.firestore.FieldValue.arrayUnion({
        from: _currentUser.uid,
        fromName: myName,
        date: today
      })
    });
  } catch(e) {
    console.warn('sendKudos error:', e);
  }
}

// Shared card builder used by both friends list and group members
// ── Favorites ──────────────────────────────────────────────────────────
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('favoriteFriends') || '[]'); }
  catch { return []; }
}
function toggleFavorite(uid) {
  const favs = getFavorites();
  const idx = favs.indexOf(uid);
  if (idx === -1) favs.push(uid);
  else favs.splice(idx, 1);
  localStorage.setItem('favoriteFriends', JSON.stringify(favs));
  if (_currentUser && _fbDb) {
    _fbDb.collection('users').doc(_currentUser.uid).update({ favoriteFriends: favs }).catch(() => {});
  }
  renderFriends();
}

function _buildPersonCard(fd, uid, myData, today) {
  const email = fd.email || uid;
  const name = fd.displayName || email;
  const initial = name.charAt(0).toUpperCase();
  const photo = fd.photoDataUrl
    ? `<img src="${fd.photoDataUrl}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : initial;
  const habits = (fd.customHabits && fd.customHabits.length > 0) ? fd.customHabits : HABITS;
  const todayData = (fd.habitData && fd.habitData[today]) || {};
  // Respect hidden habits setting and habitSharingMode
  const sharingMode = fd.habitSharingMode || 'everyone';
  const myFriendsOfFriend = fd.friends || [];
  const hiddenByMode = sharingMode === 'private' ||
    (sharingMode === 'friends' && _currentUser && !myFriendsOfFriend.includes(_currentUser.uid));
  const habitsHidden = fd.habitsVisible === false || hiddenByMode;
  const completedCount = habitsHidden ? 0 : habits.filter(h => !!todayData[h.id]).length;
  const totalCount = habitsHidden ? 0 : habits.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const bestStreak = habits.length > 0 ? Math.max(0, ...habits.map(h => getStreak(h.id, fd.habitData || {}))) : 0;
  // Gratitude streak for this friend
  const gratStreak = getGratitudeStreak ? (() => {
    const journals = fd.grateful || {};
    const today2 = today;
    let gs = 0;
    const todayParts = today2.split('-');
    let dd = new Date(parseInt(todayParts[0]), parseInt(todayParts[1])-1, parseInt(todayParts[2]));
    for (let i = 0; i < 30; i++) {
      const y = dd.getFullYear(), m = String(dd.getMonth()+1).padStart(2,'0'), day = String(dd.getDate()).padStart(2,'0');
      const key = `${y}-${m}-${day}`;
      if (key === today2) { dd.setDate(dd.getDate()-1); continue; }
      const e = journals[key];
      if (e && e.s1 && e.s2 && e.s3) { gs++; dd.setDate(dd.getDate()-1); } else break;
    }
    const todayEntry = journals[today2];
    if (todayEntry && todayEntry.s1 && todayEntry.s2 && todayEntry.s3) gs++;
    return gs;
  })() : 0;

  const allDone = totalCount > 0 && completedCount === totalCount;
  const sentToday = (myData.kudosSent && myData.kudosSent[today]) || [];
  const alreadySent = sentToday.includes(uid);

  const kudosReceived = (fd.kudosReceived || []).filter(k => k.date === today);

  const safeUid = uid.replace(/'/g, "\\'");
  const safeName = name.replace(/'/g, "\\'");
  const isFav = getFavorites().includes(uid);
  const favBtn = `<button class="fcard-fav-btn${isFav ? ' active' : ''}" onclick="event.stopPropagation();toggleFavorite('${safeUid}')" title="${isFav ? 'Unfavorite' : 'Favorite'}">${isFav ? '⭐' : '☆'}</button>`;
  const kudosBtn = allDone
    ? (alreadySent
        ? `<button class="fcard-kudos-btn sent" disabled>✓ Kudos Sent</button>`
        : `<button class="fcard-kudos-btn" onclick="event.stopPropagation();sendKudos('${safeUid}','${safeName}')">🎉 Kudos</button>`)
    : '';

  const kudosBar = kudosReceived.length > 0
    ? `<div class="fcard-kudos-bar">${kudosReceived.map(k =>
        `<span class="fcard-kudos-pill">🎉 ${k.fromName.split(' ')[0]}</span>`
      ).join('')}</div>`
    : '';

  const safePhoto = (fd.photoDataUrl || '').replace(/'/g, "\\'");
  const safeBio = (fd.bio || '').replace(/'/g, "\\'");

  const openModal = `openFriendModal('${safeUid}','${safeName}','${safePhoto}','${safeBio}')`;
  return `
    <div class="friend-card${allDone ? ' all-done' : ''}${isFav ? ' favorited' : ''}">
      <div class="fcard-header">
        <div class="friend-avatar${allDone ? ' all-done' : ''}" onclick="${openModal}" style="cursor:pointer">${photo}</div>
        <div class="fcard-header-info">
          <div class="fcard-name-row">
            <div class="friend-name" onclick="${openModal}" style="cursor:pointer">${name}</div>
            ${favBtn}${kudosBtn}
          </div>
          <div class="fcard-meta">
            ${bestStreak > 0 ? `<span class="fcard-best-streak">🔥 ${bestStreak} day streak</span>` : '<span class="fcard-meta-dim">No streak yet</span>'}
            ${gratStreak > 0 ? `<span class="fcard-best-streak" style="margin-left:8px;color:#c084fc">📓 ${gratStreak} grateful</span>` : ''}
          </div>
          <div class="fcard-progress-bar-wrap">
            <div class="fcard-progress-bar" style="width:${pct}%"></div>
          </div>
          <div class="fcard-progress-label">${habitsHidden ? '🔒 Habits hidden' : `${completedCount}/${totalCount} habits today`}</div>
        </div>
      </div>
      ${kudosBar}
    </div>`;
}

function shareFriendLink(url) {
  if (navigator.share) {
    navigator.share({
      title: 'Daily Habit Tracker',
      text: 'Track habits with me!',
      url: url,
    }).catch(() => {});
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      const label = document.querySelector('.add-friend-label');
      if (label) { label.textContent = '✓ Copied!'; setTimeout(() => { label.textContent = 'Add Friend'; }, 2000); }
    }).catch(() => {
      prompt('Copy your invite link:', url);
    });
  }
}

// ── SWIPE & SCROLL ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setProgressBg(); // Set background photo immediately for all pages

  const pages = document.getElementById('pages');
  const nav = document.querySelector('.bottom-nav');

  // ── Peek/drag swipe between pages ─────────────────────────────────────────
  // Rules:
  //  1. Vertical scroll ALWAYS wins — more vertical than horizontal = no swipe
  //  2. Full page change: both old page and new page reset scroll to top
  //  3. Snap-back (partial swipe, same page): restore saved scroll position
  //  4. Scroll position per page is saved live and cleared on full page change
  const PAGE_IDS = ['page-progress', 'page-habits', 'page-journal', 'page-friends'];
  const _pageScrollSave = [0, 0, 0, 0];

  let swipeBlocked = false;
  let _swipeDragging = false;
  let _swipeStartX = 0;
  let _swipeStartY = 0;
  let _swipeDirectionLocked = null; // 'h' | 'v' | null

  pages.addEventListener('touchstart', e => {
    swipeBlocked = !!e.target.closest(
      'textarea, input, button, select, .grateful-item, .habit-card, .check-btn, ' +
      '.grateful-check, .emoji-dropdown, .friends-row, .friends-row-wrap, ' +
      '.add-habit-form, .emoji-search-popup, .fit-slider, .fit-range-input'
    ) || document.getElementById('habit-list')?.classList.contains('edit-mode');
    _swipeStartX = e.touches[0].clientX;
    _swipeStartY = e.touches[0].clientY;
    _swipeDragging = false;
    _swipeDirectionLocked = null;
  }, { passive: true });

  pages.addEventListener('touchmove', e => {
    if (swipeBlocked) return;
    const dx = e.touches[0].clientX - _swipeStartX;
    const dy = e.touches[0].clientY - _swipeStartY;

    // Lock scroll direction on first clear movement
    if (!_swipeDirectionLocked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      _swipeDirectionLocked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }

    // Vertical wins — cancel any swipe visual, let native scroll work
    if (_swipeDirectionLocked === 'v') {
      if (_swipeDragging) {
        pages.style.transition = '';
        pages.style.transform = `translateX(${-currentPage * 100}vw)`;
        _swipeDragging = false;
      }
      return;
    }

    if (_swipeDirectionLocked === 'h') {
      e.preventDefault(); // block vertical drift during horizontal swipe
      _swipeDragging = true;
      let dragPct = (dx / window.innerWidth) * 100;
      if (currentPage === 0 && dragPct > 0) dragPct *= 0.18; // rubber-band left edge
      if (currentPage === 3 && dragPct < 0) dragPct *= 0.18; // rubber-band right edge
      pages.style.transition = 'none';
      pages.style.transform = `translateX(calc(${-currentPage * 100}vw + ${dragPct}vw))`;
    }
  }, { passive: false });

  pages.addEventListener('touchend', e => {
    if (swipeBlocked || !_swipeDragging) { _swipeDragging = false; _swipeDirectionLocked = null; return; }
    const dx = e.changedTouches[0].clientX - _swipeStartX;
    pages.style.transition = '';

    if (Math.abs(dx) > 55) {
      // Full page change — preserve scroll positions
      const prevPage = currentPage;
      if (dx < 0 && currentPage < 3) {
        goTo(currentPage + 1);
      } else if (dx > 0 && currentPage > 0) {
        goTo(currentPage - 1);
      } else {
        goTo(currentPage);
      }
    } else {
      // Snap back — restore this page's scroll position exactly where user left it
      goTo(currentPage);
      const pageEl = document.getElementById(PAGE_IDS[currentPage]);
      if (pageEl && _pageScrollSave[currentPage] > 0) {
        requestAnimationFrame(() => { pageEl.scrollTop = _pageScrollSave[currentPage]; });
      }
    }
    _swipeDragging = false;
    _swipeDirectionLocked = null;
  }, { passive: true });

  // Save scroll position live so snap-back can restore it
  PAGE_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('scroll', () => { _pageScrollSave[i] = el.scrollTop; }, { passive: true });
  });

  // Bottom nav always stays visible — never hide on scroll

  // Parallax — bg moves at 7% of scroll speed on all pages
  const progressBg = document.getElementById('progress-bg');
  let _parallaxTicking = false;
  let _parallaxScrollTop = 0;
  ['page-progress', 'page-habits', 'page-journal', 'page-friends'].forEach(id => {
    const page = document.getElementById(id);
    if (page && progressBg) {
      page.addEventListener('scroll', () => {
        _parallaxScrollTop = page.scrollTop;
        if (!_parallaxTicking) {
          _parallaxTicking = true;
          requestAnimationFrame(() => {
            progressBg.style.transform = `translateY(${_parallaxScrollTop * -0.07}px)`;
            _parallaxTicking = false;
          });
        }
      }, { passive: true });
    }
  });

  // Pull-to-refresh for all pages
  const PULL_THRESHOLD = 72;
  window.setupPullToRefresh = function setupPullToRefresh(pageEl, indicatorEl, refreshFn) {
    let pullStartY = 0, pullActive = false, pullDone = false;
    pageEl.addEventListener('touchstart', e => {
      if (pageEl.scrollTop <= 0) {
        pullStartY = e.touches[0].clientY;
        pullActive = true;
        pullDone   = false;
      }
    }, { passive: true });
    pageEl.addEventListener('touchmove', e => {
      if (!pullActive || pullDone) return;
      const dist = e.touches[0].clientY - pullStartY;
      if (dist <= 0) return;
      const pct = Math.min(dist / PULL_THRESHOLD, 1);
      indicatorEl.style.top     = (-56 + pct * 72) + 'px';
      indicatorEl.style.opacity = pct.toFixed(2);
      indicatorEl.classList.toggle('spinning', pct >= 1);
    }, { passive: true });
    pageEl.addEventListener('touchend', e => {
      if (!pullActive) return;
      pullActive = false;
      const dist = e.changedTouches[0].clientY - pullStartY;
      if (dist >= PULL_THRESHOLD) {
        pullDone = true;
        indicatorEl.style.top     = '16px';
        indicatorEl.style.opacity = '1';
        indicatorEl.classList.add('spinning');
        setTimeout(() => {
          refreshFn();
          pageEl.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            indicatorEl.classList.remove('spinning');
            indicatorEl.style.top     = '-56px';
            indicatorEl.style.opacity = '0';
            pullDone = false;
          }, 400);
        }, 1000);
      } else {
        indicatorEl.style.transition = 'top 0.25s ease, opacity 0.25s';
        indicatorEl.style.top        = '-56px';
        indicatorEl.style.opacity    = '0';
        indicatorEl.classList.remove('spinning');
        setTimeout(() => indicatorEl.style.transition = '', 300);
      }
    }, { passive: true });
  }

  ;[
    ['page-progress',  'pull-refresh',         () => renderProgress()],
    ['page-habits',    'pull-refresh-habits',   () => render()],
    ['page-journal',   'pull-refresh-journal',  () => renderJournal()],
    ['page-friends',   'pull-refresh-friends',  () => renderFriends()],
  ].forEach(([pageId, indId, fn]) => {
    const pageEl = document.getElementById(pageId);
    const indEl  = document.getElementById(indId);
    if (pageEl && indEl) setupPullToRefresh(pageEl, indEl, fn);
  });

  // ── Auto-hide top buttons on scroll down ─────────────
  let _lastScrollTop = {};
  document.querySelectorAll('.page, .sch-screen').forEach(page => {
    page.addEventListener('scroll', () => {
      const st = page.scrollTop;
      const prev = _lastScrollTop[page.id] || 0;
      const hamburger = document.getElementById('hamburger-btn');
      const avatar    = document.getElementById('profile-avatar-btn');
      const worldTab = document.getElementById('world-tab');
      if (st > prev && st > 40) {
        hamburger?.classList.add('scrolled-away');
        avatar?.classList.add('scrolled-away');
        worldTab?.classList.add('scrolled-away');
      } else {
        hamburger?.classList.remove('scrolled-away');
        avatar?.classList.remove('scrolled-away');
        worldTab?.classList.remove('scrolled-away');
      }
      _lastScrollTop[page.id] = st;
    }, { passive: true });
  });

  // Close slider info boxes when tapping outside them
  document.addEventListener('click', e => {
    if (!e.target.closest('.slider-info-btn') && !e.target.closest('.slider-info-box')) {
      document.querySelectorAll('.slider-info-box.open').forEach(b => b.classList.remove('open'));
    }
  });

  // ── Network / offline detection ──────────────────────
  window.addEventListener('online', () => {
    _isOnline = true;
    _updateSyncLabel();
    if (_hasPendingSync && _currentUser && _fbDb) {
      syncToCloud();
    }
  });
  window.addEventListener('offline', () => {
    _isOnline = false;
    _updateSyncLabel();
  });

  applyTheme();
  initFirebase();
  goTo(1);

  // Block all text selection except inside textareas/inputs
  document.addEventListener('selectstart', e => {
    if (!e.target.closest('textarea, input')) e.preventDefault();
  });
});

// ── WELLNESS SURVEYS ─────────────────────────────────────

const EXERCISE_SURVEY = {
  key: 'exercise',
  title: 'Exercise Survey',
  emoji: '🏃',
  storageKey: 'exerciseOptimalMins',
  source: 'ACSM Guidelines · Lancet Psychiatry (2018)',
  unit: v => fmtExerciseMins(v),
  questions: [
    {
      q: 'What best describes your fitness background?',
      sub: 'Be honest — there\'s no wrong answer.',
      options: [
        { label: 'Just starting out',                     val: 0 },
        { label: 'Some experience, but inconsistent',     val: 1 },
        { label: 'Regularly active for 1+ years',         val: 2 },
        { label: 'Athletic / advanced training',           val: 3 },
      ]
    },
    {
      q: "What's your main fitness goal?",
      sub: 'Pick the one that matters most right now.',
      options: [
        { label: 'Lose weight / burn fat',          val: 10 },
        { label: 'Build strength & muscle',         val: 5  },
        { label: 'Improve cardio & endurance',      val: 15 },
        { label: 'General health & wellbeing',      val: 0  },
        { label: 'Stress relief / mental health',   val: -5 },
      ]
    },
    {
      q: 'How many days per week do you plan to train?',
      sub: 'More sessions means each can be shorter.',
      options: [
        { label: '1–2 days',   val: 15  },
        { label: '3–4 days',   val: 5   },
        { label: '5–6 days',   val: 0   },
        { label: 'Every day',  val: -10 },
      ]
    },
    {
      q: 'How active is your daily life outside of workouts?',
      sub: 'Think commute, job, chores — not gym time.',
      options: [
        { label: 'Mostly sitting — desk job or student',    val: 8   },
        { label: 'Mix of sitting and moving',               val: 3   },
        { label: 'On my feet most of the day',              val: -5  },
        { label: 'Physical labor / very active job',        val: -12 },
      ]
    },
    {
      q: 'How quickly do you recover after a hard session?',
      sub: 'Recovery drives how long each session should be.',
      options: [
        { label: 'I bounce back fast (under 24 h)',  val: 5   },
        { label: 'About 1–2 days — pretty normal',   val: 0   },
        { label: '2–3 days to feel back to normal',  val: -5  },
        { label: 'Often sore for several days',      val: -10 },
      ]
    },
  ],
  calc(answers) {
    const bases = [20, 32, 43, 55];
    const base  = bases[answers[0]] ?? 35;
    const adj   = answers.slice(1).reduce((s, v) => s + v, 0);
    return Math.round(Math.max(15, Math.min(90, base + adj)) / 5) * 5;
  },
  explain(answers) {
    const lbl = (qi) => {
      const q = this.questions[qi];
      return (q.options.find(o => o.val === answers[qi])?.label || '').toLowerCase();
    };
    const levelPhrases = [
      'just starting out',
      'still building consistency',
      'regularly active for over a year',
      'an experienced athlete'
    ];
    const level   = levelPhrases[answers[0]] ?? 'your current level';
    const goal    = lbl(1) || 'your goals';
    const days    = lbl(2) || 'your schedule';
    const recover = lbl(4) || 'your recovery rate';

    const summary = `Because you're ${level} with a focus on "${goal}", training ${days}, and ${recover.includes('bounce') ? 'recover quickly' : 'need extra recovery time between sessions'} — this target gives your body enough stimulus to progress without accumulating the fatigue that stalls results. Longer isn't always better; matching duration to your recovery capacity is what drives consistent improvement.`;

    const research = [
      { text: 'For general health, the ACSM recommends 150–300 minutes of moderate exercise per week. Your target, applied across your training days, lands right in this zone.', source: 'American College of Sports Medicine (ACSM) Guidelines, 2021' },
      { text: 'A study of 1.2 million people found that exercising 3–5 times per week for 45 minutes delivered the greatest mental health benefit — more sessions or longer duration showed diminishing returns.', source: 'Chekroud et al., The Lancet Psychiatry, 2018' },
      { text: 'Sessions beyond 60–75 minutes significantly elevate cortisol in recreational athletes, which can suppress muscle growth and increase injury risk over time.', source: 'Schoenfeld & Grgic, Strength & Conditioning Journal, 2019' },
    ];
    return { summary, research };
  }
};

const SLEEP_SURVEY = {
  key: 'sleep',
  title: 'Sleep Survey',
  emoji: '😴',
  storageKey: 'sleepOptimalHours',
  source: 'National Sleep Foundation · Mayo Clinic',
  unit: v => `${v}h`,
  questions: [
    {
      q: 'How old are you?',
      sub: 'Sleep needs shift significantly with age.',
      options: [
        { label: 'Under 18',    val: 9.0 },
        { label: '18–25',       val: 8.0 },
        { label: '26–40',       val: 7.5 },
        { label: '41–60',       val: 7.5 },
        { label: '60 and over', val: 7.5 },
      ]
    },
    {
      q: 'How do you feel within the first hour of waking up?',
      sub: 'On a typical morning, not your worst day.',
      options: [
        { label: 'Alert and ready to go',                       val: 0    },
        { label: 'Groggy but functional',                       val: 0.5  },
        { label: 'Tired — depend on caffeine',                  val: 0.75 },
        { label: 'Exhausted, could go straight back to sleep',  val: 1.0  },
      ]
    },
    {
      q: 'How would you describe your daily stress level?',
      sub: 'Stress raises cortisol, which disrupts deep sleep.',
      options: [
        { label: 'Pretty relaxed, minimal stress',   val: 0    },
        { label: 'Moderate — manageable',            val: 0.25 },
        { label: 'High stress, mind often racing',   val: 0.5  },
        { label: 'Very high stress / anxiety',       val: 0.75 },
      ]
    },
    {
      q: 'How intense is your physical training?',
      sub: 'Harder training demands more sleep for muscle repair.',
      options: [
        { label: 'Little to no exercise',               val: 0    },
        { label: 'Light (walks, yoga, stretching)',     val: 0    },
        { label: 'Moderate (gym 3–4× per week)',        val: 0.5  },
        { label: 'Intense (daily training or sport)',   val: 0.75 },
      ]
    },
    {
      q: 'Which best describes your natural sleep tendency?',
      sub: 'Your chronotype — not what your schedule forces.',
      options: [
        { label: 'Early bird — asleep early, awake easily',    val: -0.25 },
        { label: 'Flexible — adapt to any schedule',           val: 0     },
        { label: 'Night owl — naturally sleep and wake late',  val: 0.25  },
        { label: 'Trouble sleeping / insomnia tendencies',     val: 0.5   },
      ]
    },
  ],
  calc(answers) {
    const base = answers[0] ?? 7.5;
    const adj  = answers.slice(1).reduce((s, v) => s + v, 0);
    return Math.round(Math.max(6, Math.min(10, base + adj)) * 2) / 2;
  },
  explain(answers) {
    const lbl = (qi) => {
      const q = this.questions[qi];
      return (q.options.find(o => o.val === answers[qi])?.label || '').toLowerCase();
    };
    const ageMap = { 9: 'under 18', 8: '18–25', 7.5: '26 or older' };
    const ageStr = ageMap[answers[0]] ?? 'your age group';
    const wake   = lbl(1) || 'your wake state';
    const stress = lbl(2) || 'your stress level';
    const exStr  = lbl(3) || 'your activity level';

    const summary = `Adults ${ageStr} typically need a 7–9 hour baseline. You wake feeling "${wake.split('—')[0].trim()}", which signals your current sleep may not be fully restorative. With ${stress.split('—')[0].trim()} on top of ${exStr.split('(')[0].trim()}, your body's need for deep slow-wave sleep is elevated — that's when cortisol is cleared, memories are consolidated, and muscle tissue is repaired. This target is calibrated to give you enough cycles of that restorative deep sleep.`;

    const research = [
      { text: 'Adults aged 18–64 need 7–9 hours per night. Regularly getting fewer than 6 hours doubles cardiovascular disease risk and impairs glucose metabolism within just two weeks.', source: 'National Sleep Foundation, Sleep Health Journal, 2023' },
      { text: 'Psychological stress fragments slow-wave (deep) sleep without reducing total sleep time — meaning stressed individuals need more sleep to get the same restorative depth.', source: 'Kalmbach et al., Sleep Medicine Reviews, 2018' },
      { text: 'Athletes doing intense training require up to 9–10 hours for full hormonal recovery. Growth hormone — critical for muscle repair — is primarily secreted during deep sleep cycles.', source: 'Fullagar et al., Sports Medicine, 2015' },
      { text: 'Just one week of sleeping 6 hours per night produces cognitive deficits equivalent to two full nights of no sleep, yet most people report feeling "fine" — the brain adapts to impairment.', source: 'Van Dongen et al., Sleep Journal, 2003' },
    ];
    return { summary, research };
  }
};

// ── FITNESS GOALS SURVEY ─────────────────────────────────

const FITNESS_SURVEY = {
  key: 'fitness',
  title: 'Fitness Plan',
  emoji: '💪',
  questions: [
    {
      q: 'What are your fitness goals?',
      sub: 'Select all that apply — then tap Continue.',
      multi: true,
      options: [
        { label: '💪 Build muscle & strength',     id: 'muscle'  },
        { label: '🔥 Lose body fat / get leaner',  id: 'fat'     },
        { label: '🏃 Improve cardio & endurance',  id: 'cardio'  },
        { label: '🧘 Flexibility & mobility',      id: 'flex'    },
        { label: '⚡ Athletic performance',         id: 'athlete' },
        { label: '❤️ General health & wellness',  id: 'health'  },
      ]
    },
    {
      q: 'What is your training experience?',
      sub: 'Based on consistent, structured training history.',
      options: [
        { label: 'Beginner — less than 6 months',         id: 'beginner'     },
        { label: 'Intermediate — 6 months to 2 years',    id: 'intermediate' },
        { label: 'Advanced — 2+ years consistent',        id: 'advanced'     },
      ]
    },
    {
      q: 'How many days per week can you train?',
      sub: 'Be realistic — consistency beats ambition.',
      options: [
        { label: '2–3 days per week',  id: 'd2' },
        { label: '3–4 days per week',  id: 'd3' },
        { label: '4–5 days per week',  id: 'd4' },
        { label: '5–6 days per week',  id: 'd5' },
      ]
    },
    {
      q: 'What equipment do you have access to?',
      sub: 'This determines your exercise selection.',
      options: [
        { label: '🏋️ Full gym — barbells, machines, cardio',  id: 'full'       },
        { label: '🏠 Home setup — dumbbells & basic gear',    id: 'home'       },
        { label: '🤸 Bodyweight / minimal equipment',         id: 'bodyweight' },
      ]
    },
    {
      q: 'How long can each training session be?',
      sub: 'Be honest — quality beats duration.',
      options: [
        { label: '20–30 minutes',  id: 't30' },
        { label: '30–45 minutes',  id: 't45' },
        { label: '45–60 minutes',  id: 't60' },
        { label: '60–90 minutes',  id: 't90' },
      ]
    },
  ]
};

function showFitnessSurvey() {
  _surveyState = { survey: FITNESS_SURVEY, qIdx: 0, answers: [], multiSelected: new Set() };
  _renderSurveyQ();
}

function _generateFitnessPlan(answers) {
  const goals  = answers[0] || [];
  const level  = answers[1] || 'beginner';
  const daysId = answers[2] || 'd3';
  const equip  = answers[3] || 'full';
  const timeId = answers[4] || 't60';

  const muscle  = goals.includes('muscle') || goals.includes('athlete');
  const fat     = goals.includes('fat');
  const cardio  = goals.includes('cardio');
  const flex    = goals.includes('flex');

  let type = 'balanced';
  if      (muscle && fat && cardio) type = 'hybrid';
  else if (muscle && fat)           type = 'recomp';
  else if (muscle)                  type = 'strength';
  else if (fat && cardio)           type = 'cardio-cut';
  else if (fat)                     type = 'fat-loss';
  else if (cardio)                  type = 'endurance';

  const levelParams = {
    beginner:     { sets: '2–3 sets', reps: '10–15 reps', rest: '60–90 sec', note: 'Start light, nail form first. Add weight only when every rep is clean.' },
    intermediate: { sets: '3–4 sets', reps: '8–12 reps',  rest: '60–120 sec', note: 'Progressive overload: increase weight or reps each week.' },
    advanced:     { sets: '4–5 sets', reps: '6–12 reps',  rest: '90–180 sec', note: 'Periodize: 3 weeks progressive loading, 1 week deload at 60% volume.' },
  };
  const params = levelParams[level] || levelParams.beginner;
  const numDays = { d2: 3, d3: 3, d4: 4, d5: 5 }[daysId] || 3;

  const useBarbell = equip === 'full';
  const useDumbb   = equip !== 'bodyweight';
  const pushEx  = useBarbell ? 'Bench Press, Overhead Press, Dips'          : useDumbb ? 'DB Bench, DB Shoulder Press, Push-Ups'     : 'Push-Ups, Pike Push-Ups, Dips';
  const pullEx  = useBarbell ? 'Pull-Ups, Barbell Row, Face Pulls'           : useDumbb ? 'Pull-Ups, DB Row, Band Pull-Aparts'          : 'Pull-Ups, Bodyweight Rows';
  const legEx   = useBarbell ? 'Squat, Romanian Deadlift, Leg Press'         : useDumbb ? 'Goblet Squat, DB RDL, Walking Lunges'        : 'Squat, Lunges, Glute Bridges, Step-Ups';
  const coreEx  = 'Planks, Dead Bugs, Hollow Holds';
  const zone2   = timeId === 't30' ? '20 min Zone 2 (60–70% max HR)' : '30–40 min Zone 2 (60–70% max HR)';
  const hiit    = '20 min HIIT — 30 sec all-out / 90 sec rest × 8 rounds';
  const mobEx   = '15 min mobility — hip flexors, hamstrings, thoracic rotation';

  const schedule = [];

  if (type === 'strength') {
    if (numDays <= 3) {
      schedule.push({ day: 'Day 1', label: 'Full Body A', type: 'strength', ex: `${pushEx} · ${legEx} · ${coreEx}` });
      schedule.push({ day: 'Day 2', label: 'Rest / Walk', type: 'rest', ex: 'Easy 20–30 min walk or light mobility' });
      schedule.push({ day: 'Day 3', label: 'Full Body B', type: 'strength', ex: `${pullEx} · ${legEx} · ${coreEx}` });
    } else if (numDays === 4) {
      schedule.push({ day: 'Day 1', label: 'Upper Body', type: 'strength', ex: `${pushEx} · ${pullEx}` });
      schedule.push({ day: 'Day 2', label: 'Lower Body', type: 'strength', ex: `${legEx} · ${coreEx}` });
      schedule.push({ day: 'Day 3', label: 'Rest', type: 'rest', ex: 'Active recovery or mobility' });
      schedule.push({ day: 'Day 4', label: 'Upper Accessory', type: 'strength', ex: `${pullEx} · ${pushEx} (lighter, higher reps)` });
      schedule.push({ day: 'Day 5', label: 'Lower + Core', type: 'strength', ex: `${legEx} · ${coreEx}` });
    } else {
      schedule.push({ day: 'Day 1', label: 'Push', type: 'strength', ex: pushEx });
      schedule.push({ day: 'Day 2', label: 'Pull', type: 'strength', ex: pullEx });
      schedule.push({ day: 'Day 3', label: 'Legs & Core', type: 'strength', ex: `${legEx} · ${coreEx}` });
      schedule.push({ day: 'Day 4', label: 'Push (Accessory)', type: 'strength', ex: `${pushEx} — lighter, 12–20 reps` });
      schedule.push({ day: 'Day 5', label: 'Pull + Core', type: 'strength', ex: `${pullEx} · ${coreEx}` });
    }
  } else if (type === 'endurance') {
    schedule.push({ day: 'Day 1', label: 'Zone 2 Cardio', type: 'cardio', ex: zone2 });
    schedule.push({ day: 'Day 2', label: 'Strength Support', type: 'strength', ex: `${legEx} · ${coreEx}` });
    schedule.push({ day: 'Day 3', label: 'HIIT', type: 'hiit', ex: hiit });
    if (numDays >= 4) schedule.push({ day: 'Day 4', label: 'Zone 2 + Mobility', type: 'cardio', ex: `${zone2} + ${mobEx}` });
    if (numDays >= 5) schedule.push({ day: 'Day 5', label: 'Long Easy Effort', type: 'cardio', ex: '45–60 min steady Zone 2 — build aerobic base progressively' });
  } else if (type === 'fat-loss') {
    schedule.push({ day: 'Day 1', label: 'Full Body Circuit', type: 'strength', ex: `${pushEx} + ${legEx} — circuit style, 30 sec rest` });
    schedule.push({ day: 'Day 2', label: 'HIIT Cardio', type: 'hiit', ex: hiit });
    schedule.push({ day: 'Day 3', label: 'Full Body Strength', type: 'strength', ex: `${pullEx} · ${legEx} · ${coreEx}` });
    if (numDays >= 4) schedule.push({ day: 'Day 4', label: 'Zone 2 Cardio', type: 'cardio', ex: zone2 });
    if (numDays >= 5) schedule.push({ day: 'Day 5', label: 'Full Body + Core', type: 'strength', ex: `${pushEx} · ${pullEx} · ${coreEx}` });
  } else if (type === 'recomp') {
    schedule.push({ day: 'Day 1', label: 'Upper Body', type: 'strength', ex: `${pushEx} · ${pullEx}` });
    schedule.push({ day: 'Day 2', label: 'Lower Body', type: 'strength', ex: `${legEx} · ${coreEx}` });
    schedule.push({ day: 'Day 3', label: 'Cardio', type: 'cardio', ex: `${hiit}  —or—  ${zone2}` });
    if (numDays >= 4) schedule.push({ day: 'Day 4', label: 'Full Body', type: 'strength', ex: `${pushEx} · ${legEx} · ${coreEx}` });
    if (numDays >= 5) schedule.push({ day: 'Day 5', label: 'Zone 2 + Mobility', type: 'cardio', ex: `${zone2} + ${mobEx}` });
  } else if (type === 'cardio-cut') {
    schedule.push({ day: 'Day 1', label: 'Zone 2 Cardio', type: 'cardio', ex: zone2 });
    schedule.push({ day: 'Day 2', label: 'Strength (preserve muscle)', type: 'strength', ex: `${pushEx} · ${legEx}` });
    schedule.push({ day: 'Day 3', label: 'HIIT', type: 'hiit', ex: hiit });
    if (numDays >= 4) schedule.push({ day: 'Day 4', label: 'Zone 2 + Core', type: 'cardio', ex: `${zone2} + ${coreEx}` });
    if (numDays >= 5) schedule.push({ day: 'Day 5', label: 'Full Body Strength', type: 'strength', ex: `${pushEx} · ${pullEx} · ${legEx}` });
  } else {
    schedule.push({ day: 'Day 1', label: 'Push + Cardio Finisher', type: 'strength', ex: `${pushEx} + 10 min HIIT finisher` });
    schedule.push({ day: 'Day 2', label: 'Zone 2 Cardio', type: 'cardio', ex: zone2 });
    schedule.push({ day: 'Day 3', label: 'Legs & Core', type: 'strength', ex: `${legEx} · ${coreEx}` });
    if (numDays >= 4) schedule.push({ day: 'Day 4', label: 'Pull + HIIT', type: 'strength', ex: `${pullEx} + ${hiit}` });
    if (numDays >= 5) schedule.push({ day: 'Day 5', label: 'Full Body + Mobility', type: 'strength', ex: `${pushEx} · ${pullEx} · ${coreEx} + ${mobEx}` });
  }
  if (flex) schedule.push({ day: '+ Any Day', label: 'Mobility Session', type: 'flex', ex: mobEx });

  const nutrition = (muscle && fat)
    ? { title: 'Nutrition for Recomposition', points: ['High protein: 0.7–1g per lb of bodyweight daily', 'Slight caloric deficit: 200–300 cal below maintenance', 'Time carbs around workouts for performance and recovery', 'Minimize processed foods and liquid calories'] }
    : muscle
    ? { title: 'Nutrition for Muscle Growth', points: ['Caloric surplus: 200–300 cal above maintenance', 'Protein: 0.7–1g per lb of bodyweight daily', 'Carbs fuel heavy lifting — don\'t restrict them', 'Eat protein within 2h of training for muscle protein synthesis'] }
    : fat
    ? { title: 'Nutrition for Fat Loss', points: ['Caloric deficit: 300–500 cal below maintenance (1–1.5 lbs/week)', 'High protein (0.7g/lb) to preserve muscle while cutting', 'Prioritize volume foods — vegetables, lean protein, fiber', 'Eliminate liquid calories — soda, juice, alcohol stall fat loss'] }
    : { title: 'Nutrition for Health & Performance', points: ['Whole foods first — vegetables, protein, complex carbs', 'Hydration: 0.5–1 oz per lb of bodyweight daily', 'Protein at every meal (20–40g) for muscle maintenance', 'Consistent meal timing supports energy and recovery'] };

  const research = [];
  if (muscle) research.push({ text: 'Hypertrophy requires 10–20 weekly sets per muscle group across 2–4 sessions. Progressive overload — consistently adding load over time — is the primary driver of muscle growth.', source: 'Schoenfeld et al., Journal of Strength & Conditioning Research, 2017' });
  if (fat) research.push({ text: 'Resistance training during fat loss is critical — it preserves lean muscle mass and keeps metabolism elevated. Programs relying on cardio alone cause both fat AND muscle loss.', source: 'Willis et al., Journal of Applied Physiology, 2012' });
  if (cardio) research.push({ text: 'Elite endurance coaches recommend spending 80% of training time in Zone 2 (conversational pace). Just one high-intensity session per week produces optimal aerobic adaptation with minimal injury risk.', source: 'Seiler & Tønnessen, Int\'l Journal of Sports Physiology & Performance, 2009' });
  if (muscle && fat) research.push({ text: 'Body recomposition — building muscle while losing fat simultaneously — is achievable with high protein intake (0.7–1g/lb) and progressive resistance training, even in a slight caloric deficit.', source: 'Barakat et al., Strength & Conditioning Journal, 2020' });
  research.push({ text: 'Consistency is the single strongest predictor of long-term fitness outcomes. A moderate program followed for 6+ months outperforms any aggressive program abandoned in weeks.', source: 'Garber et al., ACSM Position Stand, Medicine & Science in Sports & Exercise, 2011' });

  const typeLabels = { strength: 'Strength & Muscle', endurance: 'Cardio & Endurance', 'fat-loss': 'Fat Loss', recomp: 'Body Recomposition', 'cardio-cut': 'Cardio + Fat Loss', hybrid: 'Hybrid Training', balanced: 'Balanced Fitness' };
  return { type, label: typeLabels[type] || 'Balanced Fitness', goals, level, numDays, params, schedule, nutrition, research };
}

function _renderFitnessPlanResult() {
  const plan = _generateFitnessPlan(_surveyState.answers);
  const typeColors  = { strength: '#f59e0b', cardio: '#38bdf8', hiit: '#f87171', rest: '#4ade80', flex: '#c084fc' };
  const typeLabels2 = { strength: '🏋️ Strength', cardio: '🏃 Zone 2', hiit: '⚡ HIIT', rest: '😴 Recovery', flex: '🧘 Mobility' };

  const schedHtml = plan.schedule.map(d => `
    <div class="fp-day-card" style="border-left:3px solid ${typeColors[d.type] || '#555'}">
      <div class="fp-day-top"><span class="fp-day-num">${_escHtml(d.day)}</span><span class="fp-day-type-badge" style="color:${typeColors[d.type] || '#aaa'}">${typeLabels2[d.type] || ''}</span></div>
      <div class="fp-day-label">${_escHtml(d.label)}</div>
      <div class="fp-day-ex">${_escHtml(d.ex)}</div>
    </div>
  `).join('');

  const nutriHtml = plan.nutrition.points.map(p => `<div class="fp-nutrition-pt">• ${_escHtml(p)}</div>`).join('');
  const resHtml   = plan.research.map(r => `
    <div class="survey-research-item">
      <div class="survey-research-text">${_escHtml(r.text)}</div>
      <div class="survey-research-source">— ${_escHtml(r.source)}</div>
    </div>`).join('');

  const saved = localStorage.getItem('fitnessAnswers') === JSON.stringify(_surveyState.answers);

  document.getElementById('drawer-title').textContent = 'Your Fitness Plan';
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="showFitnessSurvey()">‹ Retake</button>

    <div class="survey-result-card">
      <div class="survey-result-emoji">💪</div>
      <div class="survey-result-heading">Your Training Plan</div>
      <div class="survey-result-value" style="font-size:1.3rem;line-height:1.2">${_escHtml(plan.label)}</div>
      <div class="survey-result-detail">${plan.numDays} days/week · ${plan.params.sets} · ${plan.params.reps}</div>
      <div class="survey-result-source">Rest between sets: ${plan.params.rest}</div>
    </div>

    <div class="fp-section-label">📅 Weekly Schedule</div>
    <div class="fp-schedule">${schedHtml}</div>

    <div class="fp-section-label">🍎 ${_escHtml(plan.nutrition.title)}</div>
    <div class="fp-nutrition-card">${nutriHtml}</div>

    <div class="fp-intensity-note">${_escHtml(plan.params.note)}</div>

    <div class="survey-explain-wrap" id="fp-explain-wrap">
      <button class="survey-explain-toggle" onclick="document.getElementById('fp-explain-wrap').classList.toggle('open')">
        <span>The science behind this</span>
        <span class="survey-explain-arrow">›</span>
      </button>
      <div class="survey-explain-body">${resHtml}</div>
    </div>

    <button class="survey-save-btn${saved ? ' saved' : ''}" id="fp-save-btn" onclick="_saveFitnessPlan()">
      ${saved ? '✓ Plan saved' : 'Save this plan'}
    </button>
    <button class="drawer-item" style="margin-top:6px" onclick="renderDrawerMenu()">
      <span class="drawer-item-text">Back to Menu</span>
    </button>
  `;
}

function _saveFitnessPlan() {
  if (!_surveyState) return;
  localStorage.setItem('fitnessAnswers', JSON.stringify(_surveyState.answers));
  const btn = document.getElementById('fp-save-btn');
  if (btn) { btn.classList.add('saved'); btn.textContent = '✓ Plan saved!'; }
}

// Survey state — stored globally so back navigation works cleanly
let _surveyState = null;

function showExerciseSurvey() { _startSurvey(EXERCISE_SURVEY); }
function showSleepSurvey()    { _startSurvey(SLEEP_SURVEY); }

function _startSurvey(survey) {
  _surveyState = { survey, qIdx: 0, answers: [] };
  _renderSurveyQ();
}

function _renderSurveyQ() {
  const { survey, qIdx } = _surveyState;
  const q     = survey.questions[qIdx];
  const total = survey.questions.length;
  const pct   = Math.round((qIdx / total) * 100);
  const sel   = _surveyState.multiSelected || new Set();

  let optionBtns, continueBtn = '';
  if (q.multi) {
    optionBtns = q.options.map(opt => `
      <button class="survey-opt${sel.has(opt.id) ? ' selected' : ''}" onclick="_toggleMultiOpt('${opt.id}')">${_escHtml(opt.label)}</button>
    `).join('');
    continueBtn = `<button class="survey-multi-continue" id="survey-multi-continue" onclick="_surveyMultiContinue()">Continue →</button>`;
  } else {
    optionBtns = q.options.map((opt, i) => `
      <button class="survey-opt" onclick="_surveyPick(${i})">${_escHtml(opt.label)}</button>
    `).join('');
  }

  document.getElementById('drawer-title').textContent = survey.title;
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="_surveyBack()">‹ Back</button>
    <div class="survey-prog-wrap"><div class="survey-prog-bar" style="width:${pct}%"></div></div>
    <div class="survey-step">${qIdx + 1} / ${total}</div>
    <div class="survey-q">${_escHtml(q.q)}</div>
    <div class="survey-sub">${_escHtml(q.sub)}</div>
    <div class="survey-opts">${optionBtns}</div>
    ${continueBtn}
  `;
}

function _toggleMultiOpt(id) {
  if (!_surveyState.multiSelected) _surveyState.multiSelected = new Set();
  if (_surveyState.multiSelected.has(id)) _surveyState.multiSelected.delete(id);
  else _surveyState.multiSelected.add(id);
  _renderSurveyQ();
}

function _surveyMultiContinue() {
  const sel = _surveyState.multiSelected;
  if (!sel || sel.size === 0) {
    const btn = document.getElementById('survey-multi-continue');
    if (btn) { btn.textContent = 'Pick at least one!'; setTimeout(() => { btn.textContent = 'Continue →'; }, 1200); }
    return;
  }
  _surveyState = { ..._surveyState, qIdx: _surveyState.qIdx + 1, answers: [..._surveyState.answers, [...sel]], multiSelected: new Set() };
  if (_surveyState.qIdx < _surveyState.survey.questions.length) _renderSurveyQ();
  else _renderSurveyResult();
}

function _surveyPick(optIdx) {
  const { survey, qIdx, answers } = _surveyState;
  const opt = survey.questions[qIdx].options[optIdx];
  const val = opt.val !== undefined ? opt.val : opt.id;
  _surveyState = { survey, qIdx: qIdx + 1, answers: [...answers, val], multiSelected: new Set() };
  if (_surveyState.qIdx < survey.questions.length) {
    _renderSurveyQ();
  } else {
    _renderSurveyResult();
  }
}

function _surveyBack() {
  if (!_surveyState || _surveyState.qIdx === 0) { renderDrawerMenu(); return; }
  const newIdx  = _surveyState.qIdx - 1;
  const prevQ   = _surveyState.survey.questions[newIdx];
  const prevAns = _surveyState.answers[newIdx];
  _surveyState = {
    ..._surveyState,
    qIdx:         newIdx,
    answers:      _surveyState.answers.slice(0, -1),
    multiSelected: prevQ.multi ? new Set(Array.isArray(prevAns) ? prevAns : []) : new Set(),
  };
  _renderSurveyQ();
}

function _renderSurveyResult() {
  if (_surveyState.survey.key === 'fitness') { _renderFitnessPlanResult(); return; }
  const { survey, answers } = _surveyState;
  const result     = survey.calc(answers);
  const label      = survey.unit(result);
  const saved      = parseFloat(localStorage.getItem(survey.storageKey));
  const isSame     = saved === result;
  const isExercise = survey.key === 'exercise';
  const explain    = survey.explain(answers);

  const researchHtml = explain.research.map(r => `
    <div class="survey-research-item">
      <div class="survey-research-text">${_escHtml(r.text)}</div>
      <div class="survey-research-source">— ${_escHtml(r.source)}</div>
    </div>`).join('');

  document.getElementById('drawer-title').textContent = 'Your Result';
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="_startSurvey(_surveyState.survey)">‹ Retake</button>
    <div class="survey-result-card">
      <div class="survey-result-emoji">${survey.emoji}</div>
      <div class="survey-result-heading">Your optimal ${isExercise ? 'workout duration' : 'sleep target'}</div>
      <div class="survey-result-value">${label}</div>
      <div class="survey-result-detail">${
        isExercise
          ? `Per session · ${survey.questions[2].options.find(o => o.val === answers[2])?.label?.toLowerCase() ?? ''}`
          : 'Per night for recovery and performance'
      }</div>
      <div class="survey-result-source">Based on ${survey.source}</div>
    </div>

    <div class="survey-explain-wrap" id="survey-explain-wrap">
      <button class="survey-explain-toggle" onclick="document.getElementById('survey-explain-wrap').classList.toggle('open')">
        <span>Why this target?</span>
        <span class="survey-explain-arrow">›</span>
      </button>
      <div class="survey-explain-body">
        <p class="survey-explain-summary">${_escHtml(explain.summary)}</p>
        <div class="survey-explain-research">${researchHtml}</div>
      </div>
    </div>

    <button class="survey-save-btn${isSame ? ' saved' : ''}" id="survey-save-btn"
      onclick="_saveSurveyResult(${result})">
      ${isSame ? '✓ Already your target' : 'Set as my optimal target'}
    </button>
    <button class="drawer-item" style="margin-top:6px" onclick="renderDrawerMenu()">
      <span class="drawer-item-text">Back to Menu</span>
    </button>
  `;
}

function _saveSurveyResult(result) {
  if (!_surveyState) return;
  const survey = _surveyState.survey;
  localStorage.setItem(survey.storageKey, result);
  // Auto-set the corresponding goal
  if (survey.key === 'exercise') {
    if (!localStorage.getItem('goalExerciseMins')) {
      localStorage.setItem('goalExerciseMins', result * 5);
    }
  } else if (survey.key === 'sleep') {
    if (!localStorage.getItem('goalSleepHours')) {
      localStorage.setItem('goalSleepHours', result);
    }
  }
  queueSync(); // save survey result to the user's account immediately
  renderWellnessCharts();
  _updateHamburgerBadge();
  const btn = document.getElementById('survey-save-btn');
  if (btn) { btn.classList.add('saved'); btn.textContent = '✓ Saved — chart updated!'; }
}

// ── HAMBURGER DRAWER ─────────────────────────────────────

function dismissNotif(key) {
  const perDay = ['streak', 'grat'];
  if (perDay.includes(key)) {
    localStorage.setItem('notifDismiss_' + key, getToday());
  } else {
    localStorage.setItem('notifDismiss_' + key, '1');
  }
  const el = document.getElementById('drawer-notif-' + key);
  if (el) el.remove();
}

function toggleDrawer() {
  const drawer = document.getElementById('side-drawer');
  const isOpen = drawer.classList.contains('open');
  if (isOpen) closeDrawer();
  else openDrawer();
}

function openDrawer() {
  _updateHamburgerBadge();
  document.getElementById('side-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('visible');
  document.getElementById('hamburger-btn').style.visibility = 'hidden';
  renderDrawerMenu();
}

function closeDrawer() {
  document.getElementById('side-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('visible');
  document.getElementById('hamburger-btn').style.visibility = '';
}

function _updateHamburgerBadge() {
  const btn = document.getElementById('hamburger-btn');
  if (!btn) return;
  const hasExSurvey = !localStorage.getItem('exerciseOptimalMins');
  const hasSlSurvey = !localStorage.getItem('sleepOptimalHours');
  const count = (hasExSurvey ? 1 : 0) + (hasSlSurvey ? 1 : 0);
  let badge = btn.querySelector('.hamburger-badge');
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'hamburger-badge';
      btn.appendChild(badge);
    }
    badge.textContent = count;
  } else {
    if (badge) badge.remove();
  }
}

function renderDrawerMenu() {
  document.getElementById('drawer-title').textContent = 'Menu';
  const userEmail = _currentUser ? _currentUser.email : null;
  const photoUrl = localStorage.getItem('photoDataUrl') || '';
  const dName = localStorage.getItem('displayName') || '';
  const initial = dName ? dName[0].toUpperCase() : (userEmail ? userEmail[0].toUpperCase() : '?');
  const avatarHtml = photoUrl
    ? `<img src="${photoUrl}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
    : `<span class="drawer-avatar-circle">${initial}</span>`;

  const hasExSurvey = !localStorage.getItem('exerciseOptimalMins') && !localStorage.getItem('notifDismiss_exSurvey');
  const hasSlSurvey = !localStorage.getItem('sleepOptimalHours') && !localStorage.getItem('notifDismiss_slSurvey');

  const now = new Date();
  const hour = now.getHours();
  const todayData = loadData()[getToday()] || {};
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const todayJournal = journals[getToday()] || {};
  const habitsNotDone = getHabits().length > 0 && !getHabits().some(h => !!todayData[h.id]);
  const gratNotDone = !todayJournal.s1 || !todayJournal.s2 || !todayJournal.s3;
  const streakWarning = habitsNotDone && hour >= 18 && localStorage.getItem('notifDismiss_streak') !== getToday()
    ? `<div class="drawer-notif" id="drawer-notif-streak">
        <span class="drawer-notif-icon">🔥</span>
        <div class="drawer-notif-body">
          <div class="drawer-notif-title">Streak at risk!</div>
          <div class="drawer-notif-sub">You haven't logged any habits today</div>
        </div>
        <button class="drawer-notif-btn" onclick="closeDrawer();goTo(1)">Log Now</button>
        <button class="drawer-notif-dismiss" onclick="dismissNotif('streak')" aria-label="Dismiss">✕</button>
      </div>` : '';
  const gratWarning = gratNotDone && hour >= 19 && localStorage.getItem('notifDismiss_grat') !== getToday()
    ? `<div class="drawer-notif" id="drawer-notif-grat">
        <span class="drawer-notif-icon">📓</span>
        <div class="drawer-notif-body">
          <div class="drawer-notif-title">Gratitude not done yet</div>
          <div class="drawer-notif-sub">Take a moment to reflect on your day</div>
        </div>
        <button class="drawer-notif-btn" onclick="closeDrawer();goTo(2)">Go There</button>
        <button class="drawer-notif-dismiss" onclick="dismissNotif('grat')" aria-label="Dismiss">✕</button>
      </div>` : '';

  const notifHtml = (hasExSurvey || hasSlSurvey || streakWarning || gratWarning) ? `
    <div class="drawer-notif-group">
      ${streakWarning}
      ${gratWarning}
      ${hasExSurvey ? `
        <div class="drawer-notif" id="drawer-notif-exSurvey">
          <span class="drawer-notif-icon">🏃</span>
          <div class="drawer-notif-body">
            <div class="drawer-notif-title">Set your exercise goal</div>
            <div class="drawer-notif-sub">Take the survey to get your personal target</div>
          </div>
          <button class="drawer-notif-btn" onclick="showExerciseSurvey()">Start</button>
          <button class="drawer-notif-dismiss" onclick="dismissNotif('exSurvey')" aria-label="Dismiss">✕</button>
        </div>` : ''}
      ${hasSlSurvey ? `
        <div class="drawer-notif" id="drawer-notif-slSurvey">
          <span class="drawer-notif-icon">😴</span>
          <div class="drawer-notif-body">
            <div class="drawer-notif-title">Set your sleep goal</div>
            <div class="drawer-notif-sub">Take the survey to find your optimal hours</div>
          </div>
          <button class="drawer-notif-btn" onclick="showSleepSurvey()">Start</button>
          <button class="drawer-notif-dismiss" onclick="dismissNotif('slSurvey')" aria-label="Dismiss">✕</button>
        </div>` : ''}
    </div>` : '';

  document.getElementById('drawer-body').innerHTML = `
    <div class="worlds-switcher">
      <div class="worlds-label">Worlds 🌍</div>
      <div class="worlds-row">
        <button class="world-btn world-btn-habit${_currentWorld==='habit'?' world-active':''}" onclick="switchWorld('habit')">
          <span class="world-icon">🔥</span>
          <span class="world-name">Habit World</span>
        </button>
        <button class="world-btn world-btn-fitness${_currentWorld==='fitness'?' world-active world-active-fitness':''}" onclick="switchWorld('fitness')">
          <span class="world-icon">💪</span>
          <span class="world-name">Fitness World</span>
        </button>
        <button class="world-btn world-btn-scholar${_currentWorld==='scholar'?' world-active world-active-scholar':''}" onclick="switchWorld('scholar')">
          <span class="world-icon">📚</span>
          <span class="world-name">Scholar World</span>
        </button>
      </div>
    </div>

    ${_renderWorldTokenBox()}

    <div class="drawer-divider"></div>

    <button class="drawer-item" onclick="showAccount()">
      ${avatarHtml}
      <span class="drawer-item-text" style="flex:1">Profile</span>
      <span class="drawer-item-arrow">›</span>
    </button>

    <div class="drawer-divider"></div>

    <button class="drawer-item" onclick="showSettings()">
      <span class="drawer-item-text">Settings</span>
      <span class="drawer-item-arrow">›</span>
    </button>


    <div class="drawer-divider"></div>
    <button class="drawer-item" onclick="toggleWellnessSurveys()" id="wellness-surveys-toggle">
      <span class="drawer-item-text">🌿 Wellness Surveys</span>
      <span class="drawer-item-arrow" id="wellness-surveys-arrow">›</span>
    </button>
    <div id="wellness-surveys-content" style="display:none;">
      <button class="drawer-item survey-menu-btn" style="padding-left:24px" onclick="showFitnessSurvey()">
        <span class="survey-menu-icon">💪</span>
        <span class="drawer-item-text">Fitness Goals Plan</span>
        <span class="survey-menu-badge${localStorage.getItem('fitnessAnswers') ? ' done' : ''}">${localStorage.getItem('fitnessAnswers') ? '✓' : 'New'}</span>
      </button>
      <button class="drawer-item survey-menu-btn" style="padding-left:24px" onclick="showExerciseSurvey()">
        <span class="survey-menu-icon">🏃</span>
        <span class="drawer-item-text">Exercise Survey</span>
        <span class="survey-menu-badge${localStorage.getItem('exerciseOptimalMins') ? ' done' : ''}">${localStorage.getItem('exerciseOptimalMins') ? '✓' : 'New'}</span>
      </button>
      <button class="drawer-item survey-menu-btn" style="padding-left:24px" onclick="showSleepSurvey()">
        <span class="survey-menu-icon">😴</span>
        <span class="drawer-item-text">Sleep Survey</span>
        <span class="survey-menu-badge${localStorage.getItem('sleepOptimalHours') ? ' done' : ''}">${localStorage.getItem('sleepOptimalHours') ? '✓' : 'New'}</span>
      </button>
    </div>

    <div class="drawer-divider"></div>
    <button class="drawer-item" onclick="showGoals()">
      <span class="drawer-item-text">Goals</span>
      <span class="drawer-item-arrow">›</span>
    </button>

    ${notifHtml ? `
    <div class="drawer-divider"></div>
    <div class="drawer-section-label" style="padding:8px 20px 4px;font-size:0.68rem;color:#444;text-transform:uppercase;letter-spacing:0.08em">Notifications</div>
    ${notifHtml}` : ''}
  `;
}

function showGoals() {
  document.getElementById('drawer-title').textContent = 'Goals';
  const exOptimal = parseFloat(localStorage.getItem('exerciseOptimalMins')) || null;
  const slOptimal = parseFloat(localStorage.getItem('sleepOptimalHours'))   || null;
  const goalEx   = parseFloat(localStorage.getItem('goalExerciseMins'))   || (exOptimal ? exOptimal * 5 : null);
  const goalSl   = parseFloat(localStorage.getItem('goalSleepHours'))     || slOptimal;
  const goalHab  = parseInt(localStorage.getItem('goalHabitsPerDay'))     || getHabits().length;
  const totalHab = getHabits().length;

  const exRow = goalEx !== null
    ? `<div class="goal-value" id="goal-ex-val">${fmtExerciseMins(goalEx)} / week</div>`
    : `<div class="goal-hint">Take the Exercise Survey to auto-set</div>`;

  const slRow = goalSl !== null
    ? `<div class="goal-value" id="goal-sl-val">${goalSl}h / night</div>`
    : `<div class="goal-hint">Take the Sleep Survey to auto-set</div>`;

  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="renderDrawerMenu()">‹ Back</button>

    <div class="goal-card">
      <div class="goal-card-header">
        <span class="goal-card-emoji">🏃</span>
        <span class="goal-card-title">Weekly Exercise</span>
      </div>
      ${exRow}
      ${goalEx !== null ? `
      <input type="range" class="goal-range" min="25" max="600" step="5"
        value="${Math.round(goalEx)}"
        oninput="updateGoal('exercise', this.value)"
        onchange="saveGoal('exercise', this.value)" />
      <div class="goal-range-ends"><span>25m</span><span>10h / wk</span></div>` : ''}
    </div>

    <div class="goal-card">
      <div class="goal-card-header">
        <span class="goal-card-emoji">😴</span>
        <span class="goal-card-title">Nightly Sleep</span>
      </div>
      ${slRow}
      ${goalSl !== null ? `
      <input type="range" class="goal-range goal-range-sleep" min="5" max="12" step="0.5"
        value="${goalSl}"
        oninput="updateGoal('sleep', this.value)"
        onchange="saveGoal('sleep', this.value)" />
      <div class="goal-range-ends"><span>5h</span><span>12h</span></div>` : ''}
    </div>

    <div class="goal-card">
      <div class="goal-card-header">
        <span class="goal-card-emoji">✅</span>
        <span class="goal-card-title">Daily Habits</span>
      </div>
      <div class="goal-value" id="goal-hab-val">${goalHab} of ${totalHab} habits / day</div>
      <input type="range" class="goal-range goal-range-habits" min="1" max="${totalHab}" step="1"
        value="${Math.min(goalHab, totalHab)}"
        oninput="updateGoal('habits', this.value, ${totalHab})"
        onchange="saveGoal('habits', this.value)" />
      <div class="goal-range-ends"><span>1</span><span>${totalHab}</span></div>
    </div>
  `;
}

function updateGoal(type, val, extra) {
  val = parseFloat(val);
  if (type === 'exercise') {
    const el = document.getElementById('goal-ex-val');
    if (el) el.textContent = fmtExerciseMins(Math.round(val)) + ' / week';
  } else if (type === 'sleep') {
    const el = document.getElementById('goal-sl-val');
    if (el) el.textContent = val + 'h / night';
  } else if (type === 'habits') {
    const el = document.getElementById('goal-hab-val');
    if (el) el.textContent = `${val} of ${extra} habits / day`;
  }
}

function saveGoal(type, val) {
  val = parseFloat(val);
  if (type === 'exercise') {
    localStorage.setItem('goalExerciseMins', val);
  } else if (type === 'sleep') {
    localStorage.setItem('goalSleepHours', val);
  } else if (type === 'habits') {
    localStorage.setItem('goalHabitsPerDay', val);
  }
  renderWellnessCharts();
}

function applyTheme() {
  const theme = localStorage.getItem('colorTheme') || 'default';
  const isLight = localStorage.getItem('lightMode') === 'true';
  document.body.classList.toggle('theme-wood', theme === 'wood');
  document.body.classList.toggle('theme-light', isLight);
}

function toggleLightMode() {
  const isNow = localStorage.getItem('lightMode') !== 'true';
  localStorage.setItem('lightMode', isNow ? 'true' : 'false');
  applyTheme();
  const sw = document.getElementById('light-mode-switch');
  if (sw) sw.classList.toggle('on', isNow);
}

function showColorThemes() {
  const isWood = (localStorage.getItem('colorTheme') || 'default') === 'wood';
  document.getElementById('drawer-title').textContent = 'Color Themes';
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="showSettings()">‹ Back</button>
    <button class="drawer-toggle-row" onclick="toggleWoodTheme()">
      <span class="drawer-toggle-label">Wood Theme</span>
      <div class="toggle-switch ${isWood ? 'on' : ''}" id="wood-toggle-switch"></div>
    </button>
  `;
}

function toggleWoodTheme() {
  const current = localStorage.getItem('colorTheme') || 'default';
  const isNowWood = current !== 'wood';
  localStorage.setItem('colorTheme', isNowWood ? 'wood' : 'default');
  applyTheme();
  queueSync();
  // Update any visible toggle in-place
  const toggle = document.getElementById('wood-toggle-switch') ||
    document.querySelector('#color-themes-content .toggle-switch');
  if (toggle) toggle.classList.toggle('on', isNowWood);
}

function showSettings() {
  const isLight = localStorage.getItem('lightMode') === 'true';
  document.getElementById('drawer-title').textContent = 'Settings';
  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="renderDrawerMenu()">‹ Back</button>

    <button class="drawer-item" onclick="showAccountSettings()">
      <span class="drawer-item-text">Account Settings</span>
      <span class="drawer-item-arrow">›</span>
    </button>

    <button class="drawer-toggle-row" onclick="toggleLightMode()">
      <span class="drawer-toggle-label">☀️ Light Mode</span>
      <div class="toggle-switch ${isLight ? 'on' : ''}" id="light-mode-switch"></div>
    </button>

    <div class="drawer-divider"></div>

    <button class="drawer-item danger" onclick="toggleDangerZone()" id="danger-zone-toggle">
      <span class="drawer-item-text">⚠️ Danger Zone</span>
      <span class="drawer-item-arrow" id="danger-arrow">›</span>
    </button>
    <div id="danger-zone-content" style="display:none;">
      <button class="drawer-item danger" style="padding-left:20px" onclick="dangerConfirm('Edit a Day','View and edit past habit data',showDateCalendar)">
        <span class="drawer-item-text">📅 Edit a Day</span>
      </button>
      <button class="drawer-item danger" style="padding-left:20px" onclick="dangerConfirm('Clear Today\\'s Data','This will erase all of today\\'s habit completions',clearTodayData)">
        <span class="drawer-item-text">🗑 Clear Today's Data</span>
      </button>
      <button class="drawer-item danger" style="padding-left:20px" onclick="dangerConfirm('Reset ALL Data','Every habit record and gratitude entry will be permanently deleted. This cannot be undone.',resetAllData)">
        <span class="drawer-item-text">💥 Reset All Data</span>
      </button>
    </div>
  `;
}

function dangerConfirm(title, description, action) {
  document.getElementById('danger-confirm-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'danger-confirm-overlay';
  overlay.className = 'hep-overlay';
  overlay.innerHTML = `
    <div class="hep-modal danger-confirm-modal">
      <div class="danger-confirm-icon">⚠️</div>
      <div class="danger-confirm-title">${title}</div>
      <div class="danger-confirm-desc">${description}</div>
      <div class="danger-confirm-check-row">
        <input type="checkbox" id="danger-confirm-check" class="danger-confirm-check"/>
        <label for="danger-confirm-check" class="danger-confirm-check-label">I understand this cannot be undone</label>
      </div>
      <div class="danger-confirm-btns">
        <button class="danger-confirm-cancel" onclick="document.getElementById('danger-confirm-overlay')?.remove()">Cancel</button>
        <button class="danger-confirm-go" onclick="
          if(!document.getElementById('danger-confirm-check').checked){
            document.getElementById('danger-confirm-check').style.outline='2px solid #f87171';return;
          }
          document.getElementById('danger-confirm-overlay')?.remove();
          (${action.toString()})();
        ">Confirm</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function toggleColorThemes() {
  const content = document.getElementById('color-themes-content');
  const arrow = document.getElementById('color-themes-arrow');
  const open = content.style.display === 'none';
  content.style.display = open ? 'block' : 'none';
  arrow.textContent = open ? '⌄' : '›';
}

function toggleDangerZone() {
  const content = document.getElementById('danger-zone-content');
  const arrow = document.getElementById('danger-arrow');
  const open = content.style.display === 'none';
  content.style.display = open ? 'block' : 'none';
  arrow.textContent = open ? '⌄' : '›';
}

function toggleWellnessSurveys() {
  const content = document.getElementById('wellness-surveys-content');
  const arrow = document.getElementById('wellness-surveys-arrow');
  if (!content) return;
  const open = content.style.display === 'none';
  content.style.display = open ? 'block' : 'none';
  if (arrow) arrow.textContent = open ? '⌄' : '›';
}

// ── DRAWER CALENDAR ──────────────────────────────────────
let drawerYear  = new Date().getFullYear();
let drawerMonth = new Date().getMonth();

function showDateCalendar() {
  document.getElementById('drawer-title').textContent = 'Edit a Day';
  renderDrawerCalendar();
}

function drawerCalPrev() {
  drawerMonth--;
  if (drawerMonth < 0) { drawerMonth = 11; drawerYear--; }
  renderDrawerCalendar();
}

function drawerCalNext() {
  drawerMonth++;
  if (drawerMonth > 11) { drawerMonth = 0; drawerYear++; }
  renderDrawerCalendar();
}

function renderDrawerCalendar() {
  const habitData = loadData();
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const today = getToday();

  const monthLabel = new Date(drawerYear, drawerMonth).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  const firstDay = new Date(drawerYear, drawerMonth, 1).getDay();
  const daysInMonth = new Date(drawerYear, drawerMonth + 1, 0).getDate();

  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa']
    .map(d => `<div class="drawer-cal-day-header">${d}</div>`).join('');

  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="drawer-cal-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${drawerYear}-${String(drawerMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday   = dateStr === today;
    const isFuture  = dateStr > today;

    const dayHabits  = habitData[dateStr] || {};
    const dayJournal = journals[dateStr] || {};
    const habitsCompleted = getHabits().filter(h => dayHabits[h.id]).length;
    const gratitudeDone   = [1,2,3].filter(n => dayJournal[`s${n}`]).length;
    const hasData   = habitsCompleted > 0 || gratitudeDone > 0;
    const isPerfect = habitsCompleted === getHabits().length && gratitudeDone === 3;

    let cls = 'drawer-cal-cell';
    if (isFuture)       cls += ' future';
    else if (isPerfect) cls += ' has-data perfect';
    else if (hasData)   cls += ' has-data';
    if (isToday) cls += ' is-today';

    const click = isFuture ? '' : `onclick="openEditDay('${dateStr}')"`;
    cells += `<div class="${cls}" ${click}>${day}</div>`;
  }

  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="renderDrawerMenu()">‹ Back</button>
    <div class="drawer-cal-header">
      <button class="drawer-cal-nav" onclick="drawerCalPrev()">‹</button>
      <span class="drawer-cal-month">${monthLabel}</span>
      <button class="drawer-cal-nav" onclick="drawerCalNext()">›</button>
    </div>
    <div class="drawer-cal-grid">
      <div class="drawer-cal-day-headers">${dayHeaders}</div>
      <div class="drawer-cal-cells">${cells}</div>
    </div>
  `;
}

function openEditDay(date) {
  const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
  document.getElementById('drawer-title').textContent = label;

  const habitData = loadData();
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const dayHabits = habitData[date] || {};
  const dayJournal = journals[date] || {};

  const habitRows = getHabits().map(h => {
    const done = !!dayHabits[h.id];
    return `
      <div class="edit-habit-row${done ? ' done' : ''}">
        <span class="edit-habit-emoji">${h.emoji}</span>
        <span class="edit-habit-name">${h.name}</span>
        <button class="edit-habit-btn${done ? ' done' : ''}" onclick="toggleEditHabit('${date}', '${h.id}')">✓</button>
      </div>`;
  }).join('');

  const gratitudeRows = [1,2,3].map(n => {
    const text = dayJournal[`g${n}`] || '';
    const submitted = !!dayJournal[`s${n}`];
    return `
      <div class="edit-grateful-row${submitted ? ' done' : ''}">
        <div class="edit-grateful-num">${n}</div>
        <div class="edit-grateful-content">
          <textarea id="egt-${n}-${date}" class="edit-grateful-input"
            placeholder="I'm grateful for..."
            style="${submitted ? 'display:none' : ''}"
          >${text}</textarea>
          <div class="edit-grateful-done-text" style="${!submitted ? 'display:none' : ''}">completed</div>
        </div>
        <button class="edit-grateful-btn${submitted ? ' done' : ''}" onclick="toggleEditGrateful('${date}', ${n})">✓</button>
      </div>`;
  }).join('');

  const allDone = getHabits().every(h => !!dayHabits[h.id]);

  document.getElementById('drawer-body').innerHTML = `
    <button class="drawer-back" onclick="showDateCalendar()">‹ Calendar</button>
    <button class="edit-complete-all-btn${allDone ? ' all-done' : ''}" onclick="completeAllForDay('${date}')" title="Mark all habits complete">
      <span class="edit-complete-all-flame">${allDone ? '🔵' : '🫧'}</span>
      <span class="edit-complete-all-text">${allDone ? 'All Complete!' : 'Complete All'}</span>
    </button>
    <div class="edit-section-label">Habits</div>
    ${habitRows}
    <div class="edit-section-label" style="margin-top:12px">Gratitude</div>
    ${gratitudeRows}
  `;
}

function toggleEditHabit(date, habitId) {
  const data = loadData();
  if (!data[date]) data[date] = {};
  data[date][habitId] = !data[date][habitId];
  saveData(data);
  openEditDay(date);
  if (date === getToday()) render();
}

function completeAllForDay(date) {
  const data = loadData();
  if (!data[date]) data[date] = {};
  const habits = getHabits();
  const allDone = habits.every(h => !!data[date][h.id]);
  // Toggle: if all done → uncheck all; otherwise → check all
  habits.forEach(h => { data[date][h.id] = !allDone; });
  saveData(data);
  openEditDay(date);
  if (date === getToday()) render();
}

function toggleEditGrateful(date, n) {
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  if (!journals[date]) journals[date] = { g1:'', g2:'', g3:'', s1:false, s2:false, s3:false };
  const isSubmitted = journals[date][`s${n}`];
  if (isSubmitted) {
    journals[date][`s${n}`] = false;
  } else {
    const ta = document.getElementById(`egt-${n}-${date}`);
    const text = ta ? ta.value.trim() : '';
    if (!text) return;
    journals[date][`g${n}`] = text;
    journals[date][`s${n}`] = true;
  }
  localStorage.setItem('grateful', JSON.stringify(journals));
  openEditDay(date);
  if (date === getToday()) renderJournal();
}

function clearTodayData() {
  showConfirmModal({
    icon: '🗑️',
    title: "Clear Today's Data?",
    message: "All of today's habits and gratitude entries will be permanently erased.",
    confirmLabel: 'Clear Today',
  });
  _confirmCallback = () => {
    const today = getToday();
    const data = loadData();
    delete data[today];
    saveData(data);
    const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
    delete journals[today];
    localStorage.setItem('grateful', JSON.stringify(journals));
    closeDrawer();
    buildHabitCards();
    render();
    renderJournal();
  };
}

function resetAllData() {
  showConfirmModal({
    icon: '💣',
    title: 'Delete ALL Data?',
    message: 'Every habit record and gratitude entry will be permanently deleted. This cannot be undone.',
    confirmLabel: 'Delete Everything',
  });
  _confirmCallback = () => {
    localStorage.removeItem('habitData');
    localStorage.removeItem('grateful');
    localStorage.removeItem('habitOrder');
    closeDrawer();
    buildHabitCards();
    render();
    renderJournal();
  };
}

// ── PULL TO REFRESH — DISABLED (user removed spinner circle) ──
(function initPullToRefresh() {
  return; // disabled
  const threshold = window.innerHeight * 0.10;
  let startY = 0;
  let pulling = false;
  let firstPullTime = 0;
  let firstPullDone = false;

  const indicator = document.createElement('div');
  indicator.id = 'ptr-indicator';
  indicator.innerHTML = '<div class="ptr-spinner"></div>';
  document.body.appendChild(indicator);

  const appEl = document.querySelector('.app') || document.body;

  function getScrollTop() {
    const pages = document.querySelectorAll('.page');
    const active = pages[typeof currentPage !== 'undefined' ? currentPage : 0];
    return active ? active.scrollTop : window.scrollY;
  }

  function resetIndicator() {
    indicator.style.transition = 'opacity 0.25s, transform 0.25s';
    indicator.style.opacity = '0';
    indicator.style.transform = 'translateX(-50%) scale(0.5)';
    indicator.classList.remove('spinning');
  }

  function doRefresh() {
    indicator.classList.add('spinning');
    indicator.style.opacity = '1';
    indicator.style.transform = 'translateX(-50%) translateY(16px) scale(1)';
    setTimeout(() => {
      const tab = document.querySelector('.nav-btn.active');
      if (tab) tab.click();
      if (typeof loadFromCloud === 'function') loadFromCloud();
      setTimeout(resetIndicator, 400);
    }, 700);
  }

  document.addEventListener('touchstart', e => {
    if (typeof currentPage === 'undefined' || currentPage !== 3) return;
    if (getScrollTop() > 2) return;
    startY = e.touches[0].clientY;
    pulling = true;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!pulling) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0 || getScrollTop() > 2) { pulling = false; return; }

    const pull = Math.min(dy, threshold * 1.4);
    const pct  = Math.min(pull / threshold, 1);

    appEl.style.transition = 'none';
    appEl.style.transform = `translateY(${pull * 0.35}px)`;

    indicator.style.transition = 'none';
    indicator.style.opacity = pct;
    indicator.style.transform = `translateX(-50%) translateY(${pull * 0.35}px) scale(${0.5 + pct * 0.5})`;

    // Flash amber ring when first pull threshold is met
    if (pull >= threshold && !firstPullDone) {
      indicator.classList.add('ptr-ready');
    } else if (pull < threshold) {
      indicator.classList.remove('ptr-ready');
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;

    appEl.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
    appEl.style.transform = '';

    const reachedThreshold = indicator.classList.contains('ptr-ready');
    indicator.classList.remove('ptr-ready');

    if (!reachedThreshold) {
      resetIndicator();
      return;
    }

    const now = Date.now();
    if (!firstPullDone || now - firstPullTime > 600) {
      // First pull — show "pull again" hint
      firstPullDone = true;
      firstPullTime = now;
      indicator.style.transition = 'opacity 0.2s, transform 0.4s cubic-bezier(0.22,1,0.36,1)';
      indicator.style.opacity = '0.6';
      indicator.style.transform = 'translateX(-50%) translateY(16px) scale(0.85)';
      setTimeout(() => {
        if (!pulling) resetIndicator();
      }, 550);
    } else {
      // Second pull within 600ms — refresh!
      firstPullDone = false;
      doRefresh();
    }
  });
})();

// ── FRIENDS MANAGER ──────────────────────────────────────
async function openFriendsManager() {
  // Remove any existing modal
  document.getElementById('friends-manager-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'friends-manager-modal';
  modal.innerHTML = `
    <div class="fmgr-backdrop" onclick="closeFriendsManager()"></div>
    <div class="fmgr-sheet">
      <div class="fmgr-handle"></div>
      <div class="fmgr-header">
        <span class="fmgr-title">Friends & Groups</span>
        <button class="fmgr-close" onclick="closeFriendsManager()">✕</button>
      </div>

      <div class="fmgr-section-label">Find People</div>
      <div class="user-search-wrap">
        <input type="text" class="user-search-input" id="user-search-input"
          placeholder="Search by username or display name…"
          oninput="searchUsersByName(this.value)" />
        <button class="user-search-btn" onclick="searchUsersByName(document.getElementById('user-search-input').value)">🔍</button>
      </div>
      <div id="user-search-results"></div>

      <div class="fmgr-section-label" style="margin-top:16px">Add a Friend</div>
      <button class="fmgr-add-btn" onclick="shareFriendLink('https://habit-tracker-2a0ed.web.app/?add=${_currentUser ? _currentUser.uid : ''}');">
        <span class="fmgr-add-icon">🔗</span> Copy Friend Invite Link
      </button>
      <button class="fmgr-add-btn" style="background:#2a2a2a;color:#ccc;border:1.5px dashed #444;margin-top:8px" onclick="searchFriendsFromContacts()">
        <span class="fmgr-add-icon">📇</span> Find from Contacts
      </button>

      <div class="fmgr-section-label" style="margin-top:20px">Your Friends</div>
      <input type="text" id="fmgr-search" class="fmgr-search-input" placeholder="Search friends…" oninput="filterFriendsList(this.value)"/>
      <div id="fmgr-friends-list"><div class="fmgr-loading">Loading…</div></div>

      <div class="fmgr-section-label" style="margin-top:24px">Groups</div>
      <button class="fmgr-add-btn fmgr-group-btn" onclick="promptCreateGroup()">
        <span class="fmgr-add-icon">👥</span> Create a Group
      </button>
      <div id="fmgr-groups-list" style="margin-top:12px"><div class="fmgr-loading">Loading…</div></div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));

  if (!_currentUser || !_fbDb) {
    document.getElementById('fmgr-friends-list').innerHTML = '<div class="fmgr-empty">Sign in to manage friends.</div>';
    document.getElementById('fmgr-groups-list').innerHTML = '';
    return;
  }

  // Load friends and groups
  await _loadManagerFriendsList();
  await _loadManagerGroups();
}

let _userSearchTimeout = null;
async function searchUsersByName(query) {
  const resultsEl = document.getElementById('user-search-results');
  if (!resultsEl) return;
  query = (query || '').trim();
  if (query.length < 2) { resultsEl.innerHTML = ''; return; }

  clearTimeout(_userSearchTimeout);
  _userSearchTimeout = setTimeout(async () => {
    if (!_currentUser || !_fbDb) { resultsEl.innerHTML = '<div class="fmgr-empty">Sign in to search.</div>'; return; }
    resultsEl.innerHTML = '<div class="fmgr-loading">Searching…</div>';
    try {
      // Search by displayName prefix (case-sensitive Firestore limitation)
      const snap = await _fbDb.collection('users')
        .orderBy('displayName')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(8).get();

      const myUid = _currentUser.uid;
      const myDoc = await _fbDb.collection('users').doc(myUid).get();
      const myFriends = (myDoc.data()?.friends || []);

      if (snap.empty) { resultsEl.innerHTML = '<div class="fmgr-empty">No users found.</div>'; return; }
      let html = '';
      snap.forEach(doc => {
        if (doc.id === myUid) return; // skip self
        const d = doc.data();
        const name = d.displayName || d.email || doc.id;
        const isFriend = myFriends.includes(doc.id);
        const initial = name.charAt(0).toUpperCase();
        const photo = d.photoDataUrl
          ? `<img src="${d.photoDataUrl}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
          : initial;
        html += `
          <div class="user-search-result">
            <div class="friend-avatar" style="width:36px;height:36px;font-size:1rem;flex-shrink:0">${photo}</div>
            <div class="user-search-result-name">${name}</div>
            ${isFriend
              ? '<span style="font-size:0.8rem;color:#4ade80">✓ Friends</span>'
              : `<button class="user-search-add-btn" onclick="_handleFriendAdd('${doc.id}');this.textContent='✓ Added';this.disabled=true">+ Add</button>`
            }
          </div>`;
      });
      resultsEl.innerHTML = html || '<div class="fmgr-empty">No users found.</div>';
    } catch(e) {
      resultsEl.innerHTML = '<div class="fmgr-empty">Search failed. Try again.</div>';
    }
  }, 400);
}

async function _loadManagerGroups() {
  const listEl = document.getElementById('fmgr-groups-list');
  if (!listEl || !_currentUser || !_fbDb) return;
  try {
    const snap = await _fbDb.collection('groups')
      .where('members', 'array-contains', _currentUser.uid).get();
    if (snap.empty) {
      listEl.innerHTML = '<div class="fmgr-empty">No groups yet — create one!</div>';
      return;
    }
    let html = '';
    snap.forEach(doc => {
      const g = doc.data();
      const memberCount = (g.members || []).length;
      html += `
        <div class="fmgr-group-row">
          <div class="fmgr-group-icon">👥</div>
          <div class="fmgr-group-info">
            <div class="fmgr-group-name">${g.name}</div>
            <div class="fmgr-group-meta">${memberCount} member${memberCount !== 1 ? 's' : ''}</div>
          </div>
          <div class="fmgr-group-actions">
            <button class="fmgr-remove fmgr-invite-btn" onclick="shareGroupLink('${doc.id}')">Invite</button>
            <button class="fmgr-remove fmgr-leave-btn" onclick="leaveGroup('${doc.id}')">Leave</button>
          </div>
        </div>`;
    });
    listEl.innerHTML = html;
  } catch(e) {
    listEl.innerHTML = '<div class="fmgr-empty">Could not load groups.</div>';
  }
}

async function removeFriendFromManager(friendUid) {
  if (!_currentUser || !_fbDb) return;
  if (!confirm('Remove this friend?')) return;
  try {
    await _fbDb.collection('users').doc(_currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayRemove(friendUid)
    });
    // Refresh just the friends list in the modal without closing/reopening it
    await _loadManagerFriendsList();
    renderFriends();
  } catch(e) {
    alert('Could not remove: ' + (e.code || e.message));
  }
}

async function _loadManagerFriendsList() {
  const listEl = document.getElementById('fmgr-friends-list');
  if (!listEl || !_currentUser || !_fbDb) return;
  listEl.innerHTML = '<div class="fmgr-loading">Loading…</div>';
  try {
    const myDoc = await _fbDb.collection('users').doc(_currentUser.uid).get();
    const friends = myDoc.exists ? (myDoc.data().friends || []) : [];
    if (friends.length === 0) {
      listEl.innerHTML = '<div class="fmgr-empty">No friends yet — share your invite link!</div>';
      return;
    }
    let html = '';
    for (const uid of friends) {
      try {
        const fd = (await _fbDb.collection('users').doc(uid).get()).data() || {};
        const name = fd.displayName || fd.email || uid;
        const initial = name.charAt(0).toUpperCase();
        const photo = fd.photoDataUrl ? `<img src="${fd.photoDataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : initial;
        html += `
          <div class="fmgr-friend-row">
            <div class="fmgr-avatar">${photo}</div>
            <div class="fmgr-friend-name">${name}</div>
            <button class="fmgr-remove" onclick="removeFriendFromManager('${uid}')">Remove</button>
          </div>`;
      } catch(e) { /* skip */ }
    }
    listEl.innerHTML = html;
  } catch(e) {
    listEl.innerHTML = '<div class="fmgr-empty">Could not load friends.</div>';
  }
}

function closeFriendsManager() {
  const modal = document.getElementById('friends-manager-modal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => modal.remove(), 300);
}

function filterFriendsList(query) {
  const rows = document.querySelectorAll('.fmgr-friend-row');
  const q = query.toLowerCase();
  rows.forEach(row => {
    const name = row.querySelector('.fmgr-friend-name')?.textContent.toLowerCase() || '';
    row.style.display = name.includes(q) ? '' : 'none';
  });
}

async function searchFriendsFromContacts() {
  if (!('contacts' in navigator && 'ContactsManager' in window)) {
    // Fallback: open native share with invite link
    const link = `https://habit-tracker-2a0ed.web.app/?add=${_currentUser?.uid || ''}`;
    if (navigator.share) {
      navigator.share({ title: 'Join me on Habit Tracker!', url: link }).catch(() => {});
    } else {
      navigator.clipboard.writeText(link).then(() => alert('Invite link copied! Share it with your contacts.'));
    }
    return;
  }
  try {
    const contacts = await navigator.contacts.select(['name', 'email', 'tel'], { multiple: true });
    if (!contacts || contacts.length === 0) return;
    const link = `https://habit-tracker-2a0ed.web.app/?add=${_currentUser?.uid || ''}`;
    const names = contacts.map(c => (c.name && c.name[0]) || 'Friend').join(', ');
    if (navigator.share) {
      await navigator.share({
        title: 'Join me on Habit Tracker!',
        text: `Hey ${names}, join me on Habit Tracker! 🔥`,
        url: link
      });
    } else {
      navigator.clipboard.writeText(link);
      alert(`Invite link copied! Send it to: ${names}`);
    }
  } catch(e) {
    if (e.name !== 'AbortError') alert('Could not access contacts.');
  }
}

function promptCreateGroup() {
  const name = prompt('Group name:');
  if (!name || !name.trim()) return;
  createGroup(name.trim());
}

async function createGroup(name) {
  if (!_currentUser || !_fbDb) return;
  try {
    const ref = await _fbDb.collection('groups').add({
      name,
      createdBy: _currentUser.uid,
      members: [_currentUser.uid],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await _fbDb.collection('users').doc(_currentUser.uid).set({
      groups: firebase.firestore.FieldValue.arrayUnion(ref.id)
    }, { merge: true });
    shareGroupLink(ref.id);
    await _loadManagerGroups();
    renderFriends();
  } catch(e) {
    alert('Could not create group: ' + (e.code || e.message));
  }
}

function shareGroupLink(groupId) {
  const url = `https://habit-tracker-2a0ed.web.app/?joingroup=${groupId}`;
  if (navigator.share) {
    navigator.share({ title: 'Join my habit group!', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => alert('Group invite link copied!')).catch(() => {});
  }
}

async function joinGroup(groupId) {
  if (!_currentUser || !_fbDb) return;
  try {
    // Use set+merge so it works even if user doc doesn't exist yet
    await _fbDb.collection('groups').doc(groupId).set({
      members: firebase.firestore.FieldValue.arrayUnion(_currentUser.uid)
    }, { merge: true });
    await _fbDb.collection('users').doc(_currentUser.uid).set({
      groups: firebase.firestore.FieldValue.arrayUnion(groupId)
    }, { merge: true });
    renderFriends();
  } catch(e) {
    console.warn('Could not join group:', e);
  }
}

async function leaveGroup(groupId) {
  if (!_currentUser || !_fbDb) return;
  if (!confirm('Leave this group?')) return;
  try {
    await _fbDb.collection('groups').doc(groupId).update({
      members: firebase.firestore.FieldValue.arrayRemove(_currentUser.uid)
    });
    await _fbDb.collection('users').doc(_currentUser.uid).update({
      groups: firebase.firestore.FieldValue.arrayRemove(groupId)
    });
    await _loadManagerGroups();
    renderFriends();
  } catch(e) {
    alert('Could not leave group: ' + (e.code || e.message));
  }
}

// ── MOOD TRACKER ──────────────────────────────────────────
function saveMood(val) {
  const today = getToday();
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  if (!journals[today]) journals[today] = {};
  journals[today].mood = val;
  localStorage.setItem('grateful', JSON.stringify(journals));
  const el = document.getElementById('mood-tracker');
  if (el) {
    const moods = ['😢','😕','😐','🙂','😄'];
    el.innerHTML = `<div class="mood-label">How's your mood today?</div><div class="mood-options">${moods.map((e,i)=>`<button class="mood-btn${val===i+1?' selected':''}" onclick="saveMood(${i+1})">${e}</button>`).join('')}</div>`;
  }
}

// ── PAST GRATITUDE ENTRIES ────────────────────────────────
function _renderPastEntries() {
  const el = document.getElementById('past-entries-section');
  if (!el) return;
  const journals = JSON.parse(localStorage.getItem('grateful') || '{}');
  const today = getToday();
  const moods = ['','😢','😕','😐','🙂','😄'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Build 7-day week calendar (today + 6 days back)
  let dayCells = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today + 'T12:00:00');
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const entry = journals[key];
    const moodEmoji = entry && entry.mood ? moods[entry.mood] : '';
    const isToday = i === 0;
    const dateNum = d.getDate();
    const dayName = days[d.getDay()];
    dayCells += `<div class="mood-week-cell${isToday ? ' today' : ''}">
      <div class="mood-week-day">${dayName}</div>
      <div class="mood-week-date">${dateNum}</div>
      <div class="mood-week-emoji">${moodEmoji || '<span class="mood-week-empty">·</span>'}</div>
    </div>`;
  }

  el.innerHTML = `<div class="past-entries-title">Mood This Week</div>
    <div class="mood-week-calendar">${dayCells}</div>`;
}

// ── ONBOARDING ────────────────────────────────────────────
function _checkOnboarding(cloudData) {
  // Only show for brand-new accounts (no onboardingDone in Firebase)
  if (cloudData && cloudData.onboardingDone) return;
  setTimeout(_showOnboarding, 1500);
}

function _showOnboarding() {
  if (document.getElementById('onboarding-overlay')) return;
  const steps = [
    { emoji: '🔥', title: 'Welcome to Daily Habit Tracker!', body: 'Build powerful daily habits and track your progress. Swipe left or tap the tabs to navigate between pages.' },
    { emoji: '✅', title: 'Track Your Habits', body: 'Tap the check button on any habit to mark it done. Build streaks, see your progress on the Progress tab, and never miss a day.' },
    { emoji: '🎯', title: 'Personalize Your Goals', body: 'Open the menu (☰) and take the Exercise & Sleep surveys to get personalized targets. Then invite friends to stay motivated together!' },
  ];
  // Mark done in Firebase immediately so it never shows again on any device
  localStorage.setItem('onboardingDone', '1');
  if (_currentUser && _fbDb) {
    _fbDb.collection('users').doc(_currentUser.uid).set({ onboardingDone: '1' }, { merge: true });
  }
  let step = 0;
  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.className = 'onboarding-overlay';
  function renderOverlay() {
    const s = steps[step];
    const isLast = step === steps.length - 1;
    const dots = steps.map((_,i) => `<div class="onboarding-dot${i===step?' active':''}"></div>`).join('');
    overlay.innerHTML = `<div class="onboarding-card">
      <div class="onboarding-emoji">${s.emoji}</div>
      <div class="onboarding-title">${s.title}</div>
      <div class="onboarding-body">${s.body}</div>
      <div class="onboarding-dots">${dots}</div>
      <button class="onboarding-next-btn" onclick="_onboardingNext()">
        ${isLast ? "Let's Go! 🔥" : 'Next →'}
      </button>
    </div>`;
  }
  window._onboardingNext = () => {
    if (step < steps.length - 1) { step++; renderOverlay(); }
    else { localStorage.setItem('onboardingDone', '1'); overlay.remove(); }
  };
  renderOverlay();
  document.body.appendChild(overlay);
}

// ── WEEKLY FOCUS ─────────────────────────────────────────
function _renderWeeklyFocus() {
  const habitsPage = document.getElementById('page-habits');
  if (!habitsPage) return;
  let focusCard = document.getElementById('weekly-focus-card');
  if (!focusCard) {
    focusCard = document.createElement('div');
    focusCard.id = 'weekly-focus-card';
    focusCard.className = 'weekly-focus-card';
    const header = habitsPage.querySelector('.habits-header-row');
    if (header) header.insertAdjacentElement('afterend', focusCard);
    else habitsPage.querySelector('.page-inner')?.insertAdjacentElement('afterbegin', focusCard);
  }
  const weekKey = _getWeekKey();
  const saved = JSON.parse(localStorage.getItem('weeklyFocus') || '{}');
  const currentFocus = saved[weekKey] || '';
  const isEditing = focusCard.dataset.editing === 'true';

  if (isEditing || !currentFocus) {
    focusCard.innerHTML = `
      <div class="weekly-focus-header"><span class="weekly-focus-icon">🎯</span><span class="weekly-focus-title">This Week's Focus</span></div>
      <textarea class="weekly-focus-input" id="weekly-focus-input" placeholder="What's your main focus this week? e.g. 'Build the morning routine habit'" maxlength="160">${currentFocus}</textarea>
      <button class="weekly-focus-save-btn" onclick="_saveWeeklyFocus()">Save Focus</button>`;
    if (isEditing) setTimeout(() => document.getElementById('weekly-focus-input')?.focus(), 50);
  } else {
    focusCard.innerHTML = `
      <div class="weekly-focus-header"><span class="weekly-focus-icon">🎯</span><span class="weekly-focus-title">This Week's Focus</span></div>
      <div class="weekly-focus-text">${currentFocus}</div>
      <button class="weekly-focus-save-btn" onclick="document.getElementById('weekly-focus-card').dataset.editing='true';_renderWeeklyFocus()">Edit</button>`;
  }
  focusCard.dataset.editing = 'false';
}

function _saveWeeklyFocus() {
  const input = document.getElementById('weekly-focus-input');
  if (!input) return;
  const weekKey = _getWeekKey();
  const saved = JSON.parse(localStorage.getItem('weeklyFocus') || '{}');
  saved[weekKey] = input.value.trim();
  localStorage.setItem('weeklyFocus', JSON.stringify(saved));
  const card = document.getElementById('weekly-focus-card');
  if (card) card.dataset.editing = 'false';
  _renderWeeklyFocus();
}

function _getWeekKey() {
  const d = new Date();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}`;
}

// ── MORNING / DAY / NIGHT SECTIONS ───────────────────────
// Time-of-day label for habits (optional field: 'timeOfDay')
const TIME_SECTIONS = [
  { key: 'morning',   label: 'Morning',   icon: '🌅', startH: 5,  endH: 12 },
  { key: 'afternoon', label: 'Afternoon', icon: '☀️',  startH: 12, endH: 17 },
  { key: 'evening',   label: 'Evening',   icon: '🌆', startH: 17, endH: 21 },
  { key: 'night',     label: 'Night',     icon: '🌙', startH: 21, endH: 29 }, // 29 = 5am next day
  { key: 'anytime',   label: 'Anytime',   icon: '⭐', startH: 0,  endH: 29 },
];

function getCurrentTimeSection() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

// Add timeOfDay to habit (used in edit mode select)
function updateHabitTimeOfDay(id, timeOfDay) {
  const habits = getHabits().map(h => h.id === id ? { ...h, timeOfDay } : h);
  saveHabitsConfig(habits);
}

// ── SESSION / TOKEN USAGE DISPLAY ───────────────────────
function _showSessionStartBanner() {
  // Show session info banner at top of habits page
  const existing = document.getElementById('session-banner');
  if (existing) return; // only show once per session

  const today = getToday();
  const data = loadData();
  const todayData = data[today] || {};
  const habits = getHabits();
  const done = habits.filter(h => !!todayData[h.id]).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const tokens = _tokens || 0;
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const banner = document.createElement('div');
  banner.id = 'session-banner';
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:8000;
    background:linear-gradient(135deg,rgba(15,15,25,0.97),rgba(25,25,40,0.97));
    border-bottom:1px solid rgba(245,158,11,0.3);
    padding:calc(env(safe-area-inset-top,0px) + 16px) 20px 16px;
    animation:slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1);
  `;
  banner.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;max-width:500px;margin:0 auto">
      <div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:2px">New Session • ${dateStr}</div>
        <div style="font-size:1rem;font-weight:700;color:#f59e0b">🔥 ${tokens.toLocaleString()} tokens</div>
        <div style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:2px">
          ${total > 0 ? `${done}/${total} habits done today (${pct}%)` : 'No habits yet — add some!'}
        </div>
      </div>
      <button onclick="document.getElementById('session-banner')?.remove()"
        style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer">✕</button>
    </div>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 6000);
}
