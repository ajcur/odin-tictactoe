gameboard = (function() {
    let state = ["", "", "", "", "", "", "", "", ""];
    function getState() {
        return state;
    }
    function setMark(position, mark) {
        state[position] = mark;
    }
    return {getState, setMark}
})();

function createPlayer(name, mark) {
    let player = {
        name,
        mark,
        makeMark: function(position) {
            gameboard.setMark(position, this.mark);
        }
    }
    return player;
};

alex = createPlayer('alex', 'o');
jamie = createPlayer('jamie', 'x');

playTurn = (function(players) {
    let turnIndex = 0;
    let currentPlayer = players[turnIndex];
    function getCurrentPlayer() {
        return currentPlayer.name;
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
})([alex, jamie]);

playTurn.makeMark(3);
playTurn.advanceTurn();
playTurn.makeMark(0);

console.log(gameboard.getState());

/* Next steps:
- Take input of position from player
- Logic to determine win state and winning player
- Logic to determine tie state
- Logic to play turns until win or tie state is reached 
- Add a way to input player name + mark and populate the players array automatically */