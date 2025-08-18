// Constants
const TILE_SIZE = 48;
const PLAYER_SPEED = 3;
const MAP_COLS = 70;

// Sprite class for rendering images
class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.moving = false;
        this.sprites = sprites;
    }

    draw() { 
        if (this.image.complete) {
            ctx.drawImage(
                this.image, 
                this.frames.val * this.width , 
                0,
                this.image.width / this.frames.max,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max,
                this.image.height
            );
            
            if (!this.moving) return;

            if (this.frames.max > 1) {
                this.frames.elapsed++;
            }

            if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0;
            }
        }
    }
}

// Boundary class for collision detection
class Boundary {
    static width = TILE_SIZE;
    static height = TILE_SIZE;
            
    constructor({ position }) {
        this.position = position;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}