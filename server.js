//server code
//variables I want to store later
let connectionIDList = [];
let playerDict = {};
let creatureDict = {};

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
    socket.on('creatureMovement', creatureMsg);
    //send dictionary
    io.sockets.emit('playerMovement', playerDict);
    io.sockets.emit('creatureMovement', creatureDict);
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

    function creatureMsg(data){
        //check if creature needs to be removed
        let keyList = Object.keys(creatureDict);
        if (keyList.includes(data.id)){
            //that means it's getting removed
            let d = data.id;
            delete creatureDict[d];
        }
        else {
             //add creature
             creatureDict[data.id] = {'x': data.x, 'y': data.y, 'emotion': data.emotion,
             'creator': data.creator, 'background': data.background, 'outline': data.outline,
             'strokeList': data.strokeList, 'direction': data.direction, 'speed': data.speed, 'id': data.id};
             console.log(creatureDict);
        }
        
        //send dictionary
        socket.broadcast.emit('creatureMovement', creatureDict);


    }

}