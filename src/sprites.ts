import {
    Color, drawLine,
    drawRect,
    EngineObject, gamepadStick, gamepadWasPressed, gamepadWasReleased, isUsingGamepad, keyDirection,
    keyWasPressed, keyWasReleased,
    textureInfos,
    TileInfo,
    vec2, type Vector2,
} from "littlejsengine";


export class Cat extends EngineObject {
    private speed: number;
    private jumpSpeed: number
    private canDoubleJump: boolean;
    private jumpCount: number;

    constructor(pos: Vector2 = vec2(0, 0)) {
        super(pos);

        // @ts-expect-error - textureInfos is any
        this.tileInfo = new TileInfo(vec2(0, 0), vec2(16, 16), textureInfos['black_cat.png']);
        this.setCollision()
        this.speed = 0.08; // Set a speed for the cat
        this.jumpSpeed = 0.3
        this.canDoubleJump = false
        this.jumpCount = 0;
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




export class Ground extends EngineObject {
    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision(); // Enable collision for the ground
        this.mass = 0;      // Make the ground static (immovable)
    }
}

const WINDOW_TYPE_OPEN = 0;
const WINDOW_TYPE_CLOSE = 1;

export class WindowSill extends EngineObject {
    private type: number;

    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision();
        this.mass = 0;
        this.type = Math.random() * 2 | WINDOW_TYPE_OPEN;


    }

    public render() {
        super.render();

        switch (this.type) {
            case WINDOW_TYPE_CLOSE:
                drawRect(
                    vec2(this.pos.x, this.pos.y+1.5),
                    vec2(this.size.x, this.size.y-3),
                    new Color(0.25, 0.25, 0.25, 1));
                drawLine(
                    vec2(this.pos.x - 1.25, this.pos.y+1.5),
                    vec2(this.pos.x + 1.25, this.pos.y+1.5))
                drawLine(
                    vec2(this.pos.x, this.pos.y+2.75),
                    vec2(this.pos.x, this.pos.y))
                break;
            default:
                drawRect(
                    vec2(this.pos.x, this.pos.y+1.5),
                    vec2(this.size.x, this.size.y-3),
                    new Color(0.5, 0.5, 0.5, 1));
        }

        drawLine(
            vec2(this.pos.x - 1.5, this.pos.y+3),
            vec2(this.pos.x + 1.5, this.pos.y+3))

    }
}