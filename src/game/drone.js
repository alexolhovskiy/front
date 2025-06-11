import {Shell} from './shell.js';
import {Line,getAng2,dis2} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import {WIDTH,HEIGHT} from "./settings.js";
import {Unit} from "./unit.js";
import * as math from 'mathjs';


export class Drone extends Unit{
    constructor(ctx,x,y,a,r,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls){
        super(ctx,x,y,a,r,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls)
        
        this.keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false, ShiftLeft: false, Space:false,ArrowLeft:false,ArrowRight:false};

    }

  // isOk(o){
  //     if(o[0]<0 || o[0]>this.map.size[0]|| o[1]<0 || o[1]>this.map.size[1]){
  //         return false
  //     }else{ 
  //         return !this.boxes.some(item=>{return item.getReferencePoints(o)[2]<this.size[0];})&&
  //                 !this.walls.some(item=>{return item.base.getReferencePoints(o)[2]<this.size[0];});
  //     }
  // }

 handleInput() {
      // const speed = this.keys.ShiftLeft ? this.speed * 2 : this.speed;
      // const cos = Math.cos(this.ang);
      // const sin = Math.sin(this.ang);
      
      if (this.keys.KeyW) {
        // const temp=[this.pos[0] + cos * speed,this.pos[1] + sin * speed];
        // if(this.isOk(temp)){
        //   this.pos[0]=temp[0];
        //   this.pos[1]=temp[1];
        // }
        this.forward();
      }
      if (this.keys.KeyS) {
        // const temp=[this.pos[0] -cos * speed,this.pos[1] - sin * speed];
        // if(this.isOk(temp)){
        //   this.pos=temp
        // }
        this.backward();
      }
      if (this.keys.KeyA) {
        // const temp=[this.pos[0] -Math.cos(this.ang+Math.PI/2) * speed,this.pos[1] -Math.sin(this.ang+Math.PI/2)* speed];
        // if(this.isOk(temp)){
        //   this.pos=temp;
        // }
        // this.ang += this.angularSpeed;
        this.left();
      }
      if (this.keys.KeyD) {
        // const temp=[this.pos[0] +Math.cos(this.ang+Math.PI/2) * speed,this.pos[1] +Math.sin(this.ang+Math.PI/2)* speed];
        // if(this.isOk(temp)){
        //   this.pos=temp;
        // }
        this.right();
      }
      if (this.keys.ArrowLeft) {
        this.ang-=this.angularSpeed;
      }
      if (this.keys.ArrowRight) {
        this.ang+=this.angularSpeed;
      }
      if (this.keys.Space){
          // console.log("Space");
          this.main_gun_shoot();
      }      
  }

  // // Обновление по мыши (поворот к курсору)
  // updateAngle(mouseX, mouseY) {
  //   // Переводим координаты мыши в мировые
  //   const worldX = mouseX;
  //   const worldY = mouseY;
  //   this.ang = Math.atan2(worldY - this.pos[1], worldX - this.pos[0]);
  // }

  update() {
    this.handleInput();
    this.map.cam.shift[0]=-this.pos[0];
    this.map.cam.shift[1]=-this.pos[1];
  }


  draw(M){
    super.draw(M);
    for(var i=1;i<this.units.length;i++){
        // console.log(this.units[i].pos);
        if(!this.undercover2(this.pos,this.units[i].pos)){
            // console.log("Visible");
            this.units[i].draw(M);
        }
    }
  }
}