import { Game } from './game.js';
import { loadSettings,FPS } from './settings.js';
import {FPSCounter} from './fps.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const fpsCounter = new FPSCounter(ctx);

// Запускаем счётчик
fpsCounter.start();

console.log('Main: Game initialized');

const textures = {};
const textureList = [
    { name: 'house', src: 'assets/blender2.png' },
    // { name: 'wall', src: 'assets/wall.png' }
];

function loadTextures(callback) {
    let loadedCount = 0;
    textureList.forEach(({ name, src }) => {
        textures[name] = new Image();
        textures[name].src = src;
        textures[name].onload = () => {
            console.log(`Main: Loaded ${name}`);
            loadedCount++;
            if (loadedCount === textureList.length) callback();
        };
        textures[name].onerror = () => console.error(`Main: Failed to load ${name}`);
    });
}

loadTextures(() => {
    console.log('Main: All textures loaded');
    loadSettings(canvas);
    const game = new Game(ctx, textures);
    
    function gameLoop() {
        game.update();
        game.draw();
        // console.log("Sasha");
        console.log(fpsCounter.update()); // Обновляем FPS
        setTimeout(gameLoop, 1000 / FPS); // 20 FPS
    }
    
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') console.log('Main: Escape pressed');
});

canvas.addEventListener('click', () => {
    console.log('Main: Canvas clicked');
});