class GridHelper {
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

    public static cellIsEqual(cell1?: CellIndex, cell2?: CellIndex) {
        return cell1?.column === cell2?.column && cell1?.row === cell2?.row;
    }

    public static cellNameToIndex(name: string) : CellIndex {
        const splitName = name.split(/([0-9]+)/),
            // -1 to switch from 1-based to 0-based numbering
            column = this.columnNameToNumber(splitName[0]) - 1,
            row = parseInt(splitName[1]) - 1;

        return { column, row }
    }

    public static columnNameToNumber(name: string) {
        let number = 0;

        name = name.toUpperCase();
        for (let i = 0; i < name.length; i++)
        {
            const charCode = name.charCodeAt(i);

            number *= 26;
            number += charCode - 64;
        }

        return number;
    }
    
    public static columnNumberToName(number: number)
    {
        let name = '';
    
        while (number > 0)
        {
            const modulo = (number - 1) % 26;
            name = String.fromCharCode(65 + modulo) + name;
            number = Math.floor((number - modulo) / 26);
        } 
    
        return name;
    }

    public static getConnection(cell: CellIndex, from: Point, direction: Vector) : [Point, CellIndex, Point] {
        // Multiply by a large number to minimize the rounding errors
        // when calculating the intersections
        const distantTo = VectorMath.multiply(direction, 1000),
            line = { from, to: distantTo },
            //TODO: There probably is a smarter way instead of checking
            //      every side of the cell
            top = { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
            right = { from: { x: 1, y: 0 }, to: { x: 1, y: 1 } },
            bottom = { from: { x: 0, y: 1 }, to: { x: 1, y: 1 } },
            left = { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } };

        let to = VectorMath.lineIntersection(line, top),
            nextCell: CellIndex | undefined = undefined,
            nextFrom: Point | undefined = undefined;

        if (from.y !== 0 && to !== undefined) {
            to.y = 0;
            nextCell = { column: cell.column, row: cell.row - 1 };
            nextFrom = { x: to.x, y: 1 };

            return [to, nextCell, nextFrom];
        }

        to = VectorMath.lineIntersection(line, right);

        if (from.x !== 1 && to !== undefined) {
            to.x = 1;
            nextCell = { column: cell.column + 1, row: cell.row };
            nextFrom = { x: 0, y: to.y };

            return [to, nextCell, nextFrom];
        }

        to = VectorMath.lineIntersection(line, bottom);

        if (from.y !== 1 && to !== undefined) {
            to.y = 1;
            nextCell = { column: cell.column, row: cell.row + 1 };
            nextFrom = { x: to.x, y: 0 };

            return [to, nextCell, nextFrom];
        }

        to = VectorMath.lineIntersection(line, left);

        if (from.x !== 0 && to !== undefined) {
            to.x = 0;
            nextCell = { column: cell.column - 1, row: cell.row };
            nextFrom = { x: 1, y: to.y };

            return [to, nextCell, nextFrom];
        }

        throw new Error('Could not find next connection.');
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
}