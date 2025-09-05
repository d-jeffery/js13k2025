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
    5: (posx: number, posy: number, width: number, height: number, random: RandomGenerator): WindowSillBase[] => {
        return [
            new ClosedWindowSill(vec2(-posx, posy), vec2(width, height), random),
            new ClosedWindowSill(vec2(0, posy), vec2(width, height), random),
            new JumpScareEnemy(vec2(posx, posy), vec2(width, height), random)
        ]
    },
    6: (_: number, posy: number, width: number, height: number): WindowSillBase[] => {
        return [
            new PentHouse(vec2(0, posy), vec2(width * 3, height)),
        ]
    }
}