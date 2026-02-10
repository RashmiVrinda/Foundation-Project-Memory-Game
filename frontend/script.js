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

// levels
const levels = [
  { level: 1, cardsCount: 3, time: 60 },
  { level: 2, cardsCount: 4, time: 75 },
  { level: 3, cardsCount: 5, time: 90 },
];

let GAME_TIME_LIMIT = levels[currentLevel].time;

// DOM
const counterDisplay = document.getElementById("counter");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const messageEl = document.getElementById("game-message");
const container = document.getElementById("cardContainer");

// message helpers
const showMessage = (text, type = "success") => {
  messageEl.textContent = text;
  messageEl.className = type;
  messageEl.style.display = "block";
};

const hideMessage = () => {
  messageEl.textContent = "";
  messageEl.style.display = "none";
};

// fetch cards
const fetchCards = async () => {
  try {
    const res = await fetch("http://localhost:3000/cards");
    const allCards = await res.json();

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
      symbol: symbolMap[card.name.toLowerCase()] || "❓",
    }));

    GAME_TIME_LIMIT = levelInfo.time;
    levelDisplay.textContent = `Level: ${levelInfo.level}`;

    restartGame(false);
  } catch (error) {
    console.error("Failed to fetch cards:", error);
  }
};

// render cards
const renderCards = (cards) => {
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
      if (
        gameOver ||
        flippedCards.length === 2 ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
      )
        return;

      startTimer();
      card.classList.add("flipped");
      flippedCards.push(card);

      moves++;
      counterDisplay.textContent = `Moves: ${moves}`;

      if (flippedCards.length === 2) {
        const [c1, c2] = flippedCards;

        if (c1.dataset.id === c2.dataset.id) {
          setTimeout(() => {
            c1.classList.add("matched");
            c2.classList.add("matched");
            matchedCount += 2;
            flippedCards = [];

            setTimeout(() => {
              c1.remove();
              c2.remove();
              score++;
              scoreDisplay.textContent = `Score: ${score}`;
              checkWin();
            }, 300);
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

// timer
const startTimer = () => {
  if (timerStarted) return;

  timerStarted = true;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;

    if (timer >= GAME_TIME_LIMIT) {
      endGame(false);
    }
  }, 1000);
};

// win check
const checkWin = () => {
  if (matchedCount === cardsData.length * 2) {
    endGame(true);
  }
};

// end game (FIXED)
const endGame = (won) => {
  if (gameOver) return;
  gameOver = true;
  clearInterval(timerInterval);

  setTimeout(() => {
    if (won) {
      showMessage(`🎉 Level ${levels[currentLevel].level} completed!`);

      currentLevel++;

      if (currentLevel < levels.length) {
        setTimeout(() => {
          hideMessage();
          fetchCards();
        }, 2000);
      } else {
        showMessage(`🏆 You finished all levels! Final score: ${score}`);
      }
    } else {
      showMessage("⏰ Time's up! Restarting game...", "error");

      setTimeout(() => {
        hideMessage();
        restartGame(true);
      }, 2000);
    }
  }, 300);
};

// shuffle
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// restart
const restartGame = (resetLevel = true) => {
  container.innerHTML = "";
  moves = 0;
  timer = 0;
  matchedCount = 0;
  flippedCards = [];
  gameOver = false;
  timerStarted = false;

  hideMessage();

  if (resetLevel) {
    score = 0;
    currentLevel = 0;
  }

  counterDisplay.textContent = "Moves: 0";
  timerDisplay.textContent = "Time: 0s";
  scoreDisplay.textContent = `Score: ${score}`;
  levelDisplay.textContent = `Level: ${levels[currentLevel].level}`;

  renderCards(cardsData);
};

// init
fetchCards();
