export class FPSCounter {
    constructor(ctx) {
        this.ctx = ctx;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
    }

    update() {
        const now = performance.now();
        this.frameCount++;

        // Обновляем FPS каждую секунду
        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
        }

        // Выводим FPS на канвас (опционально)
        if (this.ctx) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        }

        return this.fps;
    }

    // Метод для запуска в анимационном цикле
    start() {
        const animate = () => {
            this.update();
            requestAnimationFrame(animate);
        };
        animate();
    }
}