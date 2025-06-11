import * as math from 'mathjs';

export function getAng2(p1,p2){
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}

export function dis2(p1,p2){
    const v=[p2[0]-p1[0],p2[1]-p1[1]];
    return Math.hypot(v[0],v[1]);
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function tri_dis(p1,p2,p3){//расстояние до прямой по 3 сторонам образованного треугольника
    const a=dis2(p1,p2)
    const b=dis2(p1,p3)
    const c=dis2(p2,p3)
    return Math.sqrt(b*b-((-a*a+b*b+c*c)/(2*c))**2)
}


export class Line{
    constructor(ctx,p1,p2,color='rgb(255,0,0)',width=1){
        this.ctx=ctx;
        this.v = [p2[0] - p1[0],p2[1] - p1[1]];
        this.r=Math.hypot(this.v[0], this.v[1]);
        this.s=[this.v[0]/this.r,this.v[1]/this.r];
        this.p1=[p1[0],p1[1]];
        this.p2=[p2[0],p2[1]];
        this.ang=getAng2(p1,p2);
        this.color=color;
        this.width=width;
    }


    belongSegment(p){
        const v=[p[0]-this.p1[0],p[1]-this.p1[1]];
        const r=Math.hypot(v[0],v[1]);
        const dot=this.v[0]*v[0]+this.v[1]*v[1];
        return (dot>0)&(r<=this.r);
    }

    linesIntersection(l){
        const d=this.v[1]*l.v[0]-this.v[0]*l.v[1];
        if (d==0){
            return null;
        }
        const t=(l.v[1]*(this.p1[0]-l.p1[0])+l.v[0]*(l.p1[1]-this.p1[1]))/d;
        return [this.v[0]*t+this.p1[0],this.v[1]*t+this.p1[1],1];
    }

    linesIntersection2(b,p){
        const d=this.v[1]*b[0]-this.v[0]*b[1]
        if (d==0){
            return null;
        }
        const t=(b[1]*(this.p1[0]-p[0])+b[0]*(p[1]-this.p1[1]))/d;
        return [this.v[0]*t+this.p1[0],this.v[1]*t+this.p1[1],1]
    }

    getX(y){
        if (this.v[1] == 0){
            //  Горизонтальная линия (ay=0): x не определён однозначно
            //  Возвращаем x из p1, если y совпадает с y1
            if (y == this.p1[1]){
                return this.p1[0];
            }
        }
        return (this.v[0] * y - this.v[0] * this.p1[1] + this.v[1] * this.p1[0])/this.v[1];
    }

    getY(x){
        if (this.v[0] == 0){
            // Вертикальная линия (ax=0): y не определён однозначно
            // Возвращаем y из p1, если x совпадает с x1
            if (x == this.p1[0]){
                return this.p1[1];
            }
        }
        return (this.v[1] * x - this.v[1] * this.p1[0] + this.v[0] * this.p1[1])/this.v[0];
    }
    

    intersectionSegments(l){
        p = this.linesIntersection(l)
        if(this.belongSegment(p)&belongSegment(p)){
            return p;
        }
        return [0,0];   
    }     

    getRight(){
        let bx=0,by=0;
        if (this.v[0]!=0){
            by=1;
            bx=-this.v[1]*by/this.v[0];
        }else{
            bx=1;
            by=-this.v[0]*bx/this.v[1];
        }
        return [bx,by];
    }

    getRightPoint(p){
        return this.linesIntersection2(this.getRight(),p);
    }

    getDisToRP(p){
        const o=this.getRightPoint(p);
        const v=[p[0]-o[0],p[1]-o[1]];
        return Math.hypot(v[0],v[1]);
    }


    circleIntersection(o,r){
        const a=this.v[0]*this.v[0]+this.v[1]*this.v[1];
        
        const b=2*(this.v[0]*(this.p1[0]-o[0])+this.v[1]*(this.p1[1]-o[1]));
        const c=(this.p1[0]-o[0])*(this.p1[0]-o[0])+(this.p1[1]-o[1])*(this.p1[1]-o[1])-r*r;

        const d=b*b-4*a*c;
        if (d<0){
            return 0;
        }else if (d==0){
            return 0;
        }else{
            const t1=(-b-Math.sqrt(d))/(2*a);
            const t2=(-b+Math.sqrt(d))/(2*a);
            return [[this.p1[0]+this.v[0]*t1,this.p1[1]+this.v[1]*t1,1],[this.p1[0]+this.v[0]*t2,this.p1[1]+this.v[1]*t2,1]];
        }
    }


    draw(){
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1[0], this.p1[1]);
        this.ctx.lineTo(this.p2[0], this.p2[1]);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.width;
        this.ctx.stroke();
    } 


}