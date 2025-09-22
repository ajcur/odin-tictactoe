gameboard = (function() {
    let state = ["", "", "", "", "", "", "", "", ""];
    function getState() {
        return state;
    }
    function setMark(position, mark) {
        if (position < state.length && position >= 0) {
            if (state[position] == "") {
                state[position] = mark;
            } else {
                alert ('Not an empty position');
            }
        } else {
            alert('Not a valid gameboard position');
            return;
        }
    }
    function determineWinState(mark) {
        let winState = false;
        let i = 0;
        while (!winState && i <= 8) {
            if (
                ((i == 0 || 3 || 6) && (state[i] && state[i+1] && state[i+2] == mark)) ||
                ((i < 3) && (state[i] && state[i+3] && state[i+6] == mark)) ||
                ((i == 0) && (state[i] && state[i+4] && state[i+8] == mark)) ||
                ((i == 2) && (state[i] && state[i+2] && state[i+4] == mark))
            ){
                winState = true;
            } else i++;
        }
        return winState;
        }
    return {getState, setMark, determineWinState}
})();

/* function createPlayer(name, mark) {
    let player = {
        name,
        mark,
        makeMark: function(position) {
            gameboard.setMark(position, this.mark);
        }
    }
    return player;
}; */

addPlayers = (function () {
    let players = [];
    function createPlayer(name, mark) {
        let player = {
            name,
            mark,
            makeMark: function(position) {
                gameboard.setMark(position, this.mark);
            }
        }
        players.push(player);
        return player;
    };
    return {players, createPlayer};
})();

createTurn = function(players) {
    let turnIndex = 0;
    let currentPlayer = players[turnIndex];
    function getCurrentPlayer() {
        return currentPlayer;
    }
    function advanceTurn() {
        if (turnIndex < (players.length - 1)) {
            turnIndex++;
        } else turnIndex = 0;
        currentPlayer = players[turnIndex];
    }
    function makeMark(position) {
        currentPlayer.makeMark(position);
    }
    return {getCurrentPlayer, advanceTurn, makeMark};
};

playRound = function(players) {
    playTurn = createTurn(players);
    
    position = prompt(`Position for ${playTurn.getCurrentPlayer().name}?`)
    playTurn.makeMark(position);

    if (gameboard.getState()[position] != playTurn.getCurrentPlayer().mark) {
        return;
    }
    winState = gameboard.determineWinState(playTurn.getCurrentPlayer().mark);

    if (winState) {
        let winner = playTurn.getCurrentPlayer().name;
        alert(`Congratulations! ${winner} won the game!`)
        return;
    } else playTurn.advanceTurn();
    
    return {winState, winner}
}

playGame = function() {
    alex = addPlayers.createPlayer('alex', 'o');
    jamie = addPlayers.createPlayer('jamie', 'x');

    playTurn = createTurn(addPlayers.players);

    playTurn.makeMark(prompt(`Position for ${playTurn.getCurrentPlayer().name}?`));
    playTurn.advanceTurn();
    playTurn.makeMark(prompt(`Position for ${playTurn.getCurrentPlayer().name}?`));
    console.log(gameboard.getState());
}

playGame();

/* playTurn.makeMark(prompt(`Position for ${playTurn.getCurrentPlayer().name}?`));
playTurn.advanceTurn();
playTurn.makeMark(prompt(`Position for ${playTurn.getCurrentPlayer().name}?`)); */

/* console.log(gameboard.getState()); */

/* Next steps:
- Take input of position from player
- Logic to determine win state and winning player
- Logic to determine tie state
- Logic to play turns until win or tie state is reached 
- Add a way to input player name + mark and populate the players array automatically */