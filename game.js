const gravity = 0.5; //constant values cannot be changed
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const element = document.body;
element.style.overflow = 'hidden'; //hides scrollbars

const player = {
    x: 50,
    y: 100,
    h: 80,
    w: 50,
    velY: 0,
    velX: 0,
    maxVY: 100,
    maxVX: 10,
    isGrounded: false,
    jumps: 1
};


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.w, player.h)
}

function collision() {
    if (player.x >= canvas.width-50) {
        player.velX = 0;
        player.x = canvas.width-50;
    }
    if (player.x <= 0) {
        player.velX = 0;
        player.x = 0;
    }
    if (player.y >= canvas.height-80) {
        player.velY = 0;
        player.isGrounded = true;
        player.y = canvas.height-80;
        player.jumps = 2;
    }
    else player.isGrounded = false;
    if (player.y <= 0) {
        player.velY = 0;
        player.y = 1;
    }

}

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (event.key == "w" || event.key == " ") if (player.jumps > 0) {
        player.velY = -13;
        player.jumps--;
    }
});

window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function input() {
    if (keys["d"] && player.velX < player.maxVX) player.velX += 0.4;
    if (keys["a"] && player.velX > -player.maxVX) player.velX -= 0.4;
}

function physics() {
    player.x += player.velX;
    player.y += player.velY
    if (player.velY < 20 && !player.isGrounded) player.velY += gravity;
}

function gameTick() {
    input();
    physics();
    collision();
    draw();
    requestAnimationFrame(gameTick);
}

requestAnimationFrame(gameTick);
// order should be:
// inputs, physics, collisions, render