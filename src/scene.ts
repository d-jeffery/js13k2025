import {
    Color,
    FontImage,
    time,
    TileInfo,
    drawTile,
    vec2,
    textureInfos,
    mouseIsDown, setCameraScale, Timer, setCameraPos, drawText, fontDefault, overlayContext, drawLine, drawCircle,
    drawRect,
} from "littlejsengine";
import {drawGradientCircle} from "./draw.ts";
import {Cat, Ground} from "./sprites.ts";
import {Building} from "./building.ts";

export abstract class Scene {
    public abstract update(): void

    public abstract draw(): void

    public abstract isFinished(): boolean
}


/*
const fontImage = new Image();
fontImage.src = 'assets/awesome_9.png'; // Path to your PNG font
let awesomeFont = undefined;

fontImage.onload = () => {
    // 2. Create the FontImage instance
    // Adjust tileSize and paddingSize as needed for your font
    const awesomeFont = new FontImage(fontImage, vec2(8, 8), vec2(0, 1));

    // 3. Draw text using your font
    // World space:
    awesomeFont.drawText('Hello World!', vec2(5, 5), 0.5, true);

    // Screen space:
    awesomeFont.drawTextScreen('Hello World!', vec2(100, 50), 1, true);
};
*/


export class IntroScene extends Scene {
    private catImg: HTMLImageElement = new Image(8, 8);
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

    public update(): void {
        this.offsetY = Math.sin(time)

        if (mouseIsDown(0)) {
            this.finished = true;
        }
    }

    public draw(): void {
        drawGradientCircle(vec2(0, -this.offsetY), 4, new Color(0, 0, 0, 0.5), new Color(1, 1, 1, 1), 30);
        // drawCircle(new Vector2(0, -0.5 - this.offsetY), 2.8, new Color(1, 1, 1, 1))

        const catSrcSize = 16

        // @ts-expect-error - textureInfos is any
        const catTexture = new TileInfo(vec2(0, 0), vec2(catSrcSize, catSrcSize), textureInfos['black_cat.png']);
        drawTile(vec2(0, -this.offsetY), vec2(5, 5), catTexture);


/*        drawText("Miss\nFortune",
            vec2(0, 7),
            16, new Color(1, 1, 0, 1),
            0.2, new Color(0, 0, 0, 1),
            'center',
            'assets/awesome_9.png',
            undefined,
            overlayContext);

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        drawText("Click to\nPlay",
            vec2(0, -5), 16, new Color(1, 1, 0, 1),
            0.2, new Color(0, 0, 0, 1),
            'center',
            'assets/awesome_9.png',
            undefined
            , overlayContext);*/


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

        new Ground(vec2(0, -8.5), vec2(16, 0.5));

        this.cat = new Cat(vec2(0, -7.5));

        new Building()

        this.countDown = new Timer(8);
        this.cameraOffset = 0
        this.finished = false;

        setCameraScale(50)
    }

    public update(): void {
        this.cat.update()

        if (this.countDown.elapsed()) {
            this.cameraOffset -= 0.01
            setCameraPos(vec2(0, -this.cameraOffset))
        }
    }

    public draw(): void {
        drawLine(vec2(-7,-8.5), vec2(-7,13 - this.cameraOffset) )
        drawLine(vec2(7,-8.5), vec2(7,13 - this.cameraOffset) )

        drawCircle(vec2(0,-5.5), 2, new Color(1,0,0,1))
        drawRect(vec2(0,-7), vec2(4,3), new Color(1,0,0,1))

        drawText("Score: " + this.cat.getScore(),
            vec2(0, 12 - this.cameraOffset),
            1, new Color(1, 1, 0, 1),
            0.2, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            overlayContext);

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        drawText("Locked out again! I'll need to double\njump just to reach these windows",
            vec2(0, -10), 0.8, new Color(1, 1, 0, 1),
            0.1, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined
        , overlayContext);
    }

    public isFinished(): boolean {
        return this.finished
    }

}
