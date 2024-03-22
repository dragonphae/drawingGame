//server code

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

    socket.on('mouse', mouseMsg);

    function mouseMsg(data) {
        socket.broadcast.emit('mouse',data);
        //io.sockets.emit('mouse', data); (also includes client who sent the message; ALL)
        console.log(data);
    }

}