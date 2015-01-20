

var Actor = function(spriter) {
    this.sprite = spriter;
    this.x = 0;
    this.y = 0;
}

Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// Update the Actor's position, required method for game
// Parameter: dt, a time delta between ticks
Actor.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Actor.call(this, 'images/char-horn-girl.png')
    this.y = ((row + 1) * 83) - 20;
    this.x = -101 // the width of the bug sprite, can't use resources.get here, image hasn't been loaded;
    this.speed = speed;

}
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if( this.x < ctx.canvas.width) {
           this.x = this.x + (this.speed * dt);
    }
    else
    {
        allEnemies[allEnemies.indexOf(this)] = EnemyManager.GenerateEnemy();
    }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Actor.call(this, 'images/char-boy.png');
    this.x = 101*2;
    this.y = ((6) * 83) - 10;
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    // If the player is overlapping a bug, reset their position.
    // They lost!
    var enemybug;
    for(enemybug in allEnemies) {
        var currentEnemy = allEnemies[enemybug];
        if(currentEnemy.y + 20 < this.y + 80 && currentEnemy.y + 20 > this.y-15 ) {
            //we're on the same row, check the x;
            if (currentEnemy.x >= (this.x - 65) && currentEnemy.x < (this.x +55) ) {
                this.x = 101*2;
                this.y = ((6) * 83) - 10; 
            }
        }
    }
    if(this.y == -10)
    {
        console.log("why is it -10?")
        var enemyCount;
        for(enemyCount in allEnemies) {
            allEnemies[enemyCount].speed = 0;
        }
    }
}

Player.prototype.handleInput = function(key) {
    //move the player
    switch(key) {
        case 'up':
            this.y = this.y-83;
            break;
        case 'down':
            this.y = this.y+83;
            break;
        case 'left':
            this.x = this.x-101;
            break;
        case 'right':
            this.x = this.x+101;
            break;
        case 'reset':
            allEnemies = [EnemyManager.GenerateEnemy(), EnemyManager.GenerateEnemy(),EnemyManager.GenerateEnemy(),EnemyManager.GenerateEnemy()];
            player = new Player();
        default:
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var EnemyFactory = function() {
    this.enemies = [];
    this.rows = 4
}

EnemyFactory.prototype.GenerateEnemy = function() {
    this.enemies = [];
    var row, bugRow, bugSpeed;   
    bugRow = randomIntFromInterval(0,3);
    bugSpeed = randomIntFromInterval(100, 400);
    return new Enemy(bugRow, bugSpeed);
}

var EnemyManager = new EnemyFactory();
var allEnemies = [EnemyManager.GenerateEnemy(), EnemyManager.GenerateEnemy(), EnemyManager.GenerateEnemy(), EnemyManager.GenerateEnemy()];

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'reset'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
