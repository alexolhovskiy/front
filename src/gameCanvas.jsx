import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; // импортируем
import { loadSettings, FPS } from './game/settings';
import { Game } from './game/game';
import { FPSCounter } from './game/fps';

export const GameCanvas = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null); // сокет тут

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const fpsCounter = new FPSCounter(ctx);

    const textures = {};
    const textureList = [
      { name: 'house', src: 'assets/blender2.png' },
    ];

    let game;

    // Подключаем сокет
    socketRef.current = io('https://game-socket-4.onrender.com'); // или твой сервер

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('players', (playersData) => {
      // Передаём данные игроков в игру
      if (game) game.setPlayers(playersData,socketRef.current.id);
    });

    socketRef.current.on('your_id', (id) => {
      socketRef.current.id = id;
    });

    socketRef.current.on('bullets', (bulletsData) => {
      console.log("[socket] Получены пули:", bulletsData);
      if (game) game.setBullets(bulletsData);
    });


    const loadTextures = (callback) => {
      let loaded = 0;
      textureList.forEach(({ name, src }) => {
        textures[name] = new Image();
        textures[name].src = src;
        textures[name].onload = () => {
          loaded++;
          if (loaded === textureList.length) callback();
        };
      });
    };

    loadTextures(() => {
      loadSettings(canvas);
      game = new Game(ctx, textures);

      fpsCounter.start();

      function gameLoop() {
        game.update();
        game.draw();
        fpsCounter.update();

        // Отправляем на сервер координаты игрока (предположим game.playerPos есть)
        if (socketRef.current && game.camera.map.units[0] && game.camera.map.units[0].pos) {
          socketRef.current.emit('update_player', 
            {x:game.camera.map.units[0].pos_r[0],y:game.camera.map.units[0].pos_r[1],ang:game.camera.map.units[0].ang});

          // и отправляем на сервер
          for(let i=0;i<game.camera.map.units[0].bullets.length;i++){
            console.log(game.camera.map.units[0].bullets[i]);
            socketRef.current.emit('new_bullet', game.camera.map.units[0].bullets[i]);
          }
          game.camera.map.units[0].bullets=[];
        }

        

        setTimeout(gameLoop, 1000 / FPS);
      }

      gameLoop();
    });

    // Обработчики клавиатуры и мыши
    const onKeyDown = (e) => game?.handleKey?.(e, true);
    const onKeyUp = (e) => game?.handleKey?.(e, false);
    const onMouseMove = (e) => game?.handleMouseMove?.(e);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{
        border: '2px solid black',
        background: '#000',
      }}
    />
  );
};
