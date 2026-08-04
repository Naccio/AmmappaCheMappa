import { Point } from "../../../Model/Point";
import { DrawingUI } from "../../../UI/DrawingUI";
import { Tool } from "../../../UI/Tools/Tool";
import { ToolContext } from "../../../UI/Tools/ToolContext";
import { GridHelper } from "../../../Utilities/GridHelper";
import { Utilities } from "../../../Utilities/Utilities";
import { VectorMath } from "../../../Utilities/VectorMath";
import { CellContext } from "../../Cells/CellContext";
import { MapAccessor } from "../../MapAccessor";


export class RoadsTool implements Tool {
    public readonly configuration = {
        id: 'roads',
        labelResourceId: 'tool_label_roads',
        layerTypes: ['terrain']
    };

    private startPosition?: Point;
    private startCell?: CellContext;

    constructor(
        private ui: DrawingUI,
        private map: MapAccessor
    ) {
    }

    start(context: ToolContext): void {
        const cell = context.cell;

        this.ui.drawer.clear();

        if (cell === undefined) {
            return;
        }

        this.startCell = cell;
        this.startPosition = context.position;
    }

    move(context: ToolContext): void {
        this.ui.drawer.clear();

        if (this.startCell === undefined || this.startPosition === undefined || context.cell === undefined) {
            return
        }

        const zoom = this.map.map.zoom,
            from = VectorMath.multiply(this.startPosition, zoom),
            to = VectorMath.multiply(context.position, zoom);

        this.ui.drawer.line([from, to], {
            lineWidth: 5,
            color: '#0D0'
        });
    }

    stop(context: ToolContext): void {
        const firstCell = this.startCell,
            lastCell = context.cell;

        this.ui.drawer.clear();

        if (this.startPosition === undefined || firstCell === undefined || lastCell === undefined) {
            return
        }

        this.createRoads(firstCell, this.startPosition, lastCell, context.position);

        this.startPosition = undefined;
    }

    private createRoads(firstCell: CellContext, start: Point, lastCell: CellContext, end: Point) {
        const normalizedStart = this.map.normalizedPosition(firstCell.index, start),
            normalizedEnd = this.map.normalizedPosition(lastCell.index, end),
            direction = VectorMath.direction(start, end);

        let cell = firstCell,
            from = normalizedStart,
            iterations = 0;

        while (!GridHelper.cellIsEqual(cell.index, lastCell.index)) {
            const connection = GridHelper.getConnection(from, direction);

            this.createRoad(cell, from, connection.point);

            cell = cell.neighbors[connection.neighborIndex]!;
            from = connection.neighborPoint;
            Utilities.checkInfiniteLoop(iterations++);
        }
        this.createRoad(cell, from, normalizedEnd);
    }

    private createRoad(cell: CellContext, from: Point, to: Point) {
        from = VectorMath.round(from, 2);
        to = VectorMath.round(to, 2);

        const road = cell.createObject('road', [from, to]);

        cell.clear();
        cell.addObjects([road]);
    }
}