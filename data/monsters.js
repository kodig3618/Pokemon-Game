const flameImage = new Image();
flameImage.src = './img/flameSprite.png';

const mushroomImage = new Image();
mushroomImage.src = './img/mushroomSprite.png';

const monsters = {
    Emby : {
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
    },

    Mushy : {
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
    }   
}