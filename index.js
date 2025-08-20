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
// BATTLE SYSTEM
// ============================================
function checkBattleZoneCollision() {
    player.moving = false;

    // Check if any movement keys are pressed
    if (!(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed)) {
        return;
    }

    for (let i = 0; i < battleZones.length; i++) {
        const battleZone = battleZones[i];
        
        // Skip if already initiated or no collision
        if (battleZone.initiated || !rectangularCollision({ 
            rectangle1: player, 
            rectangle2: battleZone 
        })) {
            continue;
        }

        // Calculate overlapping area
        const overlappingArea = 
            (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) 
             - Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
             - Math.max(player.position.y, battleZone.position.y));
             
        // Check if player is mostly in battle zone and random chance triggers
        if (overlappingArea > player.width * player.height / 2 && Math.random() < 0.01) {
            initiateBattle(battleZone);
            break;
        }
    }
}

function initiateBattle(battleZone) {
    window.cancelAnimationFrame(animationId);
    battleZone.initiated = true;

    gsap.to('#overlappingDiv', {
        opacity: 1,
        repeat: 3,
        yoyo: true,
        duration: 0.4,
        onComplete() {
            gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 0.4,
                onComplete: () => {
                    animateBattle();
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration: 0.4
                    });
                }
            });
        }
    });
}

// ============================================
// ATTACK SYSTEM
// ============================================
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        emby.attack({
            attack: selectedAttack,
            recipient: mushy
        });
    });
});

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

// ============================================
// GAME LOOPS
// ============================================
function animate() {
    animationId = window.requestAnimationFrame(animate);
    render();
    checkBattleZoneCollision();
    handlePlayerMovement();
}

function animateBattle() {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    mushy.draw();
    emby.draw();
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