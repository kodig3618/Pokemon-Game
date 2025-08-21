// ============================================
// GAME INITIALIZATION
// ============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// ============================================
// MAP DATA PROCESSING
// ============================================
// Convert 1D collision array to 2D map
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += MAP_COLS) {
    collisionsMap.push(collisions.slice(i, i + MAP_COLS));
}

// Convert 1D battle zones array to 2D map
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += MAP_COLS) {
    battleZonesMap.push(battleZonesData.slice(i, i + MAP_COLS));
}

// ============================================
// GAME OBJECTS SETUP
// ============================================
const offset = {
    x: -305,
    y: -130
};

// Create collision boundaries from collision map
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

// Create battle zones from battle zones map
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

// ============================================
// IMAGE LOADING
// ============================================
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

const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';

const mushroomImage = new Image();
mushroomImage.src = './img/mushroomSprite.png';

const flameImage = new Image();
flameImage.src = './img/flameSprite.png';

// ============================================
// SPRITE CREATION
// ============================================
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
    image: foregroundImage
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

const battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage
});

const mushy = new Sprite({
    name: 'Mushy',
    position: {
        x: 770,
        y: 40
    },
    image: mushroomImage,
    frames: {
        max: 4
    },
    animate: true,
    animationSpeed: 25,
    isEmemy: true
});

const emby = new Sprite({
    name: 'Emby',
    position: {
        x: 255,
        y: 270
    },
    image: flameImage,
    frames: {
        max: 4
    },
    animate: true,
    animationSpeed: 25
});

// ============================================
// INPUT HANDLING
// ============================================
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};

let keyPressOrder = [];
const moveables = [background, ...boundaries, foreground, ...battleZones];
let animationId = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

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

function moveObjects(dx, dy) {
    moveables.forEach(moveable => {
        moveable.position.x += dx;
        moveable.position.y += dy;
    });
}

// ============================================
// PLAYER MOVEMENT HANDLING
// ============================================
function handlePlayerMovement() {
    const lastKey = keyPressOrder[keyPressOrder.length - 1];
    player.animate = false;

    switch (lastKey) {
        case 'w':
            if (keys.w.pressed) {
                movePlayer('up', player.sprites.up, 0, PLAYER_SPEED);
            }
            break;
        case 'a':
            if (keys.a.pressed) {
                movePlayer('left', player.sprites.left, PLAYER_SPEED, 0);
            }
            break;
        case 's':
            if (keys.s.pressed) {
                movePlayer('down', player.sprites.down, 0, -PLAYER_SPEED);
            }
            break;
        case 'd':
            if (keys.d.pressed) {
                movePlayer('right', player.sprites.right, -PLAYER_SPEED, 0);
            }
            break;
    }
}

function movePlayer(direction, sprite, dx, dy) {
    player.animate = true;

    // Change sprite if needed
    if (player.image !== sprite) {
        player.image = sprite;
        player.frames.val = 0; // Reset animation frame
    }

    // Move if no collision
    if (!wouldCollide(dx, dy)) {
        moveObjects(dx, dy);
    }
}

// ============================================
// GAME RENDERING
// ============================================
function render() {
    // Draw in correct layer order
    background.draw();
    boundaries.forEach(boundary => boundary.draw());
    battleZones.forEach(battleZone => battleZone.draw());
    player.draw();
    foreground.draw();
}

const renderedSprites = [mushy, emby];
const button = document.querySelector('button');
button.innerHTML = 'Fireball';
document.querySelector('#attackButtons').append(button);
function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    // Draw all dynamic sprites (like fireballs)
    renderedSprites.forEach(sprite => sprite.draw());
}

// ============================================
// GAME LOOPS
// ============================================
function animate() {
    animationId = window.requestAnimationFrame(animate);
    render();
    checkBattleZoneCollision();
    handlePlayerMovement();
}

// ============================================
// EVENT LISTENERS
// ============================================
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

// ============================================
// GAME START
// ============================================
animateBattle();