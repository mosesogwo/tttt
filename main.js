const playerFactory = (name, mark) => {
  // A player can play a turn, this places the player's mark on a cell on the board.
  playTurn = (board, cell) => {
    const idx = board.cells.findIndex((position) => position === cell);

    if (board.boardArray[idx] === '') {
      board.boardArray[idx] = `${mark}`;
    } else {
      return null;
    }
    board.render();
  };

  return { name, mark, playTurn };
};

const boardModule = (() => {
  let boardArray = ['', '', '', '', '', '', '', '', ''];
  const gameBoard = document.querySelector('#board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  let winner = null;

  render = () => {
    boardArray.forEach((mark, idx) => {
      cells[idx].textContent = boardArray[idx];
    });
  };

  reset = () => {
    boardArray = ['', '', '', '', '', '', '', '', ''];
  };

  checkWin = () => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winArrays.forEach((combo) => {
      if (boardArray[combo[0]] && boardArray[combo[0]] === boardArray[combo[1]] && boardArray[combo[0]] === boardArray[combo[2]]) {
        winner = 'current';
      }
    });
    return winner || (boardArray.includes('') ? null : 'Tie');
  };

  return {
    render, gameBoard, cells, boardArray, checkWin, reset,
  };
})();

/* global gamePlay, board*/
const gamePlay = (() => {
  const playerOneName = document.querySelector('#player1').value;
  const playerTwoName = document.querySelector('#player2').value;
  const form = document.querySelector('.player-info');
  const resetBtn = document.querySelector('#reset');

  /* global gameRound, render, checkWin, reset */
  const gameRound = () => {
    playerOne = playerFactory(playerOneName, 'X');
    playerTwo = playerFactory(playerTwoName, 'O');
    currentPlayer = playerOne;
    let board = boardModule;
    const gameStatus = document.querySelector('.game-status');
    gameStatus.textContent = `${playerOne.name}'s Turn`;

    board.gameBoard.addEventListener('click', (event) => {
      event.preventDefault();
      if (currentPlayer.playTurn(board, event.target) !== null) {
        const winStatus = board.checkWin();
        if (winStatus === 'Tie') {
          gameStatus.textContent = 'Tie!';
        } else if (winStatus === null) {
          switchTurn();
          gameStatus.textContent = `${currentPlayer.name}'s Turn`;
        } else {
          gameStatus.textContent = `Winner is ${currentPlayer.name}`;
          board.reset();
          board.render();
        }
      }
    });
  };

  const gameInit = () => {
    playerOne = playerFactory(playerOneName, 'X');
    playerTwo = playerFactory(playerTwoName, 'O');
    currentPlayer = playerOne;
    gameRound();
  };

  /* global switchTurn, playerOne, playerTwo, currentPlayer */
  switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (playerOneName !== '' && playerTwoName !== '') {
      gameRound();
      form.classList.add('hidden');
    } else {
      location.reload();
    }
  });

  resetBtn.addEventListener('click', () => {
    location.reload(true);
  });
})();