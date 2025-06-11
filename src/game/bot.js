import {Shell} from './shell.js';
import {Line,getAng2,dis2} from './l_m.js';
import { Ricoshet } from './ricoshet.js';
import { Smoke } from "./smoke.js";
import {WIDTH,HEIGHT} from "./settings.js";
import {Unit} from "./unit.js";
import * as math from 'mathjs';


export class Bot extends Unit{
    constructor(ctx,x,y,a,r,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls){
        super(ctx,x,y,a,r,c,map,shells,ricoshets,smokes,fires,missiles,borders,units,boxes,walls)

    }

  
}