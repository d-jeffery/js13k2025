import {RandomGenerator, vec2} from "littlejsengine";
import {ClosedWindowSill, PentHouse, WindowSillBase, WindowSillEnemy} from "./sprites.ts";

export class Building {

    private windows: WindowSillBase[];
    private plantCount: number

    constructor(randomGenerator: RandomGenerator) {
        this.plantCount = 0;
        this.windows = [];

        const posx = 5
        const posy = 6;
        const width = 2.5
        const height = 0.5

        this.windows.push(new ClosedWindowSill(vec2(-posx, -posy), vec2(width, height), randomGenerator));
        this.windows.push(new ClosedWindowSill(vec2(posx, -posy), vec2(width, height), randomGenerator));

        const levels = [0, 1, 0, 1, 1, 1, 0, 2, 0, 3, 1, 4, 5];
        for (const [index, level] of levels.entries()) {
            this.windows.push(...WindowConfigs[level](posx, posy * index, width, height, randomGenerator));
        }

       this.plantCount = this.windows.filter(w => w.doesHavePlant()).length
    }

    public getPlantCount(): number {
        return this.plantCount;
    }
}

interface windowConfigOptions {
    [key: number]: (posx: number, posy: number, width: number, height: number, random: RandomGenerator) => WindowSillBase[]
}

const WindowConfigs: windowConfigOptions = {
    0: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx + width, posy), vec2(width, height), random),
            new ClosedWindowSill(vec2(posx - width, posy), vec2(width, height), random)
        ]
    },
    1: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx, posy), vec2(width, height), random),
            new ClosedWindowSill(vec2(0, posy), vec2(width, height), random),
            new ClosedWindowSill(vec2(posx, posy), vec2(width, height), random),
        ]
    },
    2: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx, posy), vec2(width, height), random),
            new WindowSillEnemy(vec2(0, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(posx, posy), vec2(width, height), random),
        ]
    },
    3: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx + width, posy), vec2(width, height), random),
            new WindowSillEnemy(vec2(posx - width, posy), vec2(width, height))
        ]
    },
    4: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new WindowSillEnemy(vec2(-posx, posy), vec2(width, height)),
            new ClosedWindowSill(vec2(0, posy), vec2(width, height), random),
            new WindowSillEnemy(vec2(posx, posy), vec2(width, height)),
        ]
    },
    5: (_: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new PentHouse(vec2(0, posy), vec2(width * 3, height)),
        ]
    }
}