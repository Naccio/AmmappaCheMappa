import { MapManager } from "../../Maps/MapManager";
import { Point } from "../../Model/Point";
import { VectorMath } from "../../Utilities/VectorMath";
import { Toolbar } from "./Toolbar";
import { ToolContext } from "./ToolContext";

export class ToolActivator {
    private previousPosition?: Point;

    constructor(
        //TODO: Should it depend on UI element?
        private readonly toolbar: Toolbar,
        private readonly map: MapManager
    ) {
    }

    public start(position: Point) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.start(context);
        this.previousPosition = position;
    }

    public move(position: Point) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.move(context);
        this.previousPosition = position;
    }

    public stop(position?: Point) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.stop(context);
        this.previousPosition = undefined;
    }

    private createContext(position?: Point) {
        const cellIndex = this.map.mapAccessor.getIndex(position),
            context: ToolContext = {
                position: position ?? VectorMath.zero,
                direction: VectorMath.zero,
                cellPosition: VectorMath.zero
            };

        if (position !== undefined && cellIndex !== undefined) {
            context.cell = this.map.getCell(cellIndex);
            context.cellPosition = this.map.mapAccessor.normalizedPosition(cellIndex, position);

            if (this.previousPosition !== undefined) {
                context.direction = VectorMath.direction(this.previousPosition, position);
            }
        }

        return context;
    }
}