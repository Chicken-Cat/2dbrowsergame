const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

document.body.style.overflow = 'hidden' //hides scrollwheels

const socket = io();

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

const players = {}
const frontendProjectiles = {}

socket.on('updatePlayers', (backEndPlayers) => {
    for (const id in backEndPlayers) {
        const backEndPlayer = backEndPlayers[id]

        if (!players[id]) {
            players[id] = new Player({
                x: backEndPlayer.x,
                y: backEndPlayer.y,
                color: backEndPlayer.color,
                yv: backEndPlayer.yv,
                jumpsLeft: backEndPlayer.jumpsLeft,
                touchingGround: backEndPlayer.touchingGround
            })
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

function animate() {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const id in players) {
        players[id].draw()
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