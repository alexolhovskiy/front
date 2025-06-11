import {Shell} from './shell.js';
import {Line,getAng2,dis2} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import {WIDTH,HEIGHT} from "./settings.js";
import * as math from 'mathjs';


export class Unit{
    constructor(ctx,x,y,a,r,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls){
        this.pos=[x,y];
        this.pos_r=[0,0];
        this.ctx=ctx;
        this.map=map;
        this.size=[r];
        this.ang=a;
        this.color=c;
        this.smokes=smokes;
        this.ricoshets=ricoshets;
        this.fires=fires;
        this.shells=shells;
        this.bullets=[];
        this.missiles=missiles;
        this.borders=borders;
        this.units=units;
        this.boxes=boxes;
        this.walls=walls;
        this.protection=null;
        this.wait=0;
        this.cartridges=100;
        this.l_p=[]
        for (var i=0;i<Math.PI*2;i+=Math.PI/12){
            this.l_p.push([r*Math.cos(i),r*Math.sin(i),1])
        }
        this.radius=2*r;
        this.speed=4;
        this.move_speed=20;
        this.angularSpeed = 0.1; // Радиан за кадр
        // this.keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false, ShiftLeft: false, Space:false};
        // Создаём объекты Audio
        // Создаём массив звуков для очереди
        this.shotSounds = Array(5).fill().map(() => new Audio('/static/sounds/machine_gun.mp3'));
        this.shotSounds.forEach(sound => {
            sound.volume = 0.5; // Громкость
        });
        this.currentShotIndex = 0;
        // this.shotSound = new Audio('/static/sounds/machine_gun.mp3');
        // const moveSound = new Audio('/static/sounds/move.mp3');
        // this.shotSound.volume = 0.5; // Устанавливаем громкость (0.0 - 1.0)
        // moveSound.volume = 0.3;
    }


  isOk(o){
      if(o[0]<0 || o[0]>this.map.size[0]|| o[1]<0 || o[1]>this.map.size[1]){
          return false
      }else{ 
          return !this.boxes.some(item=>{return item.getReferencePoints(o)[2]<this.size[0];})&&
                  !this.walls.some(item=>{return item.base.getReferencePoints(o)[2]<this.size[0];});
      }
  }

  forward(){
      const cos = Math.cos(this.ang);
      const sin = Math.sin(this.ang);
      const temp=[this.pos[0] + cos * this.move_speed,this.pos[1] + sin * this.move_speed];
      if(this.isOk(temp)){
        this.pos_r[0]=temp[0];
        this.pos_r[1]=temp[1];
      }
  }

  backward(){
      const cos = Math.cos(this.ang);
      const sin = Math.sin(this.ang);
      const temp=[this.pos[0] -cos * this.move_speed,this.pos[1] - sin * this.move_speed];
      if(this.isOk(temp)){
        this.pos_r[0]=temp[0];
        this.pos_r[1]=temp[1];
      }
  }

  left(){
      const temp=[this.pos[0] -Math.cos(this.ang+Math.PI/2) * this.move_speed,this.pos[1] -Math.sin(this.ang+Math.PI/2)* this.move_speed];
      if(this.isOk(temp)){
        this.pos_r[0]=temp[0];
        this.pos_r[1]=temp[1];
      }
  }

  right(){
      const temp=[this.pos[0] +Math.cos(this.ang+Math.PI/2) * this.move_speed,this.pos[1] +Math.sin(this.ang+Math.PI/2)* this.move_speed];
      if(this.isOk(temp)){
        this.pos_r[0]=temp[0];
        this.pos_r[1]=temp[1];
      }
  }

 

  contact(){
      this.shells.forEach(s=>{
          if(dis2(s.pos,this.pos)<2*this.radius){
              console.log("Close");
              const trajectory=new Line(this.ctx,s.start,s.pos);
          
              // if (!this.protection & !this.protection.contact(trajectory,s)){
                  if (dis2(s.pos,this.pos)<this.size[0]){
                      if (s.type=='missile'){
                          // this.explosion(getAng2(this.pos,s.pos),s.r_destruction);
                          this.life=-1;
                      }else{
                          this.life-=s.r_destruction;
                          this.ricoshets.push(new Ricoshet(this.ctx,this.pos,getAng2(this.pos,s.pos),s.r_destruction,this.color));
                          this.smokes.push(new Smoke(this.ctx,this.pos,0.02,0.4,0,0));
                      }
                      s.flag=false;
                  // }
              }
          }
    });
  }

  // isOk(o){
  //     if(o[0]<0 || o[0]>WIDTH || o[1]<0 || o[1]>HEIGHT){
  //         return false
  //     }else{ 
  //         return !this.boxes.some(item=>{
  //             const temp=item.getReferencePoints(o);
  //             console.log(temp);
  //             return temp[2]<this.size[0]
  //         });
  //     }
  // }



  // handleInput() {
  //     const speed = this.keys.ShiftLeft ? this.speed * 2 : this.speed;
  //     const cos = Math.cos(this.ang);
  //     const sin = Math.sin(this.ang);
      
  //     if (this.keys.KeyW) {
  //       const temp=[this.pos[0] + cos * speed,this.pos[1] + sin * speed];
  //       if(this.isOk(temp)){
  //         this.pos[0]=temp[0];
  //         this.pos[1]=temp[1];
  //       }
  //     }
  //     if (this.keys.KeyS) {
  //       const temp=[this.pos[0] -cos * speed,this.pos[1] - sin * speed];
  //       if(this.isOk(temp)){
  //         this.pos=temp
  //       }
  //     }
  //     if (this.keys.KeyA) {
  //       const temp=[this.pos[0] -Math.cos(this.ang+Math.PI/2) * speed,this.pos[1] -Math.sin(this.ang+Math.PI/2)* speed];
  //       if(this.isOk(temp)){
  //         this.pos=temp
  //       }
  //       // this.ang += this.angularSpeed;
  //     }
  //     if (this.keys.KeyD) {
  //       const temp=[this.pos[0] +Math.cos(this.ang+Math.PI/2) * speed,this.pos[1] +Math.sin(this.ang+Math.PI/2)* speed];
  //       if(this.isOk(temp)){
  //         this.pos=temp
  //       }
  //     }
  //     if (this.keys.Space){
  //         // console.log("Space");
  //         this.main_gun_shoot();
  //     }

      
  // }

  undercover2(o,p){//false - нет сокрытия
    // console.log(o,p);
      const trajectory=new Line(this.ctx,o,p);
      // trajectory.draw();
      return this.boxes.some(box=>{return box.boxCover(trajectory)}) || this.walls.some(wall=>{return wall.sectorCover(trajectory)});
  }


  main_gun_shoot(){
      // M=math.multiply(this.map.createMatrix(),this.map.cam.createMatrix());
      if((this.cartridges>0)&(this.wait==0)){
          this.wait=4;
          // this.shotSound.currentTime = 0; // Сброс на начало
          // this.shotSound.play();
          // const sound = this.shotSounds[this.currentShotIndex];
          // sound.currentTime = 0; // Сброс на начало
          // sound.play().catch(err => console.log("Play error:", err)); // Обрабатываем ошибки
          // this.currentShotIndex = (this.currentShotIndex + 1) % this.shotSounds.length; // Переключаем индекс
          
          // const[x,y]=this.setP(this.map.createMatrix(),math.matrix([this.pos[0],this.pos[1],1]));
          const [x,y]=[this.pos[0],this.pos[1]];
          

          // и отправляем на сервер
          this.bullets.push({x:x+Math.cos(this.ang)*this.radius*1.5,y:y+Math.sin(this.ang)*this.radius*1.5,ang:this.ang,speed:this.speed});
      }
  }

  // shellCreate(x,y,ang){
  //     // console.log("Shoot",x+Math.cos(this.ang)*this.radius*1.5,y+Math.sin(this.ang)*this.radius*1.5,this.ang);
  //     // const endX = x + this.radius * Math.cos(this.ang);
  //     // const endY = y + this.radius * Math.sin(this.ang);
  //     this.shells.push(new Shell(this.ctx,x,y,ang,2,'rgb(0,0,0)',this.borders,this.units,this.boxes));
  // }

  // Обновление по мыши (поворот к курсору)
  // updateAngle(mouseX, mouseY) {
  //   // Переводим координаты мыши в мировые
  //   const worldX = mouseX;
  //   const worldY = mouseY;
  //   this.ang = Math.atan2(worldY - this.pos[1], worldX - this.pos[0]);
  // }

  // update() {
  //   this.handleInput();
  // }

  createMatrix() {
    const c = Math.cos(this.ang);
    const s = Math.sin(this.ang);
    return math.matrix([
      [c, -s, this.pos[0]],
      [s, c, this.pos[1]],
      [0, 0, 1]
    ]);
  }

  setArr(M) {
    return math.transpose(math.multiply(math.multiply(M, this.createMatrix()), math.transpose(math.matrix(this.l_p)))).toArray().map(item => [
      item[0],
      item[1]
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

  setP(M,v) {
    const pos = math.multiply(M, v).toArray();
    return [pos[0], pos[1]];
  }

  draw(M) {
    const [x, y] = this.setP(M,math.matrix([this.pos[0], this.pos[1], 1])); // Трансформированная позиция
    const endX = x + this.radius*this.map.cam.scale * Math.cos(this.ang);
    const endY = y + this.radius*this.map.cam.scale * Math.sin(this.ang);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = 'rgb(0,0,0)';
    this.ctx.lineWidth = 3*this.map.cam.scale;
    this.ctx.stroke();

    const points = this.setArr(M);

    this.drawPolygon(points, this.color, this.color);

    if(this.wait>0){
        this.wait-=1;
    }
  }  
}