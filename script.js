// --- Global State & Elements ---
const screens = document.querySelectorAll('.screen');
const bgMusic = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
const heartContainer = document.getElementById('heart-container');
const typewriterText = document.getElementById('typewriter-text');
const messageOverlay = document.getElementById('message-overlay');
const overlayText = document.getElementById('overlay-text');
const splashScreen = document.getElementById('splash-screen');

let musicPlaying = false;
let letterTyped = false;


// --- Music Logic ---
function startExperience() {
  if (splashScreen) splashScreen.classList.add('hidden');
  if (bgMusic) {
    bgMusic.play().catch(e => console.log("Music play blocked", e));
    musicControl.classList.add('music-on');
    musicPlaying = true;
  }
  document.body.style.overflow = 'auto';
}

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicControl.classList.remove('music-on');
  } else {
    bgMusic.play().catch(e => console.log("Music play blocked", e));
    musicControl.classList.add('music-on');
  }
  musicPlaying = !musicPlaying;
}

// --- Scrolling / Section Reveal Logic ---
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      if (entry.target.id === 'letter-section' && !letterTyped) {
        startTypewriter();
      }
    }
  });
}, observerOptions);

screens.forEach(screen => observer.observe(screen));

// --- Typewriter Logic ---
const letterContent = `My Dearest,

From the moment we first met, my life has been filled with a light I never knew existed. You are my best friend, my greatest adventure, and my home.

I wanted to take a moment to walk through our journey together, to remember the smiles, the laughter, and the love that grows stronger every day...

Keep scrolling, there's so much more I want to say.`;

function startTypewriter() {
  if (!typewriterText) return;
  letterTyped = true;
  let i = 0;
  function type() {
    if (i < letterContent.length) {
      typewriterText.innerHTML += letterContent.charAt(i);
      i++;
      setTimeout(type, 50);
    }
  }
  type();
}

// --- Heart Triggered Story ---
const heartMessages = [
  "You're the peanut butter to my jelly! 🥪",
  "I love you more than pizza! 🍕",
  "Every day with you is my favorite day. ❤️",
  "You make my heart skip a beat! 💓",
  "You are my sunshine! ☀️",
  "I'm so lucky to have you. 🍀"
];

function createHeart() {
  if (!heartContainer) return;
  const heart = document.createElement('div');
  heart.classList.add('heart-bg');
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";

  heart.onclick = (e) => {
    e.stopPropagation();
    showOverlay(heartMessages[Math.floor(Math.random() * heartMessages.length)]);
    heart.remove();
  };

  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}

setInterval(createHeart, 500);

function showOverlay(text) {
  if (!overlayText || !messageOverlay) return;
  overlayText.innerText = text;
  messageOverlay.classList.remove('hidden');
}

function closeOverlay() {
  if (messageOverlay) messageOverlay.classList.add('hidden');
}

// --- Quiz Logic ---
const quizData = [
  {
    question: "Where did we first meet?",
    options: ["At a cafe", "Through friends", "Online", "It's a secret!"],
    correct: 3
  },
  {
    question: "What's my favorite thing about you?",
    options: ["Your smile", "Your kindness", "Everything", "Your jokes"],
    correct: 2
  }
];

let currentQuestion = 0;

function loadQuiz() {
  const questionEl = document.getElementById('question-text');
  const optionsEl = document.getElementById('options-container');
  if (!questionEl || !optionsEl) return;

  if (currentQuestion >= quizData.length) {
    questionEl.innerHTML = "You know us so well! Now for the most important part...";
    optionsEl.innerHTML = "";
    return;
  }

  const data = quizData[currentQuestion];
  questionEl.innerText = data.question;
  optionsEl.innerHTML = "";

  data.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.classList.add('option-btn');
    btn.onclick = () => {
      currentQuestion++;
      loadQuiz();
    };
    optionsEl.appendChild(btn);
  });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadQuiz();

  const yesBtn = document.getElementById('yes-btn');
  const askScreen = document.getElementById('ask-screen');
  const successScreen = document.getElementById('success-screen');

  if (yesBtn && askScreen && successScreen) {
    yesBtn.addEventListener('click', () => {
      askScreen.style.display = 'none';
      successScreen.style.display = 'block';

      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        confetti({ particleCount: 40, origin: { x: Math.random(), y: Math.random() - 0.2 } });
      }, 300);
    });
  }

  // Hidden Surprise Mode: Long press anywhere for 3 seconds
  let pressTimer;
  document.addEventListener('mousedown', () => {
    pressTimer = window.setTimeout(() => {
      showOverlay("Surprise! You found the secret message: I'm planning our next big adventure! ✈️🌍");
    }, 3000);
  });
  document.addEventListener('mouseup', () => clearTimeout(pressTimer));
});
