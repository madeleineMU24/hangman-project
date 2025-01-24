// DOM Elements
const nameInputSection = document.getElementById("name-input-section"); // Player name input section
const gameContainer = document.getElementById("game-container"); // Main game container
const userInputSection = document.getElementById("user-input-section"); // Input section for guesses
const newGameContainer = document.getElementById("new-game-container"); // "New Game" popup container
const player1Display = document.getElementById("player1-display"); // Player 1 name display
const player2Display = document.getElementById("player2-display"); // Player 2 name display
const player1Light = document.getElementById("player1-light"); // Light indicator for Player 1
const player2Light = document.getElementById("player2-light"); // Light indicator for Player 2
const player1HistoryList = document.getElementById("player1-history"); // History box for Player 1
const player2HistoryList = document.getElementById("player2-history"); // History box for Player 2
const turnIndicator = document.getElementById("turn-indicator"); // Current player's turn indicator
const guessInput = document.getElementById("guess"); // Input field for guesses
const submitButton = document.getElementById("submit-btn"); // Button to submit a guess
const message = document.getElementById("message"); // Message display (feedback on guesses)
const resultText = document.getElementById("result-text"); // Result display (win/lose message)
const newGameButton = document.getElementById("new-game-button"); // Button to start a new game

// Hangman drawing steps (array of drawing functions)
const drawSteps = (ctx) => [
  () => {
    ctx.beginPath();
    ctx.moveTo(50, 150); // Base
    ctx.lineTo(150, 150);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(100, 150); // Vertical pole
    ctx.lineTo(100, 20);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(100, 20); // Top beam
    ctx.lineTo(140, 20);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 20); // Rope
    ctx.lineTo(140, 40);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.arc(140, 50, 10, 0, Math.PI * 2); // Head
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 60); // Body
    ctx.lineTo(140, 100);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 70); // Left arm
    ctx.lineTo(120, 90);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 70); // Right arm
    ctx.lineTo(160, 90);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 100); // Left leg
    ctx.lineTo(120, 120);
    ctx.stroke();
  },
  () => {
    ctx.beginPath();
    ctx.moveTo(140, 100); // Right leg
    ctx.lineTo(160, 120);
    ctx.stroke();
  },
];

// Game variables
let player1 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null }; // Player 1 object
let player2 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null }; // Player 2 object
let currentPlayer, opponentPlayer; // Track current and opponent players

// Initialize the game by setting player names and secret numbers
function startGame() {
  const player1Name = document.getElementById("player1-name").value.trim();
  const player2Name = document.getElementById("player2-name").value.trim();

  if (!player1Name || !player2Name) {
    alert("Both players must enter their names!");
    return;
  }

  player1 = {
    ...player1,
    name: player1Name,
    secretNumber: Math.floor(Math.random() * 100) + 1, // Random number between 1 and 100
    ctx: document.getElementById("canvas1").getContext("2d"),
    steps: drawSteps(document.getElementById("canvas1").getContext("2d")),
  };
  player2 = {
    ...player2,
    name: player2Name,
    secretNumber: Math.floor(Math.random() * 100) + 1, // Random number between 1 and 100
    ctx: document.getElementById("canvas2").getContext("2d"),
    steps: drawSteps(document.getElementById("canvas2").getContext("2d")),
  };

  // Display player names
  player1Display.textContent = player1.name;
  player2Display.textContent = player2.name;

  // Set the first player
  currentPlayer = player1;
  opponentPlayer = player2;

  // Update the turn indicator
  turnIndicator.textContent = `${currentPlayer.name}'s Turn`;

  // Show the game screen
  nameInputSection.classList.add("hide");
  gameContainer.classList.remove("hide");
  userInputSection.classList.remove("hide");
}

// Handle a player's guess
function handleGuess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    message.textContent = "Please enter a valid number between 1 and 100.";
    return;
  }

  currentPlayer.history.push(guess); // Add guess to player's history
  updateHistory(); // Update history display

  if (guess === opponentPlayer.secretNumber) {
    // Correct guess: End game
    setLight(currentPlayer, "green"); // Green light
    message.textContent = `🎉 Congratulations ${currentPlayer.name}! You win!`;
    resultText.textContent = `${currentPlayer.name} Wins!`;
    drawFullHangman(opponentPlayer); // Draw losing player's hangman
    endGame();
  } else {
    // Incorrect guess: Red light
    setLight(currentPlayer, "red");
    message.textContent = guess < opponentPlayer.secretNumber ? "Too low!" : "Too high!";
    setTimeout(switchTurn, 1000); // Delay turn switch to show red light
  }

  guessInput.value = ""; // Clear input box
}

// Update the history display for both players
function updateHistory() {
  player1HistoryList.innerHTML = player1.history.map((num) => `<span>${num}</span>`).join(" ");
  player2HistoryList.innerHTML = player2.history.map((num) => `<span>${num}</span>`).join(" ");
}

// Set the light for the current player
function setLight(player, color) {
  const light = player === player1 ? player1Light : player2Light;
  light.className = "light"; // Reset the light class

  if (color === "green") {
    light.classList.add("green"); // Green light
  } else if (color === "red") {
    light.classList.add("red"); // Red light
    setTimeout(() => {
      light.classList.remove("red"); // Turn off red light after 1 second
    }, 1000);
  }
}

// Switch to the next player's turn
function switchTurn() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
  opponentPlayer = opponentPlayer === player1 ? player2 : player1;
  turnIndicator.textContent = `${currentPlayer.name}'s Turn`;
}

// Draw the full hangman for the losing player
function drawFullHangman(player) {
  player.steps.forEach((step) => step());
}

// End the game and disable further input
function endGame() {
  guessInput.disabled = true;
  submitButton.disabled = true;
  newGameContainer.classList.remove("hide");
}

// Event Listeners
document.getElementById("start-game-button").addEventListener("click", startGame);
submitButton.addEventListener("click", handleGuess);
