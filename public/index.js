const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

document.body.style.overflow = 'hidden' //hides scrollwheels

const socket = io();

canvas.width = innerWidth
canvas.height = innerHeight

const width = canvas.width
const height = canvas.height
console.log(width, height)

const players = {}
const frontendProjectiles = {}

socket.on('updatePlayers', (backEndPlayers) => {
    for (const id in backEndPlayers) {
        const backEndPlayer = backEndPlayers[id]

        if (!players[id]) {
            players[id] = new Player(
                backEndPlayer.x,
                backEndPlayer.y,
                backEndPlayer.color,
                backEndPlayer.yv,
                backEndPlayer.touchingGround,
                backEndPlayer.jumpsLeft
            )
        } else {
            players[id].x = backEndPlayer.x
            players[id].y = backEndPlayer.y
            players[id].color = backEndPlayer.color
            players[id].yv = backEndPlayer.yv
            players[id].jumpsLeft = backEndPlayer.jumpsLeft
            players[id].touchingGround = backEndPlayer.touchingGround
        }
    }
    for (const id in players) {
        if (!backEndPlayers[id]) {
            delete players[id]
        }
    }
})

socket.on('updateProjectiles', (backendProjectiles) => {
    for (const id in backendProjectiles) {
        const backendProjectile = backendProjectiles[id]

        if (!frontendProjectiles[id]) {
            frontendProjectiles[id] = new projectile(
                backendProjectile.damage,
                backendProjectile.x,
                backendProjectile.y,
                backendProjectile.xVel,
                backendProjectile.yVel,
                backendProjectile.type
            )
        } else {
            frontendProjectiles[id].damage = backendProjectile.damage
            frontendProjectiles[id].x = backendProjectile.x
            frontendProjectiles[id].y = backendProjectile.y
            frontendProjectiles[id].xVel = backendProjectile.xVel
            frontendProjectiles[id].yVel = backendProjectile.yVel
            frontendProjectiles[id].type = backendProjectile.type
        }
    }
    for (const id in frontendProjectiles) {
        if (!backendProjectiles[id]) {
            delete frontendProjectiles[id]
        }
    }
})

const blocks = {}

socket.on('loadMap', (map) => {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '1') {
                const id = `${x}-${y}`
                blocks[id] = new Blocks(x, y)
            }
        }
    }
})

function animate() {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let temp = Math.abs(width/3 - innerHeight)
    ctx.fillStyle = 'red'
    ctx.fillRect(width - 1366, height - 768,1366, 768)

    ctx.fillStyle = 'yellow'
    ctx.fillRect(width - 1366, height - 768, 1366/4, 768)

    for (const id in players) {
        players[id].draw()
    }

    for (const id in frontendProjectiles) {
        frontendProjectiles[id].projectileDraw()
    }

    for (const id in blocks) {
        blocks[id].blockDraw()
    }
}

animate()

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },

    sa: { pressed: false },
    sd: { pressed: false },
    sw: { pressed: false },
    ss: { pressed: false }
}
const speed = 5

let tempStratInputs = ""



setInterval(() => {
    if (keys.a.pressed) {
        players[socket.id].x -= speed
        socket.emit('keydown', 'KeyA')
    }
    if (keys.d.pressed) {
        players[socket.id].x += speed
        socket.emit('keydown', 'KeyD')
    }
    if (keys.w.pressed) {
        socket.emit('keydown', 'KeyW')
        keys.w.pressed = false
    }


    if (keys.sw.pressed) {
        keys.sw.pressed = false
        tempStratInputs += "w"
        console.log(tempStratInputs)
    }
    if (keys.sa.pressed) {
        keys.sa.pressed = false
        tempStratInputs += "a"
        console.log(tempStratInputs)
    }
    if (keys.ss.pressed) {
        keys.ss.pressed = false
        tempStratInputs += "s"
        console.log(tempStratInputs)
    }
    if (keys.sd.pressed) {
        keys.sd.pressed = false
        tempStratInputs += "d"
        console.log(tempStratInputs)
    }
}, 15)

window.addEventListener("keydown", (event) => {
    if (!players[socket.id]) return
    if (event.shiftKey) {
        switch (event.code) {
            case 'KeyA':
            case 'ArrowLeft':
                keys.sa.pressed = true
                break

            case 'KeyD':
            case 'ArrowRight':
                keys.sd.pressed = true
                break

            case 'KeyW':
            case 'ArrowUp':
                keys.sw.pressed = true
                break

            case 'KeyS':
            case 'ArrowDown':
                keys.ss.pressed = true
                break
        }
        return
    }
    switch(event.code) {
        case 'KeyA':
        case 'ArrowLeft':
            keys.a.pressed = true
            break

        case 'KeyD':
        case 'ArrowRight':
            keys.d.pressed = true
            break

        case 'KeyW':
        case 'Space':
        case 'ArrowUp':
            keys.w.pressed = true
            break
    }
})

window.addEventListener("keyup", (event) => {
    if (!players[socket.id]) return
    switch(event.code) {
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.d.pressed = false
            break
        case 'ShiftLeft':
        case 'ShiftRight':
            console.log(tempStratInputs)
            socket.emit('keyup', tempStratInputs)
            tempStratInputs = ""
            break
    }
})

let mouseX = 0
let mouseY = 0

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
})

socket.on('getDirection', ({ damage, type }) => {
    const player = players[socket.id]

    const playerCenterX = player.x + 25
    const playerCenterY = player.y + 40

    const angle = Math.atan2(
        mouseY - playerCenterY,
        mouseX - playerCenterX
    )

    const speed = 10

    const xVel = Math.cos(angle) * speed
    const yVel = Math.sin(angle) * speed

    socket.emit('direction', {
        damage: damage,
        type: type,
        xVel: xVel,
        yVel: yVel
    })
})
