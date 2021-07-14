# tic-tac-toe-5

in below heroku deployment, you can have two players chatting and playing the game:

## [play game](https://larhs-tic-tac-toe-five.herokuapp.com/)

### Description

An alternative version to classical tic-tac-toe, but giving more options since instead of only 3 in row you need to place 5. It is a simple yet enjoyable game I used to enjoy in primary school.

### Technologies

* jQuery<br/> - v 3.2.1
* socket.io - v 2.4.0
* node.js

### Screenshots

![winner pic](https://raw.githubusercontent.com/GrzesiekKozdroj/tic-tac-toe-5/master/Screenshot%20from%202020-03-17%2014-18-54.png)

![game pic](https://raw.githubusercontent.com/GrzesiekKozdroj/tic-tac-toe-5/master/Screenshot%20from%202020-03-17%2014-22-51.png)

### Setup

this game doesn't work in usual game and at the time of making it I was learning concepts of node for first tiem ever. You need to have installed node globally, open terminal in this folder and type in `node -v`. If you do not have one pIease install it.<br/>

Once you have node and npm in the terminal run command `node index` to start the server and go to `http://localhost:3001/` to see the game deployed with node server and socket.io as well as chat options. This game has no lobbies and separate game rooms.
