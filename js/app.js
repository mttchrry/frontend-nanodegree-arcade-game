// Game win state
var winState = false,
    CELL_WIDTH = 101,
    CELL_HEIGHT = 83,
    enemyCount = 4,
    maxSpeed = 100,
    numRows = 7,
    numCols = 5;
    numLosses = 0;
//  Base class for moving objects
var Actor = function(spriter) {
    this.sprite = spriter;
    this.x = 0;
    this.y = 0;
};
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//
// Enemies our player must avoid
//
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Actor.call(this, 'images/muscle_car.png')
    this.y = ((row + 1) * CELL_HEIGHT) - 20;
    this.x = -CELL_WIDTH // the width of the bug sprite, can't use resources.get here, image hasn't been loaded;
    this.speed = speed;
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if( this.x < ctx.canvas.width) {
        this.x = this.x + (this.speed * dt);
    } else {
        allEnemies[allEnemies.indexOf(this)] = EnemyManager.generateEnemy();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Actor.call(this, 'images/char-boy.png');
    this.x = CELL_WIDTH*2;
    this.y = ((numRows-1) * CELL_HEIGHT) - 10;
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {
    // If the player is overlapping any enemy, reset their position.
    // They lost!
    var checkEnemy;
    for(checkEnemy in allEnemies) {
        var currentEnemy = allEnemies[checkEnemy];
        // check if the current enemy is on the players row
        if(currentEnemy.y + 20 < this.y + 80 && currentEnemy.y + 20 > this.y-15 ) {
            // we're on the same row, check the x;
            if (currentEnemy.x >= (this.x - 65) && currentEnemy.x < (this.x +55) ) {
                // they hit an enemy, restart the player
                this.x = CELL_WIDTH*2;
                this.y = ((numRows-1) * CELL_HEIGHT) - 10;
                numLosses = numLosses+1;
            }
        }
    }
    // if the player is at the top, they won
    if(this.y <= 0) {
        var enemyCount;
        for(enemyCount in allEnemies) {
            allEnemies[enemyCount].speed = 0;
        }
        winState = true;
    }
};
Player.prototype.handleInput = function(key) {
    //move the player as long as they haven't won and aren't going offscreen
    switch(key) {
        case 'up':
            if (!winState && this.y > 0) {
                this.y = this.y-CELL_HEIGHT;
            }
            break;
        case 'down':
            if (!winState && this.y < (numRows-1)*CELL_HEIGHT-10) {
               this.y = this.y+CELL_HEIGHT;
            }
            break;
        case 'left':
            if (!winState && this.x > 80) {
                this.x = this.x-CELL_WIDTH;
            }
            break;
        case 'right':
            if (!winState && this.x < (numCols-1)*CELL_WIDTH) {
                this.x = this.x+CELL_WIDTH;
            }
            break;
        case 'reset':
            EnemyManager.buildAllEnemies();
            player = new Player();
            winState = false;
            numLosses = 0;
            break;
        default:
    }
};

var allEnemies;
var EnemyFactory = function() {
    this.rows = 4
};
EnemyFactory.prototype.generateEnemy = function() {
    var bugRow, bugSpeed;
    bugRow = randomIntFromInterval(0,3);
    bugSpeed = randomIntFromInterval(maxSpeed, 4*maxSpeed);
    return new Enemy(bugRow, bugSpeed);
};
EnemyFactory.prototype.buildAllEnemies = function() {
    //Replace the entire enemy array and build it from scratch.
    var count = 0;
    allEnemies = [];
    for(count = 0; count < enemyCount; count=count+1)
    {
        var newEnemy = this.generateEnemy();
        // initially randomize the x location of enemies so users don't get a free
        // path at the begining of the game.
        newEnemy.x = randomIntFromInterval(-CELL_WIDTH, CELL_WIDTH*5)
        allEnemies.push(newEnemy);
    }
    //used to show the current count and speed, initially on start up.
    var numEnemies = document.getElementById('enemy_number');
    var speedEnemies = document.getElementById('enemy_speed');
    numEnemies.value= enemyCount;
    speedEnemies.value = Math.floor(maxSpeed);
}

// Now instantiate your objects.
// Create and Enemy Factory to build random row/speed enemies
var EnemyManager = new EnemyFactory();

// Place all enemy objects in an array called allEnemies
EnemyManager.buildAllEnemies();

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'reset'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

$('#main').append('<button id="resetEnemies">Reset Game</button>');
$(document).ready(function() {
  $('#resetEnemies').click(function() {
    var numEnemies = document.getElementById('enemy_number');
    var speedEnemies = document.getElementById('enemy_speed');
    if(isNaN(numEnemies.value) || isNaN(speedEnemies.value)) {
        numEnemies.value = 'I need numbers';
        speedEnemies.value = 'I need numbers';
    } else {
        //set the values to user prescribed ones withing a reasonable range
        maxSpeed = Math.floor(speedEnemies.value);
        if(maxSpeed < 50 ) {
            maxSpeed = 50;
        }
        if(maxSpeed > 1500) {
            maxSpeed = 1500;
        }
        enemyCount = Math.floor(numEnemies.value);
        if(enemyCount < 1) {
            enemyCount = 1;
        }
        if(enemyCount > 50) {
            enemyCount = 50;
        }
        // if we are in win state, don't reset all the enemies yet
        if(!winState) {
            EnemyManager.buildAllEnemies();
        }
    }
  });
});

// This generates a random number between min and max to seed the enemies speed and row
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
