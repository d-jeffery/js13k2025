import {RandomGenerator, vec2} from "littlejsengine";
import {ClosedWindowSill, JumpScareEnemy, PentHouse, WindowSillBase, WindowSillEnemy} from "./sprites.ts";

export class Building {

    protected windows: WindowSillBase[];
    protected posx: number
    protected posy: number
    protected width: number
    protected height: number
    protected randomGenerator: RandomGenerator
    protected floor: number = 0;

    constructor(randomGenerator: RandomGenerator) {
        this.windows = [];

        this.posx = 5
        this.posy = 6;
        this.width = 2.5
        this.height = 0.5
        this.randomGenerator = randomGenerator

        this.windows.push(new ClosedWindowSill(vec2(-this.posx, -this.posy), vec2(this.width, this.height), this.floor, this.randomGenerator));
        this.windows.push(new ClosedWindowSill(vec2(this.posx, -this.posy), vec2(this.width, this.height), this.floor, this.randomGenerator));
    }

}

export class IntroBuilding extends Building {

    private readonly plantCount: number

    constructor(randomGenerator: RandomGenerator) {
        super(randomGenerator)

        this.plantCount = 0;

        const levels = [0, 1, 0, 1, 0, 1, 0, 2, 0, 3, 1, 4, 1, 6];
        for (const [index, level] of levels.entries()) {
            this.windows.push(...sillFactory(level, this.posx, this.posy * index, this.width, this.height, this.floor, randomGenerator));
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
        this.windows.push(...sillFactory(this.randomGenerator.int(0, 6), this.posx, this.posy, this.width, this.height, this.floor, this.randomGenerator));
        this.posy += 6
    }

    public currentHeight(): number {
        return this.posy
    }
}

const Configs = [
    [ClosedWindowSill, JumpScareEnemy], // 0
    [ClosedWindowSill, ClosedWindowSill, ClosedWindowSill], // 1
    [ClosedWindowSill, WindowSillEnemy, ClosedWindowSill], // 2
    [ClosedWindowSill, WindowSillEnemy], // 3
    [WindowSillEnemy, ClosedWindowSill, WindowSillEnemy], // 4
    [ClosedWindowSill, ClosedWindowSill, JumpScareEnemy], // 5
    [PentHouse] // 6
]

function createSill(SillClass: any, x: number, y: number, width: number, height: number, floor:number, random: RandomGenerator) {
    return new SillClass(vec2(x, y), vec2(width, height), floor, random)
}

function sillFactory(level: number, posx: number, posy: number, width: number, height: number, floor: number, random: RandomGenerator): WindowSillBase[] {

    const sills = [];

    // const arr = shuffleArray(Configs[level], random);

    const arr = Configs[level]

    switch (arr.length) {
        case 1:
            sills.push(createSill(arr[0], 0, posy, width * 3, height, floor, random))
            break;
        case 2:
            sills.push(createSill(arr[0], -posx + width, posy, width, height, floor, random))
            sills.push(createSill(arr[1], posx - width, posy, width, height, floor, random))
            break;
        case 3:
            sills.push(createSill(arr[0], -posx, posy, width, height, floor, random))
            sills.push(createSill(arr[1], 0, posy, width, height, floor, random))
            sills.push(createSill(arr[2], posx, posy, width, height, floor, random))
            break;
        default:
    }
    return sills;
}

/*
function shuffleArray(array: any[], randomGenerator: RandomGenerator) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randomGenerator.int(0, 1) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}*/
