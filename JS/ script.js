function getCurrentUser() {
  const user = localStorage.getItem('basalt_user');
  return user ? JSON.parse(user) : null;
}

function checkAuth() {
  const user = getCurrentUser();
  const page = window.location.pathname.split('/').pop();
  if (!user && page !== 'login.html') {
    window.location.href = 'login.html';
  }
  return user;
}

function updateUserUI() {
  const user = getCurrentUser();
  if (user) {
    document.querySelectorAll('.username-display, #usernameDisplay').forEach(el => {
      if (el) el.innerText = '@' + user.name;
    });
    document.querySelectorAll('.avatar-init, #avatarInit').forEach(el => {
      if (el) el.innerText = (user.name?.[1] || 'U').toUpperCase();
    });
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.innerText = '@' + user.name;
    const bigAvatar = document.getElementById('bigAvatar');
    if (bigAvatar) bigAvatar.innerText = (user.name?.[1] || 'U').toUpperCase();
  }
}

function logout() {
  localStorage.removeItem('basalt_user');
  window.location.href = 'login.html';
}

function initLoginPage() {
  const tabLogin = document.getElementById('tabLoginBtn');
  const tabRegister = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authMsg = document.getElementById('authMsg');

  function showMsg(msg, isErr) {
    if (!authMsg) return;
    authMsg.textContent = msg;
    authMsg.className = `mt-4 text-sm text-center p-2 rounded-lg ${isErr ? 'bg-red-500/20 text-red-400' : 'bg-arena-cyan/20 text-arena-cyan'}`;
    authMsg.classList.remove('hidden');
    setTimeout(() => authMsg.classList.add('hidden'), 3000);
  }

  if (tabLogin && tabRegister) {
    tabLogin.onclick = () => {
      tabLogin.classList.add('bg-arena-cyan', 'text-arena-dark');
      tabRegister.classList.remove('bg-arena-cyan', 'text-arena-dark');
      tabRegister.classList.add('text-gray-400');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    };
    tabRegister.onclick = () => {
      tabRegister.classList.add('bg-arena-cyan', 'text-arena-dark');
      tabLogin.classList.remove('bg-arena-cyan', 'text-arena-dark');
      tabLogin.classList.add('text-gray-400');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    };
  }

  const doLogin = document.getElementById('doLogin');
  if (doLogin) {
    doLogin.onclick = () => {
      const u = document.getElementById('loginUsername')?.value.trim();
      const p = document.getElementById('loginPassword')?.value;
      if (!u || !p) { showMsg('Заполните все поля!', true); return; }
      if (p === '123456') {
        localStorage.setItem('basalt_user', JSON.stringify({ name: u }));
        showMsg(`Добро пожаловать, ${u}!`, false);
        setTimeout(() => window.location.href = 'index.html', 1000);
      } else { showMsg('Неверный пароль', true); }
    };
  }

  const doRegister = document.getElementById('doRegister');
  if (doRegister) {
    doRegister.onclick = () => {
      const u = document.getElementById('regUsername')?.value.trim();
      const p = document.getElementById('regPassword')?.value;
      const p2 = document.getElementById('regConfirm')?.value;
      const agreed = document.getElementById('agreeRules')?.checked;
      if (!u || !p || !p2) { showMsg('Заполните все поля!', true); return; }
      if (p !== p2) { showMsg('Пароли не совпадают!', true); return; }
      if (!agreed) { showMsg('Примите правила арены!', true); return; }
      localStorage.setItem('basalt_user', JSON.stringify({ name: u }));
      showMsg(`Регистрация успешна!`, false);
      setTimeout(() => window.location.href = 'index.html', 1000);
    };
  }

  const githubBtn = document.getElementById('githubBtn');
  const telegramBtn = document.getElementById('telegramBtn');
  const forgotLink = document.getElementById('forgotLink');
  if (githubBtn) githubBtn.onclick = () => showMsg('GitHub вход в разработке', false);
  if (telegramBtn) telegramBtn.onclick = () => showMsg('Telegram вход в разработке', false);
  if (forgotLink) forgotLink.onclick = (e) => { e.preventDefault(); showMsg('Инструкции отправлены на почту (демо)', false); };
}

const tasks = [
  { id: 1, title: "Реализовать форму регистрации", desc: "Сверстать форму по макету, добавить валидацию", difficulty: "easy", reward: 500 },
  { id: 2, title: "Настроить мок-API", desc: "Создать заглушки для авторизации", difficulty: "medium", reward: 1000 },
  { id: 3, title: "Добавить таймер обратного отсчёта", desc: "Таймер до дедлайна спринта", difficulty: "easy", reward: 400 },
  { id: 4, title: "Верстка страницы профиля", desc: "Адаптивная верстка с табами", difficulty: "hard", reward: 1500 }
];

const diffMap = {
  easy: { text: '🟢 Лёгкий', class: 'bg-green-900/30 text-arena-green' },
  medium: { text: '🔵 Средний', class: 'bg-cyan-900/30 text-arena-cyan' },
  hard: { text: '🔴 Сложный', class: 'bg-orange-900/30 text-orange-400' }
};

function renderTasks() {
  const container = document.getElementById('tasksGrid');
  if (!container) return;
  container.innerHTML = tasks.map(t => `
    <div class="bg-arena-card rounded-2xl border border-arena-border p-5 hover:border-arena-cyan transition">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${diffMap[t.difficulty].class}">${diffMap[t.difficulty].text}</span>
      <h3 class="text-lg font-semibold mt-3">${t.title}</h3>
      <p class="text-gray-400 text-sm mt-1">${t.desc}</p>
      <div class="flex justify-between items-center mt-4">
        <span class="text-arena-green font-semibold">💰 ${t.reward} баллов</span>
        <button onclick="openModal(${t.id})" class="bg-arena-cyan text-arena-dark px-4 py-1.5 rounded-full text-sm font-semibold">Сдать решение</button>
      </div>
    </div>
  `).join('');
}

function startIndexTimer() {
  let seconds = 7 * 86400 + 12 * 3600 + 30 * 60 + 15;
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  const interval = setInterval(() => {
    if (seconds <= 0) {
      timerEl.innerText = 'Спринт завершён!';
      clearInterval(interval);
      return;
    }
    seconds--;
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    timerEl.innerText = `${d}д ${h}ч ${m}м ${s}с`;
  }, 1000);
}

window.openModal = () => { const modal = document.getElementById('modal'); if (modal) modal.style.display = 'flex'; };
window.closeModal = () => { const modal = document.getElementById('modal'); if (modal) modal.style.display = 'none'; };
window.closeSuccessModal = () => { const modal = document.getElementById('successModal'); if (modal) modal.style.display = 'none'; };

const solutions = [
  { name: "Nakir", date: "14 мая 2026", score: 100, rank: 1, plus: "+12% к прошлому спринту" },
  { name: "ilgiz", date: "13 мая 2026", score: 92, rank: 2 },
  { name: "Radik", date: "13 мая 2026", score: 88, rank: 3 },
  { name: "Масжид", date: "12 мая 2026", score: 84, rank: 4 },
  { name: "Be yourself.", date: "12 мая 2026", score: 80, rank: 5 }
];

let currentSort = 'score';
let visible = 4;

function renderLeaderboard() {
  let sorted = [...solutions];
  if (currentSort === 'score') sorted.sort((a, b) => b.score - a.score);
  else sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('solutionsList');
  if (!container) return;

  container.innerHTML = sorted.slice(0, visible).map(s => `
    <div class="bg-arena-card rounded-xl border border-arena-border p-4 ${s.rank === 1 ? 'winner-card' : ''}">
      <div class="flex justify-between items-center flex-wrap gap-3">
        <div class="flex gap-3 items-center">
          <div class="w-10 h-10 rounded-full bg-arena-cyan/20 flex items-center justify-center font-bold">${s.rank}</div>
          <div>
            <div class="font-semibold">${s.name}</div>
            <div class="text-xs text-gray-500">${s.date} • Оценка наставника: ${s.score}</div>
            ${s.plus ? `<div class="text-xs text-green-400">${s.plus}</div>` : ''}
          </div>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded-full text-xs bg-gray-800">КОД</button>
          <button class="px-3 py-1 rounded-full text-xs bg-gray-800">ДЕМО</button>
        </div>
      </div>
    </div>
  `).join('');
}

function startHallTimer() {
  let time = 2 * 3600 + 45 * 60 + 12;
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  setInterval(() => {
    if (time > 0) {
      time--;
      const h = Math.floor(time / 3600);
      const m = Math.floor((time % 3600) / 60);
      const s = time % 60;
      timerEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }, 1000);
}

const badges = [
  { name: "Газующий", desc: "Не пропустил ни одного спринта", icon: "🏆" },
  { name: "Архитектор", desc: "Создатель Basalt Arena", icon: "🏆" },
  { name: "Первый", desc: "Выложил решение первым", icon: "🏆" },
  { name: "Невидимка", desc: "Ни разу не участвовал", icon: "👻", locked: true }
];

function renderBadges() {
  const container = document.getElementById('badgesGrid');
  if (!container) return;
  container.innerHTML = badges.map(b => `
    <div class="bg-arena-card border border-arena-border rounded-xl p-4 text-center ${b.locked ? 'opacity-40 border-red-500/30' : ''}">
      <div class="w-16 h-16 mx-auto rounded-full bg-arena-cyan/10 flex items-center justify-center text-2xl mb-2">${b.icon}</div>
      <div class="font-semibold ${b.locked ? 'text-red-300' : ''}">${b.name}</div>
      <div class="text-xs text-gray-500 mt-1">${b.desc}</div>
    </div>
  `).join('');
}

function initProfileTabs() {
  const tabAch = document.getElementById('tabAchievements');
  const tabSet = document.getElementById('tabSettings');
  const panelAch = document.getElementById('achievementsPanel');
  const panelSet = document.getElementById('settingsPanel');

  if (tabAch && tabSet) {
    tabAch.onclick = () => {
      tabAch.classList.add('text-arena-cyan', 'border-b-2', 'border-arena-cyan');
      tabAch.classList.remove('text-gray-400');
      tabSet.classList.remove('text-arena-cyan', 'border-b-2', 'border-arena-cyan');
      tabSet.classList.add('text-gray-400');
      panelAch.classList.remove('hidden');
      panelSet.classList.add('hidden');
    };
    tabSet.onclick = () => {
      tabSet.classList.add('text-arena-cyan', 'border-b-2', 'border-arena-cyan');
      tabSet.classList.remove('text-gray-400');
      tabAch.classList.remove('text-arena-cyan', 'border-b-2', 'border-arena-cyan');
      tabAch.classList.add('text-gray-400');
      panelSet.classList.remove('hidden');
      panelAch.classList.add('hidden');
    };
  }
}

function initProfileSave() {
  const saveBtn = document.getElementById('saveSettings');
  const cancelBtn = document.getElementById('cancelSettings');
  const msgEl = document.getElementById('settingsMsg');

  if (saveBtn) {
    saveBtn.onclick = () => {
      if (msgEl) {
        msgEl.innerHTML = '✅ Профиль обновлён!';
        msgEl.className = 'text-sm text-arena-cyan mt-2 text-center';
        setTimeout(() => msgEl.innerHTML = '', 2000);
      }
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      document.getElementById('editName').value = 'dev_architect';
      document.getElementById('editEmail').value = 'ahmad@basalt-arena.io';
      document.getElementById('editTelegram').value = '@dev_arch';
      document.getElementById('editBio').value = 'Разработчик. Учусь, делаю проекты, участвую в спринтах Basalt Arena.';
      if (msgEl) {
        msgEl.innerHTML = '🔁 Изменения отменены';
        msgEl.className = 'text-sm text-gray-400 mt-2 text-center';
        setTimeout(() => msgEl.innerHTML = '', 2000);
      }
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  checkAuth();
  updateUserUI();

  document.querySelectorAll('#logoutBtn, #logoutBtn2, #logoutBtn3').forEach(btn => {
    if (btn) btn.onclick = logout;
  });

  if (page === 'login.html') initLoginPage();
  if (page === 'index.html') { renderTasks(); startIndexTimer(); }
  if (page === 'hall.html') { renderLeaderboard(); startHallTimer(); }
  if (page === 'profile.html') { renderBadges(); initProfileTabs(); initProfileSave(); }

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.onclick = () => document.getElementById('successModal').style.display = 'flex';

  const confirmSubmit = document.getElementById('confirmSubmit');
  if (confirmSubmit) {
    confirmSubmit.onclick = () => {
      const sol = document.getElementById('solutionText')?.value.trim();
      if (!sol) { alert('Введи ссылку!'); return; }
      alert('✅ Решение отправлено! (мок-API)');
      closeModal();
    };
  }

  const sortScore = document.getElementById('sortScore');
  const sortDate = document.getElementById('sortDate');
  const loadMore = document.getElementById('loadMore');
  if (sortScore) sortScore.onclick = () => { currentSort = 'score'; renderLeaderboard(); };
  if (sortDate) sortDate.onclick = () => { currentSort = 'date'; renderLeaderboard(); };
  if (loadMore) loadMore.onclick = () => { visible += 4; renderLeaderboard(); };
});