document.addEventListener('DOMContentLoaded', () => {

    const socket = io();

    let gamer = true;
    let offline = true;
    let xScore = 0;
    let oScore = 0;
    let symbol = 'X';
    let boardSize = 20;
    let moveCount;
    let ajdee = 0;
    socket.on('id',(data)=>{
        if(ajdee===0){
            ajdee=data.id;
            gamer=data.turn;
            offline = false;
        }
    })

    //fills the board with boxes with coordinates
    function makeNewBoard() {
        $('#board').empty()
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                let square = `<div class='square' data-xy=${i+','+j}></div>`;
                $('#board').append(square);
            }
        }
        moveCount = 1;
        addClicks();addHover()
    }



    //on kilck places a symbol of one of the players
    function addClicks() {            
        $('.square').on('click', function (e) {
            e.preventDefault();
            if ($(this).text() === '' && (gamer === true || offline)) {
                $(this).toggleClass('rotator');
                if(!offline){
                    gamer = false;
                    symbol = 'X';
                }else{
                    gamer = gamer === true ? false : true;
                    symbol = gamer === true ? 'X' : 'O';
                }
                //console.log(symbol,gamer,$(this).data('xy'));
                $(this).html(symbol);
                let color = symbol==='X'?'green':'yellow';
                $(this).css('background',color);
                checkForWinner();
                moveCount++;
                let  myTimOut = ()=>{setTimeout(()=>{$(this).removeClass('rotator')},2000);}
                myTimOut();
                clearTimeout(myTimOut);
                let coords = $(this).data("xy");
                socket.emit('board update',{coords:coords,id:ajdee});
            }
        });
    }
    function addHover(){
        $('.square').mouseenter(function(){
            if($(this).text()===''){ 
                if(!gamer && offline)       $(this).css('background-color','green'); 
                else if(gamer && offline) $(this).css('background-color','yellow');
                else if(!offline)          $(this).css('background-color','green');
            let coords = $(this).data("xy"); 
            socket.emit('hoverin',coords)   }
        })
        $('.square').mouseleave(function(){
            if($(this).text()===''){  $(this).css('background-color','rgb(235, 235, 207)');
            let coords = $(this).data("xy");
            socket.emit('hoverout',coords)  }
        })
    }

    socket.on('server update',(data)=>{
        data.forEach(player=>{
            if(ajdee!==player.origin_id){
                $(`div[data-xy = "${ player.board_update }"]`).text('O').css('background','yellow');
                gamer = true;
                moveCount++;
                checkForWinner();
                let  myTimOut = ()=>{setTimeout(()=>{$(this).removeClass('rotator')},2000);}
                myTimOut();
                clearTimeout(myTimOut);
            }
        })
    });

    socket.on('server hoverin',(data)=>{
        data.forEach(player=>{
            if(ajdee!==player.origin_id){
                $(`div[data-xy = "${player.hoverin}"]`).css('backround','yellow');
                console.log('recieving')
            }
        })
    });

    socket.on('server hoverout', (data)=>{
        data.forEach(player=>{
            if(ajdee!==player.origin_id){
                if($(`div[data-xy = "${player.hoverout}"]`).text()==='X'){
                    $(`div[data-xy = "${player.hoverout}"]`).css('backround','green');
                }else if($(`div[data-xy = "${player.hoverout}"]`).text()==="O"){
                    $(`div[data-xy = "${player.hoverout}"]`).css('backround','yellow');
                }else{
                    $(`div[data-xy = "${player.hoverout}"]`).css('backround','rgb(235, 235, 207)');
                }
            }
            console.log('recievong')
        })
    })
    

    $('.winner__alert').on('click',()=>{
        makeNewBoard();
        $('.winner__alert').toggleClass('winner').text('');
    })

    function winner(score){
        if(score==='X'){xScore++;$('.xScore').text(xScore)}else{oScore++;$('.oScore').text(oScore);};
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
                winner($square.eq(i).text());
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
                winner($square.eq(i).text());
            }
            //checking for winner in a minus diagonal option
            else if ($square.eq(i).text() !== '' &&
                $square.eq(i).text() === $square.eq(i + 19).text() &&
                $square.eq(i + 19).text() === $square.eq(i + 38).text() &&
                $square.eq(i + 38).text() === $square.eq(i + 57).text() &&
                $square.eq(i + 57).text() === $square.eq(i + 76).text() &&
                i%boardSize>3
                ) {
                    $square.eq(i).css("background-color","red");
                    $square.eq(i+19).css("background-color","red");
                    $square.eq(i+38).css("background-color","red");
                    $square.eq(i+57).css("background-color","red");
                    $square.eq(i+76).css("background-color","red");
                winner($square.eq(i).text());
            }
            //checking if board is completely full
            else if (moveCount === 400){
                makeNewBoard();
            }
        }
    }
    
    makeNewBoard();
    addHover();

})