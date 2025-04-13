/// <reference path="River.ts" />

class RiversTool implements Tool {
    id = 'rivers';
    labelResourceId = 'tool_label_rivers';

    private startPosition?: Point;
    private activeCell?: CellIndex;

    constructor(private mapAccessor: MapAccessor, private renderer: CellRenderer) {
    }

    start(position: Point): void {
        const cell = this.mapAccessor.getIndex(position);

        if (cell === undefined) {
            return;
        }

        this.startPosition = position;
        this.activeCell = cell;
    }

    move(position?: Point): void {
        const activeCell = this.activeCell,
            cell = this.mapAccessor.getIndex(position);

        if (this.startPosition === undefined || activeCell === undefined || position === undefined || cell === undefined) {
            return
        }

        if (!GridHelper.cellIsEqual(activeCell, cell)) {
            const cells = this.createRivers(activeCell, this.startPosition, cell, position),
                river = this.getRiver(cell)!,
                cellPosition = this.mapAccessor.getPosition(cell);
    
            for (let cell of cells) {
                this.renderer.render(cell, 'terrain');
            }

            this.startPosition = VectorMath.startOperation(river.from)
                .multiply(this.mapAccessor.map.pixelsPerCell)
                .add(cellPosition)
                .divide(this.mapAccessor.map.zoom);
            this.activeCell = cell;
        } else {
            const river = this.getRiver(cell);

            if (river === undefined) {
                const from = this.mapAccessor.normalizedPosition(cell, this.startPosition),
                    to = this.mapAccessor.normalizedPosition(cell, position);

                this.createRiver(cell, from, to);
            } else {
                river.to = VectorMath.round(this.mapAccessor.normalizedPosition(cell, position), 4);
                this.mapAccessor.setObjects(cell, [river]);

                this.startPosition = this.mapAccessor.absolutePosition(cell, river.from);
            }

            this.renderer.render(cell, 'terrain');
        }
    }

    stop(): void {
        this.startPosition = undefined;
        this.activeCell = undefined
    }

    private createRivers(firstCell: CellIndex, start: Point, lastCell: CellIndex, end: Point) {
        const normalizedStart = this.mapAccessor.normalizedPosition(firstCell, start),
            direction = VectorMath.direction(start, end),
            cells: CellIndex[] = [firstCell];

        let cell = firstCell,
            from = normalizedStart,
            previous = this.getRiver(firstCell),
            [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);

        do {
            cells.push(cell);
            cell = nextCell;
            from = nextFrom;

            [to, nextCell, nextFrom] = GridHelper.getConnection(cell, from, direction);
            previous = this.createRiver(cell, from, to, previous);
        }
        while (!GridHelper.cellIsEqual(cell, lastCell));

        return cells;
    }

    private createRiver(cell: CellIndex, from: Point, to: Point, previous?: River) {
        let bend1 = {
            x: MathHelper.random(.2, .8),
            y: MathHelper.random(.2, .8)
        };

        if (previous !== undefined) {
            bend1 = VectorMath.startOperation(previous.bend2)
                .direction(previous.to)
                .multiply(MathHelper.random(.2, .5))
                .add(from);
        }
        
        const river: River = {
            type: RiversHelper.objectType,
            layer: 'terrain',
            from: VectorMath.round(from, 4),
            to: VectorMath.round(to, 4),
            bend1: VectorMath.round(bend1, 2),
            bend2: {
                x: MathHelper.round(MathHelper.random(.2, .8), 2),
                y: MathHelper.round(MathHelper.random(.2, .8), 2)
            }
        };
        this.mapAccessor.setObjects(cell, [river]);

        return river;
    }

    private getRiver(cell: CellIndex) : River | undefined {
        return this.mapAccessor.getCell(cell).objects[0] as River;
    }
}