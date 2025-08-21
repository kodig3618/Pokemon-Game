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
    constructor({ 
        position, 
        image, 
        frames = { max: 1 }, 
        sprites, 
        animate = false, 
        animationSpeed = 10, 
        isEmemy = false 
    }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.moving = false;
        this.animate = animate;
        this.animationSpeed = animationSpeed;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100;
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
        ctx.globalAlpha = this.opacity;

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

    // ============================================
    // ATTACK SYSTEM
    // ============================================
    attack({ attack, recipient, renderedSprites }) {
        switch (attack.name) {
            case 'Tackle':
                this._performTackleAttack(attack, recipient);
                break;
            case 'Fireball':
                this._performFireballAttack(attack, recipient, renderedSprites);
                break;
            default:
                console.warn(`Unknown attack: ${attack.name}`);
        }
    }

    _performTackleAttack(attack, recipient) {
        const healthBar = recipient.isEmemy ? '#enemyHealthGreen' : '#healthGreen';
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEmemy) {
            movementDistance = -20;
        }

        // Reduce the recipient's health
        recipient.health -= attack.damage;
        if (recipient.health < 0) recipient.health = 0;

        // Attack animation sequence
        tl.to(this.position, {
            x: this.position.x - movementDistance,
            duration: 0.1
        }).to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
                // Update health bar
                gsap.to(healthBar, {
                    width: recipient.health + '%',
                    duration: 0.2
                });

                // Recipient hit animation
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                });

                // Recipient flash animation
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.08
                });
            }
        }).to(this.position, {
            x: this.position.x,
            duration: 0.1
        });
    }

    _performFireballAttack(attack, recipient, renderedSprites) {
        const healthBar = recipient.isEmemy ? '#enemyHealthGreen' : '#healthGreen';
        const fireballImage = new Image();
        fireballImage.src = './img/fireball.png';

        // Reduce the recipient's health
        recipient.health -= attack.damage;
        if (recipient.health < 0) recipient.health = 0;

        // Create a fireball sprite
        const fireball = new Sprite({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2
            },
            image: fireballImage,
            frames: {
                max: 4,
                elapsed: 10
            },
            animate: true
        });

        renderedSprites.push(fireball);

        // Animate fireball to target
        gsap.to(fireball.position, {
            x: recipient.position.x,
            y: recipient.position.y,
            duration: 0.5,
            onComplete: () => {
                // Update health bar
                gsap.to(healthBar, {
                    width: recipient.health + '%',
                    duration: 0.2
                });

                // Recipient hit animation
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                });

                // Recipient flash animation
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.08
                });

                // Remove fireball sprite
                const fireballIndex = renderedSprites.indexOf(fireball);
                if (fireballIndex > -1) {
                    renderedSprites.splice(fireballIndex, 1);
                }
            }
        });
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
        // Draw collision boundary (invisible in production)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}