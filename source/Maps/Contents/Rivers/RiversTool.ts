import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Tool } from "../../../UI/Tools/Tool";
import { ToolContext } from "../../../UI/Tools/ToolContext";
import { GridHelper } from "../../../Utilities/GridHelper";
import { MathHelper } from "../../../Utilities/MathHelper";
import { Utilities } from "../../../Utilities/Utilities";
import { VectorMath } from "../../../Utilities/VectorMath";
import { CellContext } from "../../Cells/CellContext";


export class RiversTool implements Tool {
    public readonly configuration = {
        id: 'rivers',
        labelResourceId: 'tool_label_rivers',
        layerTypes: ['terrain']
    };

    private startPosition?: Point;
    private activeCell?: CellContext;

    start(context: ToolContext): void {
        const cell = context.cell;

        if (cell === undefined) {
            return;
        }

        this.startPosition = context.cellPosition;
        this.activeCell = cell;
    }

    move(context: ToolContext): void {
        const activeCell = this.activeCell,
            cell = context.cell;

        if (this.startPosition === undefined || activeCell === undefined || cell === undefined) {
            return
        }

        const position = context.cellPosition;

        if (!GridHelper.cellIsEqual(activeCell.index, cell.index)) {
            const river = this.getRiver(activeCell)!;

            this.createRivers(activeCell, this.startPosition, cell, position)

            this.startPosition = river.points[0];
            this.activeCell = cell;
        } else {
            const river = this.getRiver(cell);

            if (river === undefined) {
                const from = this.startPosition,
                    to = position;

                this.createRiver(cell, from, to);
            } else {
                const points = [...river.points];

                points[1] = position;
                cell.update(river.id, points);

                this.startPosition = river.points[0];
            }
        }
    }

    stop(): void {
        this.startPosition = undefined;
        this.activeCell = undefined
    }

    private createRivers(firstCell: CellContext, start: Point, lastCell: CellContext, end: Point) {
        const direction = VectorMath.startOperation(end)
            .add(lastCell.index.column - firstCell.index.column, lastCell.index.row - firstCell.index.row)
            .direction(start)
            .invert();

        let cell = firstCell,
            from = start,
            previous = this.getRiver(firstCell),
            [to, nextCell, nextFrom] = GridHelper.getConnection(from, direction),
            iterations = 0;

        do {
            cell = cell.neighbors[nextCell]!;
            from = nextFrom;

            [to, nextCell, nextFrom] = GridHelper.getConnection(from, direction);
            previous = this.createRiver(cell, from, to, previous);
            Utilities.checkInfiniteLoop(iterations++);
        }
        while (!GridHelper.cellIsEqual(cell.index, lastCell.index));
    }

    private createRiver(cell: CellContext, from: Point, to: Point, previous?: MapObject) {
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

    private getRiver(cell: CellContext) {
        return cell.objects.value.find(o => o.type === 'river');
    }
}