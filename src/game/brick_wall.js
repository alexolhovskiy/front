
import { CENTER_H, CENTER_W } from "./settings.js";
import {Line,getAng2,dis2,tri_dis} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import {Brick} from "./brick.js";
import * as math from 'mathjs';


export class BrickWall {
  constructor(ctx, x, y, a, b_w,b_h,cnt_w,cnt_h,map,shells,ricoshets,smokes,fires,missiles) {
    this.base=new Brick(ctx, x, y, a, b_w*cnt_w, b_h*cnt_h,map,shells,ricoshets,smokes,fires,missiles);

    this.pos=[x,y];
    this.ctx=ctx;
    
    this.brick_size=[b_w,b_h];

    this.map=map;

    this.smokes=smokes;
    this.ricoshets=ricoshets;
    this.fires=fires;
    this.shells=shells;
    this.missiles=missiles;

    this.rows=cnt_h;
    this.cols=cnt_w;

    this.color='rgb(123,45,189)';

    this.grid = [];
    for (let i = 0; i < this.rows; i++) {
        this.grid[i] = [];
        for (let j = 0; j < this.cols; j++) {
            this.grid[i][j] = [1,false];
        }
    }
    this.poly=[];
    this.boundaries = [];
    this.visited = new Set();
    this.sectors=[];

    this.getClasters();
  }

  findFragmentBoundaries(startRow,startCol) {
      console.log("findFragmentBoundaries",startRow,startCol);
      const boundaries = [];
      // const visited = new Set(); // Для отслеживания посещенных ячеек
      const directions = [
          [0, 1],  // Вправо
          [1, 0],  // Вниз
          [0, -1], // Влево
          [-1, 0]  // Вверх
      ];

      
      let currentRow = startRow;
      let currentCol = startCol;
      let direction = 0; // Начальное направление: вправо
      const startDirection=0;
      do {
         
          // Добавляем текущую точку в границы
          const key = `${currentCol},${currentRow}`;
          // if (!this.visited.has(key)) {
          console.log(boundaries.length);
          boundaries.push([currentCol,currentRow]);
          this.visited.add(key);
          // }

          //всегда пробуем повернуть против часовой стрелки
          if(direction>0){
            direction -=1;
          }else{
            direction=3;
          }

          // Проверяем следующую точку в текущем направлении
          let nextRow = currentRow + directions[direction][0];
          let nextCol = currentCol + directions[direction][1];
          // console.log(direction,nextCol,currentCol,nextRow,currentRow,this.cols,this.rows);
          if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
              direction = (direction + 1) % 4;
              nextRow = currentRow + directions[direction][0];
              nextCol = currentCol + directions[direction][1];
          }
              // Если следующая точка выходит за границы или мертва, поворачиваем по часовой стрелке
          if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
              direction = (direction + 1) % 4; // Поворот
              nextRow = currentRow + directions[direction][0];
              nextCol = currentCol + directions[direction][1];
          }
          if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
              direction = (direction + 1) % 4; // Поворот
              nextRow = currentRow + directions[direction][0];
              nextCol = currentCol + directions[direction][1];
          }

          // if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
          //     direction = (direction + 1) % 4; // Поворот
          //     nextRow = currentRow + directions[direction][0];
          //     nextCol = currentCol + directions[direction][1];
          // }

          // if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
          //     direction = (direction + 1) % 4; // Поворот
          //     nextRow = currentRow + directions[direction][0];
          //     nextCol = currentCol + directions[direction][1];
          // }
          if (nextCol >= this.cols|| nextRow >= this.rows ||nextCol <0|| nextRow <0 || this.grid[nextRow][nextCol][0] <= 0){
              nextRow=startRow;
              nextCol=startCol;
          }   

          // Переходим к следующей точке
          currentRow = nextRow;
          currentCol = nextCol;
        
          // Если обошли полный круг и вернулись к началу, завершаем
          if(currentRow === startRow){
            console.log(currentRow,startRow);
            if(currentCol === startCol){
              console.log(currentCol,startCol)
            }
          }
          console.log(currentRow,startRow,currentCol,startCol);
      } while (!(currentRow === startRow && currentCol === startCol));

      return boundaries;
  }

  getClasters(){
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            if(this.grid[i][j][0]>0){
              this.grid[i][j][1]=false;
            }
        }
    }

    var arr_rows=[];
    var arr_cols=[];
    for (let i = 0; i < this.rows; i++) {
        var temp=[0,this.cols,i];
        var j=0;
        while(j<this.cols){
          while(j<this.cols && this.grid[i][j][0]<=0){j++;}
          temp[0]=j;
          while(j<this.cols && this.grid[i][j][0]>0){
            temp[1]=j;
            j++;
          }
          arr_rows.push([temp[0],temp[1],i]);
        }
    }

    console.log("Rows",arr_rows);

    var clasters = [];
    if (arr_rows.length > 0) {
        var start = arr_rows[0][0];
        var end = arr_rows[0][1];
        clasters.push([]);
        clasters[clasters.length - 1].push([arr_rows[0][2], start, end]);
        // for (let i = 1; i < this.rows; i++) {
        arr_rows.forEach(item=>{
            if (item[0] == start && item[1] == end) {
                clasters[clasters.length - 1].push([item[2], start, end]);
            } else {
                start = item[0];
                end = item[1];
                clasters.push([]);
                clasters[clasters.length - 1].push([item[2], start, end]);
            }
        });
        //     if (arr_rows[i][0] == start && arr_rows[i][1] == end) {
        //         clasters[clasters.length - 1].push([i, start, end]);
        //     } else {
        //         start = arr_rows[i][0];
        //         end = arr_rows[i][1];
        //         clasters.push([]);
        //         clasters[clasters.length - 1].push([i, start, end]);
        //     }
        // }
    }
    console.log("Clasters", clasters);
    var n=0;
    this.poly = [];
    clasters.forEach(item => {
        const s_row = item[0][0];
        const e_row = item[item.length - 1][0];
        const s_col = item[0][1];
        const e_col = item[0][2];

        this.poly.push([
            [
                [s_col * this.brick_size[0], s_row * this.brick_size[1], 1],
                [e_col * this.brick_size[0]+this.brick_size[0], s_row * this.brick_size[1], 1],
                [e_col * this.brick_size[0]+this.brick_size[0], e_row * this.brick_size[1]+this.brick_size[1], 1],
                [s_col * this.brick_size[0], e_row * this.brick_size[1]+this.brick_size[1], 1]
            ],
            // 'rgb(' + Math.random() * 250 + ',' + Math.random() * 250 + ',' + Math.random() * 250 + ')'
            'rgb(0,255,2)'
        ]);

        for (let i = s_row; i <=e_row; i++) {
            for (let j = s_col; j <=e_col; j++) {
                this.grid[i][j][1] = true;
            }
        }
    });

    console.log(this.grid);
    console.log("Poly",this.poly);



    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            if(this.grid[i][j][0]>0 && !this.grid[i][j][1]){
              console.log("Free brick",this.grid[i][j]);
              this.poly.push([
                [
                  [j*this.brick_size[0],i*this.brick_size[1],1],
                  [(j+1)*this.brick_size[0],i*this.brick_size[1],1],
                  [(j+1)*this.brick_size[0],(i+1)*this.brick_size[1],1],
                  [j*this.brick_size[0],(i+1)*this.brick_size[1],1]
                ],
                'rgb(0,0,255)'
              ]);
            }
        }
    }
    // let rows_cnt=[];
    // this.grid.forEach(item=>{
    //   rows_cnt.push(item.filter(element=>element[0]>=0).length);
    // })

    // Начинаем с верхнего левого угла и ищем первую живую ячейку
    
    // for (let i = 0; i < this.rows; i++) {
    //     for (let j = 0; j < this.cols; j++) {
    //         const key=`${i},${j}`;
    //         if ((this.grid[i][j][0] > 0)&&
    //           ((i===0)||(j===0)||(i===this.rows-1)||(j===this.cols-1)||(i>0 && this.grid[i-1][j][0]<=0)||
    //           (i<this.rows-1 && this.grid[i+1][j][0]<=0)||(j>0 && this.grid[i][j-1][0]<=0)||
    //           (j<this.cols-1 && this.grid[i][j+1][0]<=0))&&
    //           !this.visited.has(key)
    //         ) {
    //             const startRow = i;
    //             const startCol = j;
    //             this.boundaries.push(this.findFragmentBoundaries(startRow,startCol));
    //         }
    //     }
    // }

    // this.visited.clear();
    // this.boundaries = [];
    // console.log("Grid before boundary search:", JSON.stringify(this.grid));
    // for (let i = 0; i < this.rows; i++) {
    //     for (let j = 0; j < this.cols; j++) {
    //         const key = `${j},${i}`; // Сохраняем твой порядок [x, y]
    //         if (
    //             (this.grid[i][j][0] > 0) &&
    //             (
    //                 (i === 0) || (j === 0) || (i === this.rows - 1) || (j === this.cols - 1) ||
    //                 (i > 0 && this.grid[i-1][j][0] <= 0) ||
    //                 (i < this.rows - 1 && this.grid[i+1][j][0] <= 0) ||
    //                 (j > 0 && this.grid[i][j-1][0] <= 0) ||
    //                 (j < this.cols - 1 && this.grid[i][j+1][0] <= 0)
    //             ) &&
    //             !this.visited.has(key)
    //         ) {
    //             const startRow = i;
    //             const startCol = j;
    //             console.log(`Starting boundary search at [${startRow}, ${startCol}]`);
    //             const newBoundaries = this.findFragmentBoundaries(startRow, startCol);
    //             if (newBoundaries && Array.isArray(newBoundaries) && newBoundaries.length > 0 && newBoundaries.length <= this.rows * this.cols) {
    //                 this.boundaries.push(newBoundaries);
    //             } else {
    //                 console.warn(`Skipping invalid boundaries from [${startRow}, ${startCol}]`);
    //             }
    //         }
    //     }
    // }
    // console.log("Boundaries after search:", JSON.stringify(this.boundaries));

    this.visited.clear();
    this.boundaries=[];
    this.sectors=[];
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            const key=`${j},${i}`;

            if ((this.grid[i][j][0] > 0) &&
                  (
                      (i === 0) || (j === 0) || (i === this.rows - 1) || (j === this.cols - 1) ||
                      (i > 0 && this.grid[i-1][j][0] <= 0) ||
                      (i < this.rows - 1 && this.grid[i+1][j][0] <= 0) ||
                      (j > 0 && this.grid[i][j-1][0] <= 0) ||
                      (j < this.cols - 1 && this.grid[i][j+1][0] <= 0)
                  ) &&
                  !this.visited.has(key)
              ) {
                  const startRow = i;
                  const startCol = j;
                  const temp=this.findFragmentBoundaries(startRow, startCol);
                  this.boundaries.push(temp);
                  let points=[];
                  temp.forEach(item=>{
                      points.push([item[0]*this.brick_size[0],item[1]*this.brick_size[1],1]);
                      points.push([item[0]*this.brick_size[0]+this.brick_size[0],item[1]*this.brick_size[1],1]);
                      points.push([item[0]*this.brick_size[0]+this.brick_size[0],item[1]*this.brick_size[1]+this.brick_size[1],1]);
                      points.push([item[0]*this.brick_size[0],item[1]*this.brick_size[1]+this.brick_size[1],1]);
                  });
                  // this.sectors.push(this.optimizeConvexHull(points));
                  this.sectors.push(this.getSector(this.optimizeConvexHull(points)));
            }
        }
    }

    // if (startRow >= this.rows || startCol >= this.cols) return boundaries; // Нет живых ячеек


    // const boundaries = this.findFragmentBoundaries(startRow,startCol);
    // let temp=[];
    // for(let i=0;i<this.rows;i++){
    //   arr=boundaries.filter(item=>item[1]==i).sort((a,b)=>a[0]-b[0]);
    //   temp.push([i,arr[0],arr[arr.length-1]]);
    // }

    // this.boundaries.push(temp,boundaries);

    // temp.forEach(item=>{
    //   if(item[2]<this.cols){

    //   }
    // })
  }

  sectorCover(trajectory){
      // trajectory.draw();
      return this.sectors.some(sector=>{
          return sector[1].some(line=>{
              const temp=line.linesIntersection(trajectory);
              return temp && line.belongSegment(temp) && trajectory.belongSegment(temp);
          });
      });
  }

  // sectorCover(trajectory) {
  //     trajectory.draw();
  //     console.log("Checking sector cover with trajectory:", trajectory);
  //     const result = this.sectors.some(sector => {
  //         console.log("Checking sector:", sector);
  //         const lines = sector[1]; // Массив линий сектора
  //         const sectorResult = lines.some(line => {
  //             console.log("Checking line:", line);
  //             const temp = line.linesIntersection(trajectory);
  //             console.log("Intersection point:", temp);
  //             const isIntersectionValid = temp && line.belongSegment(temp) && trajectory.belongSegment(temp);
  //             console.log("Intersection valid:", isIntersectionValid);
  //             return isIntersectionValid;
  //         });
  //         console.log("Sector intersection result:", sectorResult);
  //         return sectorResult;
  //     });
  //     console.log("Final sector cover result:", result);
  //     return result; // true, если есть пересечение
  // }

  getSector(sector){
      const g_p=this.base.setArr(math.matrix([[1,0,0],[0,1,0],[0,0,1]]),sector);
      let lines=[];
      for(var i=0;i<g_p.length;i++){
          if(i<g_p.length-1){
              lines.push(new Line(this.ctx,g_p[i],g_p[i+1],'rgb(1,1,1)'));
          }else{
              lines.push(new Line(this.ctx,g_p[i],g_p[0],'rgb(1,1,1)'));
          }        
      }
      return [sector,lines];
  }

  optimizeConvexHull(boundaries) {
      if (!boundaries || boundaries.length < 3) {
          console.warn("Not enough points for convex hull:", boundaries);
          return boundaries;
      }

      // Шаг 1: Находим начальную точку
      let startPoint = boundaries[0];
      for (let i = 1; i < boundaries.length; i++) {
          const [col, row] = boundaries[i];
          const [startCol, startRow] = startPoint;
          if (row < startRow || (row === startRow && col < startCol)) {
              startPoint = boundaries[i];
          }
      }
      console.log("Start point:", startPoint);

      // Шаг 2: Строим оболочку
      const hull = [startPoint];
      let currentPoint = startPoint;
      let visited = new Set([`${currentPoint[0]},${currentPoint[1]}`]);

      while (true) {
          let nextPoint = boundaries[0];
          let maxLeftTurn = -Infinity;

          for (let i = 0; i < boundaries.length; i++) {
              if (`${boundaries[i][0]},${boundaries[i][1]}` === `${currentPoint[0]},${currentPoint[1]}`) continue;

              const val = this.orientation(currentPoint, boundaries[i], nextPoint);
              if (val > maxLeftTurn) {
                  maxLeftTurn = val;
                  nextPoint = boundaries[i];
              } else if (val === maxLeftTurn && this.distance(currentPoint, boundaries[i]) < this.distance(currentPoint, nextPoint)) {
                  nextPoint = boundaries[i]; // Ближайшая при коллинеарности
              }
          }

          const nextKey = `${nextPoint[0]},${nextPoint[1]}`;
          if (visited.has(nextKey) && nextPoint !== startPoint) {
              break; // Замыкаем, если вернулись к началу (кроме первой итерации)
          }
          visited.add(nextKey);
          hull.push(nextPoint);
          currentPoint = nextPoint;

          if (hull.length > boundaries.length) {
              console.warn("Possible infinite loop, breaking");
              break;
          }
      }

      if (hull.length > 1 && `${hull[0][0]},${hull[0][1]}` !== `${hull[hull.length - 1][0]},${hull[hull.length - 1][1]}`) {
          hull.push(hull[0]); // Явно замыкаем
      }

      console.log("Optimized convex hull (Jarvis):", hull);
      return hull;
  }

  orientation(p, q, r) {
      const [col1, row1] = p;
      const [col2, row2] = q;
      const [col3, row3] = r;
      return (row2 - row1) * (col3 - col2) - (col2 - col1) * (row3 - row2);
  }

  distance(p, q) {
      const [col1, row1] = p;
      const [col2, row2] = q;
      return (col2 - col1) ** 2 + (row2 - row1) ** 2;
  }

  contact(){
    this.shells.forEach(s=>{
      const temp=this.base.contact(s);
      if(temp[0]){
        
        let sp=temp[1][0];
        let lp=temp[1][1];
        sp=[sp[0]/this.brick_size[0],sp[1]/this.brick_size[1]];
        lp=[lp[0]/this.brick_size[0],lp[1]/this.brick_size[1]];
        const trajectory=new Line(this.ctx,sp,lp);
        console.log("Contact",sp,lp);
        if(Math.abs(sp[0]-lp[0])>Math.abs(sp[1]-lp[1])){
          if(sp[0]<0){
            console.log("Case1");
            for(let i=0;i<this.cols;i++){
              const p=trajectory.getY(i);
              if(p>0 && p<this.rows){
                if(this.grid[Math.floor(p)][i][0]>0){
                  this.grid[Math.floor(p)][i][0]=0;
                  s.flag=false;
                  this.getClasters();
                  console.log("Ricoshet");
                  const point=this.base.setP([i*this.brick_size[0],Math.floor(p)*this.brick_size[1]]);
                  console.log(point);
                  this.ricoshets.push(new Ricoshet(this.ctx,point,this.base.lines[3].ang,s.r_destruction,this.color));
                  this.smokes.push(new Smoke(this.ctx,point,0.02,0.3,0,0));
                  return;
                }
              }
            }
          }else{
            console.log("Case2");
            for(let i=this.cols-1;i>=0;i--){
              const p=trajectory.getY(i);
              if(p>0 && p<this.rows){
                if(this.grid[Math.floor(p)][i][0]>0){
                  this.grid[Math.floor(p)][i][0]=0;
                  s.flag=false;
                  this.getClasters();
                  console.log("Ricoshet");
                  const point=this.base.setP([i*this.brick_size[0],Math.floor(p)*this.brick_size[1]]);
                  console.log(point);
                  this.ricoshets.push(new Ricoshet(this.ctx,point,this.base.lines[1].ang,s.r_destruction,this.color));
                  this.smokes.push(new Smoke(this.ctx,point,0.02,0.3,0,0));
                  return;
                }
              }
            }
          }
        }else{
          if(sp[1]<0){
            console.log("Case3");
            for(let i=0;i<this.rows;i++){
              const p=trajectory.getX(i);
              console.log(p);
              if(p>0 && p<this.cols){
                console.log(Math.floor(p),i,this.grid[i][Math.floor(p)]);
                if(this.grid[i][Math.floor(p)][0]>0){
                  this.grid[i][Math.floor(p)][0]=0;
                  s.flag=false;
                  this.getClasters();
                  console.log("Ricoshet");
                  const point=this.base.setP([Math.floor(p)*this.brick_size[0],i*this.brick_size[1]]);
                  console.log(point);
                  this.ricoshets.push(new Ricoshet(this.ctx,point,this.base.lines[0].ang,s.r_destruction,this.color));
                  this.smokes.push(new Smoke(this.ctx,point,0.02,0.3,0,0));
                  return;
                }
              }
            }
          }else{
            console.log("Case4");
            for(let i=this.rows-1;i>=0;i--){
              const p=trajectory.getX(i);
              if(p>0 && p<this.cols){
                if(this.grid[i][Math.floor(p)][0]>0){
                  this.grid[i][Math.floor(p)][0]=0;
                  s.flag=false;
                  this.getClasters();
                  console.log("Ricoshet");
                  const point=this.base.setP([Math.floor(p)*this.brick_size[0],i*this.brick_size[1]]);
                  console.log(point);
                  this.ricoshets.push(new Ricoshet(this.ctx,point,this.base.lines[2].ang,s.r_destruction,this.color));
                  this.smokes.push(new Smoke(this.ctx,point,0.02,0.3,0,0));
                  return;
                }
              }
            }
          }
        }
      }
    });
  }

  draw(M){
    this.base.draw(M);
    // console.log(this.poly);
    this.poly.forEach(item=>{     
      this.base.drawPolygon(this.base.setArr(M,item[0]),item[1], item[1]);
    });

    // this.boundaries.forEach(item=> {
    //     let points=[];
    //     item.forEach(point=>{
    //       points.push([point[0]*this.brick_size[0],point[1]*this.brick_size[1],1]);
    //     })

    //     const temp=this.base.setArr(M,points);

    //     this.ctx.beginPath();
    //     this.ctx.strokeStyle = 'red';
    //     this.ctx.moveTo(temp[0][0], temp[0][1]);
    //     for (let i = 1; i < temp.length; i++) {
    //         this.ctx.lineTo(temp[i][0], temp[i][1]);
    //     }
    //     this.ctx.closePath();
    //     this.ctx.stroke();
    // });


    // this.sectors.forEach(item=>{
    //     const temp=this.base.setArr(M,item[0]);

    //     this.ctx.beginPath();
    //     this.ctx.strokeStyle = 'blue';
    //     this.ctx.lineWidth=3;
    //     this.ctx.moveTo(temp[0][0], temp[0][1]);
    //     for (let i = 1; i < temp.length; i++) {
    //         this.ctx.lineTo(temp[i][0], temp[i][1]);
    //     }
    //     this.ctx.closePath();
    //     this.ctx.stroke();
    // });

    // this.sectors.forEach(item=>{
    //   item[1].forEach(line=>{
    //     line.draw();
    //   });
    // });
  }
}