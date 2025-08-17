import {
    Color,
    FontImage,
    time,
    TileInfo,
    drawTile,
    vec2,
    textureInfos,
    mouseIsDown, EngineObject, type Vector2, setCameraScale, Timer, setCameraPos, drawRect, drawLine,
} from "littlejsengine";
import {drawGradientCircle} from "./draw.ts";
import {Cat} from "./sprites.ts";

export abstract class Scene {
    public abstract update(): void
    public abstract draw(): void
    public abstract isFinished(): boolean
}

export class IntroScene extends Scene {
    private catImg: HTMLImageElement = new Image(8,8);
    //private fontImg: HTMLImageElement = new Image();
    private offsetY: number;
    protected finished: boolean;

    public constructor() {
        super();
        this.catImg.src = "./black_cat.png";
        // this.fontImg.src = "./Quirk.png";
        this.offsetY = 0
        this.finished = false
    }

    public update(): void{
        this.offsetY = Math.sin(time)

        if (mouseIsDown(0)) {
            this.finished = true;
        }
    }

    public draw(): void {
        drawGradientCircle(vec2(0, - this.offsetY), 4, new Color(0, 0, 0, 0.5), new Color(1, 1, 1, 1), 30);
        // drawCircle(new Vector2(0, -0.5 - this.offsetY), 2.8, new Color(1, 1, 1, 1))

        const catSrcSize = 16

        // @ts-expect-error - textureInfos is any
        const catTexture = new TileInfo(vec2(0,0), vec2(catSrcSize, catSrcSize), textureInfos['black_cat.png']);
        drawTile(vec2(0, - this.offsetY), vec2(5, 5), catTexture);

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        const font = new FontImage
        font.drawText("Miss\nFortune", vec2(0, 7), 0.2, true)
        font.drawText("Click to\nPlay", vec2(0, -5), 0.1, true)
    }

    public isFinished(): boolean {
        return this.finished;
    }
}

export class GameScene extends Scene {
    private cat: Cat
    private countDown: Timer;
    private cameraOffset: number;
    protected finished: boolean;


    public constructor() {
        super();

        new Ground(vec2(0,-10), vec2(16, 0.5));

        new WindowSill(vec2(-5, -6), vec2(2.5, 0.5));
        new WindowSill(vec2(0, -6), vec2(2.5, 0.5));
        new WindowSill(vec2(5, -6), vec2(2.5, 0.5));

        new WindowSill(vec2(-5, 0), vec2(2.5, 0.5));
        new WindowSill(vec2(0, 0), vec2(2.5, 0.5));
        new WindowSill(vec2(5, 0), vec2(2.5, 0.5));

        new WindowSill(vec2(-5, 6), vec2(2.5, 0.5));
        new WindowSill(vec2(0, 6), vec2(2.5, 0.5));
        new WindowSill(vec2(5, 6), vec2(2.5, 0.5));


        this.cat = new Cat();
        this.countDown = new Timer(5);
        this.cameraOffset = 0
        this.finished = false;


        setCameraScale(50)
    }
    public update(): void {
        this.cat.update()

        if (this.countDown.elapsed()) {
            this.cameraOffset -= 0.01
            setCameraPos(vec2(0,-this.cameraOffset))
        }
    }
    public draw(): void {
        this.cat.render()
    }
    public isFinished(): boolean {
        return this.finished
    }

}

class Ground extends EngineObject {
    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision(); // Enable collision for the ground
        this.mass = 0;      // Make the ground static (immovable)
    }
}

class WindowSill extends EngineObject {
    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision(); // Enable collision for the ground
        this.mass = 0;      // Make the ground static (immovable)
    }

    public render() {
        super.render();

        drawRect(
            vec2(this.pos.x, this.pos.y+1.5),
            vec2(this.size.x, this.size.y-3),
            new Color(0.5, 0.5, 0.5, 1));

        drawLine(
            vec2(this.pos.x - 1.5, this.pos.y+3),
            vec2(this.pos.x + 1.5, this.pos.y+3))

    }
}