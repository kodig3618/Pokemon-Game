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
    constructor({ position, image, frames = { max: 1 }, sprites, animate = false, animationSpeed = 10, isEmemy}) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.moving = false;
        this.animate = animate; // Add animate property
        this.animationSpeed = animationSpeed; // Add customizable animation speed
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100, // Default health
        this.isEmemy = isEmemy;

        // Calculate sprite dimensions once image loads
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
    }

    draw() {
        if (!this.image.complete) return;

        // Draw the current frame of the sprite
        ctx.save();
        ctx.globalAlpha = this.opacity; // Apply opacity

        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        );

        ctx.restore();

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

    attack({attack, recipient}) {
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEmemy) movementDistance = -20;

        let healthBar = recipient.isEmemy ? '#enemyHealthGreen' : '#healthGreen';

        // Reduce the recipient's health
        recipient.health -= attack.damage;
        // Make sure health doesn't go below 0
        if (recipient.health < 0) recipient.health = 0;

        tl.to(this.position, {
            x: this.position.x - movementDistance,
            duration: 0.1
        }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
                gsap.to(healthBar, {
                    width: recipient.health + '%', 
                    duration: 0.2
                })

                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08,
                })

                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.08,
                })
            }
        }).to(this.position, {
            x: this.position.x,
            duration: 0.1
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