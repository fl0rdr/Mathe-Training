const STORAGE_KEYS = {
  test: 'mathTrainingLeaderboardTest',
  intensive: 'mathTrainingLeaderboardIntensive',
  settings: 'mathTrainingSettings'
};

const MODES = {
  quick: { label: 'Quick Training', tasks: 10, requiresName: false },
  test: { label: 'Test', tasks: 20, requiresName: true },
  intensive: { label: 'Intensive Test', tasks: 40, requiresName: true }
};

const DEFAULT_LEADERBOARD = {
  test: [
    { name: 'Alex', correct: 18, total: 20, percentage: 90, time: 42, date: '2026-10-09', mode: 'Test' },
    { name: 'Mia', correct: 17, total: 20, percentage: 85, time: 45, date: '2026-10-09', mode: 'Test' },
    { name: 'Leo', correct: 16, total: 20, percentage: 80, time: 50, date: '2026-10-09', mode: 'Test' }
  ],
  intensive: [
    { name: 'Nina', correct: 34, total: 40, percentage: 85, time: 110, date: '2026-10-09', mode: 'Intensive Test' },
    { name: 'Omar', correct: 31, total: 40, percentage: 78, time: 130, date: '2026-10-09', mode: 'Intensive Test' },
    { name: 'Zoe', correct: 28, total: 40, percentage: 70, time: 135, date: '2026-10-09', mode: 'Intensive Test' }
  ]
};

const state = {
  currentView: 'home',
  selectedMode: 'quick',
  leaderboardMode: 'test',
  playerName: '',
  tasks: [],
  currentIndex: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timerSeconds: 0,
  timerInterval: null,
  leaderboard: { test: [], intensive: [] },
  incorrectEntries: [],
  isSessionActive: false
};

const elements = {
  homeView: document.getElementById('homeView'),
  prepView: document.getElementById('prepView'),
  trainingView: document.getElementById('trainingView'),
  resultView: document.getElementById('resultView'),
  navButtons: [...document.querySelectorAll('.nav-btn')],
  menuToggle: document.querySelector('.menu-toggle'),
  nav: document.querySelector('.nav'),
  modeCards: [...document.querySelectorAll('.mode-card')],
  leaderboardBody: document.getElementById('leaderboardBody'),
  leaderboardButtons: [...document.querySelectorAll('.toggle-btn')],
  resetLeaderboardBtn: document.getElementById('resetLeaderboardBtn'),
  prepTitle: document.getElementById('prepTitle'),
  prepModeLabel: document.getElementById('prepModeLabel'),
  prepQuestionCount: document.getElementById('prepQuestionCount'),
  playerNameWrap: document.getElementById('playerNameWrap'),
  playerNameInput: document.getElementById('playerNameInput'),
  startBtn: document.getElementById('startBtn'),
  backToHomeBtn: document.getElementById('backToHomeBtn'),
  questionCounter: document.getElementById('questionCounter'),
  timerValue: document.getElementById('timerValue'),
  progressFill: document.getElementById('progressFill'),
  questionDisplay: document.getElementById('questionDisplay'),
  answerInput: document.getElementById('answerInput'),
  submitAnswerBtn: document.getElementById('submitAnswerBtn'),
  cancelTrainingBtn: document.getElementById('cancelTrainingBtn'),
  resultName: document.getElementById('resultName'),
  resultMode: document.getElementById('resultMode'),
  resultCorrect: document.getElementById('resultCorrect'),
  resultWrong: document.getElementById('resultWrong'),
  resultAccuracy: document.getElementById('resultAccuracy'),
  resultTime: document.getElementById('resultTime'),
  resultRank: document.getElementById('resultRank'),
  resultTotal: document.getElementById('resultTotal'),
  motivationalMessage: document.getElementById('motivationalMessage'),
  incorrectList: document.getElementById('incorrectList'),
  restartBtn: document.getElementById('restartBtn'),
  homeFromResultBtn: document.getElementById('homeFromResultBtn')
};

function loadLeaderboards() {
  try {
    const storedTest = JSON.parse(localStorage.getItem(STORAGE_KEYS.test) || 'null');
    const storedIntensive = JSON.parse(localStorage.getItem(STORAGE_KEYS.intensive) || 'null');

    state.leaderboard.test = Array.isArray(storedTest) ? storedTest : DEFAULT_LEADERBOARD.test;
    state.leaderboard.intensive = Array.isArray(storedIntensive) ? storedIntensive : DEFAULT_LEADERBOARD.intensive;
  } catch (error) {
    state.leaderboard = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
  }
}

function saveLeaderboard(mode) {
  try {
    const key = mode === 'test' ? STORAGE_KEYS.test : STORAGE_KEYS.intensive;
    localStorage.setItem(key, JSON.stringify(state.leaderboard[mode]));
  } catch (error) {
    console.warn('localStorage unavailable');
  }
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getSortWeight(entry) {
  return { correct: entry.correct, time: entry.time || 9999 };
}

function sortLeaderboard(list) {
  return [...list].sort((a, b) => {
    if (b.correct !== a.correct) return b.correct - a.correct;
    if (a.time !== b.time) return a.time - b.time;
    return 0;
  }).slice(0, 10);
}

function renderLeaderboard() {
  const list = sortLeaderboard(state.leaderboard[state.leaderboardMode] || []);
  elements.leaderboardBody.innerHTML = list.map((entry, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.correct}/${entry.total} (${entry.percentage}%)</td>
      <td>${formatTime(entry.time)}</td>
    </tr>
  `).join('') || '<tr><td colspan="4">No scores yet</td></tr>';
}

function showView(viewName) {
  state.currentView = viewName;

  [elements.homeView, elements.prepView, elements.trainingView, elements.resultView].forEach((view) => {
    view.classList.toggle('active', view.id === `${viewName}View`);
  });

  elements.navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName || (viewName === 'quick' && button.dataset.view === 'home'));
  });

  if (viewName === 'home') {
    renderLeaderboard();
  }
}

function openMode(modeKey) {
  state.selectedMode = modeKey;
  const mode = MODES[modeKey];

  elements.prepTitle.textContent = mode.label;
  elements.prepModeLabel.textContent = mode.label;
  elements.prepQuestionCount.textContent = mode.tasks;

  elements.playerNameWrap.classList.toggle('hidden', !mode.requiresName);
  elements.playerNameInput.value = state.playerName;
  elements.startBtn.disabled = mode.requiresName && !state.playerName.trim();

  if (mode.requiresName) {
    elements.playerNameInput.focus();
  }

  showView('prep');
}

function generateTaskExpression() {
  const patterns = [
    'add',
    'sub',
    'addAdd',
    'subAdd',
    'subSub'
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  let a = 0;
  let b = 0;
  let c = 0;
  let expression = '';
  let answer = 0;

  do {
    a = Math.floor(Math.random() * 101);
    b = Math.floor(Math.random() * 101);
    c = Math.floor(Math.random() * 101);

    if (pattern === 'add') {
      expression = `${a} + ${b}`;
      answer = a + b;
    }

    if (pattern === 'sub') {
      const left = Math.max(a, b);
      const right = Math.min(a, b);
      expression = `${left} - ${right}`;
      answer = left - right;
    }

    if (pattern === 'addAdd') {
      expression = `${a} + ${b} + ${c}`;
      answer = a + b + c;
    }

    if (pattern === 'subAdd') {
      const start = Math.max(a, b);
      expression = `${start} - ${b} + ${c}`;
      answer = start - b + c;
    }

    if (pattern === 'subSub') {
      const start = Math.max(a, b);
      expression = `${start} - ${b} - ${c}`;
      answer = start - b - c;
    }
  } while (
    answer < 0 ||
    answer > 100 ||
    (expression.includes('-') && expression.includes('+') && answer > 100)
  );

  return { expression, answer };
}

function generateTaskSet(total) {
  const set = [];
  const seen = new Set();

  while (set.length < total) {
    const task = generateTaskExpression();
    const key = task.expression;

    if (!seen.has(key)) {
      seen.add(key);
      set.push(task);
    }
  }

  return set;
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timerSeconds += 1;
    elements.timerValue.textContent = formatTime(state.timerSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

function startSession() {
  const mode = MODES[state.selectedMode];
  state.playerName = mode.requiresName ? elements.playerNameInput.value.trim() : 'Quick Player';

  if (mode.requiresName && !state.playerName) {
    elements.playerNameInput.focus();
    return;
  }

  state.tasks = generateTaskSet(mode.tasks);
  state.currentIndex = 0;
  state.correctAnswers = 0;
  state.wrongAnswers = 0;
  state.incorrectEntries = [];
  state.timerSeconds = 0;
  state.isSessionActive = true;
  elements.answerInput.value = '';
  elements.answerInput.focus();
  renderQuestion();
  startTimer();
  showView('training');
}

function renderQuestion() {
  const task = state.tasks[state.currentIndex];

  if (!task) {
    finishSession();
    return;
  }

  const progress = ((state.currentIndex + 1) / state.tasks.length) * 100;
  elements.questionCounter.textContent = `Question ${state.currentIndex + 1} of ${state.tasks.length}`;
  elements.progressFill.style.width = `${progress}%`;
  elements.questionDisplay.textContent = `${task.expression} = ?`;
  elements.answerInput.value = '';
  elements.answerInput.focus();
}

function submitAnswer() {
  if (!state.isSessionActive) return;

  const task = state.tasks[state.currentIndex];
  const value = Number(elements.answerInput.value);

  if (Number.isNaN(value)) {
    elements.answerInput.focus();
    return;
  }

  if (value === task.answer) {
    state.correctAnswers += 1;
  } else {
    state.wrongAnswers += 1;
    state.incorrectEntries.push(`${task.expression} = ${value}`);
  }

  state.currentIndex += 1;

  if (state.currentIndex >= state.tasks.length) {
    finishSession();
    return;
  }

  renderQuestion();
}

function getMotivationalMessage(accuracy) {
  if (accuracy === 100) return 'Fantastic! Perfect score!';
  if (accuracy >= 80) return 'Great job!';
  if (accuracy >= 60) return 'Good work! Keep practicing!';
  return 'Practice makes perfect!';
}

function finishSession() {
  state.isSessionActive = false;
  stopTimer();

  const total = state.tasks.length;
  const accuracy = total === 0 ? 0 : Math.round((state.correctAnswers / total) * 100);
  const modeKey = state.selectedMode;
  const modeLabel = MODES[modeKey].label;
  const rankText = 'Unranked';

  elements.resultName.textContent = state.playerName;
  elements.resultMode.textContent = modeLabel;
  elements.resultCorrect.textContent = state.correctAnswers;
  elements.resultWrong.textContent = state.wrongAnswers;
  elements.resultAccuracy.textContent = `${accuracy}%`;
  elements.resultTime.textContent = formatTime(state.timerSeconds);
  elements.resultTotal.textContent = total;
  elements.resultRank.textContent = rankText;
  elements.motivationalMessage.textContent = getMotivationalMessage(accuracy);

  elements.incorrectList.innerHTML = state.incorrectEntries.length
    ? state.incorrectEntries.map((item) => `<li>${item}</li>`).join('')
    : '<li>No incorrect answers.</li>';

  if (modeKey !== 'quick') {
    const entry = {
      name: state.playerName,
      correct: state.correctAnswers,
      total,
      percentage: accuracy,
      time: state.timerSeconds,
      date: new Date().toISOString().slice(0, 10),
      mode: modeLabel
    };

    state.leaderboard[modeKey].push(entry);
    state.leaderboard[modeKey] = sortLeaderboard(state.leaderboard[modeKey]);
    state.leaderboard[modeKey] = state.leaderboard[modeKey].slice(0, 10);
    saveLeaderboard(modeKey);

    const rankingData = state.leaderboard[modeKey];
    const index = rankingData.findIndex((item) => item.name === state.playerName && item.time === state.timerSeconds && item.correct === state.correctAnswers);
    if (index >= 0) {
      elements.resultRank.textContent = `#${index + 1}`;
    }
  }

  renderLeaderboard();
  showView('result');
}

function resetLeaderboard() {
  state.leaderboard.test = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD.test));
  state.leaderboard.intensive = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD.intensive));
  saveLeaderboard('test');
  saveLeaderboard('intensive');
  renderLeaderboard();
}

function bindEvents() {
  elements.menuToggle.addEventListener('click', () => {
    elements.nav.classList.toggle('open');
  });

  elements.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.view;
      if (mode === 'home') {
        showView('home');
        elements.nav.classList.remove('open');
        return;
      }

      if (mode === 'quick') {
        state.selectedMode = 'quick';
        showView('prep');
        openMode('quick');
        return;
      }

      if (mode === 'test') {
        state.selectedMode = 'test';
        openMode('test');
        return;
      }

      if (mode === 'intensive') {
        state.selectedMode = 'intensive';
        openMode('intensive');
        return;
      }
    });
  });

  elements.modeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      openMode(mode);
    });
  });

  elements.leaderboardButtons.forEach((button) => {
    button.addEventListener('click', () => {
      elements.leaderboardButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      state.leaderboardMode = button.dataset.leaderboard;
      renderLeaderboard();
    });
  });

  elements.resetLeaderboardBtn.addEventListener('click', resetLeaderboard);

  elements.playerNameInput.addEventListener('input', () => {
    const isValid = state.selectedMode !== 'quick' && elements.playerNameInput.value.trim().length > 0;
    elements.startBtn.disabled = !isValid;
  });

  elements.startBtn.addEventListener('click', startSession);
  elements.backToHomeBtn.addEventListener('click', () => showView('home'));
  elements.submitAnswerBtn.addEventListener('click', submitAnswer);
  elements.cancelTrainingBtn.addEventListener('click', () => {
    stopTimer();
    showView('home');
  });
  elements.restartBtn.addEventListener('click', () => openMode(state.selectedMode));
  elements.homeFromResultBtn.addEventListener('click', () => showView('home'));

  elements.answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submitAnswer();
    }
  });
}

function initialise() {
  loadLeaderboards();
  renderLeaderboard();
  elements.playerNameInput.value = '';
  elements.startBtn.disabled = true;
  showView('home');
  bindEvents();
}

initialise();
