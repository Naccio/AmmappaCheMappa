import { CellContext } from "../../Maps/Cells/CellContext";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { Vector } from "../../Model/Vector";
import { GridHelper } from "../../Utilities/GridHelper";
import { MathHelper } from "../../Utilities/MathHelper";
import { Utilities } from "../../Utilities/Utilities";
import { VectorMath } from "../../Utilities/VectorMath";
import { Tool } from "./Tool";
import { ToolConfiguration } from "./ToolConfiguration";
import { ToolContext } from "./ToolContext";


export abstract class LinkedCellTool implements Tool {
    public abstract readonly configuration: ToolConfiguration;

    protected readonly endPointIndex = 1;
    protected readonly padding = .1;

    private startPosition?: Point;
    private previousCell?: CellContext;
    private _previousObject?: MapObject;

    protected get previousObject() {
        return this._previousObject;
    }

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
        this._previousObject = undefined;
    }

    protected abstract createObject(cell: CellContext, from: Point, to: Point): MapObject;

    private connectObject(cell: CellContext, object: MapObject, direction: Vector) {
        const
            previousObjectCell = GridHelper.cellNameToIndex(object.cell),
            neighbor = cell.neighbors.find(c => GridHelper.cellIsEqual(c?.index, previousObjectCell));

        // Last object was in a neighboring cell
        if (neighbor !== undefined) {
            const connection = this.getConnection(object.points[1], direction);

            // Last object connects to this cell
            if (neighbor.neighbors[connection.neighborIndex] === cell) {
                this.updateObject(neighbor, object, connection.point);
                return connection;
            }
        }

        return undefined;
    }

    private getConnection(from: Point, direction: Vector) {
        const connection = GridHelper.getConnection(from, direction),
            index = connection.neighborIndex,
            min = 0 + this.padding,
            max = 1 - this.padding;

        if (index === GridHelper.topSideIndex || index === GridHelper.bottomSideIndex) {
            connection.point.x = MathHelper.clamp(connection.point.x, min, max);
            connection.neighborPoint.x = MathHelper.clamp(connection.neighborPoint.x, min, max);
        } else if (index === GridHelper.rightSideIndex || index === GridHelper.leftSideIndex) {
            connection.point.y = MathHelper.clamp(connection.point.y, min, max);
            connection.neighborPoint.y = MathHelper.clamp(connection.neighborPoint.y, min, max);
        }

        return connection;
    }

    private moveBetweenCells(context: ToolContext) {
        const cell = context.cell,
            previousCell = this.previousCell,
            previousObject = this._previousObject,
            direction = context.direction;

        if (
            cell === undefined ||
            previousCell === undefined ||
            previousObject === undefined ||
            !previousCell.hasObject(previousObject)
        ) {
            return;
        }

        let connection = this.getConnection(previousObject.points[1], direction),
            nextCell = previousCell.neighbors[connection.neighborIndex],
            iterations = 0;

        this.updateObject(previousCell, previousObject, connection.point);

        while (!GridHelper.cellIsEqual(nextCell?.index, cell.index)) {
            if (nextCell === undefined) {
                return;
            }

            const from = connection.neighborPoint;

            connection = this.getConnection(from, direction);

            this._previousObject = this.createObject(nextCell, from, connection.point);

            nextCell = nextCell.neighbors[connection.neighborIndex];

            Utilities.checkInfiniteLoop(iterations++);
        }

        if (nextCell !== undefined) {
            this._previousObject = this.createObject(nextCell, connection.neighborPoint, context.cellPosition);
        }
    }

    private moveInsideCell(context: ToolContext) {
        const cell = context.cell,
            previousObject = this._previousObject;

        if (cell === undefined || this.startPosition === undefined) {
            return;
        }

        let from = VectorMath.round(this.startPosition, 2),
            to = VectorMath.round(context.cellPosition, 2);

        if (previousObject === undefined) {
            this._previousObject = this.createObject(cell, from, to);
        } else if (cell.hasObject(previousObject)) {
            this.updateObject(cell, previousObject, to);
        } else {
            const connection = this.connectObject(cell, previousObject, context.direction);

            if (connection !== undefined) {
                from = VectorMath.round(connection.neighborPoint, 2);
            }

            this._previousObject = this.createObject(cell, from, to);
        }

    }

    private updateObject(cell: CellContext, object: MapObject, position: Point) {
        const points = [...object.points];

        points[this.endPointIndex] = VectorMath.round(position, 2);
        cell.update(object.id, points);
    }
}