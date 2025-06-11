
import { CENTER_H, CENTER_W } from "./settings.js";
import {Line,getAng2,dis2,tri_dis} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import * as math from 'mathjs';


export class Brick {
  static id=0;
  static getId(){
      return this.id++;
  }
  constructor(ctx, x, y, a, w, h,map,shells,ricoshets,smokes,fires,missiles) {
    this.id=Brick.getId();
    this.ctx = ctx;
    this.R=Math.sqrt(w*w+h*h);
    this.map=map;
    this.pos = [x, y];
    this.ang = a;
    this.size = [w, h];
    this.color='rgb(221, 101, 21)';
    this.l_p = [[0, 0, 1], [w, 0, 1], [w, h, 1], [0, h, 1]];
    this.g_p=this.setArr(math.matrix([[1,0,0],[0,1,0],[0,0,1]]),this.l_p);
    this.lines = [];
    for(var i=0;i<this.g_p.length;i++){
        if(i<this.g_p.length-1){
            this.lines.push(new Line(this.ctx,this.g_p[i],this.g_p[i+1],'rgb(1,1,1)'));
        }else{
            this.lines.push(new Line(this.ctx,this.g_p[i],this.g_p[0],'rgb(1,1,1)'));
        }        
    }
    
    if(this.id==1){
      this.lines.forEach(item=>console.log(item));
    }
    this.smokes=smokes;
    this.ricoshets=ricoshets;
    this.fires=fires;
    this.shells=shells;
    this.missiles=missiles;
    this.coef = 1; // Как в Pygame, уточни значение
  }

  // entrancePoint(e_p,s_p,s_type,des){
  //     const trajectory=new Line(this.ctx,s_p,e_p);
  //     trajectory.draw();
  //     this.lines.forEach(line=>{
  //         const temp=line.linesIntersection(trajectory);
  //         if(temp){
  //             console.log("Temp",temp);
  //             if(line.belongSegment(temp)&trajectory.belongSegment(temp)){
  //                 console.log('belong');
  //                 if(s_type=='missile'){
  //                     // this.explosion(temp,line.ang,des)
  //                 }else{
  //                     console.log("Ricoshet");
  //                     this.ricoshets.push(new Ricoshet(this.ctx,temp,line.ang,des,this.color));
  //                     this.smokes.push(new Smoke(this.ctx,temp,0.02,0.3,0,0));
  //                 }
  //             }
  //         }
  //     });
  // }

  contact(s){
    console.log(''+s.id);
    if(dis2(s.pos,this.pos)<this.R){
        
        const lp=this.toLocal(math.matrix([s.pos[0],s.pos[1],1]));
        console.log("Near",lp);
        if (((lp[0]>=this.l_p[0][0])&(lp[0]<=this.l_p[2][0]))&
            ((lp[1]>=this.l_p[0][1])&(lp[1]<=this.l_p[2][1]))){
                console.log("Contact",lp);
                // s.flag=false;
                // this.entrancePoint(s.pos,s.start,s.type,s.r_destruction);
                const lsp=this.toLocal(math.matrix([s.start[0],s.start[1],1]));
                return [true,[lsp,lp]];
            }
    }
    return [false,null];
  }

  createMatrix() {
    const c = Math.cos(this.ang);
    const s = Math.sin(this.ang);
    return math.matrix([
      [c, -s, this.pos[0]],
      [s, c, this.pos[1]],
      [0, 0, 1]
    ]);
  }

  setArr(M,points) {
    // console.log("Matrix",M);
    // console.log("Points",points);
    return math.transpose(math.multiply(math.multiply(M, this.createMatrix()), math.transpose(math.matrix(points))))
    .toArray().map(item => [
      item[0],
      item[1]
    ]);
  }

  setP(point) {
    // console.log("Matrix",M);
    // console.log("Points",points);
    return math.multiply(this.createMatrix(), math.matrix([point[0],point[1],1])).toArray();
  }

  boxCover(trajectory){
      return this.lines.some(line=>{
          const temp=line.linesIntersection(trajectory);
          return temp && line.belongSegment(temp) && trajectory.belongSegment(temp);
      });
  }

  toLocal(p) {
      const invM = math.inv(this.createMatrix()); // Обратная матрица
      return math.multiply(invM, p).toArray(); // Матричное умножение
  }

  getReferencePoints(p){
        console.log(p);
        const lp=this.toLocal(math.matrix([p[0],p[1],1]))
        if ((lp[0]<=this.l_p[0][0])&(lp[0]<=this.l_p[2][0])&(lp[1]<=this.l_p[0][1])&(lp[1]<=this.l_p[2][1])){
            return [this.g_p[1],this.g_p[3],dis2(p,this.g_p[0])];
        }else if ((lp[0]>=this.l_p[0][0])&(lp[0]<=this.l_p[2][0])&(lp[1]<=this.l_p[0][1])&(lp[1]<=this.l_p[2][1])){
            return [this.g_p[0],this.g_p[1],tri_dis(p,this.g_p[0],this.g_p[1])];
        }else if ((lp[0]>=this.l_p[0][0])&(lp[0]>=this.l_p[2][0])&(lp[1]<=this.l_p[0][1])&(lp[1]<=this.l_p[2][1])){
            return [this.g_p[0],this.g_p[2],dis2(p,this.g_p[1])];
        }else if ((lp[0]>=this.l_p[0][0])&(lp[0]>=this.l_p[2][0])&(lp[1]>=this.l_p[0][1])&(lp[1]<=this.l_p[2][1])){
            return [this.g_p[1],this.g_p[2],tri_dis(p,this.g_p[1],this.g_p[2])];
        }else if ((lp[0]>=this.l_p[0][0])&(lp[0]>=this.l_p[2][0])&(lp[1]>=this.l_p[0][1])&(lp[1]>=this.l_p[2][1])){
            return [this.g_p[1],this.g_p[3],dis2(p,this.g_p[2])];
        }else if ((lp[0]>=this.l_p[0][0])&(lp[0]<=this.l_p[2][0])&(lp[1]>=this.l_p[0][1])&(lp[1]>=this.l_p[2][1])){
            return [this.g_p[2],this.g_p[3],tri_dis(p,this.g_p[2],this.g_p[3])];
        }else if ((lp[0]<=this.l_p[0][0])&(lp[0]<=this.l_p[2][0])&(lp[1]>=this.l_p[0][1])&(lp[1]>=this.l_p[2][1])){
            return [this.g_p[2],this.g_p[0],dis2(p,this.g_p[3])];
        }else if ((lp[0]<=this.l_p[0][0])&(lp[0]<=this.l_p[2][0])&(lp[1]>=this.l_p[0][1])&(lp[1]<=this.l_p[2][1])){
            return [this.g_p[3],this.g_p[0],tri_dis(p,this.g_p[3],this.g_p[0])];
        }
  }

  drawPolygon(points, strokeColor = 'rgb(194, 188, 184)', fillColor = null) {
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

  draw(M) {
    const points = this.setArr(M,this.l_p);

    this.drawPolygon(points, 'rgb(255,255,255)', 'rgb(194, 137, 13)');

    // this.lines.forEach(line=>{
    //   line.draw();
    // })
    
    // console.log('Box.draw: Completed');
  }
}