// Introduction
document.getElementById('console').innerHTML = 'Welcome to the game! Click the Start button to begin.'

// Insert .continue button to initiate game
var insertedElement = document.createElement('button');
var console = document.getElementById('console');
insertedElement.setAttribute('class', 'continue-button');
insertedElement.setAttribute('onclick', 'beginGame()');
insertedElement.innerHTML = "Click Me!";
console.appendChild(insertedElement);

// This happens once the first continue button is clicked
function beginGame() {
  console.innerHTML = "Game commencing...";

// Prompt player name
  let player1Name = prompt('Please input your name');

// and change it in the HTML
  document.getElementById('player-1-name').innerHTML = player1Name;
}
