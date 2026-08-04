import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { Vector } from "../../../Model/Vector";
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
    private previousCell?: CellContext;
    private previousRiver?: MapObject;

    public start(context: ToolContext) {
        const cell = context.cell;

        if (cell === undefined) {
            return;
        }

        this.startPosition = context.cellPosition;
        this.previousCell = cell;
    }

    public move(context: ToolContext) {
        if (GridHelper.cellIsEqual(this.previousCell?.index, context.cell?.index)) {
            this.moveInsideCell(context);
        } else {
            this.moveBetweenCells(context);
        }
        this.previousCell = context.cell;
    }

    public stop() {
        this.startPosition = undefined;
        this.previousCell = undefined;
        this.previousRiver = undefined;
    }

    private connectRiver(cell: CellContext, river: MapObject, direction: Vector) {
        const
            lastRiverCell = GridHelper.cellNameToIndex(river.cell),
            neighbor = cell.neighbors.find(c => GridHelper.cellIsEqual(c?.index, lastRiverCell));

        // Last river was in a neighboring cell
        if (neighbor !== undefined) {
            const connection = GridHelper.getConnection(river.points[1], direction);

            // Last river connects to this cell
            if (neighbor.neighbors[connection.neighborIndex] === cell) {
                this.updateRiver(neighbor, river, connection.point);
                return connection;
            }
        }

        return undefined;
    }

    private createRiver(cell: CellContext, from: Point, to: Point) {
        const previous = this.previousRiver;

        let bend1 = {
            x: MathHelper.random(.2, .8),
            y: MathHelper.random(.2, .8)
        };

        from = VectorMath.round(from, 2);
        to = VectorMath.round(to, 2);

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

        this.previousRiver = river;
    }

    private moveBetweenCells(context: ToolContext) {
        const cell = context.cell,
            previousCell = this.previousCell,
            previousRiver = this.previousRiver,
            direction = context.direction;

        if (
            cell === undefined ||
            previousCell === undefined ||
            previousRiver === undefined ||
            !previousCell.hasObject(previousRiver)
        ) {
            return;
        }

        let connection = GridHelper.getConnection(previousRiver.points[1], direction),
            nextCell = previousCell.neighbors[connection.neighborIndex],
            iterations = 0;

        this.updateRiver(previousCell, previousRiver, connection.point);

        while (!GridHelper.cellIsEqual(nextCell?.index, cell.index)) {
            if (nextCell === undefined) {
                return;
            }

            const from = connection.neighborPoint;

            connection = GridHelper.getConnection(from, direction);

            this.createRiver(nextCell, from, connection.point);

            nextCell = nextCell.neighbors[connection.neighborIndex];

            Utilities.checkInfiniteLoop(iterations++);
        }

        if (nextCell !== undefined) {
            this.createRiver(nextCell, connection.neighborPoint, context.cellPosition);
        }
    }

    private moveInsideCell(context: ToolContext) {
        const cell = context.cell,
            position = context.cellPosition,
            lastRiver = this.previousRiver;

        if (cell === undefined || this.startPosition === undefined) {
            return;
        }

        if (lastRiver === undefined) {
            this.createRiver(cell, this.startPosition, position);
        } else if (cell.hasObject(lastRiver)) {
            this.updateRiver(cell, lastRiver, position);
        } else {
            const connection = this.connectRiver(cell, lastRiver, context.direction),
                from = connection?.neighborPoint ?? this.startPosition;

            this.createRiver(cell, from, position);
        }

    }

    private updateRiver(cell: CellContext, river: MapObject, position: Point) {
        const points = [...river.points];

        points[1] = VectorMath.round(position, 2);
        cell.update(river.id, points);
    }
}