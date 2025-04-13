interface Tool {
    readonly id: string;
    readonly labelResourceId: string;

    start(position: Point) : void;

    move(position?: Point) : void;

    stop(position?: Point) : void;
}