import {
    Color,
    FontImage,
    time,
    tile,
    drawTile,
    vec2,
    mouseIsDown, setCameraScale, Timer, setCameraPos, drawText, fontDefault, overlayContext, drawLine,
    drawRect, mainContext, worldToScreen, engineObjects,
} from "littlejsengine";
import {drawGradientCircle} from "./draw.ts";
import {Cat, Ground} from "./sprites.ts";
import {Building} from "./building.ts";
import {Colors} from "./utils.ts";

export abstract class Scene {
    public abstract update(): void

    public abstract draw(): void

    public abstract drawOverlay(): void;

    public abstract isFinished(): boolean

    public abstract clean(): void;
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

        drawTile(vec2(0, -this.offsetY), vec2(5, 5), tile(0, 16));


        /*        drawText("Miss\nFortune",
                    vec2(0, 7),
                    16, Colors.yellow,
                    0.2, new Color(0, 0, 0, 1),
                    'center',
                    'assets/awesome_9.png',
                    undefined,
                    overlayContext);

                // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
                drawText("Click to\nPlay",
                    vec2(0, -5), 16, Colors.yellow,
                    0.2, new Color(0, 0, 0, 1),
                    'center',
                    'assets/awesome_9.png',
                    undefined
                    , overlayContext);*/

    }

    public drawOverlay() {
        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        const font = new FontImage
        font.drawText("Miss\nFortune", vec2(0, 7), 0.2, true)
        font.drawText("Click to\nPlay", vec2(0, -5), 0.1, true)
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public clean(): void {
    }
}

export class GameScene extends Scene {
    private cat: Cat
    private countDown: Timer;
    private cameraOffset: number;
    private catReached: boolean;
    private building: Building;
    // private lerpY: number;
    // private rain: ParticleEmitter;
    // private lerpFactor: number = 0

    protected finished: boolean;

    public constructor() {
        super();

        new Ground(vec2(0, -8.5), vec2(16, 0.5));

        this.cat = new Cat(vec2(0, -7.5));

        this.building = new Building()

        this.countDown = new Timer(5);
        this.finished = false;
        this.cameraOffset = 0
        this.catReached = false;
        /*
                this.rain = new ParticleEmitter(vec2(6, 14), (5/4) * Math.PI, vec2(24,1), 0, 150, 0, tile(3, 16),
                    new Color(0.57, 0.72, 0.82, 0.75),
                    new Color(0.57, 0.72, 0.82, 0.75),
                    new Color(0.77, 0.88, 0.96, 0.5),
                    new Color(0.77, 0.88, 0.96, 0.5),
                    2, 0.15, 0.1, 0.25, 0.05, 1, 1, 1, 3.14, 0.1, 0.25, false, false, true);

                this.rain.renderOrder = 3*/

        setCameraScale(50)
    }

    public update(): void {
        this.cat.update()

        const catPos = worldToScreen(this.cat.pos)

        // End the scene if the cat goes off the bottom of the screen
        if (catPos.y > 1160) {
            this.finished = true;
        }

        const catPosY = this.cat.pos.y
        if (catPosY > 7 && !this.catReached) {
            this.catReached = true
        }

        if (this.countDown.elapsed() && this.catReached) {
            if (catPosY - this.cameraOffset >= 10) {
                // this.cameraOffset = lerp(this.lerpY, catPosY - 10, catPosY)
                this.cameraOffset = catPosY - 10
            } else {
                this.cameraOffset += 0.01
            }
            setCameraPos(vec2(0, this.cameraOffset))
        } else if (this.catReached) {
            this.countDown.set(0)
        }
    }

    public drawOverlay(): void {
        drawRect(vec2(0, -11 + this.cameraOffset), vec2(15, 3.5), new Color(1, 1, 1, 1), 0, true);

        drawRect(vec2(0, -11 + this.cameraOffset), vec2(13.5, 3), new Color(0, 0, 0, 1), 0, true);

        drawText("Smashables: " + this.cat.getScore() + "/" + this.building.getPlantCount(),
            vec2(0, -10.5 + this.cameraOffset),
            0.8, Colors.yellow,
            0.2, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            overlayContext);

        drawText("Lives: " + this.cat.getLives(),
            vec2(0, -11.5 + this.cameraOffset),
            0.8, Colors.yellow,
            0.2, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            overlayContext);
    }

    public draw(): void {
        drawRect(vec2(0, 2 + this.cameraOffset), vec2(14, 23), new Color(0.1, 0.1, 0.1, 1), 0, false);

        // Draw building outline
        drawLine(vec2(-7, -8.5), vec2(-7, 13 + this.cameraOffset), 0.1, Colors.white, false)
        drawLine(vec2(7, -8.5), vec2(7, 13 + this.cameraOffset), 0.1, Colors.white, false)

        // Draw door
        // drawCircle(vec2(0,-5.5), 2, new Color(0.4,0.22,0.19,1))
        //drawRect(vec2(0,-7), vec2(4,3), Colors.brown, 0, false)

        drawRect(vec2(0, -5.75), vec2(4, -5.5), Colors.brown, 0, false)
        drawLine(vec2(-2, -3), vec2(2, -3), 0.1, Colors.white, false)
        drawLine(vec2(0, -8.5), vec2(0, -3), 0.1, Colors.white,false)
        drawLine(vec2(2, -8.5), vec2(2, -3), 0.1, Colors.white,false)
        drawLine(vec2(-2, -8.5), vec2(-2, -3), 0.1, Colors.white,false)

        drawLine(vec2(0.5, -5), vec2(0.5, -6), 0.1, Colors.yellow,false)
        drawLine(vec2(-0.5, -5), vec2(-0.5, -6), 0.1, Colors.yellow,false)

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        drawText("Locked out again!",
            vec2(0, -1.5), 0.8, Colors.yellow,
            0.1, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            mainContext);

        drawText("I'll need to double jump\njust to reach these windows...",
            vec2(0, 4.5), 0.8, Colors.yellow,
            0.1, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            mainContext);

        drawText("And if I time it right,\nI can reach the penthouse!",
            vec2(0, 10.5), 0.8, Colors.yellow,
            0.1, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            mainContext);
    }

    public isFinished(): boolean {
        return this.finished
    }

    public clean(): void {
        engineObjects.forEach(e => e.destroy())
    }

}

export class EndScene extends Scene {

    protected finished: boolean;

    constructor() {
        super();

        this.finished = false
    }


    public draw(): void {
        drawText("Game Over!\nClick to Restart",
            vec2(0, 3), 0.8, Colors.yellow,
            0.1, Colors.black,
            'center',
            fontDefault,
            undefined,
            mainContext);
    }

    public drawOverlay(): void {
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public update(): void {
        if (mouseIsDown(0)) {
            this.finished = true;
        }
    }

    public clean(): void {
    }

}
