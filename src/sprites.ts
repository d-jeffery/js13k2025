import {EngineObject, keyIsDown, textureInfos, TileInfo, vec2} from "littlejsengine";

export class Cat extends EngineObject {
    private speed: number;
    private jumpSpeed: number
    private canDoubleJump: boolean;


    constructor() {
        super(vec2(0,0));

        // @ts-expect-error - textureInfos is any
        this.tileInfo = new TileInfo(vec2(0,0), vec2(16, 16), textureInfos['black_cat.png']);
        this.setCollision()
        this.speed = 0.08; // Set a speed for the cat
        this.jumpSpeed = 0.3
        this.canDoubleJump = true
    }
    public update(): void {
        super.update()

        if (keyIsDown('ArrowLeft') || keyIsDown('a')) {
            this.velocity = vec2(-this.speed, this.velocity.y);
        } else if (keyIsDown('ArrowRight') || keyIsDown('d')) {
            this.velocity = vec2(this.speed, this.velocity.y);
        }

        if (keyIsDown('ArrowUp') || keyIsDown('w')) {
            if (this.groundObject) {
                this.velocity = vec2(this.velocity.x, this.jumpSpeed);
                this.canDoubleJump = true;
            } else if (this.canDoubleJump && this.velocity.y <= 0) {
                this.velocity = vec2(this.velocity.x, this.jumpSpeed);
                this.canDoubleJump = false;
            }
        }
    }
    public render() {
        super.render();
    }
}