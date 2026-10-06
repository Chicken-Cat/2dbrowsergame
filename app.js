const express = require('express');
const app = express();

// sets up socketio
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000})

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {}

io.on('connection', (socket) => {
    console.log('a user connected');
    players[socket.id] = {
        x: Math.round(Math.random() * 500),
        y: Math.round(Math.random() * 500),
        color: 'orange',
        touchingGround: false,
        yv: 0,
        jumpsLeft: 2
    }

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

    socket.on('keyup', (serverStratInput) => {
        let player = players[socket.id]
        switch (serverStratInput) {
            case 'wdsss':
                console.log('500KG INBOUND')
                // let temp = new projectile(10, player.x, player.y, 5, 0)
                // temp.draw()
                break
        }
    })
})



const gravity = 0.2

setInterval(() => {
    for (const id in players) {
        if (players[id].touchingGround && players[id].yv > 0) players[id].yv = 0
        else players[id].yv += gravity
        players[id].y += players[id].yv

        // temp floor collision
        if (players[id].y >= 600) {
            players[id].y = 600
            players[id].touchingGround = true
            players[id].jumpsLeft = 2
        }
    }
    io.emit('updatePlayers', players)
}, 15)

server.listen(port, () => {
    console.log(`app is up on port ${port}`);
})

console.log('server loaded')