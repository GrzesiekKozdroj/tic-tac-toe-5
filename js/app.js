document.addEventListener('DOMContentLoaded', () => {

    let gamer = true;

    let symbol = gamer === true ? 'X' : 'O';
    let boardSize = 20;

    //fills the board with boxes with coordinates
    function makeNewBoard() {
        $('#board').empty().off();
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let square = `<div class='square' data-xy=${i+','+j}></div>`;
                $('#board').append(square);
            }
        }
    }
    makeNewBoard();

    //on kilck places a symbol of one of the players
    $('.square').on('click', function () {
        if ($(this).text() === '') {
            $(this).toggleClass('rotator');
            gamer = gamer === true ? false : true;
            symbol = gamer === true ? 'X' : 'O';
            //console.log(symbol,gamer,$(this).data('xy'));
            $(this).html(symbol);
            checkForWinner()
        }
    });

    function checkForWinner() {
        let $square = $('.square');
        for (let i = 0; i < boardSize * boardSize; i++) {
            //checking for winner in horizontal plane
            if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 1).text() &&
                $square.eq(i + 1).text() === $square.eq(i + 2).text() &&
                $square.eq(i + 2).text() === $square.eq(i + 3).text() &&
                $square.eq(i + 3).text() === $square.eq(i + 4).text()) {
                    console.log('winner is ', $square.eq(i).text(), ' horizontally');
                makeNewBoard();
            }
            //checking for winner in vertical plane
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 20).text() &&
                $square.eq(i + 20).text() === $square.eq(i + 40).text() &&
                $square.eq(i + 40).text() === $square.eq(i + 60).text() &&
                $square.eq(i + 60).text() === $square.eq(i + 80).text()) {
                    console.log('winner is ', $square.eq(i).text(), ' vertically');
                makeNewBoard();
            }
            //checking for winner on a diagonal forward plane
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 21).text() &&
                $square.eq(i + 21).text() === $square.eq(i + 42).text() &&
                $square.eq(i + 42).text() === $square.eq(i + 63).text() &&
                $square.eq(i + 63).text() === $square.eq(i + 84).text()) {
                    console.log('winner is '+ $square.eq(i).text()+ ' diagonally');
                makeNewBoard();
            }
            //checking for winner in a minus diagonal option
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 19).text() &&
                $square.eq(i + 19).text() === $square.eq(i + 38).text() &&
                $square.eq(i + 38).text() === $square.eq(i + 57).text() &&
                $square.eq(i + 57).text() === $square.eq(i + 76).text()) {
                console.log('winner is '+ $square.eq(i).text()+ ' anti-diagonally');
                makeNewBoard();
            }
        }
    }
    //git is counterintuiitive


})