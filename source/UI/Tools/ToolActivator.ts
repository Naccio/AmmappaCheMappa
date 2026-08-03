import { MapManager } from "../../Maps/MapManager";
import { Vector } from "../../Model/Vector";
import { VectorMath } from "../../Utilities/VectorMath";
import { Toolbar } from "./Toolbar";
import { ToolContext } from "./ToolContext";

export class ToolActivator {
    constructor(
        //TODO: Should it depend on UI element?
        private readonly toolbar: Toolbar,
        private readonly map: MapManager
    ) {
    }

    public start(position: Vector) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.start(context);
    }

    public move(position: Vector) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.move(context);
    }

    public stop(position?: Vector) {
        const context = this.createContext(position);
        this.toolbar.activeTool?.stop(context);
    }

    private createContext(position?: Vector) {
        const cellIndex = this.map.mapAccessor.getIndex(position),
            context: ToolContext = {
                mapPosition: position ?? VectorMath.zero,
                cellPosition: VectorMath.zero
            };

        if (position !== undefined && cellIndex !== undefined) {
            context.cell = this.map.getCell(cellIndex);
            context.cellPosition = this.map.mapAccessor.normalizedPosition(cellIndex, position);
        }

        return context;
    }
}