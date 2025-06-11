import {Shell} from './shell.js';
import {Line,getAng2,dis2} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import {WIDTH,HEIGHT} from "./settings.js";
import * as math from 'mathjs';


export class Tree{
    constructor(ctx,x,y,num,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls){
        this.pos=[x,y,1];
        this.ctx=ctx;
        this.map=map;
        this.size=[num];
        this.ang=0;
        this.color=c;
        this.crouns=[];

        this.smokes=smokes;
        this.ricoshets=ricoshets;
        this.fires=fires;
        this.shells=shells;
        this.missiles=missiles;
        this.borders=borders;
        this.units=units;
        this.boxes=boxes;
        this.walls=walls;


        this.setCrouns();
    }


    setCrouns(){
        for(let i=0;i<this.size[0];i++){
            const ang=Math.random()*Math.PI*2;
            const R=this.size[0]*10;

            const pos=[Math.cos(ang)*R,Math.sin(ang)*R,1];
            const r=2*R/3+Math.random()*(R/3);

            let points=[];
            for(let j=0;j<4;j++){
                points.push([Math.cos(j*Math.PI/2)*r,Math.sin(j*Math.PI/2)*r,1]);
            }
            const g=100+Math.random()*150;
            const color='rgb(0,'+g+',0)';

            this.crouns.push([ang,pos,points,color]);

        }
    }

  

  undercover2(o,p){//false - нет сокрытия
    // console.log(o,p);
      const trajectory=new Line(this.ctx,o,p);
      // trajectory.draw();
      return this.boxes.some(box=>{return box.boxCover(trajectory)}) || this.walls.some(wall=>{return wall.base.boxCover(trajectory)});
  }

  
  createMatrix(ang,pos) {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    return math.matrix([
      [c, -s, pos[0]],
      [s, c, pos[1]],
      [0, 0, 1]
    ]);
  }

  setArr(M,l_p,l_a,l_pos,g_a,g_pos) {
    return math.transpose(math.multiply(math.multiply(M, math.multiply(this.createMatrix(g_a,g_pos),
    this.createMatrix(l_a,l_pos))), math.transpose(math.matrix(l_p)))).toArray().map(item => [
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
    const pos = math.multiply(math.multiply(M,this.createMatrix(this.ang,this.pos)), v).toArray();
    return [pos[0], pos[1]];
  }

  // move(){

  // }

  draw(M) {
    const [g_x,g_y,one]=math.multiply(M,math.matrix(this.pos)).toArray();
    this.ctx.beginPath();
    this.ctx.fillStyle='rgb(56, 24, 2)';
    this.ctx.arc(g_x,g_y,this.size[0],0,2*Math.PI,true);
    this.ctx.fill();
    this.crouns.forEach(item=>{
        const [x,y]=this.setP(M,math.matrix(item[1]));
        this.ctx.beginPath();
        this.ctx.moveTo(g_x, g_y);
        this.ctx.lineTo(x,y);
        this.ctx.strokeStyle = 'rgb(56, 24, 2)';
        this.ctx.lineWidth = 4*this.map.cam.scale;
        this.ctx.stroke();
        
        this.drawPolygon(this.setArr(M,item[2],item[0],item[1],this.ang,this.pos),item[3],item[3]);
    });
  }  
}