import { GridHelper } from "../../Utilities/GridHelper";
import { CellIndex } from "../../Model/CellIndex";
import { Point } from "../../Model/Point";
import { Tool } from "./Tool";
import { ToolConfiguration } from "./ToolConfiguration";
import { CellContext } from "../../Maps/Cells/CellContext";
import { MapManager } from "../../Maps/MapManager";

export abstract class CellTool implements Tool {
    private lastCell?: CellIndex;
    private lastPosition?: Point;

    public abstract readonly configuration: ToolConfiguration;

    public constructor(protected map: MapManager) {
    }

    protected abstract useOnCell(cell: CellContext): void;

    public start(position: Point) {
        this.guardedUse(position);
    }

    public move(position?: Point) {
        if (position !== undefined) {
            this.guardedUse(position);
        }
    }

    public stop(position?: Point) {
        if (position !== undefined) {
            this.guardedUse(position);
        }
        this.lastCell = undefined;
        this.lastPosition = undefined;
    }

    private guardedUse(position: Point) {
        const cellIndex = this.map.mapAccessor.getIndex(position);

        if (cellIndex !== undefined && !GridHelper.cellIsEqual(cellIndex, this.lastCell)) {
            const cell = this.map.getCell(cellIndex);

            if (this.lastPosition === undefined) {
                this.useOnCell(cell);
            } else {
                this.map.mapAccessor.getIndexes(this.lastPosition, position)
                    .map(i => this.map.getCell(i))
                    .forEach(c => this.useOnCell(c));
            }
        }

        this.lastCell = cellIndex;
        this.lastPosition = position;
    }
}