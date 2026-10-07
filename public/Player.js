class Player {
    constructor(x, y, color, yv, touchingGround, jumpsLeft) {
        console.log(x, y, color, yv, touchingGround, jumpsLeft)
        this.x = x
        this.y = y
        this.color = color
        this.yv = yv
        this.touchingGround = touchingGround
        this.jumpsLeft = jumpsLeft
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, 50, 80)
    }
}