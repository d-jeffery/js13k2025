import {vec2} from "littlejsengine";
import {WindowSill} from "./sprites.ts";

export class Building {

    constructor() {
        const posx = 5
        const posy = 6;
        const width = 2.5
        const height = 0.5

        new WindowSill(vec2(-posx, -posy), vec2(width, height));
        new WindowSill(vec2(posx, -posy), vec2(width, height));

        const levels = [0,1,0,1,1,1];
        for (const [index, level] of levels.entries()) {
            windowConfigs[level](posx, posy*index, width, height);
        }
    }
}

interface windowConfigOptions {
    [key: number]: (posx: number, posy: number, width:number, height:number) => void
}

const windowConfigs: windowConfigOptions = {
    0: (posx: number, posy: number, width:number, height:number) => {
        new WindowSill(vec2(-posx+width, posy), vec2(width, height));
        new WindowSill(vec2(posx-width, posy), vec2(width, height));
    },
    1: (posx: number, posy: number, width:number, height:number) => {
        new WindowSill(vec2(-posx, posy), vec2(width, height));
        new WindowSill(vec2(0, posy), vec2(width, height));
        new WindowSill(vec2(posx, posy), vec2(width, height));
    },
}