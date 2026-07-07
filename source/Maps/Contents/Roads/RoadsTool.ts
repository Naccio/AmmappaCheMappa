import { CellIndex } from "../../../Model/CellIndex";
import { Point } from "../../../Model/Point";
import { DrawingUI } from "../../../UI/DrawingUI";
import { Tool } from "../../../UI/Tools/Tool";
import { GridHelper } from "../../../Utilities/GridHelper";
import { VectorMath } from "../../../Utilities/VectorMath";
import { MapAccessor } from "../../MapAccessor";
import { MapManager } from "../../MapManager";


export class RoadsTool implements Tool {
    private readonly mapAccessor: MapAccessor;

    public readonly configuration = {
        id: 'roads',
        labelResourceId: 'tool_label_roads',
        layerTypes: ['terrain']
    };

    private startPosition?: Point;

    constructor(private ui: DrawingUI, private map: MapManager) {
        this.mapAccessor = map.mapAccessor;
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

        this.createRoads(firstCell, this.startPosition, lastCell, position);

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

    private createRoad(cellIndex: CellIndex, from: Point, to: Point) {
        from = VectorMath.round(from, 2);
        to = VectorMath.round(to, 2);

        const cell = this.map.getCell(cellIndex),
            road = cell.createObject('road', [from, to]);

        cell.clear();
        cell.addObjects([road]);
    }
}