class MapAccessor {
    private _map?: GridMap;
    private _cells: GridCell[][] = [];

    constructor() {
    }

    public get map() {
        if (this._map === undefined) {
            throw new Error('No map active');
        }

        return this._map;
    }

    public set map(map: GridMap) {
        this._map = map;
        this.save();

        for (let column = 0; column < map.columns; column++) {
            this._cells[column] = [];
            for (let row = 0; row < map.rows; row++) {
                this._cells[column][row] = {
                    coordinates: { column, row },
                    objects: []
                }
            }
        }

        for (let key in map.objects) {
            const index = GridHelper.cellNameToIndex(key),
                cell = this._cells[index.column][index.row];

            cell.objects = map.objects[key];
        }
    }

    public get scale() {
        return this.map.zoom / this.map.pixelsPerCell;
    }

    public absolutePosition(cell: CellIndex, normalizedPosition: Point): Point {
        const cellPosition = {
            x: cell.column,
            y: cell.row
        };

        return VectorMath
            .startOperation(normalizedPosition)
            .add(cellPosition)
            .divide(this.scale);
    }

    public getCell(index: CellIndex) {
        return this._cells[index.column][index.row];
    }

    public getIndex(position?: Point) {
        if (position === undefined) {
            return undefined;
        }

        const map = this.map,
            cell = VectorMath.multiply(position, this.scale),
            column = Math.floor(cell.x),
            row = Math.floor(cell.y);

        if (row < 0 || row >= map.rows || column < 0 || column >= map.columns) {
            return undefined;
        }

        return { column, row };
    }

    public getIndexes(from: Point, to: Point) {
        const fromCell = this.getIndex(from),
            toCell = this.getIndex(to);

        if (fromCell === undefined || toCell === undefined) {
            return [];
        }

        if (fromCell.column == toCell.column && fromCell.row === toCell.row) {
            return [fromCell];
        }

        return this.getConnectingCells(fromCell, toCell);
    }

    public getPosition(index: CellIndex): Point {
        const shift = {
            x: index.column,
            y: index.row
        };

        return VectorMath.multiply(shift, this.map.pixelsPerCell);
    }

    private getConnectingCells(from: CellIndex, to: CellIndex) {
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

    public normalizedPosition(cell: CellIndex, absolutePosition: Point): Point {
        const cellPosition = {
            x: cell.column,
            y: cell.row
        };

        return VectorMath
            .startOperation(absolutePosition)
            .multiply(this.scale)
            .subtract(cellPosition);
    }

    public setObjects(index: CellIndex, objects: MapObject[]) {
        const cell = this._cells[index.column][index.row],
            cellName = GridHelper.cellIndexToName(index);

        if (objects.length === 0) {
            delete this.map.objects[cellName];
        } else {
            this.map.objects[cellName] = objects;
        }

        cell.objects = objects;

        this.save();
    }

    private save() {
        localStorage.setItem('map', JSON.stringify(this._map));
    }

    private splitActionsEvenly(numerator: number, denominator: number, splitAction: () => void, mainAction: () => void) {
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