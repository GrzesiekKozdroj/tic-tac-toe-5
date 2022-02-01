'use strict';
const express = require('express');
const app = express();
const controller = require('./js/controller');
const serv = require('http').Server(app);
let SOCKET_LIST = {'1':{}}

const io = require('socket.io')(serv, {});

class Player {
    constructor(id, room, turn) {
        this.id = id;
        this.room = room;
        this.turn = turn;
        this.board_update = '';
        this.hover_in = '';
        this.hover_out = '';
    };
};

const info = 'make sure you have oponent to play on: <a class="msgLink" target="_blank" href="https://larhs-tic-tac-toe-five.herokuapp.com/">https://larhs-tic-tac-toe-five.herokuapp.com/</a>';
let turn = 1;
io.sockets.on('connection', (socket) => {
    const id = Math.random()+'';
    const newRoom = Math.random()+'';
    let oldRoom = false;
    turn++;
    let turner = turn = turn % 2 === 0 ? false : true;
    for(let r in SOCKET_LIST){
        if( Object.keys(SOCKET_LIST[r]).length < 2 ){
            oldRoom = r;
        }
    };
    if( oldRoom ){
        socket.player = new Player(id, oldRoom, turner);
        SOCKET_LIST[oldRoom][id] = socket;
    } else {
        socket.player = new Player(id, newRoom, turner)
        SOCKET_LIST[newRoom] = {};
        SOCKET_LIST[newRoom][id] = socket;
        oldRoom = newRoom;
    };
    socket.emit('id', {id: socket.id, room: oldRoom, turn: socket.player.turn });
    socket.emit('chat msg', {
        playerName:'server', 
        messageVal: socket.player.turn ? 
            `Its your turn, ${info}`:
            `Its, your opponent turn, ${info}`
    });
    socket.on('make new board', ()=>{
            console.log('made new board');
        for (let r in SOCKET_LIST[socket.player.room]) {
            SOCKET_LIST[socket.player.room][r].emit('make new board');
        };
    });
    socket.on('board update', data => serverMSG('server update', data) );
    socket.on('hoverin', data =>  serverMSG('server hoverin', data)  );
    socket.on('hoverout', data => serverMSG('server hoverout', data) );
    socket.on('msg recieved', (data)=>{
        let playerName = (""+socket.player.id).slice(2,7);
        const { message, room } = data
            for(let i in SOCKET_LIST[room]){
                SOCKET_LIST[room][i].emit('chat msg', { playerName, messageVal:message})
            }
    })
    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.player.room][socket.player.id];
    })

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


let serverMSG = (message, data) => {
    const { coords, id, room } = data
    let pack = [];
    for (let a in SOCKET_LIST[room]) {
        let player = SOCKET_LIST[room][a]
        player.turn = player.turn && message === 'server update' ? false : true;
        pack.push({
             board_update: player.board_update,
             hover_in: player.hover_in, 
             hover_out: player.hover_out, 
             turn: player.turn, 
             id: player.id, 
             origin_id: data,
            });
    }
    for (let b in SOCKET_LIST[room]) {
        let socket = SOCKET_LIST[room][b];
        socket.emit(message, pack);
    }
}