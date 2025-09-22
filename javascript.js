gameboard = (function() {
    let state = ["", "", "", "", "", "", "", "", ""];

    function getState() {
        return state;
    }

    function setMark(position, mark) {
        if (position >= state.length || position < 0) {
            alert('Not a valid gameboard position');
            return;
        }
        if (state[position] !== "") {
            alert ('Not an empty position');
            return;
        }
        state[position] = mark;
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

players = (function() {
    let list = [];
    function createPlayer(name, mark) {
        let player = {
            name,
            mark,
            makeMark: function(position) {
                gameboard.setMark(position, this.mark);
            }
        }
        list.push(player);
        return player;
    };
    return {list, createPlayer};
})();

game = (function() {
    players.createPlayer('alex', 'o');
    players.createPlayer('jamie', 'x');

    gameFunctions = (function (playerList) {
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

        function setPosition() {
            return prompt(`Mark position for ${currentPlayer.name}?`);
        }

        function playTurn() {
            position = setPosition();
            currentPlayer.makeMark(position);
            if (gameboard.getState()[position] != currentPlayer.mark) {
                return;
            }

            let winner;
            let winState = gameboard.determineWinState(currentPlayer.mark);

            if (winState) {
                winner = currentPlayer.name;
                alert(`Congratulations! ${winner} won the game!`)
                return;
            }

            advanceTurn();
            
            console.log(gameboard.getState());
            
            return {winState, winner};
            }
        return {getCurrentPlayer, playTurn};
    })(players.list);

    function playGame() {
        let winState = false;
        while (!winState) {
            winState = gameFunctions.playTurn().winState;
        }
    }
    
    return {playGame}

})();

game.playGame();

/* Next steps:
- Take input of position from player
- Logic to determine win state and winning player
- Logic to determine tie state
- Logic to play turns until win or tie state is reached 
- Add a way to input player name + mark and populate the players array automatically */