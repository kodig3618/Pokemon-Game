const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/Town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
    constructor({ position, velocity, image }) {
        this.position = position
        this.image = image
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({position: {
    x: -200,
    y: -50,
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

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    ctx.drawImage(
        playerImage, 
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 4) / 2,
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height
    )

    const lastKey = keyPressOrder[keyPressOrder.length - 1];

    if (keys.w.pressed && lastKey === 'w') background.position.y += 3;
    if (keys.a.pressed && lastKey === 'a') background.position.x += 3;
    if (keys.s.pressed && lastKey === 's') background.position.y -= 3;
    if (keys.d.pressed && lastKey === 'd') background.position.x -= 3;
    
}
animate();

window.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            if (!keys[key].pressed) {  // Only add if not already pressed
                keys[key].pressed = true;
                // Remove key if it exists, then add to end
                keyPressOrder = keyPressOrder.filter(k => k !== key);
                keyPressOrder.push(key);
            }
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase) {
        case 'w':
        case 'a':
        case 's':        
        case 'd':
            keys[key].pressed = false;
            // Remove the key from the press order
            keyPressOrder = keyPressOrder.filter(k => k !== key);
            break;
    }
})
