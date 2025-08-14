import {
    Color,
    drawCircle,
    FontImage,
    time,
    Vector2,
    TileInfo,
    drawTile,
    vec2,
    textureInfos,
} from "littlejsengine";

export abstract class Scene {
    public abstract update(): void
    public abstract draw(): void
}

const catSrcSize = 16

export class IntroScene extends Scene {
    private catImg: HTMLImageElement = new Image();
    private offsetY: number = 0;

    public constructor() {
        super();
        this.catImg.src = "./black_cat.png";
        this.offsetY = 0
    }

    public update(): void{
        this.offsetY = Math.sin(time)
    }

    public draw(): void {
        drawGradientCircle(new Vector2(0, - this.offsetY), 4, new Color(0, 0, 0, 0.5), new Color(1, 1, 1, 1), 30);
        // drawCircle(new Vector2(0, -0.5 - this.offsetY), 2.8, new Color(1, 1, 1, 1))

        const catTexture = new TileInfo(vec2(0,0), vec2(catSrcSize, catSrcSize), textureInfos['black_cat.png']);
        drawTile(vec2(0, - this.offsetY), vec2(4, 4), catTexture);

        const font = new FontImage;
        font.drawText("Miss Fortune", new Vector2(0, 5), 0.2, true)
        font.drawText("Click to Play", new Vector2(0, -5), 0.1, true)
    }
}

function drawGradientCircle(center: Vector2, radius: number, colorStart: Color, colorEnd: Color, steps: number = 20) {
    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const r = radius * (1 - t);
        // Linear interpolation for color
        const color = new Color(
            colorStart.r * (1 - t) + colorEnd.r * t,
            colorStart.g * (1 - t) + colorEnd.g * t,
            colorStart.b * (1 - t) + colorEnd.b * t,
            colorStart.a * (1 - t) + colorEnd.a * t
        );
        drawCircle(center, r, color);
    }
}