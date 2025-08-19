// ============================================
// GAME CONSTANTS
// ============================================
const TILE_SIZE = 48;
const PLAYER_SPEED = 3;
const MAP_COLS = 70;

// ============================================
// SPRITE CLASS
// ============================================
class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.moving = false;
        this.sprites = sprites;

        // Calculate sprite dimensions once image loads
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
    }

    draw() {
        if (!this.image.complete) return;

        // Draw the current frame of the sprite
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );

        // Handle animation frames
        this._updateAnimationFrame();
    }

    _updateAnimationFrame() {
        if (!this.moving || this.frames.max <= 1) return;

        this.frames.elapsed++;

        // Update frame every 10 game loops
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            } else {
                this.frames.val = 0;
            }
        }
    }
}

// ============================================
// BOUNDARY CLASS
// ============================================
class Boundary {
    static width = TILE_SIZE;
    static height = TILE_SIZE;

    constructor({ position }) {
        this.position = position;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
    }

    draw() {
        // Draw collision boundary (semi-transparent red)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}