import {
    EngineObject, gamepadStick, gamepadWasPressed, gamepadWasReleased, isUsingGamepad, keyDirection,
    keyWasPressed, keyWasReleased,
    textureInfos,
    TileInfo,
    vec2,
} from "littlejsengine";


export class Building extends EngineObject {
    public constructor() {
        super()

    }
}

export class Cat extends EngineObject {
    private speed: number;
    private jumpSpeed: number
    private canDoubleJump: boolean;
    private jumpCount: number;

    constructor() {
        super(vec2(0, 0));

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