import * as math from 'mathjs';


export class Smoke{
    constructor(ctx,p,d_s,r_s,ang=0,speed=0,r=100,g=100,b=100){
        this.ctx=ctx;
        this.pos=[p[0],p[1],1];

        this.r=r;
        this.g=g;
        this.b=b; 
        this.dens=0.8;//начальная плотность(начальная непрозрачность)
        
        this.R=1;//начальный радиус
       
        this.d_step=d_s;//шаг разряжения
        this.r_step=r_s;//шаг расширения
        
        this.ang=ang;
        this.speed=speed;
    }

    // # def moveEx(this):
    // #     this.o=(this.o[0]+this.dir[0]*this.speed,this.o[1]+this.dir[1]*this.speed,1)

    move(){
        // if this.dir!=0:
        //     this.o=(this.o[0]+this.dir[0]*this.speed,this.o[1]+this.dir[1]*this.speed,1)
        // # if this.speed>0:
        // #     this.moveEx()
        this.dens-=this.d_step;
        this.R+=this.r_step;
    }
    
    setP(M,v) {
        const pos = math.multiply(M, v).toArray();
        return [pos[0], pos[1]];
    }

    draw(M){
        this.move();
        const [x,y]=this.setP(M,math.matrix([this.pos[0],this.pos[1],1]));
        this.ctx.fillStyle = 'rgba('+this.r+','+this.g+','+this.b+','+this.dens+')';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.R, 0, Math.PI * 2);
        this.ctx.fill();
    }
}