import {
    Color,
    FontImage,
    time,
    TileInfo,
    drawTile,
    vec2,
    textureInfos,
    mouseIsDown,
} from "littlejsengine";
import {drawGradientCircle} from "./draw.ts";

export abstract class Scene {
    public abstract update(): void
    public abstract draw(): void
    public abstract isFinished(): boolean
}

export class IntroScene extends Scene {
    private catImg: HTMLImageElement = new Image(8,8);
    //private fontImg: HTMLImageElement = new Image();
    private offsetY: number;
    /**
     * Indicates if the scene is finished.
     * If true, the game will switch to the next scene.
     */
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
        drawTile(vec2(0, - this.offsetY), vec2(4, 4), catTexture);

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        const font = new FontImage
        font.drawText("Miss Fortune", vec2(0, 5), 0.2, true)
        font.drawText("Click to Play", vec2(0, -5), 0.1, true)
    }

    public isFinished(): boolean {
        return this.finished;
    }
}

export class GameScene extends Scene {
    public constructor() {
        super();
    }
    public update(): void {
        throw new Error("Method not implemented.");
    }
    public draw(): void {
        throw new Error("Method not implemented.");
    }
    public isFinished(): boolean {
        throw new Error("Method not implemented.");
    }

}