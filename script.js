// DOM Elements
const nameInputSection = document.getElementById("name-input-section");
const gameContainer = document.getElementById("game-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const player1Display = document.getElementById("player1-display");
const player2Display = document.getElementById("player2-display");
const player1Light = document.getElementById("player1-light");
const player2Light = document.getElementById("player2-light");
const player1HistoryList = document.getElementById("player1-history");
const player2HistoryList = document.getElementById("player2-history");
const turnIndicator = document.getElementById("turn-indicator");
const guessInput = document.getElementById("guess");
const submitButton = document.getElementById("submit-btn");
const message = document.getElementById("message");
const resultText = document.getElementById("result-text");
const newGameButton = document.getElementById("new-game-button");

let player1, player2, currentPlayer, opponentPlayer;

// Hangman drawing steps
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

// Start Game
function startGame() {
    const player1Name = document.getElementById("player1-name").value.trim();
    const player2Name = document.getElementById("player2-name").value.trim();

    if (!player1Name || !player2Name) {
        alert("Both players must enter their names!");
        return;
    }

    player1 = {
        name: player1Name,
        secretNumber: randomNumber(),
        history: [],
        remainingGuesses: 10,
        ctx: document.getElementById("canvas1").getContext("2d"),
        steps: drawSteps(document.getElementById("canvas1").getContext("2d")),
    };

    player2 = {
        name: player2Name,
        secretNumber: randomNumber(),
        history: [],
        remainingGuesses: 10,
        ctx: document.getElementById("canvas2").getContext("2d"),
        steps: drawSteps(document.getElementById("canvas2").getContext("2d")),
    };

    currentPlayer = player1;
    opponentPlayer = player2;

    player1Display.textContent = player1.name;
    player2Display.textContent = player2.name;
    turnIndicator.textContent = `${currentPlayer.name}'s Turn`;

    nameInputSection.classList.add("hide");
    gameContainer.classList.remove("hide");
    userInputSection.classList.remove("hide");
}

function handleGuess() {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        message.textContent = "Please enter a valid number!";
        return;
    }

    currentPlayer.history.push(guess);
    currentPlayer.remainingGuesses--;

    updateHistory();
    updateGuesses();

    if (guess === opponentPlayer.secretNumber) {
        setLight(currentPlayer, "green");
        message.textContent = `🎉 Correct! ${currentPlayer.name} guessed the number!`;
        resultText.textContent = `${currentPlayer.name} Wins!`;

        // Draw the full hangman for the losing player
        drawFullHangman(opponentPlayer);

        endGame();
    } else if (currentPlayer.remainingGuesses === 0) {
        setLight(currentPlayer, "red");
        message.textContent = `${currentPlayer.name} has no guesses left!`;

        // Draw the full hangman for the losing player
        drawFullHangman(currentPlayer);

        resultText.textContent = `${opponentPlayer.name} Wins!`;
        endGame();
    } else {
        setLight(currentPlayer, "red");
        message.textContent = guess < opponentPlayer.secretNumber ? "Too low! Try again." : "Too high! Try again.";
        setTimeout(switchTurn, 1000);
    }

    guessInput.value = "";
}

function setLight(player, color) {
    const light = player === player1 ? player1Light : player2Light;

    light.className = "light";

    if (color === "green") {
        light.classList.add("green");
    } else if (color === "red") {
        light.classList.add("red");
        setTimeout(() => light.classList.remove("red"), 1000);
    }
}

function switchTurn() {
    [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
    turnIndicator.textContent = `${currentPlayer.name}'s Turn`;
}

function drawFullHangman(player) {
    player.steps.forEach((step) => step());
}

function endGame() {
    guessInput.disabled = true;
    submitButton.disabled = true;
    newGameContainer.classList.remove("hide");
}

function updateHistory() {
    player1HistoryList.innerHTML = player1.history.map(num => `<span>${num}</span>`).join(" ");
    player2HistoryList.innerHTML = player2.history.map(num => `<span>${num}</span>`).join(" ");
}

function updateGuesses() {
    document.getElementById("player1-guesses-left").textContent = player1.remainingGuesses;
    document.getElementById("player2-guesses-left").textContent = player2.remainingGuesses;
}

function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function resetGame() {
    location.reload();
}
// Event Listeners
document.getElementById("start-game-button").addEventListener("click", startGame);
submitButton.addEventListener("click", handleGuess);
newGameButton.addEventListener("click", resetGame);