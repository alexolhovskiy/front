import { Map } from './map.js';
import { CENTER_H, CENTER_W } from './settings.js';
import * as math from 'mathjs';


export class Camera {
    constructor(ctx, textures) {
        this.ctx = ctx;
        this.scale=1;
        this.shift=[];
        this.textures = textures;
        this.map = new Map(ctx,2000,2000,textures,this);
        this.keys = { KeyU: false, KeyI: false};
    }

    setPlayers(playersData,socketId) {
        this.map.setPlayers(playersData,socketId);
    }

    setBullets(bulletsData){
        this.map.setBullets(bulletsData);
    }

    handleInput() {
        if (this.keys.KeyU) {
            console.log("U");
            if(this.scale<3){
                this.scale+=0.2;
            }
        }
        if (this.keys.KeyI) {
            if(this.scale>0.2){
                this.scale-=0.2;
            }
        }
    }

    createScaleMatrix() {
        return math.matrix([
        [this.scale, 0, 0],
        [0, this.scale, 0],
        [0, 0, 1]
        ]);
    }

    createShiftMatrix() {
        return math.matrix([
        [1, 0, this.shift[0]+CENTER_W],
        [0, 1, this.shift[1]+CENTER_H],
        [0, 0, 1]
        ]);
    }

    createMatrix() {
        return math.multiply(this.createScaleMatrix(),this.createShiftMatrix())
    }

    update() {
        this.map.update();
        this.handleInput();
    }

    draw(){
        this.map.draw(this.createMatrix())
    }

}