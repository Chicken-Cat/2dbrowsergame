const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('/Users/brady/Downloads/2dgame/index.html')
})

app.listen(port, () => {
    console.log(`app is up on port ${port}`)
})