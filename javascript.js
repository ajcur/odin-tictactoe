// player objects need a score that can't be manually changed (private, with only readScore() as a public method?)

// method makeMark(field) on player objects?

// OR each field is an object with a private property of mark and public methods that can view and change the mark? and gameboard is an array of the field objects?

/* function createField(letter, number) {
    const name = `field${letter}${number}`;

    let mark = '';
    const setMark = function(newMark) {
        mark = newMark;
    };
    const getMark = function() {
        return mark;
    }

    return { name, setMark, getMark };
}

gameboard = (function createGameboard(colNumber, rowNumber) {
    let letter;
    let gameboard = [];
    for (let i = 1; i <= rowNumber; i++) {
        for (let j = 1; j <= colNumber; j++) {
            switch (j) {
                case 1:
                    letter = 'A';
                    break;
                case 2:
                    letter = 'B';
                    break;
                case 3:
                    letter = 'C';
            }
            let newField = createField(letter, i)
            gameboard.push(newField);
        }
    }
    return gameboard;
})(3,3); */

gameboard = (function() {
    state = ["", "", "", "", "", "", "", "", ""];
    getState = function() {
        return state;
    }
    setMark = function(position, mark) {
        state[position] = mark;
    }
    return {getState, setMark}
})();

playGame = (function(players) {
    let turnIndex = 0;
    let currentPlayer = players[turnIndex];
    getCurrentPlayer = function() {
        return currentPlayer;
    }
    advanceTurn = function() {
        if (turnIndex < (players.length)) {
            turnIndex++;
        } else turnIndex = 0;
        return turnIndex;
    }
    makeMark = function(position, currentPlayer) {
        gameboard.setMark(position, currentPlayer.mark);
    }
    return {turnIndex, getCurrentPlayer, advanceTurn, makeMark};
});

function createPlayer(name, mark) {
    let player = {
        name,
        mark
    }
    return player;
};

alex = createPlayer('alex', 'o');
jamie = createPlayer('jamie', 'x');

game = playGame([alex, jamie]);

game.advanceTurn();
console.log(game.getCurrentPlayer());

/* gameboard.setMark(3, alex.mark);
gameboard.setMark(0, jamie.mark); */

console.log(gameboard.getState());