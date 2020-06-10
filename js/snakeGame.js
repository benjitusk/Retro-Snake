let scl = 30;
let food;
let power;
let start;
let snake;
let debug = false;
let paused = false;
let powerOn = false;
let gameStart = now();

class Snake {
  constructor() {
    this.pos = createVector(floor(floor(width / scl) / 2), floor(floor(height / scl) / 2));
    this.pos.mult(scl);
    this.velocity = createVector(0, 0);
    this.tail = [this.pos];
    this.bonusPoint = false;
  }

  show() {
    powerOn ? fill(212, 175, 55) : fill(255);
    for (let i = 0; i < this.tail.length; i++) {
      push();
      textAlign(CENTER, CENTER);
      translate(this.tail[i].x, this.tail[i].y);
      noStroke();
      rect(0, 0, scl, scl);
      stroke(0);
      fill(0);
      textSize(scl);
      if (debug) text(i + 0, scl / 2, scl / 2);
      pop();
    }
  }

  move() {
    this.pos.add(this.velocity);
    this.tail.unshift(createVector(this.pos.x, this.pos.y));
    if (!(this.hasEatenFood() || this.hasEatenPower() || (mouseIsPressed && debug) || this.bonusPoint)) this.tail.pop();
    this.bonusPoint = false;
  }

  walls() {
    return (this.pos.x > width - scl || this.pos.x < 0 || this.pos.y > height - scl || this.pos.y < 0);
  }

  body() {
    for (let i = 1; i < this.tail.length; i++) {
      if (this.tail[i].equals(this.pos)) {
        return true;
      }
    }
    return false;
  }

  update() {
    if (powerOn) {
      if (this.walls()) {
        if (this.pos.x > width - scl) this.pos.x = -scl;

        if (this.pos.x < -scl) this.pos.x = floor(width / scl) * scl;

        if (this.pos.y > height - scl) this.pos.y = -scl;

        if (this.pos.y < -scl) this.pos.y = floor(height / scl) * scl;
      }

      if (now() >= start + 5) {
        powerOn = false;
      }

    } else if (this.walls() || this.body()) { // GAME OVER
      this.pos = createVector(floor(floor(width / scl) / 2), floor(floor(height / scl) / 2));
      this.pos.mult(scl);
      this.tail = [this.pos];
      frameRate(7);
      this.velocity = createVector(0, 0);
    }

    if (this.tail.length % 5 === 0) {
      this.bonusPoint = true;
      if (frameRate() < 70) frameRate(frameRate() + 5);
    }

  }

  hasEatenFood() {
    if (this.pos.equals(food.pos)) {
      food = new Food();
      return true;
    } else {
      return false;
    }
  }

  hasEatenPower() {
    if (this.pos.equals(power.pos)) {
      power = new Power();
      start = now();
      powerOn = true;
      return true;
    } else {
      return false;
    }
  }

}
class Food {
  constructor() {
    this.cols = floor(width / scl);
    this.rows = floor(height / scl);
    this.pos;
    do {
      this.pos = createVector(floor(random(this.cols)), floor(random(this.rows)));
      this.pos.mult(scl);
    } while (this.pos.equals(snake.pos));

  }

  show() {
    fill('red');
    noStroke();
    rect(this.pos.x, this.pos.y, scl, scl);
  }
}

class Power {
  constructor() {
    this.cols = floor(width / scl);
    this.rows = floor(height / scl);
    this.pos;
    do {
      this.pos = createVector(floor(random(this.cols)), floor(random(this.rows)));
      this.pos.mult(scl);
    } while (this.pos.equals(snake.pos));

  }

  show() {
    fill('green');
    noStroke();
    rect(this.pos.x, this.pos.y, scl, scl);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  snake = new Snake();
  food = new Food();
  power = new Power();
  if (!debug) noStroke();
  frameRate(7);
}

function draw() {
  if (!paused) {
    background(51);
    snake.move();
    snake.show();
    snake.update();
    food.show();
    power.show();

    if (debug) grid();

  }

}

function keyPressed() {
  if (keyIsPressed) {
    switch (keyCode) {
      case LEFT_ARROW:
      case 65:
        if (!snake.velocity.equals(createVector(scl, 0))) {
          snake.velocity.x = -scl;
          snake.velocity.y = 0;
        }
        break;
      case RIGHT_ARROW:
      case 68:
        if (!snake.velocity.equals(createVector(-scl, 0))) {
          snake.velocity.x = scl;
          snake.velocity.y = 0;
        }
        break;
      case UP_ARROW:
      case 87:
        if (!snake.velocity.equals(createVector(0, scl))) {
          snake.velocity.x = 0;
          snake.velocity.y = -scl;
        }
        break;
      case DOWN_ARROW:
      case 83:
        if (!snake.velocity.equals(createVector(0, -scl))) {
          snake.velocity.x = 0;
          snake.velocity.y = scl;
        }
        break;
      case 69:
        paused = !paused;
    }
  }
}

function grid() {
  stroke(0);
  let cols = floor(width / scl);
  let rows = floor(height / scl);
  for (let i = 0; i <= cols; i++) {
    line(i * scl, 0, i * scl, height);
  }
  for (let i = 0; i <= rows; i++) {
    line(0, i * scl, width, i * scl);
  }
}

function now() {
  return Math.floor(new Date().getTime() / 1000);
}