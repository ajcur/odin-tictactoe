const newGameBtn = document.querySelector('#new-game');
const newPlayerDialog = document.querySelector('.new-player-window');
const player1NameInput = document.querySelector('#name1');
const player2NameInput = document.querySelector('#name2');
const player1SymbolInput = document.querySelector('#symbol1');
const player2SymbolInput = document.querySelector('#symbol2');
const startGameBtn = document.querySelector('#start-game');

const gameboardFieldA1 = document.querySelector('#a1');
const gameboardFieldA2 = document.querySelector('#a2');
const gameboardFieldA3 = document.querySelector('#a3');
const gameboardFieldB1 = document.querySelector('#b1');
const gameboardFieldB2 = document.querySelector('#b2');
const gameboardFieldB3 = document.querySelector('#b3');
const gameboardFieldC1 = document.querySelector('#c1');
const gameboardFieldC2 = document.querySelector('#c2');
const gameboardFieldC3 = document.querySelector('#c3');

const gameboardFields = [
    gameboardFieldA1,
    gameboardFieldA2,
    gameboardFieldA3,
    gameboardFieldB1,
    gameboardFieldB2,
    gameboardFieldB3,
    gameboardFieldC1,
    gameboardFieldC2,
    gameboardFieldC3
];

gameboard = (function() {
    let state = ["", "", "", "", "", "", "", "", ""];

    const possibleCombinations = [
        [3, 4, 5],
        [0, 1, 2],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8]
    ]

    function getState() {
        return state;
    }

    function render() {
        for (let i = 0; i < state.length; i++) {
            gameboardFields[i].textContent = state[i];
        };
    }

    function setMark(position, mark) {
        if (position >= state.length || position < 0) {
            console.log('Not a valid gameboard position');
            return false;
        }
        if (state[position] !== "") {
            console.log('Not an empty position');
            return false;
        }
        state[position] = mark;
        return true;
    }

    function determineWinState(mark) {
        let winState = false;
        for (const combination of possibleCombinations) {
            if (
                state[combination[0]] == mark &&
                state[combination[1]] == mark && 
                state[combination[2]] == mark
            ) {
                winState = true;
            }
        }

        /* let winState = possibleCombinations.oneTrue(mark); */
        /* while (!winState && i < 8) { */
            /* if (
                ((i == 0 || i == 3 || i == 6) && 
                    (state[i] == mark && state[i+1] == mark && state[i+2] == mark)) ||
                ((i < 3) && 
                    (state[i] == mark && state[i+3] == mark && state[i+6] == mark)) ||
                ((i == 0) &&
                    (state[i] == mark && state[i+4] == mark && state[i+8] == mark)) ||
                ((i == 2) && 
                    (state[i] == mark && state[i+2] == mark && state[i+4] == mark))
            ){
                winState = true;
            } else i++; */
        return winState;
    }
    
    function determineTieState() {
        let tieState = true;
        for (const combination of possibleCombinations) {
            if (
                state[combination[0]] == "" ||
                state[combination[1]] == "" ||
                state[combination[2]] == ""
            ){
                tieState = false;
            }
        }
        
        /* let i = 0;
        while (!tieState && i < 8) {
            if (
                ((i == 0 || i == 3 || i == 6) && (state[i] && state[i+1] && state[i+2])) &&
                ((i < 3) && (state[i] && state[i+3] && state[i+6])) &&
                ((i == 0) && (state[i] && state[i+4] && state[i+8])) &&
                ((i == 2) && (state[i] && state[i+2] && state[i+4]))
            ){
                tieState = true;
            } else i++;
        } */
        return tieState;
    }

    return {getState, render, setMark, determineWinState, determineTieState}

})();

players = (function() {
    let list = [];
    function createPlayer(name, mark) {
        let player = {
            name,
            mark,
            makeMark: function(position) {
                return gameboard.setMark(position, this.mark);
            }
        }
        list.push(player);
        return player;
    };
    return {list, createPlayer};
})();

game = (function() {
    /* players.createPlayer('alex', 'o');
    players.createPlayer('jamie', 'x'); */

    initializeGameFunctions = function (playerList) {
        let turnIndex = 0;
        let currentPlayer = playerList[turnIndex];

        function getCurrentPlayer() {
            return currentPlayer;
        }

        function advanceTurn() {
            if (turnIndex < (playerList.length - 1)) {
                turnIndex++;
            } else turnIndex = 0;
            currentPlayer = playerList[turnIndex];
        }

        /* function setPosition() {
            let position;
            gameboardFields.forEach((field) => {
                field.addEventListener('click', () => {
                    position = gameboardFields.indexOf(field)
                })
            })
            return position;
        }; */

        function playTurn(position) {
            let gameStates = {
                winState: false,
                tieState: false
            };

            let markSuccessful = currentPlayer.makeMark(position);

            let winner;

            if (!markSuccessful) {
                return {gameStates};
            }

            console.log(gameboard.getState());
            gameboard.render();

            gameStates.winState = gameboard.determineWinState(currentPlayer.mark);

            if (gameStates.winState) {
                winner = currentPlayer.name;
                console.log(`Congratulations! ${winner} won the game!`);
                return {gameStates, winner};
            }

            gameStates.tieState = gameboard.determineTieState();
            
            if (gameStates.tieState) {
                console.log('Tie! Try again!');
                return {gameStates}
            }

            advanceTurn();
            
            
            return {gameStates};
            }

        return {getCurrentPlayer, playTurn};
    };

    function playGame() {
        gameFunctions = initializeGameFunctions(players.list);
        
        let gameStates = {
            winState: false,
            tieState: false
        }

        gameboardFields.forEach((field) => {
            field.addEventListener('click', () => {
                let position = gameboardFields.indexOf(field);
                if (!gameStates.winState && !gameStates.tieState) {
                    gameStates = gameFunctions.playTurn(position).gameStates;
                }
            })
        })
    }
    
    return {playGame}

})();

newGameBtn.addEventListener('click', () => {
    newPlayerDialog.showModal();
})

newPlayerDialog.addEventListener('submit', () => {
    let player1Name = player1NameInput.value;
    let player1Symbol = player1SymbolInput.value;
    let player2Name = player2NameInput.value;
    let player2Symbol = player2SymbolInput.value;

    players.createPlayer(player1Name, player1Symbol);
    players.createPlayer(player2Name, player2Symbol);

    game.playGame();
})

/* Next steps:
- Take input of position from player
- Logic to determine win state and winning player
- Logic to determine tie state
- Logic to play turns until win or tie state is reached 
- Add a way to input player name + mark and populate the players array automatically */