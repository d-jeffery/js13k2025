import {RandomGenerator, vec2} from "littlejsengine";
import {ClosedWindowSill, JumpScareEnemy, PentHouse, WindowSillBase, WindowSillEnemy} from "./sprites.ts";

export class Building {

    protected windows: WindowSillBase[];
    protected posx: number
    protected posy: number
    protected width: number
    protected height: number
    protected randomGenerator: RandomGenerator

    constructor(randomGenerator: RandomGenerator) {
        this.windows = [];

        this.posx = 5
        this.posy = 6;
        this.width = 2.5
        this.height = 0.5
        this.randomGenerator = randomGenerator

        this.windows.push(new ClosedWindowSill(vec2(-this.posx, -this.posy), vec2(this.width, this.height), this.randomGenerator));
        this.windows.push(new ClosedWindowSill(vec2(this.posx, -this.posy), vec2(this.width, this.height), this.randomGenerator));
    }

}

export class IntroBuilding extends Building {

    private readonly plantCount: number

    constructor(randomGenerator: RandomGenerator) {
        super(randomGenerator)

        this.plantCount = 0;

        const levels = [0, 1, 0, 1, 1, 1, 0, 2, 0, 3, 1, 4, 1, 6];
        for (const [index, level] of levels.entries()) {
            this.windows.push(...WindowConfigs[level](this.posx, this.posy * index, this.width, this.height, randomGenerator));
        }

       this.plantCount = this.windows.filter(w => w.doesHavePlant()).length
    }

    public getPlantCount(): number {
        return this.plantCount;
    }
}

export class EndlessBuilding extends Building {

    constructor(randomGenerator: RandomGenerator) {
        super(randomGenerator)

        this.posy = 0;
    }

    public addLevel() {
        this.windows.push(...WindowConfigs[this.randomGenerator.int(0, 5)](this.posx, this.posy, this.width, this.height, this.randomGenerator));
        this.posy += 6
    }
}

interface windowConfigOptions {
    [key: number]: (posx: number, posy: number, width: number, height: number, random: RandomGenerator) => WindowSillBase[]
}

const WindowConfigs: windowConfigOptions = {
    0: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(ClosedWindowSill, -posx + width, posy, width, height, random),
            createSill(ClosedWindowSill, posx - width, posy, width, height, random),
        ]
    },
    1: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(ClosedWindowSill, -posx, posy, width, height, random),
            createSill(ClosedWindowSill, 0, posy, width, height, random),
            createSill(ClosedWindowSill, posx, posy, width, height, random)
        ]
    },
    2: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(ClosedWindowSill, -posx, posy, width, height, random),
            createSill(WindowSillEnemy, 0, posy, width, height),
            createSill(ClosedWindowSill, posx, posy, width, height, random)
        ]
    },
    3: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(ClosedWindowSill, -posx + width, posy, width, height, random),
            createSill(WindowSillEnemy, posx - width, posy, width, height),
        ]
    },
    4: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(WindowSillEnemy, -posx, posy, width, height),
            createSill(ClosedWindowSill, 0, posy, width, height, random),
            createSill(WindowSillEnemy, posx, posy, width, height)
        ]
    },
    5: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            createSill(ClosedWindowSill, -posx, posy, width, height, random),
            createSill(ClosedWindowSill, 0, posy, width, height, random),
            createSill(JumpScareEnemy, posx, posy, width, height, random)
        ]
    },
    6: (_: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            createSill(PentHouse, 0, posy, width * 3, height)
        ]
    }
}

function createSill(SillClass: any, x: number, y: number, width: number, height: number, random?: RandomGenerator) {
    return random
        ? new SillClass(vec2(x, y), vec2(width, height), random)
        : new SillClass(vec2(x, y), vec2(width, height));
}