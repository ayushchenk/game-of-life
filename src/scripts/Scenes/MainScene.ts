import { Container } from "@pixi/display";
import { InteractionEvent } from "@pixi/interaction";
import { Rectangle } from "@pixi/math";
import { Ticker } from "@pixi/ticker";
import { Cell } from "../Models/Cell";
import { Mouse } from "../Models/Mouse";

export class MainScene extends Container {
    private readonly cells: Cell[][] = [];
    private readonly interval: number = 15;
    private readonly mouseDrawTicker: Ticker;

    public constructor() {
        super();

        this.mouseDrawTicker = new Ticker();
        this.mouseDrawTicker.add(this.drawTickerHandler, this);
        this.mouseDrawTicker.start();

        Ticker.shared.minFPS = 1;
        Ticker.shared.maxFPS = 5;
        Ticker.shared.add(this.tickerHandler, this);
        Ticker.shared.stop();

        this.interactive = true;
        this.hitArea = new Rectangle(0, 0, window.innerWidth, window.innerWidth);

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
        this.spawnCell(event.data.global.x, event.data.global.y);
    }

    private drawTickerHandler() {
       if(Mouse.pressed){
           this.spawnCell(Mouse.x, Mouse.y);
       }
    }

    private spawnCell(mouseX: number, mouseY: number) {
        const x = Math.floor(mouseX) - (Math.floor(mouseX) % this.interval);
        const y = Math.floor(mouseY) - (Math.floor(mouseY) % this.interval);

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

        let neighbors: Cell[] = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cell = this.cells[x][y];

                neighbors = [];
                neighbors.push(this.cells[x - 1]?.[y] ?? this.cells[width - 1][y]);
                neighbors.push(this.cells[x - 1]?.[y - 1] ?? this.cells[width - 1][y - 1]);
                neighbors.push(this.cells[x][y - 1] ?? this.cells[x][height - 1]);
                neighbors.push(this.cells[x + 1]?.[y - 1] ?? this.cells[0][y - 1] ?? this.cells[0][height - 1]);
                neighbors.push(this.cells[x + 1]?.[y] ?? this.cells[0][y]);
                neighbors.push(this.cells[x + 1]?.[y + 1] ?? this.cells[0][y - 1] ?? this.cells[0][0]);
                neighbors.push(this.cells[x][y + 1] ?? this.cells[x][0]);
                neighbors.push(this.cells[x - 1]?.[y + 1] ?? this.cells[width - 1][y - 1] ?? this.cells[width - 1][0]);
                neighbors = neighbors.filter(n => n && n.isAlive);

                if (cell.isAlive && (neighbors.length < 2 || neighbors.length > 3)) {
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