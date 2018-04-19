var snake=[];
var fruit=[];
var fruitImage;
var step=10;
var points=0;

var border=15;
var sizeR=10;

var right=true;
var left=false;
var up=false;
var down=false;
var ateFruit=false;

var speed=5;

var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;

var normalPos=0;



function preload(){
    fruitImage = loadImage("/assets/cherry.png");
}

function setup(){
    setupOsc(8338, 3334);
    //create canvas
    createCanvas(500, 500);
    //frameRate(10);
    //speed=windowWidth/500;

    snake=intializeSnake();
    fruit=randomGridXY();
    imageMode(CENTER);
    rectMode(CENTER);
}

function draw(){ 
    if (frameCount<10){
		normalPos=position;
    }
	//control with the video feed
	if (normalPos.x-position.x>40){
		right=true;
		left=false;
		down=false;
		up=false;
	}
	if (position.x-normalPos.x>40){
		right=false;
		left=true;
		down=false;
		up=false;
	}
	if (normalPos.y-position.y>40){
		right=false;
		left=false;
		down=false;
		up=true;
	}
	if (position.y-normalPos.y>40){
		right=false;
		left=false;
		down=true;
		up=false;
	}
	
	//background and maintenance
    background(255);
    push();
    noFill();
    rectMode(CORNER);
    strokeWeight(4);
    stroke(210);
    rect(2,2,width-border+sizeR-2, height-border+sizeR-2);
    pop();

    push();
    textSize(72);
    fill(100);
    text(points, width-100, 100);
    pop();

    
    //draw  fruit
    image(fruitImage, fruit[0], fruit[1], 20, 20);
	fill(0);
	//draw snake and check borders
	drawSnake();
	checkBorders();

    // Update snake
    if (right){
        snake.unshift(createVector(snake[0].x+speed, snake[0].y));
    }
    else if (left){
        snake.unshift(createVector(snake[0].x-speed, snake[0].y));
    }
    else if (up){
        snake.unshift(createVector(snake[0].x, snake[0].y-speed));
    }
    else if (down){
        snake.unshift(createVector(snake[0].x, snake[0].y+speed));
    }

    if (!ateFruit){
        snake.pop();
    }


    //check if fruit is eaten
    if (dist(snake[0].x, snake[0].y, fruit[0], fruit[1])<sizeR*2){
        ateFruit=true;
        fruit=randomGridXY();
        points+=1;
        //append
        if(right){
            snake.push(createVector(snake[snake.length-1].x-sizeR, snake[0].y));
        }
        if(left){
            snake.push(createVector(snake[snake.length-1].x+sizeR, snake[0].y));
        }
        if(up){
            snake.push(createVector(snake[snake.length-1].x, snake[snake.length-1].y-sizeR, ));
        }
        if(down){
            snake.push(createVector(snake[snake.length-1].x, snake[snake.length-1].y+sizeR, ));
        }
    }
    else{
        ateFruit=false; 
    }

}

function drawSnake(){
    
    for (var i=0; i<snake.length; i++){
        rect(snake[i].x, snake[i].y, sizeR, sizeR);
    }
}

function checkBorders(){
    if (snake[0].x<border && left){
        //turn down if in the upper part
        left=false;
        if (snake[0].y<height/2){
            down=true;
        }
        else{
            up=true;
        }

    }
    else if (snake[0].x>width-border-sizeR/2 && right){
        right=false;

        if (snake[0].y<height/2){
            down=true;
        }
        else{
            up=true;
        }
    }
    else if (snake[0].y<border && up){
        //turn right
        up=false;
        if (snake[0].x<width/2){
            right=true;
        }
        else{
            left=true; 
        }
    }
    else if (snake[0].y>(height-border-sizeR/2) && down){
        //turn right if we are in the left corner
        down=false;
        if (snake[0].x<width/2){
            right=true;
        }
        else{
            left=true; 
        }
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
      right=true;
      left=false;
      up=false;
      down=false;
    } else if (keyCode === LEFT_ARROW) {
      left=true;
      right=false;
      up=false;
      down=false;
    }
    if (keyCode === UP_ARROW) {
        right=false;
        left=false;
        up=true;
        down=false;
      } 
    else if (keyCode === DOWN_ARROW) {
        left=false;
        right=false;
        up=false;
        down=true;
    }
}

function intializeSnake(){
    var x=floor(random()*width/10)*10;
    var y=floor(random()*height/10)*10;
    return [createVector(x, y)];
}

function randomGridXY(){
    var x=floor(random(border,(width-border)/10))*10;
    var y=floor(random(border,(height-border)/10))*10;
    return [x,y];
}

//// FACEosc version
function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
