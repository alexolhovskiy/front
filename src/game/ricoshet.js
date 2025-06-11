import { randInt } from "./l_m.js";
import * as math from 'mathjs';


export class Ricoshet{
    constructor(ctx,p,a,des,c){
        this.ctx=ctx;
        this.color=c;
        this.des=des;//уровень рикошета - его сила
        this.pos=[p[0],p[1]];//точка контакта
        this.r=4;
        var a_e=a-((20*Math.PI)/180);//а - угол поверхности
        var a_s=a-((160*Math.PI)/180);
        this.dens=250;
        // print(a,a_s,a_e)
        this.elements=[];
        if (a_s<0){
            a_e+=Math.PI*2;
            a_s+=Math.PI*2;
        }
        const num=randInt(this.des,5);
        for(var i=0;i<num;i++){
            var chunck=[];
            const chunck_points=randInt(3,6);
            const chunck_size=randInt(2,4);
            for(var j=0;j<chunck_points;j++){
                const point_ang=Math.random()*Math.PI*2;
                chunck.push([Math.cos(point_ang)*chunck_size,Math.sin(point_ang)*chunck_size,1]);
            }
            console.log(chunck);
            this.elements.push([a_s+Math.random()*(a_e-a_s),1,chunck]);
        }
        this.v=1
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

    move(){
        this.dens-=10;
        // this.elements.forEach(item=>{
        //     item[1] + this.v;
        // })
        this.elements = this.elements.map(item => [item[0], item[1] + this.v,item[2]]);
    }

    setP(M,v) {
        console.log(M,v);
        const pos = math.multiply(M, v).toArray();
        return [pos[0], pos[1]];
    }

    setChunck(ang,pos,chunck) {
        console.log(chunck);
        return math.transpose(math.multiply(this.createMatrix(ang,pos), math.transpose(math.matrix(chunck)))).toArray().map(item => [
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

    draw(M){
        this.move()
        const [x,y]=this.setP(M,math.matrix([this.pos[0],this.pos[1],1]));
        this.elements.forEach(item=>{
            this.drawPolygon(this.setChunck(item[0],[x+Math.cos(item[0])*item[1], y+Math.sin(item[0])*item[1]],item[2]),this.color,this.color);
        // this.elements.forEach(item=>{
        //     this.ctx.fillStyle = 'rgb(200,200,200)';
        //     this.ctx.beginPath();
        //     this.ctx.arc(x+Math.cos(item[0])*item[1], y+Math.sin(item[0])*item[1], this.r, 0, Math.PI * 2);
        //     this.ctx.fill();
        });
    }
}