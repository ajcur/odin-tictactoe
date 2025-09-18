// player objects need a score that can't be manually changed (private, with only readScore() as a public method?)

// method makeMark(field) on player objects?

// OR each field is an object with a private property of mark and public methods that can view and change the mark? and gameboard is an array of the field objects?

function createField(letter, number) {
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
})(3,3);