const namePlayer1 = document.getElementById("player1"); 
const namePlayer2 = document.getElementById("player2"); 
const player1Display = document.getElementById("player1-display"); 
const player2Display = document.getElementById("player2-display"); 
const btnStartGame = document.getElementById("start-game")
function displayName() {
    player1Display.innerHTML = namePlayer1.value;
    player2Display.innerHTML = namePlayer2.value;
}

btnStartGame.addEventListener('click', displayName)
