'use strict';
const express  = require('express');
const app = express();
const controller = require('./js/controller');
const serv = require('http').Server(app);
let SOCKET_LIST = {};
let PLAYER_LIST ={};
let board_update, hover_in, hover_out;

const io = require('socket.io')(serv,{});

class Player  {
    constructor(id){
        this.id=id;
        this.turn=true;
        this.board_update='';
        this.hover_in='';
        this.hover_out='';
        this.origin_id = id;
    }
}
let serverMSG = (message, origin_id)=>{
    let pack = [];
    for(let a in PLAYER_LIST){
        let player = PLAYER_LIST[a];
        player.turn = player.turn && message === 'board update' ?false:true;
        pack.push({board_update:player.board_update, hover_in:player.hover_in, hover_out:player.hover_out,turn:player.turn,id:player.id, origin_id:origin_id});
    }
    for(let b in SOCKET_LIST){
        let socket = SOCKET_LIST[b];
        socket.emit('server update',pack);
    }
}

    let turn = 1;
io.sockets.on('connection', (socket)=>{
    //unique id for each player in here
    socket.id = Math.random ();
    SOCKET_LIST[socket.id] = socket;
    let player = new Player(socket.id);
    PLAYER_LIST[socket.id] = player;
    turn++;
    PLAYER_LIST[socket.id].turn = turn%2===0?false:true;
    socket.emit('id',{id:socket.id,turn:PLAYER_LIST[socket.id].turn})
    console.log('socket connection');
    socket.on('board update',(data)=>{
        for(let player in PLAYER_LIST){
            PLAYER_LIST[player].board_update = '';
        }
        PLAYER_LIST[socket.id].board_update = data.coords;
        serverMSG('board udate',data.id);
    });
    socket.on('hoverin',(data)=>{
        PLAYER_LIST[socket.id].hover_in = data.coords;
      //  serverMSG('hoverin',data.id);
    });
    socket.on('hoverout',(data)=>{
        PLAYER_LIST[socket.id].hover_out = data.coords;
      //  serverMSG('hoverout',data.id);
    });
    socket.on('disconnect',()=>{
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        console.log("player left");
    });
    console.log(PLAYER_LIST)
})

//set up a template engine
app.set('view engine', 'ejs');

//static assets
app.use(express.static(__dirname+'/'));

//fire controllers
controller(app);

//listen to port
serv.listen(3001);

