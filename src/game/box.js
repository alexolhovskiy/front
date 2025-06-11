
import { CENTER_H, CENTER_W } from "./settings.js";
import {Line,getAng2,dis2,tri_dis} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import * as math from 'mathjs';


export class Box {
  static id=0;
  static getId(){
      return this.id++;
  }
  constructor(ctx, x, y, a, w, h, textures,map,shells,ricoshets,smokes,fires,missiles) {
    this.id=Box.getId();
    this.ctx = ctx;
    this.R=Math.sqrt(w*w+h*h);
    this.map=map;
    this.pos = [x, y];
    this.ang = a;
    this.size = [w, h];
    this.color='rgb(221, 101, 21)';
    this.l_p = [[-w / 2, -h / 2, 1], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1]];
    this.g_p=this.setArr(math.matrix([[1,0,0],[0,1,0],[0,0,1]]));
    this.lines = [];
    for(var i=0;i<this.g_p.length;i++){
        if(i<this.g_p.length-1){
            this.lines.push(new Line(this.ctx,this.g_p[i],this.g_p[i+1]));
        }else{
            this.lines.push(new Line(this.ctx,this.g_p[i],this.g_p[0]));
        }        
    }
    
    if(this.id==1){
      this.lines.forEach(item=>console.log(item));
    }

    this.textures = textures;
    this.smokes=smokes;
    this.ricoshets=ricoshets;
    this.fires=fires;
    this.shells=shells;
    this.missiles=missiles;
    this.rotatedTextures = {};
    this.lastAng = null;
    this.coef = 1; // Как в Pygame, уточни значение
    this.loadTexture('house', textures['house']);
    console.log('Box: Initialized');
  }

  boxCover(trajectory){
      return this.lines.some(line=>{
          const temp=line.linesIntersection(trajectory);
          return temp && line.belongSegment(temp) && trajectory.belongSegment(temp);
      });
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

  entrancePoint(e_p,s_p,s_type,des){
      const trajectory=new Line(this.ctx,s_p,e_p);
      // trajectory.draw();
      this.lines.forEach(line=>{
          const temp=line.linesIntersection(trajectory);
          if(temp){
              console.log("Temp",temp);
              if(line.belongSegment(temp)&trajectory.belongSegment(temp)){
                  console.log('belong');
                  if(s_type=='missile'){
                      // this.explosion(temp,line.ang,des)
                  }else{
                      console.log("Ricoshet");
                      this.ricoshets.push(new Ricoshet(this.ctx,temp,line.ang,des,this.color));
                      this.smokes.push(new Smoke(this.ctx,temp,0.02,0.3,0,0));
                  }
              }
          }
      });
  }

  toLocal(p) {
      const invM = math.inv(this.createMatrix()); // Обратная матрица
      return math.multiply(invM, p).toArray(); // Матричное умножение
  }

  contact(){
    this.shells.forEach(s=>{
      // console.log(''+s.id);
      if(dis2(s.pos,this.pos)<this.R){
          console.log("Near");
          const lp=this.toLocal(math.matrix([s.pos[0],s.pos[1],1]));
          if (((lp[0]>=this.l_p[0][0])&(lp[0]<=this.l_p[2][0]))&
              ((lp[1]>=this.l_p[0][1])&(lp[1]<=this.l_p[2][1]))){
                  console.log("Contact",lp);
                  s.flag=false;
                  this.entrancePoint(s.pos,s.start,s.type,s.r_destruction);
              }
      }
    });
  }
        
  loadTexture(url, texture) {
    const cropData = {
        "house": [440, 80, 990, 990]
    };

    const [x, y, w, h] = cropData[url] || [0, 0, texture.width, texture.height];

    // Вырезаем фрагмент
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    cropCanvas.width = w;
    cropCanvas.height = h;
    cropCtx.drawImage(texture, x, y, w, h, 0, 0, w, h);
    this.rotatedTextures[url] = { croped: cropCanvas };

    this.updateTexture(url);
    }

  updateTexture(url) {
    const cropCanvas = this.rotatedTextures[url].croped;
    // Масштабируем до размера коробки
    const targetW = this.size[0] * this.coef;
    const targetH = this.size[1] * this.coef;
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = targetW;
    scaledCanvas.height = targetH;
    scaledCanvas.getContext('2d').drawImage(cropCanvas, 0, 0, cropCanvas.width, cropCanvas.height, 0, 0, targetW, targetH);

    
    const sizeW = scaledCanvas.width;
    const sizeH = scaledCanvas.height;

    // Для поворота: холст увеличим до диагонали
    const diag = Math.sqrt(sizeW * sizeW + sizeH * sizeH);
    const rotatedCanvas = document.createElement('canvas');
    rotatedCanvas.width = diag;
    rotatedCanvas.height = diag;

    const rotatedCtx = rotatedCanvas.getContext('2d');
    rotatedCtx.translate(diag / 2, diag / 2);      // Центр
    rotatedCtx.rotate(this.ang);                   // Поворот
    rotatedCtx.translate(-sizeW / 2, -sizeH / 2);   // Назад к левому верхнему
    rotatedCtx.drawImage(scaledCanvas, 0, 0);

    this.rotatedTextures[url].rotated = rotatedCanvas;
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

  setArr(M) {
    return math.transpose(math.multiply(math.multiply(M, this.createMatrix()), math.transpose(math.matrix(this.l_p))))
    .toArray().map(item => [
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

  drawTexturedPolygon(points, textureUrl) {
    const texture = this.rotatedTextures[textureUrl]?.rotated;
    if (!texture) return;

    const texSizeW = this.size[0] * this.coef;
    const texSizeH = this.size[1] * this.coef;

    this.ctx.save();

    // Клип по форме
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.closePath();
    this.ctx.clip();

    // Центр многоугольника
    const centerX = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p[1], 0) / points.length;

    // Центр rotatedCanvas — это diag/2, diag/2
    const diag = texture.width; // т.к. width === height === diag
    const dx = diag / 2 - texSizeW / 2;
    const dy = diag / 2 - texSizeH / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.drawImage(texture, -texSizeW / 2 - dx, -texSizeH / 2 - dy);

    this.ctx.restore();
  }

//   drawTexturedPolygon(points, textureUrl) {
//     this.ctx.save();
//     this.ctx.beginPath();
//     this.ctx.moveTo(points[0][0], points[0][1]);
//     for (let i = 1; i < points.length; i++) {
//       this.ctx.lineTo(points[i][0], points[i][1]);
//     }
//     this.ctx.closePath();
//     this.ctx.clip();
    
//     const texture = this.rotatedTextures[textureUrl].rotated;
//     if (texture) {
//       const minX = Math.min(...points.map(p => p[0]));
//       const minY = Math.min(...points.map(p => p[1]));
//       const maxX = Math.max(...points.map(p => p[0]));
//       const maxY = Math.max(...points.map(p => p[1]));
//       const width = maxX - minX;
//       const height = maxY - minY;
      
//       this.ctx.drawImage(texture, minX, minY, texture.width, texture.height);
//     }
    
//     this.ctx.restore();
//   }

  draw(M) {
    const points = this.setArr(M);
    
    if (this.coef!==this.map.cam.scale && this.textures['house']) {
      this.coef=this.map.cam.scale;
      this.updateTexture('house', this.rotatedTextures['house'].scaled);      
    }

    this.drawPolygon(points, 'rgb(194, 137, 13)', 'rgb(194, 137, 13)');
    
    if (this.textures['house']) {
      this.drawTexturedPolygon(points, 'house');
    } else {
      this.drawPolygon(points, 'rgb(194, 137, 13)', 'rgb(194, 137, 13)');
    }

    // this.lines.forEach(line=>{
    //   line.draw();
    // })
    
    // console.log('Box.draw: Completed');
  }
}