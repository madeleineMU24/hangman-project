// Helper function to get all DOM elements
function getDOMElements() {
    return {
      // Game containers and sections
      nameInputSection: document.getElementById("name-input-section"),
      gameContainer: document.getElementById("game-container"),
      userInputSection: document.getElementById("user-input-section"),
      newGameContainer: document.getElementById("new-game-container"),
      // Player displays
      player1Display: document.getElementById("player1-display"),
      player2Display: document.getElementById("player2-display"),
      player1Light: document.getElementById("player1-light"),
      player2Light: document.getElementById("player2-light"),
      player1HistoryList: document.getElementById("player1-history"),
      player2HistoryList: document.getElementById("player2-history"),
      // Turn indicator and guess input
      turnIndicator: document.getElementById("turn-indicator"),
      guessInput: document.getElementById("guess"),
      submitButton: document.getElementById("submit-btn"),
      // Guess counters
      player1GuessesLeft: document.getElementById("player1-guesses-left"),
      player2GuessesLeft: document.getElementById("player2-guesses-left"),
      // Messages and results
      message: document.getElementById("message"),
      resultText: document.getElementById("result-text"),
      newGameButton: document.getElementById("new-game-button"),
    };
  }
  
  // Initialize DOM elements
  const DOM = getDOMElements();
  
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
  let player1 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null, remainingGuesses: 10 };
  let player2 = { name: "", secretNumber: 0, history: [], ctx: null, steps: null, remainingGuesses: 10 };
  let currentPlayer, opponentPlayer;
  
  // Initialize the game
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
      secretNumber: Math.floor(Math.random() * 100) + 1,
      ctx: document.getElementById("canvas1").getContext("2d"),
      steps: drawSteps(document.getElementById("canvas1").getContext("2d")),
      remainingGuesses: 10, // Reset remaining guesses
    };
  
    player2 = {
      ...player2,
      name: player2Name,
      secretNumber: Math.floor(Math.random() * 100) + 1,
      ctx: document.getElementById("canvas2").getContext("2d"),
      steps: drawSteps(document.getElementById("canvas2").getContext("2d")),
      remainingGuesses: 10, // Reset remaining guesses
    };
  
    // Display player names
    DOM.player1Display.textContent = player1.name;
    DOM.player2Display.textContent = player2.name;
  
    currentPlayer = player1;
    opponentPlayer = player2;
  
    DOM.turnIndicator.textContent = `${currentPlayer.name}'s Turn`;
  
    // Show the game screen
    DOM.nameInputSection.classList.add("hide");
    DOM.gameContainer.classList.remove("hide");
    DOM.userInputSection.classList.remove("hide");
  
    updateGuessesLeft(); // Initialize the guesses left display
  }
  
  // Handle a player's guess
  function handleGuess() {
    const guess = parseInt(DOM.guessInput.value);
  
    if (isNaN(guess) || guess < 1 || guess > 100) {
      DOM.message.textContent = "Please enter a valid number between 1 and 100.";
      return;
    }
  
    currentPlayer.history.push(guess);
    currentPlayer.remainingGuesses--;
    updateHistory();
    updateGuessesLeft();
  
    if (guess === opponentPlayer.secretNumber) {
      setLight(currentPlayer, "green");
      DOM.message.textContent = `🎉 Congratulations ${currentPlayer.name}! You win!`;
      DOM.resultText.textContent = `${currentPlayer.name} Wins!`;
      drawFullHangman(opponentPlayer);
      endGame();
    } else {
      setLight(currentPlayer, "red");
      DOM.message.textContent = guess < opponentPlayer.secretNumber ? "Too low!" : "Too high!";
  
      if (currentPlayer.remainingGuesses === 0) {
        DOM.message.textContent = `${currentPlayer.name} has no guesses left!`;
        drawFullHangman(currentPlayer);
        endGame();
      } else {
        setTimeout(switchTurn, 1000);
      }
    }
  
    DOM.guessInput.value = "";
  }
  
  // Update the history display
  function updateHistory() {
    DOM.player1HistoryList.innerHTML = player1.history.map((num) => `<span>${num}</span>`).join(" ");
    DOM.player2HistoryList.innerHTML = player2.history.map((num) => `<span>${num}</span>`).join(" ");
  }
  
  // Update of the remaining guesses display
  function updateGuessesLeft() {
    DOM.player1GuessesLeft.textContent = player1.remainingGuesses;
    DOM.player2GuessesLeft.textContent = player2.remainingGuesses;
  }
  
  // Set the light for the current player
  function setLight(player, color) {
    const light = player === player1 ? DOM.player1Light : DOM.player2Light;
    light.className = "light"; // Reset the light class
  
    if (color === "green") {
      light.classList.add("green");
    } else if (color === "red") {
      light.classList.add("red");
      setTimeout(() => {
        light.classList.remove("red");
      }, 1000);
    }
  }
  
  // Switch to the next player's turn
  function switchTurn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    opponentPlayer = opponentPlayer === player1 ? player2 : player1;
    DOM.turnIndicator.textContent = `${currentPlayer.name}'s Turn`;
  }
  function drawFullHangman(player) {
    player.steps.forEach((step) => step());
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


// Event Listeners
document.getElementById("start-game-button").addEventListener("click", startGame);
submitButton.addEventListener("click", handleGuess);