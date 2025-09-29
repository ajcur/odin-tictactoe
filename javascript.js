/* const newGameBtn = document.querySelector('#new-game');
const newPlayerDialog = document.querySelector('.new-player-dialog');
const player1NameInput = document.querySelector('#name1');
const player2NameInput = document.querySelector('#name2');
const player1SymbolInput = document.querySelector('#symbol1');
const player2SymbolInput = document.querySelector('#symbol2');
const startGameBtn = document.querySelector('#start-game');
const winStateAnnouncement = document.querySelector('.win-state-announcement');
const winStateDialog = document.querySelector('.win-state-dialog');
const tieStateDialog = document.querySelector('.tie-state-dialog'); */

gameboard = (function() {

    let state = ["", "", "", "", "", "", "", "", ""];

    uiFields = (function() {
        const a1 = document.querySelector('#a1');
        const a2 = document.querySelector('#a2');
        const a3 = document.querySelector('#a3');
        const b1 = document.querySelector('#b1');
        const b2 = document.querySelector('#b2');
        const b3 = document.querySelector('#b3');
        const c1 = document.querySelector('#c1');
        const c2 = document.querySelector('#c2');
        const c3 = document.querySelector('#c3');

        return [a1, a2, a3, b1, b2, b3, c1, c2, c3]
    })();

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

    function reset() {
        state = ["", "", "", "", "", "", "", "", ""];
        render();
    }

    function render() {
        for (let i = 0; i < state.length; i++) {
            uiFields[i].textContent = state[i];
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
        return tieState;
    }

    return {getState, uiFields, render, reset, setMark, determineWinState, determineTieState}

})();

players = (function() {
    
    let list = [];

    function getList() {
        return list;
    };
    
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

    function clearPlayers() {
        list = [];
    };

    return {getList, createPlayer, clearPlayers};
})();

game = (function() {
    
    gameUI = (function(){
        const newGameBtn = document.querySelector('#new-game');
        const resetGameBtn = document.querySelector('#reset-game');
        const startOverBtns = Array.from(document.querySelectorAll('.start-over'));
        const newPlayerDialog = document.querySelector('.new-player-dialog');
        const player1NameInput = document.querySelector('#name1');
        const player2NameInput = document.querySelector('#name2');
        const player1SymbolInput = document.querySelector('#symbol1');
        const player2SymbolInput = document.querySelector('#symbol2');
        const startGameBtn = document.querySelector('#start-game');
        const winStateAnnouncement = document.querySelector('.win-state-announcement');
        const winStateDialog = document.querySelector('.win-state-dialog');
        const tieStateDialog = document.querySelector('.tie-state-dialog');

        return {
            newGameBtn,
            resetGameBtn,
            startOverBtns,
            newPlayerDialog,
            player1NameInput,
            player2NameInput,
            player1SymbolInput,
            player2SymbolInput,
            startGameBtn,
            winStateAnnouncement,
            winStateDialog,
            tieStateDialog
        }
    })();

    (function openNewPlayerDialog() {
        gameUI.newGameBtn.addEventListener('click', () => {
            gameUI.newPlayerDialog.showModal();
        })
    })();

    function resetNewPlayerDialog() {
        gameUI.player1NameInput.value = "";
        gameUI.player1SymbolInput.value = "";
        gameUI.player2NameInput.value = "";
        gameUI.player2SymbolInput.value = "";
    }

    (function resetBtn() {
        gameUI.resetGameBtn.addEventListener('click', () => {
            gameboard.reset();
        });
    })();

    (function startOver() {
        for (button of gameUI.startOverBtns) {
            button.addEventListener('click', () => {
                gameboard.reset();
                players.clearPlayers();
                gameUI.tieStateDialog.close();
                gameUI.winStateDialog.close();

                gameUI.newPlayerDialog.showModal();
            });
        };
    })();

    initializeGameFunctions = function(playerList) {
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

        function playTurn(position) {
            let turnResult = {
                winState: false,
                tieState: false
            };

            let markSuccessful = currentPlayer.makeMark(position);

            if (!markSuccessful) {
                return {turnResult};
            }

            console.log(gameboard.getState());
            gameboard.render();

            turnResult.winState = gameboard.determineWinState(currentPlayer.mark);

            if (turnResult.winState) {
                let winner = currentPlayer.name;
                gameUI.winStateDialog.showModal();
                gameUI.winStateAnnouncement.textContent = `Congratulations! ${winner} won the game!`;
                return {turnResult};
            }

            turnResult.tieState = gameboard.determineTieState();
            
            if (turnResult.tieState) {
                gameUI.tieStateDialog.showModal();
                return {turnResult};
            }

            advanceTurn();
            
            return {turnResult};
            }

        return {getCurrentPlayer, playTurn};
    };

    function playGame() {
        gameFunctions = initializeGameFunctions(players.getList());
        
        let turnResult = {
            winState: false,
            tieState: false
        }

        gameboard.uiFields.forEach((field) => {
            field.addEventListener('click', () => {
                let position = gameboard.uiFields.indexOf(field);
                if (!turnResult.winState && !turnResult.tieState) {
                    turnResult = gameFunctions.playTurn(position).turnResult;
                }
            })
        })
        return {turnResult};
    }

    (function startGame() {
        gameUI.newPlayerDialog.addEventListener('submit', () => {

            players.createPlayer(gameUI.player1NameInput.value, gameUI.player1SymbolInput.value);
            players.createPlayer(gameUI.player2NameInput.value, gameUI.player2SymbolInput.value);

            resetNewPlayerDialog();

            playGame();
        })
    })();

    return;

})();