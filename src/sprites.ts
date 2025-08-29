import {
    cameraPos,
    Color, drawCircle, drawEllipse, drawLine, drawPoly,
    drawRect,
    EngineObject, gamepadStick, gamepadWasPressed, gamepadWasReleased, isUsingGamepad, keyDirection,
    keyWasPressed, keyWasReleased,
    tile, Timer, vec2, type Vector2, worldToScreen
} from "littlejsengine";
import {drawCircleSegment} from "./draw.ts";
import {Colors} from "./utils.ts";

const BACKGROUND_LAYER = 0;
const CAT_LAYER = 1;
const DESTRUCTIBLE_LAYER = 2;


export class Cat extends EngineObject {
    private speed: number;
    private jumpSpeed: number
    private canDoubleJump: boolean;
    private jumpCount: number;
    private score: number;
    private lives: number;
    private lastFrames: Vector2[];

    constructor(pos: Vector2 = vec2(0, 0)) {
        super(pos);

        this.tileInfo = tile(0, 16)
        this.setCollision()
        this.speed = 0.08; // Set a speed for the cat
        this.jumpSpeed = 0.3
        this.canDoubleJump = false
        this.jumpCount = 0;
        this.renderOrder = CAT_LAYER;
        this.score = 0;
        this.friction = 0.1;
        this.lives = 3;
        this.lastFrames = []
    }

    public damage(): void {
        this.lives -= 1
    }

    public addToScore(points: number): void {
        this.score += points;
    }

    public getScore(): number {
        return this.score;
    }

    public update(): void {
        super.update()

        this.lastFrames.push(this.pos.copy())
        if (this.lastFrames.length > 10) {
            this.lastFrames.shift()
        }

        const moveInput = isUsingGamepad ? gamepadStick(0) : keyDirection()
        if (moveInput.x !== 0) {
            this.velocity = vec2(moveInput.x * this.speed, this.velocity.y);
        }

        const jumpButtonPressed = gamepadWasPressed(0) || gamepadWasPressed(1) || gamepadWasPressed(2) || gamepadWasPressed(3) || keyWasPressed('ArrowUp') || keyWasPressed('w')
        const jumpReleased = gamepadWasReleased(0) || gamepadWasReleased(1) || gamepadWasReleased(2) || gamepadWasReleased(3) || keyWasReleased('ArrowUp') || keyWasReleased('w');

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

        for (let f of this.lastFrames) {
            drawCircle(vec2(f.x, f.y - 0.05),
                (0.5),
                Colors.black, 0.05,
                new Color(0.1, 0.1, 0.1, 1))
        }
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
            object.addToScore(1)
            return true;
        }
        return false;
    }
}

class Plant extends Destructible {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = tile(1, 16);
    }
}

class Pie extends Destructible {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = tile(2, 16)
    }
}

class Flower extends Destructible {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = tile(3, 16);
    }
}

class Water extends EngineObject {
    constructor(pos: Vector2) {
        super(pos);
        this.tileInfo = tile(4, 16);
        this.setCollision()
        this.mass = 0.01
        this.renderOrder = CAT_LAYER
        this.color =  new Color(0, 0, 1, 0.5)
        // this.setCollision(false, true)

    }

    public render(): void {
        super.render()
        for (let i = 0; i < 5; i++) {
            drawCircle(vec2(this.pos.x, this.pos.y + (0.25 * i)),
                (0.5 - (0.1 * i)),
                new Color(0, 0, 1, 0.5), 0, )
        }
    }

    public collideWithObject(object: EngineObject): boolean {
        if (object instanceof Cat) {
            object.damage();
            this.destroy()
            return true;
        } else if (object instanceof Ground) {
            this.destroy()
            return true;
        }
        return false;
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


const STATE_TIME = 2.5
const BUCKET_STATE = 2.5

export class WindowSillEnemy extends EngineObject {
    private bucketTimer: Timer;
    private stateTimer: Timer;
    private state: boolean;

    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision();
        this.mass = 0;
        this.renderOrder = BACKGROUND_LAYER;
        this.bucketTimer = new Timer(BUCKET_STATE)
        this.stateTimer = new Timer(STATE_TIME)
        this.state = false
        this.color = Colors.clear
    }

    public render() {
        super.render();

        drawRect(
            vec2(this.pos.x, this.pos.y + 1.5),
            vec2(this.size.x, this.size.y - 3),
            new Color(1, 1, 0.38, 1), 0, false);

        drawEllipse(vec2(this.pos.x, this.pos.y + 1.25), 1, 1.25, 0,
            Colors.grey)

        drawCircle(vec2(this.pos.x, this.pos.y + 2.25), 0.5,
            Colors.skin)

        drawLine(
            vec2(this.pos.x + 0.05, this.pos.y + 2.25),
            vec2(this.pos.x + 0.25, this.pos.y + 2.45), 0.1,
            Colors.dark_grey, false)

        drawLine(
            vec2(this.pos.x - 0.05, this.pos.y + 2.25),
            vec2(this.pos.x - 0.25 , this.pos.y + 2.45), 0.1,
            Colors.dark_grey,  false)

        if (!this.state) {
            drawPoly([
                    vec2(this.pos.x-0.75, this.pos.y+1.5),
                    vec2(this.pos.x-0.5, this.pos.y + 0.5),
                    vec2(this.pos.x + 0.5, this.pos.y + 0.5),
                    vec2(this.pos.x + 0.75, this.pos.y + 1.5)
                ],
                Colors.dark_grey)
        } else {
            drawPoly([
                    vec2(this.pos.x-0.5, this.pos.y+1.5),
                    vec2(this.pos.x-0.75, this.pos.y + 0.5),
                    vec2(this.pos.x + 0.75, this.pos.y + 0.5),
                    vec2(this.pos.x + 0.5, this.pos.y + 1.5)
                ],
                Colors.dark_grey)
        }

        drawCircle(vec2(this.pos.x-0.5, this.pos.y + 1), 0.25,
            Colors.skin)
        drawCircle(vec2(this.pos.x+0.5, this.pos.y + 1), 0.25,
            Colors.skin)

        drawRect(this.pos, this.size, Colors.white, 0, false)

        drawLine(
            vec2(this.pos.x - 1.5, this.pos.y + 3),
            vec2(this.pos.x + 1.5, this.pos.y + 3),
            0.1, Colors.white, false)
    }

    public update() {
        super.update()
        if (this.pos.y - 14 > cameraPos.y) {
            return
        }

        if (this.stateTimer.isSet() && this.stateTimer.elapsed()) {
            this.state = true
            this.stateTimer.unset()
            this.bucketTimer.set(BUCKET_STATE)

            new Water(this.pos)

            // water.color = new Color(0.5, 0.5, 1, 1)
        } else if (this.bucketTimer.isSet() &&  this.bucketTimer.elapsed()) {
            this.state = false
            this.stateTimer.set(STATE_TIME)
            this.bucketTimer.unset()
        }
    }
}

export class WindowSill extends EngineObject {
    private type: number;

    constructor(pos: Vector2, size: Vector2) {
        super(pos, size);
        this.setCollision();
        this.mass = 0;
        this.renderOrder = BACKGROUND_LAYER;
        this.type = Math.floor(Math.random() * 4) | WINDOW_TYPE_OPEN;
        this.color = Colors.clear

        // Create a plant on the window sill at a random cadence
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                new Plant(vec2(pos.x, pos.y + 0.75))
                break;
            case 1:
                new Pie(vec2(pos.x, pos.y + 0.75))
                break;
            case 2:
                new Flower(vec2(pos.x, pos.y + 0.75))
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
                    Colors.dark_grey, 0, false);
                drawLine(
                    vec2(this.pos.x - 1.25, this.pos.y + 1.5),
                    vec2(this.pos.x + 1.25, this.pos.y + 1.5),
                    0.1, Colors.white, false);
                drawLine(
                    vec2(this.pos.x, this.pos.y + 2.75),
                    vec2(this.pos.x, this.pos.y),
                    0.1, Colors.white, false);
                break;
            case WINDOW_WITH_DRAPES:
                drawRect(
                    vec2(this.pos.x, this.pos.y + 1.5),
                    vec2(this.size.x, this.size.y - 3),
                    Colors.dark_grey,
                    0, false);
                 drawCircleSegment(
                     worldToScreen(vec2(this.pos.x-1.25, this.pos.y+2.75)),
                     45,
                     0,
                     Math.PI/2,
                     Colors.grey)
                 drawCircleSegment(
                     worldToScreen(vec2(this.pos.x+1.25, this.pos.y+2.75)),
                     45,
                     Math.PI/2,
                     Math.PI,
                     Colors.grey)
                break;
            default:
                drawRect(
                    vec2(this.pos.x, this.pos.y + 1.5),
                    vec2(this.size.x, this.size.y - 3),
                    Colors.grey, 0, false);
        }

        drawRect(this.pos, this.size, Colors.white, 0, false)

        drawLine(
            vec2(this.pos.x - 1.5, this.pos.y + 3),
            vec2(this.pos.x + 1.5, this.pos.y + 3),
            0.1, Colors.white, false)
    }
}