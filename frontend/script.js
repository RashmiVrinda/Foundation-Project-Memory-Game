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
  { level: 2, cardsCount: 4, time: 45 }, // Harder!
  { level: 3, cardsCount: 5, time: 30 }, // Extreme!
];

let GAME_TIME_LIMIT = levels[currentLevel].time;

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

// --- NEW: SAVE HIGH SCORE TO BACKEND ---
const saveHighScore = async (finalScore) => {
  try {
    await fetch("/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: finalScore })
    });
    console.log("High score saved!");
  } catch (err) {
    console.error("Failed to save score", err);
  }
};

const fetchCards = async () => {
  try {
    const res = await fetch("/cards"); 
    const allCards = await res.json();

    const symbolMap = {
      apple: "🍎", banana: "🍌", cherry: "🍒",
      grapes: "🍇", lemon: "🍋", watermelon: "🍉",
    };

    const levelInfo = levels[currentLevel];
    cardsData = allCards.slice(0, levelInfo.cardsCount).map(card => ({
      ...card,
      symbol: symbolMap[card.name.toLowerCase()] || "❓",
    }));

    GAME_TIME_LIMIT = levelInfo.time;
    restartGame(false);
  } catch (error) {
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
      <div class="card-front"><span class="card-icon">${cardData.symbol}</span></div>
    `;

    card.addEventListener("click", () => {
      if (gameOver || flippedCards.length === 2 || card.classList.contains("flipped")) return;
      
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
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            flippedCards = [];
            if (matchedCount === cardsData.length * 2) endGame(true);
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

// --- UPDATED: COUNTDOWN TIMER LOGIC ---
const startTimer = () => {
  if (timerStarted) return;
  timerStarted = true;
  timer = GAME_TIME_LIMIT;
  
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Time: ${timer}s`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
};

const endGame = (won) => {
  gameOver = true;
  clearInterval(timerInterval);
  if (won) {
    if (currentLevel < levels.length - 1) {
      showMessage(`Level ${levels[currentLevel].level} Complete! Next level loading...`);
      currentLevel++;
      setTimeout(fetchCards, 2000);
    } else {
      showMessage(`🏆 Game Master! Final Score: ${score}`);
      saveHighScore(score); // Save the high score at the very end
    }
  } else {
    showMessage("⏰ Time's Up! Try Again.", "error");
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
  if (resetAll) { score = 0; currentLevel = 0; }
  moves = 0;
  matchedCount = 0;
  flippedCards = [];
  gameOver = false;
  timerStarted = false;
  timer = levels[currentLevel].time;
  
  counterDisplay.textContent = `Moves: ${moves}`;
  timerDisplay.textContent = `Time: ${timer}s`;
  scoreDisplay.textContent = `Score: ${score}`;
  levelDisplay.textContent = `Level: ${levels[currentLevel].level}`;
  renderCards(cardsData);
  messageEl.style.display = "none";
};

fetchCards();