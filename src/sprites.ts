import {
    Color, drawLine,
    drawRect,
    EngineObject, gamepadStick, gamepadWasPressed, gamepadWasReleased, isUsingGamepad, keyDirection,
    keyWasPressed, keyWasReleased,
    textureInfos,
    TileInfo,
    vec2, type Vector2, worldToScreen
} from "littlejsengine";
import {drawCircleSegment} from "./draw.ts";

const BACKGROUND_LAYER = 0;
const CAT_LAYER = 1;
const DESTRUCTIBLE_LAYER = 2;

// @ts-ignore
const spriteSheet = textureInfos['black_cat.png']

export class Cat extends EngineObject {
    private speed: number;
    private jumpSpeed: number
    private canDoubleJump: boolean;
    private jumpCount: number;
    private score: number;

    constructor(pos: Vector2 = vec2(0, 0)) {
        super(pos);

        this.tileInfo = new TileInfo(vec2(0, 0), vec2(16, 16), spriteSheet);
        this.setCollision()
        this.speed = 0.08; // Set a speed for the cat
        this.jumpSpeed = 0.3
        this.canDoubleJump = false
        this.jumpCount = 0;
        this.renderOrder = CAT_LAYER;
        this.score = 0;
    }

    public addToScore(points: number): void {
        this.score += points;
    }

    public getScore(): number {
        return this.score;
    }

    public update(): void {
        super.update()

        const moveInput = isUsingGamepad ? gamepadStick(0) : keyDirection()
        if (moveInput.x !== 0) {
            this.velocity = vec2(moveInput.x * this.speed, this.velocity.y);
        } else {
            this.velocity = vec2(0, this.velocity.y);
        }

        const jumpButtonPressed = gamepadWasPressed(0) || keyWasPressed('ArrowUp') || keyWasPressed('w')
        const jumpReleased = gamepadWasReleased(0) || keyWasReleased('ArrowUp') || keyWasReleased('w');

        if (this.groundObject) {
            this.jumpCount = 0
        }

        if (this.canDoubleJump && jumpButtonPressed && this.jumpCount == 2) {
            this.velocity = vec2(this.velocity.x, this.jumpSpeed);
            this.canDoubleJump = false;
            this.jumpCount += 1
        } else if (jumpReleased && this.jumpCount == 1) {
            this.canDoubleJump = true
            this.jumpCount += 1
        } else if (jumpButtonPressed && this.jumpCount == 0) {
            this.velocity = vec2(this.velocity.x, this.jumpSpeed);
            this.jumpCount += 1;
        }
    }

    public render() {
        super.render();
    }
}

class Destructible extends EngineObject {
    constructor(pos: Vector2) {
        super(pos, vec2(1, 1));
        this.setCollision()
        this.mass = 0
        this.renderOrder = DESTRUCTIBLE_LAYER;
    }

    public update() {
        super.update();

        if (this.pos.y < -10) {
            this.destroy()
        }
    }

    public collideWithObject(object: EngineObject): boolean {
        if (object instanceof Cat) {
            this.setCollision(false, false)
            this.mass = 1
            this.angleVelocity = (Math.random() - 0.5) * 0.2
            object.addToScore(10)
            return true;
        }
        return false;
    }
}

class Plant extends Destructible {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = new TileInfo(vec2(16, 0), vec2(16, 16), spriteSheet);
    }
}

class Pie extends Destructible {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = new TileInfo(vec2(32, 0), vec2(16, 16), spriteSheet);
    }
}

export class Ground extends EngineObject {
    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision(); // Enable collision for the ground
        this.mass = 0;      // Make the ground static (immovable)
    }
}

const WINDOW_TYPE_OPEN = 0;
const WINDOW_TYPE_CLOSE = 1;
const WINDOW_WITH_DRAPES = 2;

export class WindowSill extends EngineObject {
    private type: number;

    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision();
        this.mass = 0;
        this.renderOrder = BACKGROUND_LAYER;
        this.type = Math.floor(Math.random() * 4) | WINDOW_TYPE_OPEN;

        // Create a plant on the window sill at a random cadence
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                new Plant(vec2(pos.x, pos.y + 0.75))
                break;
            case 1:
                new Pie(vec2(pos.x, pos.y + 0.75))
                break;
            default:
        }
    }

    public render() {
        super.render();

        switch (this.type) {
            case WINDOW_TYPE_CLOSE:
                drawRect(
                    vec2(this.pos.x, this.pos.y + 1.5),
                    vec2(this.size.x, this.size.y - 3),
                    new Color(0.25, 0.25, 0.25, 1));
                drawLine(
                    vec2(this.pos.x - 1.25, this.pos.y + 1.5),
                    vec2(this.pos.x + 1.25, this.pos.y + 1.5));
                drawLine(
                    vec2(this.pos.x, this.pos.y + 2.75),
                    vec2(this.pos.x, this.pos.y));
                break;
            case WINDOW_WITH_DRAPES:
                drawRect(
                    vec2(this.pos.x, this.pos.y + 1.5),
                    vec2(this.size.x, this.size.y - 3),
                    new Color(0.25, 0.25, 0.25, 1),
                    0, false);
                 drawCircleSegment(
                     worldToScreen(vec2(this.pos.x-1.25, this.pos.y+2.75)),
                     45,
                     0,
                     Math.PI/2,
                     new Color(0.5, 0.5, 0.5, 1))
                 drawCircleSegment(
                     worldToScreen(vec2(this.pos.x+1.25, this.pos.y+2.75)),
                     45,
                     Math.PI/2,
                     Math.PI,
                     new Color(0.5, 0.5, 0.5, 1))
                break;
            default:
                drawRect(
                    vec2(this.pos.x, this.pos.y + 1.5),
                    vec2(this.size.x, this.size.y - 3),
                    new Color(0.5, 0.5, 0.5, 1));
        }

        drawLine(
            vec2(this.pos.x - 1.5, this.pos.y + 3),
            vec2(this.pos.x + 1.5, this.pos.y + 3))

    }
}