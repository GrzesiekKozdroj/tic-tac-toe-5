'use strict';
const express = require('express');
const app = express();
const controller = require('./js/controller');
const serv = require('http').Server(app);
let SOCKET_LIST = {};
let PLAYER_LIST = {};

const io = require('socket.io')(serv, {});

class Player {
    constructor(id) {
        this.id = id;
        this.turn = true;
        this.board_update = '';
        this.hover_in = '';
        this.hover_out = '';
        this.origin_id = id;
    }
}
let serverMSG = (message, origin_id) => {
    let pack = [];
    for (let a in PLAYER_LIST) {
        let player = PLAYER_LIST[a];
        player.turn = player.turn && message === 'server update' ? false : true;
        pack.push({
             board_update: player.board_update,
             hover_in: player.hover_in, 
             hover_out: player.hover_out, 
             turn: player.turn, 
             id: player.id, 
             origin_id: origin_id,
            });
    }
    for (let b in SOCKET_LIST) {
        let socket = SOCKET_LIST[b];
        socket.emit(message, pack);
    }
}

let turn = 1;
io.sockets.on('connection', (socket) => {
    //unique id for each player in here
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    let player = new Player(socket.id);
    PLAYER_LIST[socket.id] = player;
    turn++;
    PLAYER_LIST[socket.id].turn = turn % 2 === 0 ? false : true;
    socket.emit('id', { id: socket.id, turn: PLAYER_LIST[socket.id].turn })
    socket.on('board update', (data) => {
        for (let player in PLAYER_LIST) {
            PLAYER_LIST[player].board_update = '';
        }
        PLAYER_LIST[socket.id].board_update = data.coords;
        serverMSG('server update', data.id);
    });
    const info = 'make sure you have oponent to play on: <a class="msgLink" target="_blank" href="https://larhs-tic-tac-toe-five.herokuapp.com/">https://larhs-tic-tac-toe-five.herokuapp.com/</a>'
    socket.emit('chat msg', {
        playerName:'server', 
        messageVal: PLAYER_LIST[socket.id].turn ? 
            `Its your turn, ${info}`:
            `Its, your opponent turn, ${info}`
    })
    socket.on('make new board', ()=>{
        for (let b in SOCKET_LIST) {
            let socket = SOCKET_LIST[b];
            socket.emit('make new board');
        }        
    })
    socket.on('hoverin', (data) => {
        for (let player in PLAYER_LIST) {
            PLAYER_LIST[player].hover_in = '';
        }
        PLAYER_LIST[socket.id].hover_in = data.coords;
        serverMSG('server hoverin', data.id);
    });
    socket.on('hoverout', (data) => {
        for (let player in PLAYER_LIST) {
            PLAYER_LIST[player].hover_out = '';
        }
        PLAYER_LIST[socket.id].hover_out = data.coords;
        serverMSG('server hoverout', data.id);
    });
    socket.on('msg recieved',(message)=>{
        let playerName = (""+socket.id).slice(2,7);
        for(let i in SOCKET_LIST){
            SOCKET_LIST[i].emit('chat msg', {playerName:playerName, messageVal:message})
        }
    })
    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
})

//set up a template engine
app.set('view engine', 'ejs');

//static assets
app.use(express.static(__dirname + '/'));

//fire controllers
controller(app);

//listen to port
const PORT = process.env.PORT || 3001
serv.listen(PORT);
console.log(`http://localhost:${PORT}/`)

