/* jshint esversion: 6 */

let wordList = ['rhythmic', 'photon', 'adverb', 'infinite', 'eclipse'];
// word list for all puzzles
// word conditions: no more than 10 letters, must not use every vowel

let usedWords = [];

// Global var init: buzzer status, timer status, puzzle answer
let buzzer = false;
let buzzerInstance = 0;
let stopTimeFlag = false;
let roundInstructions = false;  // did player recieve round instructions
let currentWord = '';
let currentRound = 0;
let boardControl = 0;
let cpuAnswered = 0;
let puzzleBonusFlag = 0; // will there be a bonus tile in a puzzle?
let bonusTileIndex = 0; //index of bonus tile
let playerAnswered = 0;
let consanantList = 'bcdfghjklmnpqrstvwxyz';
let vowelList = 'aeiou';
let tileList = []; // list of tiles for main puzzles
let stoppers = 0; // number of stoppers in play
let tileResult = []; //need to scope the array that will contain the result of a tile check
let tileBank = []; //holder for the selected tiles


// declare puzzle box ID
const puzzleBox = document.getElementById('puzzle-box');
const gameConsole = document.getElementById('gameConsole');
const roundCount = document.querySelector('#roundCount');
const tileBox = document.querySelector('#tileBox');
const tileAnimFront = document.querySelector('#tileAnimFront');
const tileAnimBack = document.querySelector('#tileAnimBack');
const tileAnimBox = document.querySelector('#tileAnimBox');
const tileBank1 = document.querySelector('#tileBank1');
const tileBank2 = document.querySelector('#tileBank2');
let insertedElement = '';


let today = new Date(); // Get todays date and loale
let locale = "en-us";

// Get Day, month, and date. make suffix 'Error' for debug
let fullMonth = today.toLocaleString(locale , {month : 'long'});
let fullWeekday = today.toLocaleString(locale , {weekday : 'long'});
let fullDay = today.toLocaleString(locale, {day : 'numeric'});
let dateSuffix = 'Error';

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
} // end switch

// Put it all together for the date string
let dateString = fullWeekday + ', ' + fullMonth + ' ' + fullDay.concat(dateSuffix);

// Introduction
document.getElementById('gameConsole').innerHTML = 'Welcome! Today is ' + dateString + '. Click the Start button to begin.';

// Insert .continue button to initiate game
appendOutputConsole('div', '<button class="continue-button" onclick="beginGame()">Click Me!</button>', 'flex-container justify-center');

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
	appendOutputConsole('div', '<button class="continue-button" onclick="firstPuzzleStart()">Begin first Puzzle</button>', 'flex-container justify-center');
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
    let boxIdOutput = 'letter-box' + i.toString();
    let boxOutput = document.createElement('div');
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
	appendOutputConsole('div', '<button class="continue-button" onclick="playerOneBuzzer()">BUZZER</button>', 'flex-container justify-center');
  // insertedElement.setAttribute('class', 'continue-button');
  // insertedElement.setAttribute('onclick', 'playerOneBuzzer()');
  // insertedElement.innerHTML = "BUZZER";
  // gameConsole.appendChild(insertedElement);


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
        document.getElementById(elementTarget).innerHTML = letterToBeFilled.toUpperCase();
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
  } //end if
  console.log(cpuAnswered);

  if (cpuAnswered == 1) { //output results if cpu answers
    stopTimeFlag = true;
    appendOutputConsole('p', 'CPU answered correctly');
  }  else if (cpuAnswered == -1) {
    stopTimeFlag = true;
    appendOutputConsole('p', 'CPU answered incorrectly');
  } // end if

  if(boardControl == 1) {
    appendOutputConsole('p', 'Player has control of the board');
  } else if (boardControl == 2) {
    appendOutputConsole('p', 'CPU has control of the board');
  } // end if

	if(boardControl!=0) {
		appendOutputConsole('div', '<button class="continue-button" onclick="showingInstructions()">Continue</button>', 'flex-container justify-center');
	}

//  Avoid an endless loop
  break;
    }
  } //End fillInTiles


} // End firstPuzzleStart()

function showingInstructions() {
	clearConsole();
	appendOutputConsole('p', 'There will be a total of 5 puzzles to solve. Each turn a player will select a tile from the list. You can guess one of the two tiles you selected to be filled in. After the tile is filled in, you or the CPU will have a chance to solve. If you can\'t, you can draw one more tile. Be careful, there are three tiles called stoppers that dont belong in the word and if you pick one, you will lose control of the board.');
	appendOutputConsole('p', 'Puzzles are 100 points each plus 10 points for every tile not used. Correctly solving after guessing the tile in a blue square will give you 150, a pink one iwll give you 200. Good luck.');
	appendOutputConsole('div', '<button class="continue-button" onclick="beginFirstRound()">Continue</button>', 'flex-container justify-center');
}

function beginFirstRound() {
	// initialize variables:
	usedWords.push(currentWord); // add last word to used words list
	let index = wordList.indexOf(currentWord);
	wordList.splice(index, 1); // remove current word from word list
	currentRound++; // increment round
	stoppers = 3;
	clearConsole();
	puzzleBox.innerHTML=''; // clear puzzleBox
	bonusTileIndex = 0; // reset bonus tile
	let randNum = Math.floor(Math.random() * wordList.length);
	currentWord = wordList[randNum]; // get new word

	randNum = Math.random();  // determine if there will be a bonus spot
	if (randNum <= 0.2) {
		puzzleBonusFlag = 2; // pink tile bonus chance: 20%
	} else if (randNum > 0.2 && randNum < 0.5) {
		puzzleBonusFlag = 1; // blue bonus chance: 50%
	} // end if

	if(puzzleBonusFlag>0) { bonusTileIndex = Math.floor(Math.random() * currentWord.length); }

	for (i = 0; i < currentWord.length; i++) { //draw puzzle
		let boxIdOutput = 'letter-box' + i.toString();
		let boxOutput = document.createElement('div');
		boxOutput.setAttribute('class', 'puzzle-letter-box');
		boxOutput.setAttribute('id', boxIdOutput);

		if (i == bonusTileIndex) { // if theres a bonus tile here, draw it
			if(puzzleBonusFlag == 1){
				boxOutput.classList.add('puzzle-box-pink');
			} else if(puzzleBonusFlag == 2) {
				boxOutput.classList.add('puzzle-box-blue');
			} // end color if
	  } //end bonustile if
		puzzleBox.appendChild(boxOutput);
	} //end draw puzzle for

	let tiledWord = currentWord;
	let randVowel = '';
	let randCons = '';
	while (true) { // applying 1 random vowel as a stopper
    randVowel = vowelList.charAt(Math.floor(Math.random()*5));
  // Note: For now, the random vowel will always be a vowel not used
    if (currentWord.indexOf(randVowel) < 0) {
      tiledWord += randVowel;
      break;
    } //end if
  } //end vowel while loop
	while (true) { // applying 2 random consanants as a stopper
    randCons = consanantList.charAt(Math.floor(Math.random()*consanantList.length));
  // Note: For now, the random cons's will always be a vowel not used
    if (currentWord.indexOf(randCons) < 0) {
      tiledWord += randCons;
      break;
    } //end if
  } //end 1st consnt while loop
	while (true) { // applying 2 random consanants as a stopper
		randCons = consanantList.charAt(Math.floor(Math.random()*consanantList.length));
	// Note: For now, the random cons's will always be a vowel not used
		if (currentWord.indexOf(randCons) < 0) {
			tiledWord += randCons;
			break;
		} //end if
	} //end 1st consnt while loop

	//initialize tile array
	for (i=0; i < tiledWord.length; i++) {
		tileList.push([tiledWord.charAt(i), false]);
	}
	tileList = shuffle(tileList); //shuffle tiles

	//append tiles to tile-box
	for (i=0; i < tileList.length; i++) {
		insertedElement = document.createElement('div');
		insertedElement.setAttribute('class', 'tile'); //give all tiles class name tile
		insertedElement.setAttribute('id', 'tile' + i); // give all tiles id tile0, tile1, etc..
		insertedElement.innerHTML = i + 1;
		tileBox.appendChild(insertedElement);
	}
	tileBox.style.visibility = 'visible'; // show tile box

	// give a turn to whoever is in cotrol of the board
	if (boardControl == 1) { playerTurn(); }
	else { cpuTurn(); }

} // end beginFirstRound

function playerTurn() {
	// notify player to click on a tile
	appendOutputConsole('p', 'Please click on one of the numbered tiles to continue');



	//add eventlisteners for tiles that are still in play
	for (i=0; i < tileList.length; i++) {
			if(tileList[i][1] == false) {
				document.querySelector('#tile' + i).addEventListener('click', function(e) {
					giveTileBank(parseInt(e.target.innerText) - 1);
					console.log(tileResult);
				});
			} //end if
	}// end for

}// end playerTurn()

function cpuTurn() {
	console.log('cpu turn');
}

// Function if buzzer is clicked
  function playerOneBuzzer() {

// Make sure a timer is still going, and if so, stop it and change the buzzer flag so we know what caused it
    if(buzzer==false) {
      console.log ('time stopped due to buzzer');
      buzzer=true;


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
          } // end correct cpu response
          else {
            // cpu answers incorrectly, give player control
            textOutput.innerHTML = ' CPU buzzed in... but does not know!';
            gameConsole.appendChild(textOutput);
            boardControl = 1;
            cpuAnswered = -1;
          } // end incorrect cpu response

          break; // break case 0

        default:
          break;

    } // End Buzzer instance switch

  } // End CPU buzzer if

  if (buzzer == true) { //buzzer activation, ideally use this function for all buzzers

      switch(buzzerInstance) {

        case 0: // Case 0 -- First round
          var playerGuess = prompt('Buzzer Activated! Please input your guess. Remember, spelling counts');
          var playerResult = playerGuess.toLowerCase();
          // ask player for a guess, and make it lower case to make it case insensitive
          console.log('guess:' + playerResult + ' answer:' + currentWord);

          if (playerResult == currentWord) {
            alert('YOU GOT IT!');
            boardControl = 1;
            playerAnswered = 1;
						appendOutputConsole('p', 'Player has control of the board');
						stopTimeFlag = true;
						appendOutputConsole('div', '<button class="continue-button" onclick="showingInstructions()">Continue</button>', 'flex-container justify-center');
        }  // If answer is correct, give the player control and note a correct answer

          else {
            alert('WRONG-O! Control lost.');
            boardControl = 2;
            playerAnswered = -1;
						appendOutputConsole('p', 'CPU has control of the board');
						stopTimeFlag = true;
						appendOutputConsole('div', '<button class="continue-button" onclick="showingInstructions()">Continue</button>', 'flex-container justify-center');
          } // if the answer is wrong, give the cpu control and not an incorrect answer.

          break;

        default:
            break;
      } // End player buzzer insance switch
  } // End player buzzer=true if
} // End buzzerActivation()



// fucntion for outputting to conosle
function appendOutputConsole(element, value, className, idName, onClick) {
  insertedElement = document.createElement(element);
  insertedElement.setAttribute('class', className);
  insertedElement.setAttribute('id', idName);
  insertedElement.setAttribute('onclick', onClick);
  insertedElement.innerHTML = value;
  gameConsole.appendChild(insertedElement);
}

function clearConsole() { // function to clear screen
	gameConsole.innerHTML = '';
}

function shuffle(array) { //function to shuffle array -ty stack overflow-
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function checkPlayerTile(tile) {

	tileResult = []; // reset result array


	let selectedLetter = tileList[tile][0]; // get the letter on the tile
	let breakLoop = false; // allow the loop to break prematurely if a home has been found for the letter
	//note -- look at possible instances and randomize multiple letter instances. right now,  it will always fill in the first occurrence of a letter

	for(i=0; i < currentWord.length; i++) { // check to see, from the beginning, if each letter box matches the letter of the current word AND it hasnt been filled in

		if(breakLoop == true) { break; } //break the loop if necessary

		if( document.querySelector('#letter-box' + i).innerText == '' && selectedLetter == currentWord.charAt(i) ) {
			tileResult.push(true);
			tileResult.push(i);
			tileResult.push(selectedLetter);
			breakLoop = true; // dont allow any more letter checks
		} //end if
	}// end for

	if(tileResult.length == 0) { //if the tileresult array is empty, that means there was no home for the letter. stopper time!
		tileResult.push(false);
		tileResult.push(i);
		tileResult.push(selectedLetter);
	} //end if
	console.log(tileResult);
	//run animation for tileResult
	tileCheckAnimation(tileResult);

} //end checkplayertile()

function tileCheckAnimation(tileArray) {

	console.log(`TileArray: ${tileArray}`)

	//prepare front end of tile animation
	tileAnimFront.innerText = tileArray[2].toUpperCase();

	//prepare back end of tile animation
	if(tileArray[0]==false) {
		tileAnimBack.innerText = 'Wrong!';
		tileAnimBack.classList.add('back-wrong');
	} else {
		tileAnimBack.innerText = 'Correct!';
	} //end if

	tileAnimBox.style.visibility = 'visible'; // start the animation
	tileAnimBox.classList.add('tile-check-animation');
	setTimeout(function() {
		tileAnimBox.style.visibility = 'hidden';
		tileAnimBox.classList.remove('tile-check-animation');
		if(tileArray[0]==false) { tileAnimBack.classList.remove('back-wrong'); }
	}, 2500);

} // end tileCheckAnimation

function giveTileBank(tileIndex) {
	tileBank.push(tileIndex, tileList[tileIndex][0]); //push the tileindex and letter

	if(tileBank.length == 1 && stoppers == 3) { // should only occur once, if the bank only has one tile after activation, ask for another
		gameConsole.innerHTML = 'Please select one more tile';
	} else if(tileBank.length == 1 && stoppers != 3) { // no more tiles left
		for (i=0; i < tileList.length; i++) {
				if(tileList[i][1] == false) {
					document.querySelector('#tile' + i).removeEventListener('click', function(e) {
						giveTileBank(parseInt(e.target.innerText) - 1);
						console.log(tileResult);
					});
				} //end if
		}// end for
	}

}
