import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { InteractionEvent } from "@pixi/interaction";
import { Rectangle } from "@pixi/math";
import { Ticker } from "@pixi/ticker";
import { Cell } from "../Models/Cell";
import { MeshedScene } from "./MeshedScene";

export class MainScene extends Container {
    private readonly cells: Cell[][] = [];
    private readonly interval: number = 15;

    public constructor() {
        super();

        Ticker.shared.minFPS = 1;
        Ticker.shared.maxFPS = 5;
        Ticker.shared.add(this.tickerHandler, this);
        Ticker.shared.stop();

        this.interactive = true;
        this.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerWidth);

        // this.addChild(new MeshedScene(this.interval, window.innerWidth, window.innerWidth));
        this.spawnCells();

        this.on("click", this.clickHandler, this);
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private spawnCells() {
        const width = Math.floor(window.innerWidth / this.interval);
        const height = Math.floor(window.innerHeight / this.interval);

        for (let x = 0; x < width; x++) {
            this.cells[x] = [];
            for (let y = 0; y < height; y++) {
                const cell = new Cell(x * this.interval, y * this.interval, this.interval);
                this.cells[x][y] = cell;
                this.addChild(cell);
            }
        }
    }

    private clickHandler(event: InteractionEvent) {
        const x = Math.floor(event.data.global.x) - (Math.floor(event.data.global.x) % this.interval);
        const y = Math.floor(event.data.global.y) - (Math.floor(event.data.global.y) % this.interval);

        this.cells[x / this.interval][y / this.interval].revive();
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.code == "Enter") {
            Ticker.shared.start();
        }
    }

    private tickerHandler() {
        const toKill: Cell[] = [];
        const toRevive: Cell[] = [];

        const width = Math.floor(window.innerWidth / this.interval);
        const height = Math.floor(window.innerHeight / this.interval);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cell = this.cells[x][y];
                let neighbors: Cell[] = [];

                neighbors.push(this.cells[x - 1]?.[y]);
                neighbors.push(this.cells[x - 1]?.[y - 1]);
                neighbors.push(this.cells[x]?.[y - 1]);
                neighbors.push(this.cells[x + 1]?.[y - 1]);
                neighbors.push(this.cells[x + 1]?.[y]);
                neighbors.push(this.cells[x + 1]?.[y + 1]);
                neighbors.push(this.cells[x]?.[y + 1]);
                neighbors.push(this.cells[x - 1]?.[y + 1]);
                neighbors = neighbors.filter(n => n && n.isAlive);

                if (cell.isAlive && neighbors.length != 2 && neighbors.length != 3) {
                    toKill.push(cell);
                }

                if (!cell.isAlive && neighbors.length == 3) {
                    toRevive.push(cell);
                }
            }
        }

        toKill.forEach(c => c.kill());
        toRevive.forEach(c => c.revive());
    }
}