// Sprite class for rendering images
class Sprite {
    constructor({ position, image, frames = { max: 1 } }) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
    }

    draw() { 
        if (this.image.complete) {
            ctx.drawImage(
                this.image, 
                0, 0,
                this.image.width / this.frames.max,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max,
                this.image.height
            );
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