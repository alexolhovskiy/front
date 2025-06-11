import { Camera } from './camera.js';
import { WIDTH,HEIGHT } from './settings.js';


export class Game {
    constructor(ctx, textures) {
        this.ctx = ctx;
        this.textures = textures;
        this.camera = new Camera(ctx, textures);
        

        // Обработчики
        document.addEventListener('keydown', e => this.handleKey(e, true));
        document.addEventListener('keyup', e => this.handleKey(e, false));
        ctx.canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
        this.mouse = { x: 0, y: 0 };
        // console.log('Game: Instance created');

        // this.players = {};
        // this.playerPos = { x: 0, y: 0 }; // позиция текущего игрока
    }

    setPlayers(playersData,socketId) {
        this.camera.setPlayers(playersData,socketId);
    }

    setBullets(bulletsData){
        this.camera.setBullets(bulletsData);
    }

    handleKey(event, state) {
        const key = event.code;
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD','Space', 'ShiftLeft','ArrowLeft','ArrowRight'].includes(key)) {
            this.camera.map.units[0].keys[key] = state;
        }
        if (['KeyU', 'KeyI'].includes(key)) {
            this.camera.keys[key] = state;
        }
    }

    handleMouseMove(event) {
        // const rect = this.ctx.canvas.getBoundingClientRect();
        // this.mouse.x = event.clientX - rect.left;
        // this.mouse.y = event.clientY - rect.top;
        // this.camera.map.units[0].updateAngle(this.mouse.x, this.mouse.y);
    }

    update() {
        this.camera.update();
    }

    // update() {
    //     // Обновление логики (например, движение дрона)
    //     console.log('Game: Updating');
    //     // Пример: движение дрона с math.js
    //     const position = math.matrix([this.objects[0].x, this.objects[0].y]);
    //     const velocity = math.matrix([2, 1]);
    //     const newPos = math.add(position, velocity);
    //     this.objects[0].x = newPos[0];
    //     this.objects[0].y = newPos[1];
    // }

    draw() {
        this.ctx.fillStyle = 'rgb(128,128,128)';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.camera.draw();
        // console.log('Game: Drawing');
    }

    // draw() {
    //     const ctx = this.ctx;
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //     // Отрисовка всех игроков из this.players
    //     for (const id in this.players) {
    //     const p = this.players[id];
    //     ctx.fillStyle = p.color || 'white';
    //     ctx.fillRect(p.x, p.y, 20, 20);
    //     }

    //     // Отрисовка текущего игрока и других объектов
    // }
}