//server code
//variables I want to store later
let connectionIDList = [];
let playerDict = {};

//import module
var express = require ('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');




//give it server as an argument
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);
    connectionIDList.push(socket.id);

    socket.on('playerMovement', moveMsg);
    //send dictionary
    io.sockets.emit('playerMovement', playerDict);
    //socket.on('mouse', mouseMsg);

    //function mouseMsg(data) {
        //socket.broadcast.emit('mouse',data);
        //io.sockets.emit('mouse', data); (also includes client who sent the message; ALL)
        //console.log(data);
    //}

    function moveMsg(data){
        //add new player

        playerDict[data.name] = {'x':data.x, 'y': data.y, 'color': data.color};

        //send dictionary
        socket.broadcast.emit('playerMovement', playerDict);
    }

}