const questions = [
  { q: "مصطلح “الهندرة” (BPR) الذي يعتبر من أهم المتطلبات التنظيمية للإدارة الإلكترونية يعني:", options: ["شراء حواسيب وخوادم جديدة لجميع الأقسام.", "مكننة الإجراءات الإدارية كما هي دون تغيير.", "إعادة هندسة العمليات وتبسيط الإجراءات وحذف الخطوات الزائدة قبل رقمنتها.", "تغيير المدير العام والإدارة العليا للمؤسسة."], answer: 2 },
  { q: "ما هو التحدي الأكبر والأصعب الذي يواجه مشاريع الإدارة الإلكترونية من الجانب “البشري”؟", options: ["نقص الميزانية المخصصة لرواتب العمال.", "عدم توفر شبكة إنترنت سريعة في المنازل.", "صعوبة إيجاد مهندسي إعلام آلي.", "مقاومة التغيير والخوف من التكنولوجيا لدى الموظفين المعتادين على الورق."], answer: 3 },
  { q: "لتفادي مشكلة “الجزر المعلوماتية” (أنظمة وبرمجيات لا تتواصل مع بعضها بين الوزارات)، يجب الاعتماد على:", options: ["توحيد ألوان وتصميم المواقع الحكومية.", "فرض نظام عقوبات على الموظفين غير المتفاعلين.", "إرساء التوافق البيني (Interoperability) بين الإدارات.", "الاعتماد الكلي على الشبكات الاجتماعية للتواصل."], answer: 2 },
  { q: "ما هو التشريع الجزائري الذي يعطي للوثيقة الإلكترونية نفس الحجية القانونية للوثيقة الورقية التقليدية؟", options: ["قانون المالية لسنة 2010.", "القانون 15-04 المتعلق بالتوقيع والتصديق الإلكترونيين.", "قانون الوظيفة العمومية لعام 2006.", "قانون حماية المستهلك وقمع الغش."], answer: 1 },
  { q: "في أي سنة أطلق الصندوق الوطني للتأمينات الاجتماعية (CNAS) نظام بطاقة “الشفاء” بشكل رسمي؟", options: ["1999", "2002", "2007", "2012"], answer: 2 },
  { q: "أي من المنصات الرقمية التالية التابعة لـ (CNAS) موجهة خصيصاً لتسهيل عمل أرباب العمل (الشركات)؟", options: ["فضاء الهناء.", "بوابة الشفاء المفتوحة.", "المنصة الوطنية للعطل المرضية.", "بوابة التصريح عن بعد (Télé-déclaration)."], answer: 3 },
  { q: "تعتبر إستونيا رائدة عالمياً بفضل شبكتها اللامركزية التي تربط كل وزاراتها ومؤسساتها، وتسمى هذه الشبكة:", options: ["E-Estonia Network.", "X-Road.", "Baltic Data Center.", "Y-Connect."], answer: 1 },
  { q: "لضمان أقصى درجات الأمن والسرية للسجلات الطبية والمالية للمواطنين ومنع تزويرها، تعتمد إستونيا تقنية:", options: ["الذكاء الاصطناعي التوليدي (GenAI).", "الحوسبة الكمية (Quantum Computing).", "البلوكتشين (Blockchain) وتحديداً (KSI Blockchain).", "الميتافيرس الصحي (Health Metaverse)."], answer: 2 },
  { q: "في مراحل تطور الإدارة الإلكترونية، المرحلة التي تركز أساساً على إعطاء “تقارير دورية” للإدارة الوسطى تسمى:", options: ["نظم دعم القرار (DSS).", "نظم المعلومات الإدارية (MIS).", "المعالجة الآلية للبيانات (EDP).", "الإدارة المتكاملة عبر الإنترنت (Web-based Management)."], answer: 1 },
  { q: "أي من العبارات التالية يصف بدقة الفرق بين “الحكومة الإلكترونية” و“الحوكمة الإلكترونية”؟", options: ["هما مصطلحان مترادفان تماماً ولا يوجد فرق بينهما.", "الحكومة تستخدم الحواسيب، بينما الحوكمة تستخدم الهواتف الذكية.", "الحكومة هي تحويل الخدمة لخدمة رقمية، بينما الحوكمة هي استخدام التكنولوجيا لتعزيز الشفافية والمساءلة وإشراك المواطن.", "الحوكمة تسبق دائماً الحكومة في مراحل التطور التكنولوجي."], answer: 2 }
];

const LEADERBOARD_KEY = "quickQuizLeaderboard";
const TIME_PER_QUESTION = 15;
const $ = id => document.getElementById(id);
const PLAYED_KEY = "quickQuizPlayed";

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function hasPlayed(name) {
  try {
    const list = JSON.parse(localStorage.getItem(PLAYED_KEY)) || [];
    return list.includes(normalizeName(name));
  } catch (e) {
    return false;
  }
}

function markPlayed(name) {
  try {
    const list = JSON.parse(localStorage.getItem(PLAYED_KEY)) || [];
    const key = normalizeName(name);
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(PLAYED_KEY, JSON.stringify(list));
    }
  } catch (e) {
    // Storage may be blocked; the game still works.
  }
}

let playerName = "";
let current = 0;
let score = 0;
let lastEntry = null;
let timerInterval = null;
let timeLeft = TIME_PER_QUESTION;
let answered = false;
let totalTime = 0;
let questionStart = 0;

// Keeps "4 / 10" displayed correctly inside right-to-left text
const fmtScore = (s, t) => `\u2066${s} / ${t}\u2069`;

// Higher percentage first; on a tie, the faster total time first
function compareEntries(a, b) {
  const pa = a.score / a.total;
  const pb = b.score / b.total;
  if (pa !== pb) return pb - pa;
  const ta = a.timeMs ?? Infinity;
  const tb = b.timeMs ?? Infinity;
  if (ta !== tb) return ta < tb ? -1 : 1;
  return a.date - b.date;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.toggle("active", s.id === id);
  });
}

// Start
function startQuiz() {
  const name = $("player-name").value.trim();
  if (name === "") {
   $("name-error").textContent = "الرجاء كتابة اسمك أولاً.";
    $("player-name").focus();
    return;
  }
  if (hasPlayed(name)) {
    $("name-error").textContent = "هذا الاسم لعب بالفعل. يمكن لكل لاعب اللعب مرة واحدة فقط.";
    $("player-name").focus();
    return;
  }

  playerName = name;
  markPlayed(name); // saved at the start, so leaving the page mid-game doesn't allow a retry
  current = 0;
  score = 0;
  totalTime = 0;
  $("name-error").textContent = "";
  $("player-label").textContent = `👤 ${playerName}`;
  showScreen("game-screen");
  showQuestion();
}

$("start-btn").addEventListener("click", startQuiz);
$("player-name").addEventListener("keydown", e => {
  if (e.key === "Enter") startQuiz();
});

// Timer
function startTimer() {
  stopTimer();
  timeLeft = TIME_PER_QUESTION;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      timeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const t = $("timer");
  t.textContent = timeLeft;
  t.classList.toggle("warn", timeLeft <= 3);
}

function timeUp() {
  if (answered) return;
  answered = true;
  totalTime += TIME_PER_QUESTION * 1000;
  const item = questions[current];
  const buttons = $("options").querySelectorAll("button");
  buttons.forEach(b => (b.disabled = true));
  buttons[item.answer].classList.add("correct");
  $("feedback").textContent = `⏰ Time's up! The answer is ${item.options[item.answer]}`;
  nextAfterDelay();
}

function nextAfterDelay() {
  setTimeout(() => {
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }, 1300);
}

// Questions
function showQuestion() {
  answered = false;
  questionStart = Date.now();
  const item = questions[current];
  $("progress").textContent = `${current + 1} / ${questions.length}`;
  $("progress-fill").style.width = `${(current / questions.length) * 100}%`;
  $("question").textContent = item.q;
  $("feedback").textContent = "";
  $("options").innerHTML = "";

  item.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(index, btn));
    $("options").appendChild(btn);
  });

  startTimer();
}

function choose(index, clickedBtn) {
  if (answered) return;
  answered = true;
  stopTimer();
  totalTime += Date.now() - questionStart;

  const item = questions[current];
  const buttons = $("options").querySelectorAll("button");
  buttons.forEach(b => (b.disabled = true));

  if (index === item.answer) {
    score++;
    clickedBtn.classList.add("correct");
    $("feedback").textContent = "✅ Correct!";
  } else {
    clickedBtn.classList.add("wrong");
    buttons[item.answer].classList.add("correct");
    $("feedback").textContent = `❌ The answer is ${item.options[item.answer]}`;
  }

  nextAfterDelay();
}

// Leaderboard 
function loadLeaderboard() {
  try {
    const list = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    // Keep only results that match the current number of questions
    return list.filter(e => e.total === questions.length);
  } catch (e) {
    return [];
  }
}

function saveLeaderboard(list) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
  } catch (e) {
    
  }
}

function finishQuiz() {
  stopTimer();
  lastEntry = { name: playerName, score: score, total: questions.length, timeMs: totalTime, date: Date.now() };
  const list = loadLeaderboard();
  list.push(lastEntry);
  list.sort(compareEntries);
  const rank = list.indexOf(lastEntry) + 1;
  const top = list.slice(0, 10);
  saveLeaderboard(top);

  $("end-emoji").textContent = score === questions.length ? "🏆" : score >= 6 ? "🎉" : "💪";
  $("final-score").textContent = `${playerName}, ${fmtScore(score, questions.length)}`;
  $("my-rank").textContent = `Your rank: ${rank} of ${list.length} · Time: ${(totalTime / 1000).toFixed(1)}s`;
  renderWinner(top);
  renderPodium(top);
  showScreen("end-screen");
}

function renderWinner(list) {
  const msg = $("winner-msg");
  const champ = list[0];
  if (!champ) {
    msg.textContent = "";
    return;
  }
  if (champ === lastEntry || (champ.name === lastEntry.name && champ.date === lastEntry.date)) {
    msg.textContent = `🎉 Congratulations ${champ.name}! You are the champion!`;
  } else {
    msg.textContent = `🎉 Congratulations to ${champ.name} for the top score!`;
  }
}

function renderPodium(list) {
  const podium = $("podium");
  podium.innerHTML = "";
  const top = list.slice(0, 3);
  const order = [1, 0, 2];
  const heights = [190, 140, 105];
  const medals = ["🥇", "🥈", "🥉"];

  order.forEach(rank => {
    const entry = top[rank];

    const pillar = document.createElement("div");
    pillar.className = `pillar rank-${rank + 1}`;

    const name = document.createElement("div");
    name.className = "p-name";
    name.textContent = entry ? entry.name : "—";

    const pts = document.createElement("div");
    pts.className = "p-score";
    pts.textContent = entry
      ? fmtScore(entry.score, entry.total) + (entry.timeMs != null ? ` · ${(entry.timeMs / 1000).toFixed(1)}s` : "")
      : "";

    const bar = document.createElement("div");
    bar.className = "p-bar";
    bar.dataset.h = heights[rank];
    if (entry) {
      bar.textContent = medals[rank];
    } else {
      bar.classList.add("ghost");
    }

    pillar.append(name, pts, bar);
    podium.appendChild(pillar);
  });

  setTimeout(() => {
    podium.querySelectorAll(".p-bar").forEach(b => {
      b.style.height = b.dataset.h + "px";
    });
  }, 300);
}

// Play again
$("restart-btn").addEventListener("click", () => {
  $("player-name").value = "";
  $("player-name").focus();
  renderStartInfo();
  showScreen("start-screen");
});

function renderStartInfo() {
  let count = 0;
  try {
    count = (JSON.parse(localStorage.getItem(PLAYED_KEY)) || []).length;
  } catch (e) {}
  $("play-count").textContent = count;
}

renderStartInfo();
