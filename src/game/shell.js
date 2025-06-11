import * as math from 'mathjs';

export class Shell{
    static id=0;
    static getId(){
        return this.id++;
    }


    constructor(ctx,x,y,ang,r,c,borders,units,boxes,type='shell'){
        this.id=Shell.getId();
        
        this.start=[x,y];
        this.pos=[x,y];
        this.ctx=ctx;
        this.size=[r];
        this.ang=ang;
        this.color=c;
        this.borders=borders;
        this.units=units;
        this.boxes=boxes;
        this.speed=10;
        this.r_destruction=2;
        this.type=type;
        this.l_p=[];
        for (var i=0;i<Math.PI*2;i+=Math.PI/6){
            this.l_p.push([r*Math.cos(i),r*Math.sin(i),1])
        }
        this.flag=true;
    }

    not_in_contact(){
        return true;
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

    move(){
        if((this.borders[0]<this.pos[0])&(this.pos[0]<this.borders[2])&(this.borders[1]<this.pos[1])&
            (this.pos[1]<this.borders[3])&this.not_in_contact()){
            this.pos[0]+=Math.cos(this.ang)*this.speed;
            this.pos[1]+=Math.sin(this.ang)*this.speed;
        }else{
            this.flag=false;
        }
    }

    setArr(M) {
        return math.transpose(math.multiply(math.multiply(M,this.createMatrix()), math.transpose(math.matrix(this.l_p)))).toArray().map(item => [
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
        this.move();
        const points = this.setArr(M);
        this.drawPolygon(points, this.color, this.color);

    }

}