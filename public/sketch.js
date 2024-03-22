//client code
var socket;

function setup() {
    createCanvas(700,400);
    background(0,150,75);

    socket = io.connect('http://localhost:3000');
    socket.on('mouse', newDrawing);
}

function newDrawing(data) {
    noStroke();
    fill(0);
    ellipse(data.x, data.y, 20, 20);
}

function mouseDragged() {
    console.log('Sending: ' + mouseX + ',' + mouseY);
    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);

    var data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit ('mouse', data);


    return false;
}

function draw() {
}