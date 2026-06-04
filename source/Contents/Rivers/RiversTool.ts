import { GridHelper } from "../../Utilities/GridHelper";
import { MathHelper } from "../../Utilities/MathHelper";
import { CellIndex } from "../../Model/CellIndex";
import { Point } from "../../Model/Point";
import { Tool } from "../../UI/Tools/Tool";
import { VectorMath } from "../../Utilities/VectorMath";
import { MapManager } from "../../Maps/MapManager";
import { MapAccessor } from "../../Maps/MapAccessor";
import { MapObject } from "../../Model/MapObject";

export class RiversTool implements Tool {
    private readonly mapAccessor: MapAccessor;
    public readonly configuration = {
        id: 'rivers',
        labelResourceId: 'tool_label_rivers',
        layerTypes: ['terrain']
    };

    private startPosition?: Point;
    private activeCell?: CellIndex;

    constructor(private readonly map: MapManager) {
        this.mapAccessor = map.mapAccessor;
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
            const map = this.mapAccessor.map,
                river = this.getRiver(activeCell)!,
                cellPosition = this.mapAccessor.getPosition(cell);

            this.createRivers(activeCell, this.startPosition, cell, position)

            this.startPosition = VectorMath.startOperation(river.points[0])
                .multiply(map.data.pixelsPerCell)
                .add(cellPosition)
                .divide(map.zoom);
            this.activeCell = cell;
        } else {
            const river = this.getRiver(cell);

            if (river === undefined) {
                const from = this.mapAccessor.normalizedPosition(cell, this.startPosition),
                    to = this.mapAccessor.normalizedPosition(cell, position);

                this.createRiver(cell, from, to);
            } else {
                river.points[1] = VectorMath.round(this.mapAccessor.normalizedPosition(cell, position), 4);

                this.startPosition = this.mapAccessor.absolutePosition(cell, river.points[0]);
            }
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

    private createRiver(cell: CellIndex, from: Point, to: Point, previous?: MapObject) {
        let bend1 = {
            x: MathHelper.random(.2, .8),
            y: MathHelper.random(.2, .8)
        };

        if (previous !== undefined) {
            bend1 = VectorMath.startOperation(previous.points[3])
                .direction(previous.points[1])
                .multiply(MathHelper.random(.2, .5))
                .add(from);
        }

        from = VectorMath.round(from, 4);
        to = VectorMath.round(to, 4);
        bend1 = VectorMath.round(bend1, 2);
        const bend2 = {
            x: MathHelper.round(MathHelper.random(.2, .8), 2),
            y: MathHelper.round(MathHelper.random(.2, .8), 2)
        },
            river = this.map.createObject('river', cell, [from, to, bend1, bend2]);

        this.map.clear(cell);
        this.map.addObjects([river]);

        return river;
    }

    private getRiver(cell: CellIndex) {
        return this.mapAccessor.getCell(cell).objects.find(o => o.type === 'river');
    }
}