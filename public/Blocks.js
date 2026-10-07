class Blocks {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    blockDraw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(
            this.x * 32 + 341,
            this.y * 32,
            32,
            32
        )
    }
}