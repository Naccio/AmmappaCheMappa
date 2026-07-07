import { CellIndex } from "../../../Model/CellIndex";
import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Tool } from "../../../UI/Tools/Tool";
import { GridHelper } from "../../../Utilities/GridHelper";
import { MathHelper } from "../../../Utilities/MathHelper";
import { VectorMath } from "../../../Utilities/VectorMath";
import { MapAccessor } from "../../MapAccessor";
import { MapManager } from "../../MapManager";


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
            cellIndex = this.mapAccessor.getIndex(position);

        if (this.startPosition === undefined || activeCell === undefined || position === undefined || cellIndex === undefined) {
            return
        }

        if (!GridHelper.cellIsEqual(activeCell, cellIndex)) {
            const map = this.mapAccessor.map,
                river = this.getRiver(activeCell)!,
                cellPosition = this.mapAccessor.getPosition(cellIndex);

            this.createRivers(activeCell, this.startPosition, cellIndex, position)

            this.startPosition = VectorMath.startOperation(river.points[0])
                .multiply(map.data.pixelsPerCell)
                .add(cellPosition)
                .divide(map.zoom);
            this.activeCell = cellIndex;
        } else {
            const river = this.getRiver(cellIndex);

            if (river === undefined) {
                const from = this.mapAccessor.normalizedPosition(cellIndex, this.startPosition),
                    to = this.mapAccessor.normalizedPosition(cellIndex, position);

                this.createRiver(cellIndex, from, to);
            } else {
                const cell = this.map.getCell(cellIndex),
                    points = [...river.points];

                points[1] = VectorMath.round(this.mapAccessor.normalizedPosition(cellIndex, position), 2);
                cell.update(river.id, points);

                this.startPosition = this.mapAccessor.absolutePosition(cellIndex, river.points[0]);
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

    private createRiver(cellIndex: CellIndex, from: Point, to: Point, previous?: MapObject) {
        const cell = this.map.getCell(cellIndex);
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
            river = cell.createObject('river', [from, to, bend1, bend2]);

        cell.clear();
        cell.addObjects([river]);

        return river;
    }

    private getRiver(cell: CellIndex) {
        return this.map.getCell(cell).objects.value.find(o => o.type === 'river');
    }
}