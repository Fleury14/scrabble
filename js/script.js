var wordList = ['rhythmic', 'photon', 'adverb', 'infinite', 'discourage'];
// word list for all puzzles

// Global var init: buzzer status, timer status, puzzle answer
var buzzer = false;
var buzzerInstance = 0;
var stopTimeFlag = false;
var currentWord = '';
var boardControl = 0;
var cpuAnswered = 0;
var playerAnswered = 0;

// declare puzzle box ID
var puzzleBox = document.getElementById('puzzle-box');


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

  var randNum = Math.floor(Math.random()*(wordList.length - 1));
  currentWord = wordList[randNum]; // pull an random word for the list


// Output pizzle answer for debug
  // var wordOutput = document.createElement('p');
  // wordOutput.innerHTML = currentWord;
  // gameConsole.appendChild(wordOutput);

  for (i = 0; i < currentWord.length; i++) {

    // Create the tiles for the puzzle. Give each box the class for the box styles and an ID with a corresponding number (letterbox*). Finally, output the boxes
    var boxIdOutput = 'letter-box' + i.toString();
    var boxOutput = document.createElement('div');
    boxOutput.setAttribute('class', 'puzzle-letter-box');
    boxOutput.setAttribute('id', boxIdOutput);
    puzzleBox.appendChild(boxOutput);
  }

  // Variable prepartion: reset timer flags and buzzer, string checker and get the length of the current answer
  // Also, prepare buzzer instance so we know what to do when the buzzer is activate (0 = 1st puzzle, 1 = bonus round etc)

  var cpuPercent = 0;
  i = 0;
  var j = currentWord.length;
  var letterCheckString = '';
  var randCPUCheck = 0;


// Create buzzer in console FOR NOW

  insertedElement.setAttribute('class', 'continue-button');
  insertedElement.setAttribute('onclick', 'playerOneBuzzer()');
  insertedElement.innerHTML = "BUZZER";
  gameConsole.appendChild(insertedElement);


// Begin timer: start filling in tiles at a rate of 1 per second
  var fillInTimer = setInterval(fillInTiles, 1000);

// Loop until either a buzzer is triggered or all but one of the tiles are filled
  function fillInTiles() {
    while (stopTimeFlag==false) {

// Pick a random letter from the current answer
      var letterTarget = Math.floor(Math.random() * j);

// Make sure that if this is the second to last letter that this will be the final loop
      if (i == j-2) {
        clearInterval(fillInTimer);
        console.log('stop time flag triggered');
        stopTimeFlag = true;
      }

// If the current index of the array has been used already, change the random number. Note that because the check consists of appending numbers to an array, any word with more than 10 letters will not work becoase '10' would be appended
// FUTURE:: Convert the resulting checkstring to hex to allow 16 letter words
      while(letterCheckString.indexOf(letterTarget) >= 0)
      {
         letterTarget = Math.floor(Math.random() * j);
      }

// Target the box of the letter that will be filled in
      var elementTarget = 'letter-box' + letterTarget.toString();

// Get the actual letter to be used (Weve been using array numbers to avoid confusion if the same letter is used twice)
      var letterToBeFilled = currentWord.charAt(letterTarget);

  //     console.log ('j', j, 'lettertarget', letterTarget, 'letterToBeFilled', letterToBeFilled);

// A secondary conditional (probably redundant, remove later) to make sure the letter in question hasn't been used
// Passing that: Display the letter, increment the loop counter, add the array label to the string checkString, and console log it for debug
      if (letterCheckString.indexOf(letterTarget) < 0) {
        document.getElementById(elementTarget).innerHTML = letterToBeFilled;
        i++;
        letterCheckString = letterCheckString + letterTarget.toString();
        console.log('checkstring' + letterCheckString);
      }

  cpuPercent += 0.05; // Increase likelyhood of cpu answering by 5%
  console.log(cpuPercent * 100 + '%');

  randCPUCheck = Math.random(); // Get a random number to see if cpu will buzz

// check random number against % of cpu answering. if its less, cpu will buzz in
  if (randCPUCheck < cpuPercent) {
    buzzerActivation();
  }

  console.log(cpuAnswered);

  if (cpuAnswered == 1) {

    stopTimeFlag = true;
    alert('CPU WINS');

  }

  else if (cpuAnswered == -1) {

    stopTimeFlag = true;
    alert('CPU LOSES');

  }

  console.log('boardControl:' + boardControl);

  if(boardControl == 1) {

    alert('Player has control of the board');

  } else if (boardControl == 2) {

    alert('CPU has control of the board');

  }



//  Avoid an endless loop
  break;
    }


  } //End fillInTiles




  // var consanantList = 'bcdfghjklmnpqrstvwxyz';
  // var vowelList = 'aeiou';
  //
  // while (true) {
  //   randVowel = vowelList.charAt(Math.floor(Math.random()*5));
  //
  //   if (currentWord.indexOf(randVowel) < 0) {
  //     var tileList = currentWord.concat(randVowel);
  //     console.log(tileList);
  //     break;
  //   }
  //
  // }

} // End firstPuzzleStart()

// Function if buzzer is clicked
  function playerOneBuzzer() {

// Make sure a timer is still going, and if so, stop it and change the buzzer flag so we know what caused it
    if(buzzer==false) {
      console.log ('time stopped due to buzzer');
      buzzer=true;
      stopTimeFlag=true;

      buzzerActivation(); // Call activation function for insctructions
    }
  } // End playerOneBuzzer()

function buzzerActivation() {

// Impotant note: the only way this function is activated with the buzzer flag being false should be for CPU activation
  if (buzzer == false) {

    console.log('CPU Buzzer activation');

    switch(buzzerInstance) {

        case 0:
          alert('CPU INTERCEPT!');

          var textOutput = document.createElement('p');
          // even if the cpu buzzes in, theres only a 75% chance they answer correctly off the bad, this random number checks that
          var cpuGuess=Math.random();
          if(cpuGuess < 0.75) {

            // cpu answers correctly, give them control and toggle a correct answer
            textOutput.innerHTML = 'CPU answer is:' + currentWord;
            gameConsole.appendChild(textOutput);
            boardControl = 2;
            cpuAnswered = 1;
          }

          else {
            // cpu answers incorrectly, give player control
            textOutput.innerHTML = ' CPU buzzed in... but does not know!';
            gameConsole.appendChild(textOutput);
            boardControl = 1;
            cpuAnswered = -1;

          }

          break;

        default:
          break;

    } // End Buzzer instance switch

  } // End CPU buzzer if

  if (buzzer == true) {

      switch(buzzerInstance) {

        case 0:
          var playerGuess = prompt('Buzzer Activated! Please input your guess. Remember, spelling counts');
          var playerResult = playerGuess.toLowerCase();

          console.log('guess:' + playerResult + ' answer:' + currentWord);

          if (playerResult == currentWord) {
            alert('YOU GOT IT!!!!!!11ONE');
            boardControl = 1;
            playerAnswered = 1;
          }

          else {
            alert('WRONG-O! Control lost.');
            boardControl = 2;
            playerAnswered = -1;
          }

          break;

        default:
            break;
      } // End player buzzer insance switch
  } // End player buzzer=true if
} // End buzzerActivation()
