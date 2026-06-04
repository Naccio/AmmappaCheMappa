import { MapManager } from "../../Maps/MapManager";
import { CellIndex } from "../../Model/CellIndex";
import { CellTool } from "./CellTool";

export class Eraser extends CellTool {
    public readonly configuration = {
        id: 'eraser',
        labelResourceId: 'tool_label_eraser',
        layerTypes: ['terrain', 'text']
    };

    constructor(private readonly map: MapManager) {
        super(map.mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        this.map.clear(cell);
    }
}