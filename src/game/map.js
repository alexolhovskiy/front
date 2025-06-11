import {Box} from "./box.js";
import { CENTER_H,CENTER_W } from "./settings.js";
import {Drone} from './drone.js';
import {Bot} from './bot.js';
import { Shell } from "./shell.js";
import { BrickWall } from "./brick_wall.js";
import { Tree } from "./tree.js";
import * as math from 'mathjs';


export class Map {
    constructor(ctx,w,h, textures,cam) {
        this.ctx = ctx;
        this.cam=cam;
        this.ang=0;
        this.pos=[0,0];
        this.size=[w,h];
        this.l_p=math.matrix([[0,0,1],[w,0,1],[w,h,1],[0,h,1]]);
        this.textures = textures;
        
        this.ricoshets=[];
        this.smokes=[];
        this.fires=[];
        this.shells=[];
        this.missiles=[];
        this.borders=[0,0,w,h];
        this.units=[];

        this.boxes=[
            new Box(ctx,300,800,0.7,400,400,textures,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new Box(ctx,400,200,0,400,400,textures,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new Box(ctx,700,800,0.7,200,200,textures,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new Box(ctx,400,1200,0,200,200,textures,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new Box(ctx,800,1200,0,200,200,textures,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
        ];

        this.walls=[
            new BrickWall(ctx,60,400,0,7,4,60,5,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new BrickWall(ctx,550,400,0,7,4,60,5,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
            new BrickWall(ctx,500,500,1.57,7,4,20,5,this,this.shells,this.ricoshets,this.smokes,this.fires,this.missiles),
        ];

        this.trees=[
            new Tree(ctx,860,80,6,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
                                this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls),
            new Tree(ctx,260,480,4,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
                                this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls),
            new Tree(ctx,860,250,6,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
                                this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls),
        ]

        // this.units.push(new Drone(ctx,800,10,0,10,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
        //                         this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));
        // this.units.push(new Bot(ctx,850,500,1.57,10,'rgb(0,0,255)',this,this.shells,this.ricoshets,this.smokes,
        //                         this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));

        this.bulletMap = {};     // Быстрый доступ по id
    }

    // setPlayers(playersData) {
    //     this.units.push(new Drone(this.ctx,800,10,0,10,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
    //                             this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));
        
    //     for(let i=1;i<playersData.length;i++){
    //         this.units.push(new Bot(this.ctx,850,500,0,10,'rgb(0,0,255)',this,this.shells,this.ricoshets,this.smokes,
    //                                 this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));
    //     }
    // }

    setPlayers(playersData, socketId) {
        if (this.units.length === 0) {
            // 0-й юнит — игрок
            const pd = playersData[socketId];
            const drone=new Drone(this.ctx,pd.x,pd.y,0,10,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
                                    this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls);
            drone.id = socketId;
            this.units.push(drone);
            // Остальные — другие игроки
            for (let key in playersData) {
                if (key === socketId) continue;  
                const pd = playersData[key];
                const bot=new Bot(this.ctx,pd.x,pd.y,0,10,'rgb(0,0,255)',this,this.shells,this.ricoshets,this.smokes,
                                        this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls);
                bot.id = key;
                this.units.push(bot);
            }

        }else{

            const existingIds = this.units.map(u => u.id); // id = socket.id
            const updatedIds = Object.keys(playersData);

            // Удаление вышедших
            // this.units = this.units.filter(unit => updatedIds.includes(unit.id));

            // Добавление новых
            for (let id of updatedIds) {
                const pd = playersData[id];

                const existing = this.units.find(u => u.id === id);
                if (!existing) {

                    const unit = new Bot(
                        this.ctx, pd.x, pd.y, pd.angle || 0, 10, 'rgb(0,0,255)',
                        this, this.shells, this.ricoshets, this.smokes,
                        this.fires, this.missiles, this.borders, this.units,
                        this.boxes, this.walls
                    );
                    unit.id = id;
                    this.units.push(unit);
                } else {
                    // Обновить существующего
                    const t = 0.3;
                    existing.pos[0] = existing.pos[0] * (1 - t) + pd.x * t;
                    existing.pos[1] = existing.pos[1] * (1 - t) + pd.y * t;
                    existing.ang = pd.ang;
                }
            }
        }
    }


    // setPlayers(playersData,socketId) {
    //     if (this.units.length === 0) {
    //         const newUnits = [];

    //         // 0-й юнит — игрок
    //         const playerData = playersData.myIdData; // по ID твоего игрока
    //         const pd = playersData[socketId];
    //         newUnits.push(new Drone(this.ctx,pd.x,pd.y,0,10,'rgb(255,0,0)',this,this.shells,this.ricoshets,this.smokes,
    //                                 this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));

    //         // Остальные — боты / другие игроки
    //         for (let key in playersData) {
    //             if (key === socketId) continue;  
    //             const pd = playersData[key];
    //             newUnits.push(new Bot(this.ctx,pd.x,pd.y,0,10,'rgb(0,0,255)',this,this.shells,this.ricoshets,this.smokes,
    //                                     this.fires,this.missiles,this.borders,this.units,this.boxes,this.walls));
    //         }

    //         this.units = newUnits;
    //     }else{
    //         // Просто обновляем позиции
    //         let i = 0;
    //         const lerp = (a, b, t) => a + (b - a) * t;
    //         const t=0.3;
    //         for (let key in playersData) {
    //             const p = playersData[key];
    //             if (this.units[i]) {
    //                 // this.units[i].pos[0] = p.x;
    //                 // this.units[i].pos[1] = p.y;
                    
    //                 this.units[i].pos[0] = lerp(this.units[i].pos[0], p.x, 0.3);
    //                 this.units[i].pos[1] = lerp(this.units[i].pos[1], p.y, 0.3);
    //             }
    //             i++;
    //         }
    //     }
    // }

    setBullets(bulletsData) {
        bulletsData.forEach(b => {
            console.log("Create bullet", b.id);
            // Если такой пули ещё нет — создаём
            if (!this.bulletMap[b.id]) {
                const shell = new Shell(
                    this.ctx,
                    b.x,
                    b.y,
                    b.ang,
                    2,                  // Скорость пули
                    'rgb(0,0,0)',       // Цвет
                    this.borders,
                    this.units,
                    this.boxes
                );

                shell.id = b.id;               // Присваиваем ID
                this.shells.push(shell);       // Добавляем в боевые снаряды
                this.bulletMap[b.id] = shell;  // Запоминаем, что пуля уже создана
            }
            // Иначе ничего не делаем — снаряд сам двигается и удаляется
        });
    }




    update() {
        if((this.units[0])&&('update' in this.units[0])){
            this.units[0].update();
        }
    }

    createMatrix() {
        const c = math.cos(this.ang);
        const s = math.sin(this.ang);
        return math.matrix([
        [c, -s, this.pos[0]],
        [s, c, this.pos[1]],
        [0, 0, 1]
        ]);
    }

    drawPolygon(points, strokeColor = 'rgb(221, 101, 21)', fillColor = null) {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.closePath();
    
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    setArr(M){
        return math.transpose(math.multiply(math.multiply(M,this.createMatrix()),math.transpose(this.l_p))).toArray().map(item => [
            item[0], 
            item[1]
        ]);
    }

    draw(M){
        var temp=this.setArr(M);
        // console.log(temp);
        this.drawPolygon(temp,'rgb(238, 182, 98)','rgb(230, 168, 75)');

        this.boxes.forEach(item=>{
            item.contact();
            item.draw(M);
        });

        this.walls.forEach(item=>{
            item.contact();
            item.draw(M);
        });

        
        this.units.forEach(item=>{
            item.contact();
            // item.draw(M);
        });

        if(this.units[0]){
            this.units[0].draw(M);
        }
        

        for (let i = this.shells.length - 1; i >= 0; i--) {
            if (!this.shells[i].flag) {
                this.shells.splice(i, 1); // Удаляет элемент по индексу
                if (this.shells.id && this.bulletMap[this.shells.id]) {
                    delete this.bulletMap[this.shells.id];
                }
            }
        }
        this.shells.forEach(item=>{
            item.draw(M);
        })

        for (let i = this.ricoshets.length - 1; i >= 0; i--) {
            if (!this.ricoshets[i].dens) {
                this.ricoshets.splice(i, 1); // Удаляет элемент по индексу
            }
        }
        this.ricoshets.forEach(item=>{
            item.draw(M);
        })

        for (let i = this.smokes.length - 1; i >= 0; i--) {
            if (!this.smokes[i].dens) {
                this.smokes.splice(i, 1); // Удаляет элемент по индексу
            }
        }
        this.smokes.forEach(item=>{
            item.draw(M);
        })


        this.trees.forEach(item=>{
            // item.contact();
            item.draw(M);
        });
    }
}