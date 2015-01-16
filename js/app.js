var count = 0;
var Actor = function(spriter) {
    this.sprite = spriter;
    this.x = count;
    this.y = count;
    count = count + 80;
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
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Actor.call(this, 'images/enemy-bug.png')
}
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if( this.x > ctx.canvas.width - Resources.get(this.sprite).width) {
        this.x = 0;
    }
    else {
        console.log( ctx.canvas.width + " and sprite = " + Resources.get(this.sprite).width)
        this.x = this.x + (40 *dt);
    }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Actor.call(this, 'images/char-boy.png');
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Enemy;

Player.prototype.handleInput = function(key) {

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()]
var player = new Player();
var actor = new Actor('images/char-horn-girl.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
