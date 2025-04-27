class RoadsTool implements Tool {
    id = 'roads';
    labelResourceId = 'tool_label_roads';

    private startPosition?: Point;

    constructor(private ui: DrawingUI, private mapAccessor: MapAccessor, private renderer: CellRenderer) {
    }

    start(position: Point): void {
        const cell = this.mapAccessor.getIndex(position);

        this.ui.drawer.clear();

        if (cell === undefined) {
            return;
        }

        this.startPosition = position;
    }

    move(position?: Point): void {
        const cell = this.mapAccessor.getIndex(position);

        this.ui.drawer.clear();

        if (this.startPosition === undefined || position === undefined || cell === undefined) {
            return
        }

        const zoom = this.mapAccessor.map.zoom,
            from = VectorMath.multiply(this.startPosition, zoom),
            to = VectorMath.multiply(position, zoom);

        this.ui.drawer.line([from, to], {
            lineWidth: 5,
            color: '#0D0'
        });
    }

    stop(position?: Point): void {
        const firstCell = this.mapAccessor.getIndex(this.startPosition),
            lastCell = this.mapAccessor.getIndex(position);

        this.ui.drawer.clear();

        if (this.startPosition === undefined || firstCell === undefined || position === undefined || lastCell === undefined) {
            return
        }

        const cells = this.createRoads(firstCell, this.startPosition, lastCell, position);

        for (let cell of cells) {
            this.renderer.render(cell, 'terrain');
        }

        this.startPosition = undefined;
    }

    private createRoads(firstCell: CellIndex, start: Point, lastCell: CellIndex, end: Point) {
        const normalizedStart = this.mapAccessor.normalizedPosition(firstCell, start),
            normalizedEnd = this.mapAccessor.normalizedPosition(lastCell, end),
            direction = VectorMath.direction(start, end),
            cells: CellIndex[] = [firstCell];

        let cell = firstCell,
            from = normalizedStart,
            to,
            nextCell = lastCell,
            nextFrom;


        while (!GridHelper.cellIsEqual(cell, lastCell)) {
            [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);

            this.createRoad(cell, from, to);

            cell = nextCell;
            from = nextFrom;
            cells.push(nextCell);
        }
        this.createRoad(cell, from, normalizedEnd);

        return cells;
    }

    private createRoad(cell: CellIndex, from: Point, to: Point) {
        const road: Road = {
            type: 'road',
            layer: 'terrain',
            from: VectorMath.round(from, 4),
            to: VectorMath.round(to, 4)
        };
        this.mapAccessor.setObjects(cell, [road]);
    }
}