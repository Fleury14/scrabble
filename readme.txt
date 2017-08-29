      Program FLOW

      Global
          ||
      beginGame()
          ||
      firstPuzzleStart
          ||
      beginFirstRound
          |           \
  --> PlayerTurn <-     cpuTurn <-- --
  |       |       |       |       |   |
  |   playerTurnA*|   cpuTurnA*   |   | **can go to opposite turn w/stopper
  |       |       |       |       |   |
  |   playerContinue  cpuContinue     |
  |       |               |           |
  |   playerWinsRound cpuWinsRound----
  --------|    \        /
                gameOver

ancillary function list:
showingInstructions() -- Displays instruction in beginning of round 1
playerOneBuzzer() -- stops the timer in the opening round
buzzerActivation() -- processes buzzer instruction, be it cpu or player
appendOutputConsole() -- used to output element to the console area
clearConsole() -- clears the console area
shuffle() -- shuffles contents of array, ty stack overflow
checkPlayerTile() -- check to see if the passed tile, be it by cpu or player, is valid, or is in a stoppers
tileCheckAnimation() -- the animation where the tile floats on the screen and is flipped
giveTileBank() -- processes putting tiles into the bank shared by both players.
drawTileBank() -- refreshes the contents of the tile bank for the player in control of the board
drawTileBoxes() -- changed opacity of tiles that are already used. NOTE: this does not physically draw the tiles, that is done within the main flow of the game
drawStoppers() -- refreshes the stoppers indicators on the screen
checkTilesLeft() -- checks to see how many tiles are left
