import {vec2} from "littlejsengine";
import {ClosedWindowSill, WindowSillBase, WindowSillEnemy} from "./sprites.ts";

export class Building {

    private windows: WindowSillBase[];
    private plantCount: number

    constructor() {
        this.plantCount = 0;
        this.windows = [];

        const posx = 5
        const posy = 6;
        const width = 2.5
        const height = 0.5

        this.windows.push(new ClosedWindowSill(vec2(-posx, -posy), vec2(width, height)));
        this.windows.push(new ClosedWindowSill(vec2(posx, -posy), vec2(width, height)));

        const levels = [0, 1, 0, 1, 1, 1, 0, 2, 0, 3, 1, 4];
        for (const [index, level] of levels.entries()) {
            this.windows.push(...windowConfigs[level](posx, posy * index, width, height));
        }

        this.windows.forEach(w => {
            if (w.doesHavePlant()) {
                this.plantCount++;
            }
        })
    }

    public getPlantCount(): number {
        return this.plantCount;
    }
}

interface windowConfigOptions {
    [key: number]: (posx: number, posy: number, width: number, height: number) => WindowSillBase[]
}

const windowConfigs: windowConfigOptions = {
    0: (posx: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx + width, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(posx - width, posy), vec2(width, height))
        ]
    },
    1: (posx: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(0, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(posx, posy), vec2(width, height)),
        ]
    },
    2: (posx: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx, posy), vec2(width, height)),
            new WindowSillEnemy(vec2(0, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(posx, posy), vec2(width, height)),
        ]
    },
    3: (posx: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx + width, posy), vec2(width, height)),
            new WindowSillEnemy(vec2(posx - width, posy), vec2(width, height))
        ]
    },
    4: (posx: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new WindowSillEnemy(vec2(-posx, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(0, posy), vec2(width, height)),
            new WindowSillEnemy(vec2(posx, posy), vec2(width, height)),
        ]
    }
}