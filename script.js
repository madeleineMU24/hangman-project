// Game variables
let player1 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null }; 
let player2 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null }; 
let currentPlayer, opponentPlayer; 

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

let submitButton;

// Initialize the game by setting player names and secret numbers
function startGame() {
    const player1Name = document.getElementById("player1").value.trim();
    const player2Name = document.getElementById("player2").value.trim();

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
    const player1Display = document.getElementById("player1-display");
    const player2Display = document.getElementById("player2-display");
    player1Display.textContent = player1.name;
    player2Display.textContent = player2.name;

    // Set the first player
    currentPlayer = player1;
    opponentPlayer = player2;

    // Update the turn indicator
    const turnIndicator = document.getElementById("turn-indicator")
    turnIndicator.textContent = `${currentPlayer.name}'s Turn`;

    // Show the game screen
    const nameInputSection = document.getElementById("name-input");
    const gameContainer = document.getElementById("game-container");
    const userInputSection = document.getElementById("user-input-section");
    nameInputSection.toggleAttribute("hidden");
    gameContainer.toggleAttribute("hidden");
    userInputSection.toggleAttribute("hidden");
    submitButton = document.getElementById("submit-btn");
    submitButton.addEventListener("click", handleGuess);
}

const btnStartGame = document.getElementById("start-game")
btnStartGame.addEventListener('click', startGame)

const player1HistoryList = document.getElementById("player1-history"); 
const player2HistoryList = document.getElementById("player2-history"); 

// Update the history display for both players
function updateHistory() {
    player1HistoryList.innerHTML = player1.history.map((num) => `<span>${num}</span>`).join(" ");
    player2HistoryList.innerHTML = player2.history.map((num) => `<span>${num}</span>`).join(" ");
}

// Handle a player's guess
function handleGuess() {
    const guessInput = document.getElementById("guess");
    const guess = parseInt(guessInput.value);

    const message = document.getElementById("message");

    if (isNaN(guess) || guess < 1 || guess > 100) {
        message.textContent = "Please enter a valid number between 1 and 100.";
        return;
    }

    currentPlayer.history.push(guess); 
    updateHistory(); 

    if (guess === opponentPlayer.secretNumber) {
        // Correct guess: End game
        // TODO: setLight(currentPlayer, "green");
        message.textContent = `🎉 Congratulations ${currentPlayer.name}! You win!`;
        resultText.textContent = `${currentPlayer.name} Wins!`;
        drawFullHangman(opponentPlayer); 
        endGame();
    } else {
        // Incorrect guess: Red light
        // TODO: setLight(currentPlayer, "red");
        message.textContent = guess < opponentPlayer.secretNumber ? "Too low!" : "Too high!";
        // TODO: setTimeout(switchTurn, 1000); 
    }

    guessInput.value = ""; 
}
