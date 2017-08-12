let today = new Date(); // Get todays date and loale
let locale = "en-us";

// Get Day, month, and date. make suffix 'Error' for debug
var fullMonth = today.toLocaleString(locale , {month : 'long'});
let fullWeekday = today.toLocaleString(locale , {weekday : 'long'});
let fullDay = today.toLocaleString(locale, {day : 'numeric'});
let dateSuffix = 'Error'

// Check the day of the month and apply the correct suffix
switch (fullDay)
{
	case '1':
  case '21':
  case '31':
  	dateSuffix = 'st';
    break;

  case '2':
  case '22':
  	dateSuffix = 'nd';
    break;

  case '3':
  case '23':
  	dateSuffix = 'rd';
    break;

  default:
  	dateSuffix = 'th';

}

// Put it all together for the date string
let dateString = fullWeekday + ', ' + fullMonth + ' ' + fullDay.concat(dateSuffix);


// Introduction
document.getElementById('gameConsole').innerHTML = 'Welcome! Today is ' + dateString + '. Click the Start button to begin.';

// Insert .continue button to initiate game
var insertedElement = document.createElement('button');
var gameConsole = document.getElementById('gameConsole');
insertedElement.setAttribute('class', 'continue-button');
insertedElement.setAttribute('onclick', 'beginGame()');
insertedElement.innerHTML = "Click Me!";
gameConsole.appendChild(insertedElement);

// This happens once the first continue button is clicked
function beginGame() {
  gameConsole.innerHTML = "";

// Prompt player name
  let player1Name = prompt('Please input your name');

// and change it in the HTML
  document.getElementById('player-1-name').innerHTML = player1Name;

// explain the rules for the opening puzzle
  gameConsole.innerHTML = 'Thanks ' + player1Name + '. The opening puzzle will begin. There will be one word up above that will fill in slowly. Click the buzzer of the opportunity to guess correctly. A correct guess will net you 50 points, and control of the first board. Guessing incorrectly will give the opponent the points and control. Good luck, and click the start button to begin.';

// modify the start button to initialize the pizzle as oppose to beginning the game
  insertedElement.setAttribute('onclick', 'firstPuzzleStart()');
  insertedElement.innerHTML = 'Begin first puzzle';
  gameConsole.appendChild(insertedElement);

}
// end beginGame function

function firstPuzzleStart() {

// Clear gameConsole
  gameConsole.innerHTML = "";

  gameConsole.innerHTML = 'First puzzle commencing...';
}
