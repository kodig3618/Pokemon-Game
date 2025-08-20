// ============================================
// GAME CONSTANTS
// ============================================
const TILE_SIZE = 48;
const PLAYER_SPEED = 4;
const MAP_COLS = 70;

// ============================================
// SPRITE CLASS
// ============================================
class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites, animate = false, animationSpeed = 10 }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.moving = false;
        this.animate = animate; // Add animate property
        this.animationSpeed = animationSpeed; // Add customizable animation speed
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
        // Animate if either moving OR animate is true
        if ((!this.moving && !this.animate) || this.frames.max <= 1) return;

        this.frames.elapsed++;

        // Update frame based on animationSpeed
        if (this.frames.elapsed % this.animationSpeed === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            } else {
                this.frames.val = 0;
            }
        }
    }

    attack({attackType, recipient}) {
        const tl = gsap.timeline();

        tl.to(this.position, {
            x: this.position.x - 20,
        }).to(this.position.x, {
            x: this.position.x + 40,
            duration: 0.1,
            onComplete: () => {
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                })
            }
        }).to(this.position.x, {
            x: this.position.x,
        })
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