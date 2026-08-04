import { CellConnection } from "../Model/CellConnection";
import { CellIndex } from "../Model/CellIndex";
import { Point } from "../Model/Point";
import { Vector } from "../Model/Vector";
import { VectorMath } from "./VectorMath";

export class GridHelper {
    public static readonly topNeighborIndex = 0;
    public static readonly rightNeighborIndex = 1;
    public static readonly bottomNeighborIndex = 2;
    public static readonly leftNeighborIndex = 3;

    public static readonly defaultGridColor = '#999';

    public static readonly quadrantShift: Vector[] = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ];

    public static cellIndexToName(index: CellIndex) {
        // +1 to switch from 0-based to 1-based numbering
        const name = this.columnNumberToName(index.column + 1);

        return name + (index.row + 1);
    }

    public static cellIndexToPosition(index: CellIndex, size: number): Point {
        return {
            x: index.column * size,
            y: index.row * size
        };
    }

    public static cellIsEqual(cell1?: CellIndex, cell2?: CellIndex) {
        return cell1?.column === cell2?.column && cell1?.row === cell2?.row;
    }

    public static cellNameToIndex(name: string): CellIndex {
        const splitName = name.split(/([0-9]+)/),
            // -1 to switch from 1-based to 0-based numbering
            column = this.columnNameToNumber(splitName[0]) - 1,
            row = parseInt(splitName[1]) - 1;

        return { column, row }
    }

    public static columnNameToNumber(name: string) {
        let number = 0;

        name = name.toUpperCase();
        for (let i = 0; i < name.length; i++) {
            const charCode = name.charCodeAt(i);

            number *= 26;
            number += charCode - 64;
        }

        return number;
    }

    public static columnNumberToName(number: number) {
        let name = '';

        while (number > 0) {
            const modulo = (number - 1) % 26;
            name = String.fromCharCode(65 + modulo) + name;
            number = Math.floor((number - modulo) / 26);
        }

        return name;
    }

    public static getConnectingCells(from: CellIndex, to: CellIndex) {

        if (from.column == to.column && from.row === to.row) {
            return [from];
        }

        //TODO: Look into Bresenham's line algorithm for an alternative
        const columnDifference = to.column - from.column,
            rowDifference = to.row - from.row,
            columnDirection = Math.sign(columnDifference),
            rowDirection = Math.sign(rowDifference),
            columnDistance = Math.abs(columnDifference),
            rowDistance = Math.abs(rowDifference),
            cells: CellIndex[] = [];

        let column = from.column,
            row = from.row;

        if (columnDistance > rowDistance) {
            this.splitActionsEvenly(columnDistance, rowDistance, () => {
                row += 1 * rowDirection;
            }, () => {
                column += 1 * columnDirection;
                cells.push({ column, row });
            });
        } else {
            this.splitActionsEvenly(rowDistance, columnDistance, () => {
                column += 1 * columnDirection;
            }, () => {
                row += 1 * rowDirection;
                cells.push({ column, row });
            });
        }

        return cells;
    }

    public static getConnection(from: Point, direction: Vector): CellConnection {
        // Multiply by a large number to minimize the rounding errors
        // when calculating the intersections
        const to = VectorMath.multiply(direction, 1000),
            line = { from, to },
            //TODO: There probably is a smarter way instead of checking
            //      every side of the cell
            top = { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
            right = { from: { x: 1, y: 0 }, to: { x: 1, y: 1 } },
            bottom = { from: { x: 1, y: 1 }, to: { x: 0, y: 1 } },
            left = { from: { x: 0, y: 1 }, to: { x: 0, y: 0 } },
            topIntersection = VectorMath.lineIntersection(line, top),
            rightIntersection = VectorMath.lineIntersection(line, right),
            bottomIntersection = VectorMath.lineIntersection(line, bottom),
            leftIntersection = VectorMath.lineIntersection(line, left),
            intersections = [topIntersection, rightIntersection, bottomIntersection, leftIntersection]
                .filter(i => i !== undefined).length;

        let point: Point | undefined,
            neighborIndex: number | undefined,
            neighborPoint: Point | undefined;

        // There can only be one intersection between a segment moving from the
        // inside to the outside of a convex polygon and the polygon's sides,
        // unless the segment has one of its endpoints on one of the polygon's
        // sides, in which case there are two, and we don't want the one
        // corresponding to the segment's endpoint (because it would be the
        // `from` parameter)
        if (
            topIntersection !== undefined &&
            (from.y !== 0 || intersections === 1)
        ) {
            point = topIntersection;
            neighborIndex = this.topNeighborIndex;
            neighborPoint = { x: point.x, y: 1 };
        } else if (
            rightIntersection !== undefined &&
            (from.x !== 1 || intersections === 1)
        ) {
            point = rightIntersection;
            neighborIndex = this.rightNeighborIndex;
            neighborPoint = { x: 0, y: point.y };
        } else if (
            bottomIntersection !== undefined &&
            (from.y !== 1 || intersections === 1)
        ) {
            point = bottomIntersection;
            neighborIndex = this.bottomNeighborIndex;
            neighborPoint = { x: point.x, y: 0 };
        } else if (
            leftIntersection !== undefined &&
            (from.x !== 0 || intersections === 1)
        ) {
            point = leftIntersection;
            neighborIndex = this.leftNeighborIndex;
            neighborPoint = { x: 1, y: point.y };
        }

        if (point === undefined || neighborIndex === undefined || neighborPoint === undefined) {
            throw new Error(`Could not find connection from (${from.x},${from.y}) with direction (${direction.x},${direction.y}).`);
        }

        return { point, neighborIndex, neighborPoint };
    }

    public static isBottom(quadrant: number) {
        return quadrant === 2 || quadrant === 3;
    }

    public static isLeft(quadrant: number) {
        return quadrant === 0 || quadrant === 2;
    }

    public static isRight(quadrant: number) {
        return quadrant === 1 || quadrant === 3;
    }

    public static isTop(quadrant: number) {
        return quadrant === 0 || quadrant === 1;
    }

    private static splitActionsEvenly(numerator: number, denominator: number, splitAction: () => void, mainAction: () => void) {
        const quotient = Math.floor(numerator / denominator);
        let remainder = denominator === 0 ? numerator : numerator % denominator,
            remainderSpacing = denominator / remainder,
            remainderCounter = 0;

        for (let i = 0; i < denominator; i++) {
            let iterations = quotient;

            if (remainder > 0 && remainderCounter < i) {
                iterations += 1;
                remainder -= 1;
                remainderCounter += remainderSpacing;
            }

            splitAction();

            for (let j = 0; j < iterations; j++) {
                mainAction();
            }
        }

        for (let i = 0; i < remainder; i++) {
            mainAction();
        }
    }
}