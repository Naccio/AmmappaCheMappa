import { GridHelper } from "../../Utilities/GridHelper";
import { MapAccessor } from "../../Engine/MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { Point } from "../../Model/Point";
import { Tool } from "./Tool";
import { ToolConfiguration } from "./ToolConfiguration";

export abstract class CellTool implements Tool {
    private lastCell?: CellIndex;
    private lastPosition?: Point;

    public abstract readonly configuration: ToolConfiguration;

    public constructor(protected mapAccessor: MapAccessor) {
    }

    protected abstract useOnCell(cell: CellIndex): void;

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
        const cell = this.mapAccessor.getIndex(position);

        if (cell !== undefined && !GridHelper.cellIsEqual(cell, this.lastCell)) {
            if (this.lastPosition === undefined) {
                this.useOnCell(cell);
            } else {
                const cells = this.mapAccessor.getIndexes(this.lastPosition, position);

                for (let cell of cells) {
                    this.useOnCell(cell);
                }
            }
        }

        this.lastCell = cell;
        this.lastPosition = position;
    }
}