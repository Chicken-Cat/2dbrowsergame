class projectile {
    constructor(damage, x, y, xVel, yVel, type) {
        this.damage = damage
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.type = type
    }

    projectileDraw() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, 20, 20)
    }
}

/*
 5: collision with projeciles on server side
 6: damage and projectile vanishing upon impact
 */