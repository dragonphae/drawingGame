//code for the gameWorld

//client code
var socket;
var firstTime = true;
var playerDict = {};
var creatureDict = {};
var creatureIDList = [];

let randEmotion = "";

let offscreenGraphicsBuffer;
let cnv;

let chara; // Declare object
let myColor; //declare colour object
let numCreaturesMade = 1;

//variables related to drawing
let myBrush; //declare brush object
let strokeList = []; //declare strokeList
let stopDrawing = false;

//declare switch statement for gameState
//options are: "logIn", "playField", "createDrawing", "respondDrawing", "gallery"
let gameState = "logIn";
let tempString = "";

//list of creatures in game
let creatureList = [];
var creatureWidth = 100;
var creatureHeight = 100;

//variable that stores creature collided with
let creatureCollided;

//controls the first attempt at drawing a state
let createDrawingDrawn = false;
let respondDrawingDrawn = false;

//controls the list of gallery drawings
let galleryList = [];
let galleryHeight = 120;
let galleryWidth = 100;

//a list of emotion words to serve as prompts ... update later from some sort of source
let emotionList = ["sadness", "joy", "fear", "anger", "disgust", "surprise", "adoration",
"affection", "alarm", "agitation", "agony", "amazement", "ambivalence", "amusement",
"anguish", "annoyance", "anticipation", "anxiety", "apathy", "apprehension",
"astonishment", "awe", "bafflement", "bewilderment", "bitterness", "bliss",
"boredom", "calm", "cheerfulness", "confidence", "contempt", "contentment", "curiosity",
"cynicism", "dejection", "delight", "depression", "despair", "determination", "disappointment",
"disbelief", "dismay", "dread", "ecstasy", "elation", "embarrassment",
"empathy", "enchantment", "enjoyment", "enlightenment", "enthusiasm", "envy",
"epiphany", "euphoria", "exasperation", "excitement", "fascination", "fondness",
"friendliness", "frustration", "fury", "glee", "glumness", "gratitude", "greed",
"grief", "grouchiness", "grumpiness", "guilt", "happiness", "hatred",
"helplessness", "hope", "homesickness", "hopelessness", "horror", "humiliation",
"humility", "hysteria", "impatience", "indifference", "infatuation", "indignance", "insecurity",
"infuriation", "intrigue", "irritation", "isolation", "jealousy",
"jubilation", "kindness", "laziness", "loneliness", "longing", "love", "misery",
"mortification", "nervousness", "nostalgia", "numb", "outrage", "panic", "overwhelm",
"patience", "passion", "pensiveness", "pessimism", "pity", "pride", "rage", "regret", "relaxation",
"relief", "reluctance", "remorseful", "relaxation", "resentment", "resignation",
"restlessness", "revulsion", "ruthlessness", "shame", "sorrow", "serentity", "spite", "suspicion",
"sympathy", "triumph", "torment", "vulnerable", "worried", "uneasy", "unsettled", "trust"];


//login button
var loginButton = {x:200, y:500, w:200, text: 'Join Game' };

//testing button (useful for future game stuff)
var drawButton = {x:10, y: 10, w: 200, text: 'Draw Button'};
var galleryButton = {x:10, y: 10, w: 200, text: 'Go To Gallery'};

//create drawing buttons
var submitButtonDraw = {x:200, y:40, w: 200, text: 'Submit'};
var backButtonDraw = {x: 10, y: 10, w: 100, text: 'Back'};

//respond drawing buttons
var submitButtonRespond = {x:200, y:40, w: 200, text: 'Submit'};
var backButtonRespond = {x: 10, y: 10, w: 100, text: 'Back'};

//gallery buttons
var backButtonGallery = {x: 10, y: 10, w: 100, text: 'Back'};







// Character class
class Character {
    constructor() {
      this.diameter = 40;
      this.x = random(this.diameter/2, width - this.diameter/2);
      this.prevX = this.x;
      this.y = random(this.diameter/2, height - this.diameter/2);
      this.prevY = this.y;
      
      this.colour = [random(0,255), random(0,255), random(0,255)];
      this.stepSize = 20;
      this.speed = 3;
      this.isLeft = false;
      this.isRight = false;
      this.isUp = false;
      this.isDown = false;
      this.userName = "";
      this.tokens = 3;

    }
  
    display() {
      fill (this.colour[0], this.colour[1], this.colour[2]);
      ellipse(this.x, this.y, this.diameter, this.diameter);
      push();
      fill(0);
      textAlign (CENTER, TOP);
      text(this.userName, this.x, this.y + 25);
      pop();
    }

    move() {
        let tempXPos = this.x + this.speed*(int(this.isRight) - int(this.isLeft));
        let tempYPos = this.y + this.speed*(int(this.isDown) - int(this.isUp));
        
        //x is NOT legit but y is (just change y)
        if ((tempXPos < 0 + this.diameter/2 || tempXPos > width - this.diameter/2) &&
        (tempYPos >= 0 + this.diameter/2 && tempYPos <= height - this.diameter/2)){
          this.prevY = this.y;
          this.y = tempYPos;
          
        }
        //y is NOT legit but x is (just change x)
        else if ((tempXPos >= 0 + this.diameter/2 && tempXPos <= width - this.diameter/2) &&
        (tempYPos < 0 + this.diameter/2 || tempYPos > height - this.diameter/2)){
          this.prevX = this.x;
          this.x = tempXPos;

          
        }
        //both good so update both
        else if (tempXPos >= 0 + this.diameter/2 && tempXPos <= width - this.diameter/2 &&
        tempYPos >= 0 + this.diameter/2 && tempYPos <= height - this.diameter/2){
          this.prevX = this.x;
          this.x = tempXPos;
          this.prevY = this.y;
          this.y = tempYPos;
          
        }
    }
        
       

    setMove(p,k,b){
        if (k == 38 || p == "w"){
            this.isUp = b;
        }
        if (k == 40 || p == "s"){
            this.isDown = b;
        }
        if (k == 37 || p == "a"){
            this.isLeft = b;
        }
        if (k == 39 || p == "d"){
            this.isRight = b;
        }
    }
  }

//make a creature object
class Creature {
  constructor(creatureImage, creatureName) {
    this.drawing = creatureImage;
    this.name = creatureName; 
    this.width = creatureHeight;
    this.height = creatureWidth;
    this.x = random(0, width - this.width);
    this.y = random(0, height - this.height);
    this.speed = random(1, 5);
    this.direction = random(["up", "down", "right", "left"]);
    this.id = "";
    this.emotion = "";
    this.creator = "";
    this.background = [];
    this.outline = [];
    this.strokeList = [];
    
  }

  display(){
    image(this.drawing,this.x,this.y);
    push();
    stroke(this.outline[0], this.outline[1], this.outline[2]);
    noFill();
    strokeWeight(3);
    rect(this.x - 2, this.y - 2, 104, 104);
    pop();
  }

  move(){
    let possiblePositionX = width/50;
    let possiblePositionY = height/50;
    //add random chance of changing direction?
    //add basic avoidance at some point?
    switch (this.direction){
      case "up":
        possiblePositionY = this.y - this.speed;
        possiblePositionX = this.x;
        break;
      case "right":
        possiblePositionX = this.x + this.speed;
        possiblePositionY = this.y;
        break;
      case "left":
        possiblePositionX = this.x - this.speed;
        possiblePositionY = this.y;
        break;
      case "down":
        possiblePositionY = this.y + this.speed;
        possiblePositionX = this.x;
        break;
    }

    if (possiblePositionX > width - this.width || possiblePositionX < 0 ||
       possiblePositionY > height - this.height|| possiblePositionY < 0){
        switch(this.direction){
          case "up":
            this.direction = "down";
            break;
          case "down":
            this.direction = "up";
            break;
          case "right":
            this.direction = "left";
            break;
          case "left":
            this.direction = "right";
            break;
        } 
      } 
      else {
        this.prevX = this.x;
        this.x = possiblePositionX;
        this.prevY = this.y;
        this.y = possiblePositionY;
      }
  }
}

//make a brush object
class Brush {
  constructor(brushType, brushSize, r, g, b) {
    this.brushType = brushType;
    //if circle, is diameter, if rectangle, is width, etc.   
    this.brushSize = brushSize;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  paint(x,y){
    switch(this.brushType){
      case "circle":
        push();
        noStroke();
        fill(this.r,this.g,this.b);
        ellipse(x,y,this.brushSize,this.brushSize);
        pop();
      break;
    }  
  }
}

//make a gallery drawing object
class GalleryDrawing {
  constructor(galleryImage, creator, collaborator, emotion){
    this.drawing = galleryImage;
    this.creator = creator;
    this.collaborator = collaborator;
    this.emotion = emotion;
  }
}


//make a player object


function setup() {
    cnv = createCanvas(600, 600);
    offscreenGraphicsBuffer = createGraphics(600,600);

    //socket network stuff
    socket = io.connect('http://localhost:3000');
    socket.on('playerMovement', updatePlayers);
    socket.on('creatureMovement', updateCreatures);
    
    
    // Create object
    chara = new Character();
    

    //create brush
    myBrush = new Brush("circle", 10, 0, 0, 0);
    //random colour for creature drawing screen
    myColor = [random(0,255),random(0,255),random(0,255)];

    

    //update button position based on size of canvas
    drawButton.x = 10;
    drawButton.y = height - 40;
    galleryButton.x = width - 210;
    galleryButton.y = 10;

    //add draw button function
    drawButton.on_clicked = function(){
      if (chara.tokens > 0){
        myColor = [random(0,255),random(0,255),random(0,255)];
        //get everything ready to start createDrawing;
        
        createDrawingDrawn = false;
        gameState = "createDrawing";
      }
    }

    //add back button function
    backButtonDraw.on_clicked = function(){
      gameState = "playField";
    }
    
    //add back button respond function
    backButtonRespond.on_clicked = function(){
      gameState = "playField";  
    }

    //add submit button function
    submitButtonDraw.on_clicked = function(){
      //later make a formula for a more complicated name for this image
      //save(cnv,'C:/Users/phaed/Desktop/Collaborative_Drawing_Game/drawingGame/DemoNewVersion/images/myCanvas.jpg');
      //draw quick
      stopDrawing = true;
      chara.tokens = chara.tokens - 1;
       
    }

    //other submit button function
    submitButtonRespond.on_clicked = function(){
      //save image
      //draw image quick
      //save
      //update tokens
      chara.tokens = chara.tokens + 1;

      let imgDrawing = get(0, 0, width, height);
      imgDrawing.width = galleryWidth;
      imgDrawing.height = galleryHeight;
      let creatorName = "testName";
      let collaboratorName = "testName";
      let newGalleryDrawing = new GalleryDrawing(imgDrawing,creatorName, collaboratorName, creatureCollided.emotion);
      galleryList.push(newGalleryDrawing);

      

      //get rid of creature from list
      creatureList = removeItemOnce(creatureList, creatureCollided);
      //remove id from creatureIDList
      creatureIDList = removeItemOnce(creatureIDList, creatureCollided.id);

      //workDir
      //do an emit!! make sure that everyone knows she is GONE
      //copy format from other place? from create?
      //x,y,emotion,creator, outline[r,g,b], background[r,g,b],strokes[[x,y]]
      var data = {
        x: creatureCollided.x,
        y: creatureCollided.y,
        emotion: creatureCollided.emotion,
        creator: creatureCollided.creator,
        outline: creatureCollided.outline,
        background: creatureCollided.background,
        strokeList: creatureCollided.strokeList,
        id: creatureCollided.id,
        direction: creatureCollided.direction,
        speed: creatureCollided.speed
        }
      socket.emit('creatureMovement', data);
      

      //set strokeList back to 0;
      strokeList = [];
      
      //back to playField
      gameState = "playField";

    }

    //function for gallery buttons
    galleryButton.on_clicked = function(){
      gameState = "gallery";
    }

    backButtonGallery.on_clicked = function(){
      gameState = "playField";
    }

    //functions for log-in function
    loginButton.on_clicked = function(){
      chara.userName = tempString;
      
      gameState = "playField";
    }
    //update submit button for drawing mode
    submitButtonDraw.y = height - 40;
    //update other submit button for drawing mode
    submitButtonRespond.y = height - 40;
  }

  
  

  function draw() {
    //switch statement is used to determine game's behaviour based on the current play state
    switch (gameState){
      case "logIn":
        background(220);
        push();
        textSize(25);
        textAlign(CENTER);
        text("Emotional Pictionary (Zoo Edition)", width/2, height/2);
        //enter name
        fill(255);
        rectMode(CENTER);
        rect(width/2, height/2 + 65, 200, 30);
        textSize(15);
        fill(0);
        text("Enter a username below:", width/2, height/2 + 35 );
        
        //add text for the name
        textAlign(LEFT, TOP);
        textSize(17);
        text(tempString, width/2 - 95, height/2 + 58);

        pop();

        button(loginButton);

        break;
      case "playField":
        background(220);
        

        
        //creature display & motion
        for (let creature of creatureList){
          creature.display();
          creature.move();
        }

         //character motion
        chara.move();
        chara.display();

        //draw other characters
        for (let p of Object.keys(playerDict)){
          if (p != chara.userName){
          let playerC = playerDict[p]['color'];

          fill (playerC[0], playerC[1], playerC[2]);
          ellipse(playerDict[p]['x'], playerDict[p]['y'], 40, 40);
          push();
          fill(0);
          textAlign (CENTER, TOP);
          text(p, playerDict[p]['x'], playerDict[p]['y'] + 25);
          pop();

          } 
        }

        if (firstTime){
          var data = {
              x: chara.x,
              y: chara.y,
              name: chara.userName,
              color: [chara.colour[0], chara.colour[1], chara.colour[2]]
          }
          socket.emit('playerMovement', data); 

          firstTime = false;

        }
        
        
        //send socket data?
        if ((chara.x != chara.prevX || chara.y != chara.prevY) && !firstTime){
          var data = {
              x: chara.x,
              y: chara.y,
              name: chara.userName,
              color: [chara.colour[0], chara.colour[1], chara.colour[2]]
          }
          socket.emit('playerMovement', data); 
        }

        //send creature data
       
        
 

        //draw buttons
        button(drawButton);
        button(galleryButton);

        //draw tokens
        
        push();
        fill(0);
        textAlign(LEFT, CENTER);
        textSize(18);
        text(chara.userName, 10, 25);
        
        fill (0,255,0);
        triangle(10+20+70, 10, 10+20+70+15, 40, 10+20+70+30, 10);
        fill(0);
        text ("x" + str(chara.tokens), 10+20+70+30+10, 25);
        pop();

        //draw button triangle
        push();
        fill (0,255,0);
        triangle(205-29, height - 36, 205-29+12, height - 14, 205-29+24, height - 36);
        pop();

        break;
      case "createDrawing":
        if (!createDrawingDrawn && !stopDrawing){
          background(myColor[0],myColor[1],myColor[2]);
          push();
          fill(0);
          textSize(20);
          textAlign(CENTER);
          randEmotion = random(emotionList);
          text("Think of a time you felt the emotion: " + randEmotion, width/2, 70);
          text("Now draw a creature that represents that experience", width/2, 90);
          pop();

  
          createDrawingDrawn = true;
        }

        //draw buttons
        if (!stopDrawing){
          button(submitButtonDraw);
          button(backButtonDraw);
        }

        if (stopDrawing){
            push();
        background(myColor[0],myColor[1], myColor[2]);
        for (let s of strokeList){
          fill(0);
          strokeWeight(0);
          ellipse(s[0],s[1],10,10);
        }
        let imgDrawing = get(0, 0, width, height);
        pop();
        imgDrawing.width = creatureWidth;
        imgDrawing.height = creatureHeight;
        let creatureName = "testName";
        let newCreature = new Creature(imgDrawing,creatureName);
        
        newCreature.id = chara.userName + numCreaturesMade;
        numCreaturesMade = numCreaturesMade + 1; 
        newCreature.emotion = randEmotion;
        newCreature.creator = chara.userName;
        newCreature.outline = [chara.colour[0], chara.colour[1], chara.colour[2]];
        newCreature.background = [myColor[0], myColor[1], myColor[2]];
        newCreature.strokeList = strokeList;
        creatureList.push(newCreature);
        creatureIDList.push(newCreature.id);
        
        stopDrawing = false;

        //emit creature update
        
        //x,y,emotion,creator, outline[r,g,b], background[r,g,b],strokes[[x,y]]
        var data = {
          x: newCreature.x,
          y: newCreature.y,
          emotion: newCreature.emotion,
          creator: newCreature.creator,
          outline: newCreature.outline,
          background: newCreature.background,
          strokeList: newCreature.strokeList,
          id: newCreature.id,
          direction: newCreature.direction,
          speed: newCreature.speed
          }
        socket.emit('creatureMovement', data);
        
      //back to playField
        strokeList = [];
        gameState = "playField"; 
        }
        
        break;
      case "respondDrawing":
        if (!respondDrawingDrawn){

          
          background(220);
          image(creatureCollided.drawing, 0, 0);
          push();
          fill(0);
          textSize(20);
          textAlign(CENTER);
          text("Think of a time you felt the emotion: " + creatureCollided.emotion, width/2, 70);
          text("Now make an addition to the drawing that represents that experience", width/2, 90);
          pop();

          
          //draw text


          respondDrawingDrawn = true;
        }

        //draw buttons
        button(submitButtonRespond);
        button(backButtonRespond);

          //draw button triangle
          push();
          fill (0,255,0);
          triangle(width/2 + 100 -29, height - 36, width/2+ 100 -29+12, height - 14, width/2 +100-29+24, height - 36);
          pop();
        
        
        break;

      case "gallery":
        background(200);
        let xPosition = 10;
        let yPosition = 50;
        let numInCurrentRow = 0;
        let mostInRow = 5;
        let textSpace = 20;
        let padding = 10;

        for (let gDrawing of galleryList){  
          image(gDrawing.drawing, xPosition, yPosition);
          push();
          fill(0);
          stroke(0);
          textSize(10);
          
          text ("Emotion: " + gDrawing.emotion, xPosition, yPosition + galleryHeight + 10,)
          text ("Creator: " + gDrawing.creator, xPosition, yPosition + galleryHeight + 20);
          text ("Collaborator: " + gDrawing.collaborator, xPosition, yPosition + galleryHeight + 30);
          
          pop();

          xPosition = xPosition + galleryWidth + padding;
          numInCurrentRow = numInCurrentRow + 1;
          if (numInCurrentRow >= mostInRow){
            yPosition = yPosition + galleryHeight + textSpace + padding;
            xPosition = 0;
            numInCurrentRow = 0;
          }
        }

        button(backButtonGallery);
        
        break;
    }
  }

  function keyPressed() {
    switch(gameState){
      case "logIn":
        if (key == "Backspace"){
          if (tempString.length > 0){
            tempString = tempString.substring(0, tempString.length-1); 
          } 
        }
        else if (key == "Enter") {
          chara.userName = tempString;
          gameState = "playField";
        }
        else if (key == "Shift"){
          "do nothing";
        }
        else{
          tempString = tempString + key;
        }
        break;
      case "playField":
        chara.setMove(key, keyCode, true);
        //check for collision upon ENTER key being pressed
        if (key == "Enter" || keyCode == 13){
          for (let creature of creatureList){
            let collision = collisionCheck(chara, creature);
            if (collision){
              creatureCollided = creature;
              if (creatureCollided.creator != chara.userName){
                respondDrawingDrawn = false;
                creatureCollided.drawing.width = width;
                creatureCollided.drawing.height = height;
                gameState = "respondDrawing";
              }
              break;
            }

          }  
        }
        break;
      case "createDrawing":
        break;
      case "respondDrawing":
        break;
      case "gallery":
        background(200);
        
        break;
    }
  }

  function keyReleased() {
    switch(gameState){
      case "logIn":
        break;
      case "playField":
        chara.setMove(key,keyCode,false);
        break;
      case "createDrawing":
        break;
      case "respondDrawing":
        break;
      case "gallery":
        break;
    }   
  }

  function mouseDragged(){
    switch(gameState){
      case "logIn":
        break;
      case "playField":
        break;
      case "createDrawing":
        myBrush.paint(mouseX, mouseY);
        strokeList.push([mouseX, mouseY]);
        break;
      case "respondDrawing":
        myBrush.paint(mouseX, mouseY);
        strokeList.push([mouseX, mouseY]);
        break;
      case "gallery":
        break;
    }
  }

  //other functions
  function collisionCheck(player, creature){
    //remember: image x & y are coordinates of top left corner
    //player x & y are coordinates of center of circle
    //if player inside creature return true
    if (player.x + player.diameter/2 <= creature.x + creature.width &&
     player.x - player.diameter/2 >= creature.x &&
     player.y + player.diameter/2 <= creature.y + creature.width &&
     player.y - player.diameter/2 >= creature.y){
      return true;
    }
    //else return false
    else {
      return false;
    }
  }

  function removeItemOnce(arr, value){
    var index = arr.indexOf(value);
    if (index > -1){
      arr.splice(index,1);
    }
    return arr;
  }

  function updatePlayers(data){
    playerDict = data;
  }

  function updateCreatures(data){
    //curWork
    creatureDict = data;
    console.log (creatureDict);
    //later update creature list as well
    //by making new creature and adding it?
    //will ultimately need to check for inclusion
    //make new creature if needed + update existing creatures
    //curWork
    let dataEmptyCheck = Object.keys(data);
    if (dataEmptyCheck.length > 0){
      
      for (let k of dataEmptyCheck){
        //check if already in list
        if (creatureIDList.includes(k)){
          //update 
          
          
        }
       
        else{
          //add new creature
          let item = data[k];
          let b = item.background;
          offscreenGraphicsBuffer.background(b[0], b[1], b[2]);
          //now strokes
          for (let s of item['strokeList']){
            offscreenGraphicsBuffer.fill(0);
            offscreenGraphicsBuffer.strokeWeight(0);
            offscreenGraphicsBuffer.ellipse(s[0],s[1],10,10);
          }
          //get new image
          let newCImage = createImage(offscreenGraphicsBuffer.width, offscreenGraphicsBuffer.height);
          newCImage.copy(offscreenGraphicsBuffer, 0,0, offscreenGraphicsBuffer.width, offscreenGraphicsBuffer.height, 0, 0, offscreenGraphicsBuffer.width, offscreenGraphicsBuffer.height);
          newCImage.width = creatureWidth;
          newCImage.height = creatureHeight;
          let newC = new Creature(newCImage, "name");
          newC.x = item['x'];
          newC.y = item['y'];
          newC.emotion = item['emotion'];
          newC.creator = item['creator'];
          newC.background = item['creator'];
          newC.outline = item['outline'];
          newC.strokeList = item['strokeList'];
          newC.id = item['id'];
          newC.direction = item['direction'];
          newC.speed = item['speed'];
          creatureList.push(newC);
          console.log(creatureIDList);
          creatureIDList.push(newC.id);
          console.log("added new creature");
          console.log(creatureList);
        }
      }
      //check keys in id list to see if it has one dict NO LONGER HAS and remove
      
    }

    //check keys in id list to see if it has one dict NO LONGER HAS and remove
    for (let i of creatureIDList){
      if (!dataEmptyCheck.includes(i)){
        let count = 0;
        for (cr of creatureList){
          if (cr.id == i){
            break;
          }
          count = count + 1;
        }
        //remove from creatures
        
        if (creatureList.length > 0){
          creatureList.splice(count,1);
        }  
        
        //remove from id list
        let count2 = 0;
        for (cid of creatureIDList){
          if (cid == i){
            break;
          }
          count2 = count2 + 1;

          
        }
        if (creatureIDList > 0){
          creatureIDList.splice(count2,1);
        }



        
  


       
      }
    }
    
  }

  // function positionUpdate(pX, pY, pName){
  //   console.log('Sending: ' + pX + ', ' + pY+ ', ' + pName);
  //       var data = {
  //           x: pX,
  //           y: pY,
  //           name: pName
  //       }
  //       socket.emit('playerMovement', data);
  // }