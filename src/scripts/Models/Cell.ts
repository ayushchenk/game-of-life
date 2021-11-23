import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics"

export class Cell extends Container {
    private _isAlive: boolean = false;
    private size: number;
    private readonly graphics = new Graphics();

    constructor(x: number, y: number, size: number) {
        super();

        this.size = size;
        this.x = x;
        this.y = y;

        this.kill();

        this.addChild(this.graphics);
    }

    public revive() {
        this._isAlive = true;
        this.graphics.lineStyle(1, 0x0)
            .beginFill(0x00ff00)
            .drawRect(0, 0, this.size, this.size)
            .endFill();
    }

    public kill() {
        this._isAlive = false;
        this.graphics.lineStyle(1, 0x0)
            .beginFill(0xffffff)
            .drawRect(0, 0, this.size, this.size)
            .endFill();
    }

    public get isAlive() { return this._isAlive; }
}