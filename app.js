const express = require('express');
const app = express();

// sets up socketio
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000})
const fs = require('fs')

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {}
const projectiles = {}
let projectileID = 0

io.on('connection', (socket) => {
    console.log('a user connected');
    players[socket.id] = {
        x: Math.round(Math.random() * 500) + 1366/4,
        y: Math.round(Math.random() * 500),
        color: 'orange',
        touchingGround: false,
        yv: 0,
        jumpsLeft: 2
    }

    socket.emit('loadMap', map)
    io.emit('updatePlayers', players)

    socket.on('disconnect', (reason) => {
        console.log(reason);
        delete players[socket.id]
        io.emit('updatePlayers', players)
    })

    console.log(players);

    const speed = 5

    socket.on('keydown', (keycode) => {
        switch (keycode) {
            case 'KeyA':
                players[socket.id].x -= speed
                break
            case 'KeyD':
                players[socket.id].x += speed
                break
            case 'KeyW':
                if (players[socket.id].jumpsLeft > 0) {
                    players[socket.id].jumpsLeft--
                    players[socket.id].touchingGround = false
                    players[socket.id].yv = -10
                }
        }
    })

    function projectile(d, x, y, xVel, yVel, type) {

        const id = projectileID++
        projectiles[id] = {
            damage: d,
            x: x + 25,
            y: y + 40,
            xVel: xVel,
            yVel: yVel,
            type: type,
            created: Date.now(),
            lifespan: 3000
        }
        io.emit('updateProjectiles', projectiles)
    }


    socket.on('keyup', (serverStratInput) => {
        let player = players[socket.id]
        switch (serverStratInput) {
            case 'wdsss':
                console.log('500KG INBOUND')
                socket.emit('getDirection', {
                    damage: 10,
                    type: 'Fireball'
                })
                break
        }
    })

    socket.on('direction', ({ damage, type, xVel, yVel }) => {
        let player = players[socket.id]

        if (!player) return

        projectile(
            damage,
            player.x,
            player.y,
            xVel,
            yVel,
            type
        )
    })
})



const gravity = 0.2

setInterval(() => {
    for (const id in players) {
        if (players[id].touchingGround && players[id].yv > 0) players[id].yv = 0
        else players[id].yv += gravity
        players[id].y += players[id].yv

        // temp floor collision
        if (players[id].y >= 818) {
            players[id].y = 818
            players[id].touchingGround = true
            players[id].jumpsLeft = 2
        }
        if (players[id].y <= 0) {
            players[id].y = 0
            players[id].yv = 0
        }
        if (players[id].x <= 0) {
            players[id].x = 0
        }
        if (players[id].x >= 1316) {
            players[id].x = 1316
        }
    }

    for (const id in projectiles) {
        const projectile = projectiles[id]

        projectile.x += projectile.xVel
        projectile.y += projectile.yVel

        if (Date.now() - projectile.created >= projectile.lifespan) {
            delete projectiles[id]
        }
    }

    io.emit('updateProjectiles', projectiles)
    io.emit('updatePlayers', players)
}, 15)


// each block is 24 pixels wide
// loop through each

const map = []

function loadMap() {
    const data = fs.readFileSync('public/maps/map1.txt', 'utf8')
    const rows = data.trim().split('\n')

    for (let y = 0; y < 32; y++) {
        map[y] = []

        for (let x = 0; x < 32; x++) {
            map[y][x] = rows[y][x]
        }
    }
}


server.listen(port, () => {
    console.log(`app is up on port ${port}`)
})

console.log('server loaded')

loadMap()