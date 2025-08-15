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

image.onload = () => {
    ctx.drawImage(image, -200, -50);
    ctx.drawImage(playerImage, canvas.width / 2 - playerImage.width / 2 ,
         canvas.height / 2 - playerImage.height / 2);
    
}
