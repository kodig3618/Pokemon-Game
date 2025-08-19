// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


// Convert collision array to 2D map
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += MAP_COLS) {
    collisionsMap.push(collisions.slice(i, i + MAP_COLS));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += MAP_COLS) {
    battleZonesMap.push(battleZonesData.slice(i, i + MAP_COLS));
}

// Game objects
const offset = {
    x: -305,
    y: -130
};

// Create boundaries from collision map
const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
});

const battleZones = [];

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
});

// Load images
const mapImage = new Image();
mapImage.src = './img/Town.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

// Create sprites
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: mapImage
});

const foreground = new Sprite({
    position: { 
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage,
});

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,  
        right: playerRightImage,
        down: playerDownImage,
        left: playerLeftImage
    }
});

// Input handling
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};

let keyPressOrder = [];
const moveables = [background, ...boundaries, foreground, ...battleZones];

// Collision detection function
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

// Check if movement would cause collision
function wouldCollide(dx, dy) {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x + dx,
                    y: boundary.position.y + dy
                }
            }
        })) {
            return true;
        }
    }
    return false;
}

// Move all moveable objects
function moveObjects(dx, dy) {
    moveables.forEach(moveable => {
        moveable.position.x += dx;
        moveable.position.y += dy;
    });
}

// Main game loop
function animate() {
    window.requestAnimationFrame(animate);

// Clear and draw
background.draw();
boundaries.forEach(boundary => boundary.draw());
battleZones.forEach(battleZones => battleZones.draw());
player.draw();
foreground.draw();

if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
        const battleZone = battleZones[i];
        const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) 
        - Math.max(player.position.x, battleZone.position.x))
        * (Math.min(player.position.y +player.height, battleZone.position.y + battleZone.height)
        - Math.max(player.position.y, battleZone.position.y));
             
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            }) &&
            overlappingArea > player.width * player.height / 2
            && Math.random() < .01 // 1% chance to trigger battle
        ){
            console.log('Battle Zone Entered');
            break;
}}
}

// Handle movement
const lastKey = keyPressOrder[keyPressOrder.length - 1];

player.moving = false;
if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.image = player.sprites.up;
    if (player.image !== player.sprites.up) {
        player.image = player.sprites.up;
        player.frames.val = 0;
    }
    if (!wouldCollide(0, PLAYER_SPEED)) {
        moveObjects(0, PLAYER_SPEED);
    }
} else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true;
    player.image = player.sprites.left;
    if (player.image !== player.sprites.left) {
        player.image = player.sprites.left;
        player.frames.val = 0; 
    }
    if (!wouldCollide(PLAYER_SPEED, 0)) {
        moveObjects(PLAYER_SPEED, 0);
    }
} else if (keys.s.pressed && lastKey === 's') {
    player.moving = true;
    player.image = player.sprites.down;
    if (player.image !== player.sprites.down) {
        player.image = player.sprites.down;
        player.frames.val = 0; // Reset animation frame
    }
    if (!wouldCollide(0, -PLAYER_SPEED)) {
        moveObjects(0, -PLAYER_SPEED);
    }
} else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true;
    player.image = player.sprites.right;
    if (player.image !== player.sprites.right) {
        player.image = player.sprites.right;
        player.frames.val = 0; // Reset animation frame
    }
    if (!wouldCollide(-PLAYER_SPEED, 0)) {
        moveObjects(-PLAYER_SPEED, 0);
    }
}
}

// Event listeners
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (keys[key] && !keys[key].pressed) {
        keys[key].pressed = true;
        keyPressOrder = keyPressOrder.filter(k => k !== key);
        keyPressOrder.push(key);
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();

    if (keys[key]) {
        keys[key].pressed = false;
        keyPressOrder = keyPressOrder.filter(k => k !== key);
    }
});

// Start the game
animate();