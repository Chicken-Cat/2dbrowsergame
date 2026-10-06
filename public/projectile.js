class projectile {
    constructor(damage, x, y, xVel, yVel) {
        this.damage = damage
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
    }

    draw() {
        ctx.fillRect(this.x, this.y, 20, 20)
    }
}

/*
 1: projectile class that i can call to create a projectile object
 2: be able to call that class and store the projectile objects on the server
 3: transmit the x and y locations of each projectile to client sides
 4: render the projectiles every 15ms
 5: collision with projeciles on server side
 6: damage and projectile vanishing upon impact
 */