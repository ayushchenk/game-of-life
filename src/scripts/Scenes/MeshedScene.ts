import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";

export class MeshedScene extends Container {
    private readonly graphics: Graphics = new Graphics();

    constructor(interval: number, width: number, height: number) {
        super();

        this.graphics.lineStyle(1, 0x000);
        this.graphics.beginFill();
        this.drawHorizontalLines(interval, width, height);
        this.drawVerticalLines(interval, width, height);
        this.graphics.endFill();

        this.addChild(this.graphics);

    }

    private drawHorizontalLines(interval: number, width: number, height: number) {
        for (let i = 0; i < height; i += interval) {
            this.graphics.moveTo(0, i).lineTo(width, i);
        }
    }

    private drawVerticalLines(interval: number, width: number, height: number) {
        for (let i = 0; i < width; i += interval) {
            this.graphics.moveTo(i, 0).lineTo(i, height);
        }
    }
}