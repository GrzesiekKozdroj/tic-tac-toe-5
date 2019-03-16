document.addEventListener('DOMContentLoaded', () => {

    let gamer = true;
    let xScore = 0;
    let oScore = 0;
    let symbol = gamer === true ? 'X' : 'O';
    let boardSize = 20;

    //fills the board with boxes with coordinates
    function makeNewBoard() {
        $('#board').empty()
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let square = `<div class='square' data-xy=${i+','+j}></div>`;
                $('#board').append(square);
            }
        }
        addClicks();
    }

    //on kilck places a symbol of one of the players
    function addClicks() {
        $('.square').on('click', function () {
            if ($(this).text() === '') {
                $(this).toggleClass('rotator');
                gamer = gamer === true ? false : true;
                symbol = gamer === true ? 'X' : 'O';
                //console.log(symbol,gamer,$(this).data('xy'));
                $(this).html(symbol);
                checkForWinner()
                let color = symbol==='X'?'green':'yellow';
                $(this).css('background',color)
            }
        });
    }

    $('.winner__alert').on('click',()=>{
        makeNewBoard();
        $('.winner__alert').toggleClass('winner');
    })

    function winner(score){
        if(score==='X'){xScore++;console.log(xScore,'x')}else{oScore++;console.log(oScore,'o')}
        $('.winner__alert').toggleClass('winner').html(`<p>the winner is </p><spam>${symbol}</spam><p> click here to play again</p>`);
    }

    function checkForWinner() {
        let $square = $('.square');
        for (let i = 0; i < boardSize * boardSize; i++) {
            //checking for winner in horizontal plane
            if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 1).text() &&
                $square.eq(i + 1).text() === $square.eq(i + 2).text() &&
                $square.eq(i + 2).text() === $square.eq(i + 3).text() &&
                $square.eq(i + 3).text() === $square.eq(i + 4).text() &&
                i%boardSize<16) {
                    $square.eq(i).css("background-color","red");
                    $square.eq(i+1).css("background-color","red");
                    $square.eq(i+2).css("background-color","red");
                    $square.eq(i+3).css("background-color","red");
                    $square.eq(i+4).css("background-color","red");
                winner($square.eq(i).text());
            }
            //checking for winner in vertical plane
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 20).text() &&
                $square.eq(i + 20).text() === $square.eq(i + 40).text() &&
                $square.eq(i + 40).text() === $square.eq(i + 60).text() &&
                $square.eq(i + 60).text() === $square.eq(i + 80).text()) {
                    $square.eq(i).css("background-color","red");
                    $square.eq(i+20).css("background-color","red");
                    $square.eq(i+40).css("background-color","red");
                    $square.eq(i+60).css("background-color","red");
                    $square.eq(i+80).css("background-color","red");
                winner();
            }
            //checking for winner on a diagonal forward plane
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 21).text() &&
                $square.eq(i + 21).text() === $square.eq(i + 42).text() &&
                $square.eq(i + 42).text() === $square.eq(i + 63).text() &&
                $square.eq(i + 63).text() === $square.eq(i + 84).text() &&
                i%boardSize<16) {
                    $square.eq(i).css("background-color","red");
                    $square.eq(i+21).css("background-color","red");
                    $square.eq(i+42).css("background-color","red");
                    $square.eq(i+63).css("background-color","red");
                    $square.eq(i+84).css("background-color","red");
                winner();
            }
            //checking for winner in a minus diagonal option
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 19).text() &&
                $square.eq(i + 19).text() === $square.eq(i + 38).text() &&
                $square.eq(i + 38).text() === $square.eq(i + 57).text() &&
                $square.eq(i + 57).text() === $square.eq(i + 76).text() &&
                i%boardSize<16) {
                    $square.eq(i).css("background-color","red");
                    $square.eq(i+19).css("background-color","red");
                    $square.eq(i+38).css("background-color","red");
                    $square.eq(i+57).css("background-color","red");
                    $square.eq(i+76).css("background-color","red");
                winner();
            }
        }
    }

    makeNewBoard();
    addClicks();


})