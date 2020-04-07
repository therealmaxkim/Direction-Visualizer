module.exports = class Particle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 1.0;
    }

    draw(p) {
        p.strokeWeight(0);
        p.fill(255);
        p.ellipse(this.x, this.y, 2, 2);
    }

    isOutOfBounds(p) {
        return this.x < 0 ||
            this.x > p.width ||
            this.y < 0 ||
            this.y > p.height;
    }
}