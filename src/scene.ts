import {Color, drawCircle, FontImage, mainCanvas, Vector2} from "littlejsengine";

export abstract class Scene {
    public abstract update(): void
    public abstract draw(): void
}

const catSrcSize = 16
const catDstSize = 128

export class IntroScene extends Scene {

    public constructor() {
        super();

        this.catImg = new Image();
        this.catImg.src = "./black_cat.png";
    }

    public update(): void{

    }

    public draw(): void {
        const canvasWidth = mainCanvas.width;
        const canvasHeight = mainCanvas.height;

        const canvasLocX = canvasWidth/2-catDstSize/2;
        const canvasLocY = canvasHeight/2-catDstSize/2 + 20;

        drawCircle(new Vector2(0, -0.5), 3, new Color(1, 1, 1, 1))

        const ctx = mainCanvas.getContext('2d');
        ctx.drawImage(this.catImg, 0, 0, catSrcSize, catSrcSize, canvasLocX, canvasLocY, catDstSize, catDstSize);

        const font = new FontImage;
        font.drawText("Miss Fortune", new Vector2(0, 5), 0.2, true)
        font.drawText("Click to Play", new Vector2(0, -5), 0.1, true)
    }
}