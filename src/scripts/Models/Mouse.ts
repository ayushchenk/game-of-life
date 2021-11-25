export class Mouse {
    public static pressed: boolean = false;
    public static x: number = 0;
    public static y: number = 0;

    public static initialize() {
        document.addEventListener("mousedown", Mouse.down);
        document.addEventListener("mouseup", Mouse.up);
        document.addEventListener("mousemove", Mouse.move.bind(this));
    }

    private static down(): void {
        Mouse.pressed = true;
    }

    private static up(): void {
        Mouse.pressed = false;
    }

    private static move(e: MouseEvent): void {
        this.x = e.x;
        this.y = e.y;
    }
}