class Blocks {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    blockDraw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(
            this.x * 24,
            this.y * 24,
            24,
            24
        )
    }
}