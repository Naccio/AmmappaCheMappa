import { GridHelper } from "../../Utilities/GridHelper";
import { CellIndex } from "../../Model/CellIndex";
import { Tool } from "./Tool";
import { ToolConfiguration } from "./ToolConfiguration";
import { CellContext } from "../../Maps/Cells/CellContext";
import { MapManager } from "../../Maps/MapManager";
import { ToolContext } from "./ToolContext";

export abstract class CellTool implements Tool {
    private lastCell?: CellIndex;

    public abstract readonly configuration: ToolConfiguration;

    public constructor(protected map: MapManager) {
    }

    protected abstract useOnCell(cell: CellContext): void;

    public start(context: ToolContext) {
        this.guardedUse(context);
    }

    public move(context: ToolContext) {
        this.guardedUse(context);
    }

    public stop(context: ToolContext) {
        this.guardedUse(context);
        this.lastCell = undefined;
    }

    private guardedUse(context: ToolContext) {
        const cell = context.cell,
            cellIndex = cell?.index;

        if (cell !== undefined && cellIndex !== undefined && !GridHelper.cellIsEqual(cellIndex, this.lastCell)) {
            if (this.lastCell === undefined) {
                this.useOnCell(cell);
            } else {
                GridHelper.getConnectingCells(this.lastCell, cellIndex)
                    .forEach(c => {
                        const cell = this.map.getCell(c);
                        this.useOnCell(cell);
                    });
            }
        }

        this.lastCell = cellIndex;
    }
}