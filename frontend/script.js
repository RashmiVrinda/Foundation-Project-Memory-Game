let moves = 0;
let timer = 0;
let timerInterval;
let timerStarted = false;
let gameOver = false;
let flippedCards = [];
let cardsData = [];
let matchedCount = 0;
let score = 0;
let currentLevel = 0;

const levels = [
  { level: 1, cardsCount: 3, time: 60 },
  { level: 2, cardsCount: 4, time: 75 },
  { level: 3, cardsCount: 5, time: 90 },
];

let GAME_TIME_LIMIT = levels[currentLevel].time;

// DOM Elements
const counterDisplay = document.getElementById("counter");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const messageEl = document.getElementById("game-message");
const container = document.getElementById("cardContainer");

const showMessage = (text, type = "success") => {
  messageEl.textContent = text;
  messageEl.className = type;
  messageEl.style.display = "block";
};

const hideMessage = () => {
  messageEl.style.display = "none";
};

// FETCH CARDS FROM SERVER
const fetchCards = async () => {
  try {
    // Relative path works on both localhost and Render
    const res = await fetch("/cards"); 
    if (!res.ok) throw new Error("Server error");
    
    const allCards = await res.json();

    // Map your database names to Emojis
    const symbolMap = {
      apple: "🍎",
      banana: "🍌",
      cherry: "🍒",
      grapes: "🍇",
      lemon: "🍋",
      watermelon: "🍉",
    };

    const levelInfo = levels[currentLevel];
    const selectedCards = allCards.slice(0, levelInfo.cardsCount);

    cardsData = selectedCards.map((card) => ({
      ...card,
      // Convert name to lowercase to match the symbolMap keys
      symbol: symbolMap[card.name.toLowerCase()] || "❓",
    }));

    GAME_TIME_LIMIT = levelInfo.time;
    levelDisplay.textContent = `Level: ${levelInfo.level}`;

    restartGame(false);
  } catch (error) {
    console.error("Fetch error:", error);
    showMessage("Failed to load cards. Ensure server is running on port 3000.", "error");
  }
};

const renderCards = (cards) => {
  container.innerHTML = "";
  const duplicatedCards = [...cards, ...cards];
  shuffle(duplicatedCards);

  duplicatedCards.forEach((cardData) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    card.innerHTML = `
      <div class="card-back">?</div>
      <div class="card-front">
        <span class="card-icon">${cardData.symbol}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      if (gameOver || flippedCards.length === 2 || card.classList.contains("flipped") || card.classList.contains("matched")) return;

      startTimer();
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        moves++;
        counterDisplay.textContent = `Moves: ${moves}`;
        const [c1, c2] = flippedCards;

        if (c1.dataset.id === c2.dataset.id) {
          setTimeout(() => {
            c1.classList.add("matched");
            c2.classList.add("matched");
            matchedCount += 2;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            flippedCards = [];
            checkWin();
          }, 400);
        } else {
          setTimeout(() => {
            c1.classList.remove("flipped");
            c2.classList.remove("flipped");
            flippedCards = [];
          }, 1000);
        }
      }
    });
    container.appendChild(card);
  });
};

const startTimer = () => {
  if (timerStarted) return;
  timerStarted = true;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
    if (timer >= GAME_TIME_LIMIT) endGame(false);
  }, 1000);
};

const checkWin = () => {
  if (matchedCount === cardsData.length * 2) endGame(true);
};

const endGame = (won) => {
  gameOver = true;
  clearInterval(timerInterval);
  if (won) {
    showMessage(`🎉 Level ${levels[currentLevel].level} Complete!`);
    currentLevel++;
    if (currentLevel < levels.length) {
      setTimeout(fetchCards, 2000);
    } else {
      showMessage(`🏆 Game Over! Final Score: ${score}`);
    }
  } else {
    showMessage("⏰ Time's up!", "error");
    setTimeout(() => restartGame(true), 2000);
  }
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const restartGame = (resetAll = true) => {
  clearInterval(timerInterval);
  container.innerHTML = "";
  moves = 0;
  timer = 0;
  matchedCount = 0;
  flippedCards = [];
  gameOver = false;
  timerStarted = false;
  
  if (resetAll) {
    score = 0;
    currentLevel = 0;
    fetchCards();
  } else {
    counterDisplay.textContent = "Moves: 0";
    timerDisplay.textContent = "Time: 0s";
    renderCards(cardsData);
  }
  hideMessage();
};

// Initial Load
fetchCards();