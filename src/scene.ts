import {
    Color,
    time,
    tile,
    drawTile,
    vec2,
    setCameraScale, Timer, setCameraPos, drawText, fontDefault, drawLine,
    drawRect, mainContext, worldToScreen, engineObjects, RandomGenerator, mousePos, mouseWasPressed, overlayContext,
    mouseWasReleased
} from "littlejsengine";
import {drawGradientCircle} from "./draw.ts";
import {Cat, Ground, PentHouse} from "./sprites.ts";
import {Building, EndlessBuilding, IntroBuilding} from "./buildings.ts";
import {Colors} from "./utils.ts";
import {Button} from "./button.ts";

// Base class for all scenes
export abstract class Scene {
    protected nextScene: Scene | undefined;

    public abstract update(): void

    public abstract draw(): void

    public abstract drawOverlay(): void;

    public abstract getNextScene(): Scene

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

let seed = 2;

export class IntroScene extends Scene {

    private catImg: HTMLImageElement = new Image(8, 8);
    //private fontImg: HTMLImageElement = new Image();
    private offsetY: number;
    protected finished: boolean;
    protected nextScene: Scene | undefined;

    private playerIntroButton: Button
    private playerEndlessButton: Button
    private seedUpButton: Button
    private seedDownButton: Button

    // private font: FontImage;

    // private lerpY: number;

    // private rain: ParticleEmitter;
    // private lerpFactor: number = 0

    public constructor() {
        super();
        this.catImg.src = "./black_cat.png";
        // this.fontImg.src = "./Quirk.png";
        this.offsetY = 0
        this.finished = false

        this.playerIntroButton = new Button("Play Intro Level", vec2(0, 0), vec2(14, 2))
        this.playerEndlessButton = new Button("Play Endless Mode", vec2(0, -3), vec2(14, 2))
        this.seedUpButton = new Button(">", vec2(5, -6), vec2(2, 2))
        this.seedDownButton = new Button("<", vec2(-5, -6), vec2(2, 2))

        this.nextScene = undefined;

        // this.font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));

        // this.rain = new ParticleEmitter(vec2(6, 14), (5/4) * Math.PI, vec2(24,1), 0, 150, 0, tile(3, 16),
        //     new Color(0.57, 0.72, 0.82, 0.75),
        //     new Color(0.57, 0.72, 0.82, 0.75),
        //     new Color(0.77, 0.88, 0.96, 0.5),
        //     new Color(0.77, 0.88, 0.96, 0.5),
        //     2, 0.15, 0.1, 0.25, 0.05, 1, 1, 1, 3.14, 0.1, 0.25, false, false);

        // this.rain.renderOrder = 3

        // setCameraScale(50)
    }

    public update(): void {
        this.offsetY = Math.sin(time)

        if (this.playerIntroButton.isClicked(mousePos, mouseWasPressed(0))) {
            this.finished = true;
            this.nextScene = new TutorialGameScene()
        } else if (this.playerEndlessButton.isClicked(mousePos, mouseWasPressed(0))) {
            this.finished = true;
            this.nextScene = new EndlessGameScene()
        } else if (this.seedDownButton.isClicked(mousePos, mouseWasPressed(0))) {
            seed--;
            if (seed < 0) {
                seed = 0;
            }
        } else if (this.seedUpButton.isClicked(mousePos, mouseWasPressed(0))) {
            seed++
        }
    }

    public draw(): void {
        drawGradientCircle(vec2(0, -this.offsetY + 6), 4, new Color(0, 0, 0, 0.5), Colors.white, 30);
        drawTile(vec2(0, -this.offsetY + 6), vec2(5, 5), tile(0, 16));
    }

    public drawOverlay() {

        // const font = new FontImage(this.fontImg, vec2(16, 16), vec2(0, 0));
        drawText("Miss\nFortune", vec2(0, 13), 3, Colors.yellow);

        this.playerIntroButton.draw()
        this.playerEndlessButton.draw()

        drawText(`Seed: ${seed}`, vec2(0, -6), 1.5, Colors.white)

        this.seedUpButton.draw()
        this.seedDownButton.draw()
    }

    public getNextScene(): Scene {
        return this.nextScene || new TutorialGameScene();
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public clean(): void {
    }
}

export class TutorialGameScene extends Scene {
    private cat: Cat
    private countDown: Timer;
    private cameraOffset: number;
    private catReached: boolean;
    private building: IntroBuilding
    // private lerpY: number;
    // private rain: ParticleEmitter;
    // private lerpFactor: number = 0

    protected finished: boolean;

    public constructor() {
        super();

        new Ground(vec2(0, -8.5), vec2(16, 0.5));

        this.cat = new Cat(vec2(0, -7.5));

        this.building = new IntroBuilding(new RandomGenerator(seed));

        this.countDown = new Timer(5);
        this.finished = false;
        this.cameraOffset = 0
        this.catReached = false;
        this.nextScene = undefined;
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
        // this.cat.update()

        const catPos = worldToScreen(this.cat.pos)

        // End the scene if the cat goes off the bottom of the screen
        if (catPos.y > 1180) {
            this.finished = true;
        }

        const catPosY = this.cat.pos.y
        if (catPosY > 7 && !this.catReached) {
            this.catReached = true
        }

        if (this.countDown.elapsed() && this.catReached) {
            if (this.cameraOffset >= 70) {
                // Dont progresses camera if at "top"
            } else if (catPosY - this.cameraOffset >= 10) {
                // this.cameraOffset = lerp(this.lerpY, catPosY - 10, catPosY)
                this.cameraOffset = catPosY - 10
            } else {
                this.cameraOffset += 0.01
            }
            setCameraPos(vec2(0, this.cameraOffset))
        } else if (this.catReached) {
            this.countDown.set(0)
        }

        if (this.cat.getLives() <= 0) {
            this.finished = true;
        }

        if (this.cat.groundObject instanceof PentHouse) {
            setTimeout(() => this.finished = true, 1000)
        }
    }

    public drawOverlay(): void {
        drawRect(vec2(0, -11 + this.cameraOffset), vec2(15, 3.5), Colors.white, 0, true);

        drawRect(vec2(0, -11 + this.cameraOffset), vec2(13.5, 3), Colors.black, 0, true);

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
        drawRect(vec2(0, 2 + this.cameraOffset), vec2(14, 23), Colors.darker_grey, 0, false);

        // Draw building outline
        drawLine(vec2(-7, -8.5), vec2(-7, 13 + this.cameraOffset), 0.1, Colors.white, false)
        drawLine(vec2(7, -8.5), vec2(7, 13 + this.cameraOffset), 0.1, Colors.white, false)

        // Draw door
        // drawCircle(vec2(0,-5.5), 2, new Color(0.4,0.22,0.19,1))
        //drawRect(vec2(0,-7), vec2(4,3), Colors.brown, 0, false)

        drawRect(vec2(0, -5.75), vec2(4, -5.5), Colors.brown, 0, false)
        drawLine(vec2(-2, -3), vec2(2, -3), 0.1, Colors.white, false)
        drawLine(vec2(0, -8.5), vec2(0, -3), 0.1, Colors.white, false)
        drawLine(vec2(2, -8.5), vec2(2, -3), 0.1, Colors.white, false)
        drawLine(vec2(-2, -8.5), vec2(-2, -3), 0.1, Colors.white, false)

        drawLine(vec2(0.5, -5), vec2(0.5, -6), 0.1, Colors.yellow, false)
        drawLine(vec2(-0.5, -5), vec2(-0.5, -6), 0.1, Colors.yellow, false)

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

    public getNextScene(): Scene {
        return new EndScene(false)
    }

    public isFinished(): boolean {
        return this.finished
    }

    public clean(): void {
        engineObjects.forEach(e => e.destroy())
        setCameraScale(35)
    }

}

export class EndlessGameScene extends Scene {

    protected finished: boolean;
    private cat: Cat
    private cameraOffset: number;
    private catReached: boolean;
    private countDown: Timer;
    private building: EndlessBuilding;
    private randomeGenerator: RandomGenerator;

    constructor() {
        super();

        this.cameraOffset = 0
        this.catReached = false;
        this.nextScene = undefined;
        this.finished = false;
        this.countDown = new Timer(5);
        this.randomeGenerator = new RandomGenerator(seed);

        new Ground(vec2(0, -8.5), vec2(16, 0.5));

        this.cat = new Cat(vec2(0, -7.5));

        this.building = new EndlessBuilding(this.randomeGenerator);

        for (let i = 0; i < 20; i++) {
            this.building.addLevel();
        }

        setCameraScale(50)
    }

    public update(): void {

        const catPos = worldToScreen(this.cat.pos)

        // End the scene if the cat goes off the bottom of the screen
        if (catPos.y > 1180) {
            this.finished = true;
        }

        const catPosY = this.cat.pos.y
        if (catPosY > 7 && !this.catReached) {
            this.catReached = true
        }

        if (this.countDown.elapsed() && this.catReached) {
            if (this.cameraOffset >= 70) {
                // Dont progresses camera if at "top"
            } else if (catPosY - this.cameraOffset >= 10) {
                // this.cameraOffset = lerp(this.lerpY, catPosY - 10, catPosY)
                this.cameraOffset = catPosY - 10
            } else {
                this.cameraOffset += 0.01
            }
            setCameraPos(vec2(0, this.cameraOffset))
        } else if (this.catReached) {
            this.countDown.set(0)
        }

        if (this.cat.getLives() <= 0) {
            this.finished = true;
        }

        if (this.cat.groundObject instanceof PentHouse) {
            setTimeout(() => this.finished = true, 1000)
        }
    }


    public draw(): void {
        drawRect(vec2(0, 2 + this.cameraOffset), vec2(14, 23), Colors.darker_grey, 0, false);

        // Draw building outline
        drawLine(vec2(-7, -8.5), vec2(-7, 13 + this.cameraOffset), 0.1, Colors.white, false)
        drawLine(vec2(7, -8.5), vec2(7, 13 + this.cameraOffset), 0.1, Colors.white, false)

        // Draw door
        // drawCircle(vec2(0,-5.5), 2, new Color(0.4,0.22,0.19,1))
        //drawRect(vec2(0,-7), vec2(4,3), Colors.brown, 0, false)

        drawRect(vec2(0, -5.75), vec2(4, -5.5), Colors.brown, 0, false)
        drawLine(vec2(-2, -3), vec2(2, -3), 0.1, Colors.white, false)
        drawLine(vec2(0, -8.5), vec2(0, -3), 0.1, Colors.white, false)
        drawLine(vec2(2, -8.5), vec2(2, -3), 0.1, Colors.white, false)
        drawLine(vec2(-2, -8.5), vec2(-2, -3), 0.1, Colors.white, false)

        drawLine(vec2(0.5, -5), vec2(0.5, -6), 0.1, Colors.yellow, false)
        drawLine(vec2(-0.5, -5), vec2(-0.5, -6), 0.1, Colors.yellow, false)

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

        drawText("This building is huge!\nHow far can I go?",
            vec2(0, 10.5), 0.8, Colors.yellow,
            0.1, new Color(0, 0, 0, 1),
            'center',
            fontDefault,
            undefined,
            mainContext);
    }

    public drawOverlay(): void {
        drawRect(vec2(0, -11 + this.cameraOffset), vec2(15, 3.5), Colors.white, 0, true);

        drawRect(vec2(0, -11 + this.cameraOffset), vec2(13.5, 3), Colors.black, 0, true);

        drawText("Smashables: " + this.cat.getScore(),
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

    public getNextScene(): Scene {
        return new EndScene(true)
    }

    public isFinished(): boolean {
        return this.finished
    }

    public clean(): void {
        engineObjects.forEach(e => e.destroy())
        setCameraScale(35)
    }
}

export class EndScene extends Scene {

    protected finished: boolean;
    private restartButton: Button;
    private mainMenuButton: Button;
    private endless: boolean;

    constructor(endless: boolean = false) {
        super();

        this.finished = false
        this.endless = endless;

        this.restartButton = new Button("Restart", vec2(0, 0), vec2(14, 2));
        this.mainMenuButton = new Button("Main Menu", vec2(0, -3), vec2(14, 2));

        this.nextScene = undefined
    }

    public draw(): void {
        drawText("Game Over!",
            vec2(0, 6), 2.4, Colors.yellow,
            0.1, Colors.black,
            'center');

        this.restartButton.draw()
        this.mainMenuButton.draw()
    }

    public drawOverlay(): void {
    }

    public getNextScene(): Scene {
        return this.nextScene || new IntroScene();
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public update(): void {
        if (this.restartButton.isClicked(mousePos, mouseWasReleased(0))) {
            this.nextScene = this.endless ? new EndlessGameScene() : new TutorialGameScene()
            this.finished = true;
        } else if (this.mainMenuButton.isClicked(mousePos, mouseWasReleased(0))) {
            this.nextScene = new IntroScene()
            this.finished = true;
        }
    }

    public clean(): void {
    }

}
