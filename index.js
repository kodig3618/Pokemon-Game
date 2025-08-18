const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


const collisionsMap = [];
for (let i = 0; i < collisions.length; i+= 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
const offset = {
    x: -305,
    y: -130
}

collisionsMap.forEach((row , i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) 
        boundaries.push(new Boundary({position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
        }
        })
    )
    })
})

const image = new Image();
image.src = './img/Town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        }
    }

    draw() { 
        ctx.drawImage(
        this.image, 
        0,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
    )
    }
}

// canvas.width / 2 - (this.image.width / 4) / 2,
// canvas.height / 2 - this.image.height / 2,

const player = new Sprite({
    position: { 
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({position: {
    x: offset.x,
    y: offset.y,
    },
    image: image
})

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false}
}

let keyPressOrder = [];


const moveables = [background, ...boundaries];

function rectangularCollision({rectangle1, rectangle2}) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();

    const lastKey = keyPressOrder[keyPressOrder.length - 1];

    let moving = true;
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 
                }}
        })) {
            moving = false;
            break;
}}
        if (moving) {
        moveables.forEach(moveable => 
            {moveable.position.y += 3;})}}
    if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                }}
        })) {
            moving = false;
            break;
}}
        if (moving) {
        moveables.forEach(moveable => 
            {moveable.position.y += 3;})}        
        moveables.forEach(moveable => 
            {moveable.position.x += 3;})}
    if (keys.s.pressed && lastKey === 's') {
        moveables.forEach(moveable => 
            {moveable.position.y -= 3;})}
    if (keys.d.pressed && lastKey === 'd') {
        moveables.forEach(moveable => 
            {moveable.position.x -= 3;})}
}
animate();

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    switch (key) {
        case 'w':
            if (!keys[key].pressed) {
                keys[key].pressed = true;
                keyPressOrder = keyPressOrder.filter(k => k !== key);
                keyPressOrder.push(key);
            }
            break;
        case 'a':
            if (!keys[key].pressed) {
                keys[key].pressed = true;
                keyPressOrder = keyPressOrder.filter(k => k !== key);
                keyPressOrder.push(key);
            }
            break;
        case 's':
            if (!keys[key].pressed) {
                keys[key].pressed = true;
                keyPressOrder = keyPressOrder.filter(k => k !== key);
                keyPressOrder.push(key);
            }
            break;
        case 'd':
            if (!keys[key].pressed) {
                keys[key].pressed = true;
                keyPressOrder = keyPressOrder.filter(k => k !== key);
                keyPressOrder.push(key);
            }
            break;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    switch (key) {
        case 'w':
            keys[key].pressed = false;
            keyPressOrder = keyPressOrder.filter(k => k !== key);
            break;
        case 'a':
            keys[key].pressed = false;
            keyPressOrder = keyPressOrder.filter(k => k !== key);
            break;
        case 's':
            keys[key].pressed = false;
            keyPressOrder = keyPressOrder.filter(k => k !== key);
            break;
        case 'd':
            keys[key].pressed = false;
            keyPressOrder = keyPressOrder.filter(k => k !== key);
            break;
    }
})
