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
        $('#board').off();
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
                    symbol = gamer === true ? 'X' : "O";
                }
                $(this).text(symbol);
                let color = symbol==='X'?'green':'yellow';
                $(this).css('background',color);
                moveCount++;
                let coords = $(this).data("xy");
                socket.emit('board update',{coords:coords,id:ajdee});
                checkForWinner();
            }
        });
    }
    function addHover(){
        $('.square').mouseenter(function(){
            if($(this).text()===''){ 
                if(!gamer && offline)       $(this).css('background-color','green'); 
                else if(gamer && offline) $(this).css('background-color','yellow');
                else if(!offline)          $(this).css('background-color','green');}
            let coords = $(this).data("xy");
            socket.emit('hoverin',{coords:coords,id:ajdee})   
        })
        $('.square').mouseleave(function(){
            if($(this).text()===''){  $(this).css('background-color','rgb(235, 235, 207)');}
            let coords = $(this).data("xy");
            socket.emit('hoverout',{coords:coords,id:ajdee})  
        })
    }

    socket.on('server update',(data)=>{
                moveCount++;
                checkForWinner();
        data.forEach(player=>{
            if(ajdee!==player.origin_id){
                $(`div[data-xy = "${ player.board_update }"]`).text("O").css('background','yellow').addClass('incomin');
                gamer = true;
            }
        })
    });
    socket.on('make new board', ()=>{makeNewBoard()})

    socket.on('server hoverin',(data)=>{
        data.forEach(player=>{
            if(ajdee!==player.origin_id && player.hover_in!==''){
                if($(`div[data-xy = "${player.hover_in}"]`).text()=='X'){
                    $(`div[data-xy = "${player.hover_in}"]`).css('transform','scale(.9)');
                }else if($(`div[data-xy = "${player.hover_in}"]`).text()==="O"){
                    $(`div[data-xy = "${player.hover_in}"]`).removeClass('incomin').css('transform','scale(.9)');
                }else{
                    $(`div[data-xy = "${player.hover_in}"]`).css('background','yellow').css('transform','scale(.9)');
                }
            }
        })
    });

    socket.on('server hoverout', (data)=>{
        data.forEach(player=>{
            if(ajdee!==player.origin_id && player.hover_out!==''){
                if($(`div[data-xy = "${player.hover_out}"]`).text()==='X'){
                    $(`div[data-xy = "${player.hover_out}"]`).css('transform','scale(1)');
                }else if($(`div[data-xy = "${player.hover_out}"]`).text()==="O"){
                    $(`div[data-xy = "${player.hover_out}"]`).css('transform','scale(1)');
                }else{
                    $(`div[data-xy = "${player.hover_out}"]`).css('background','rgb(235, 235, 207)').css('transform','scale(1)');
                }
            }
        })
    })
    

    $('.winner__alert').on('click',()=>{
        if(!offline){ socket.emit( 'make new board')  } else { makeNewBoard() };
        $('.winner__alert').toggleClass('winner').text('');
    })

    function winner(score){
        let c
        if(score==='X'){xScore++;$('.xScore').text(xScore); c = 'X'}else{oScore++;$('.oScore').text(oScore);c='O'};
        $('.winner__alert').toggleClass('winner').html(`<p>the winner is </p><spam>${c}</spam><p> click here to play again</p>`);
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

})