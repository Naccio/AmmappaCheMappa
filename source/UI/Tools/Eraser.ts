import { CellContext } from "../../Maps/Cells/CellContext";
import { MapManager } from "../../Maps/MapManager";
import { CellTool } from "./CellTool";

export class Eraser extends CellTool {
    public readonly configuration = {
        id: 'eraser',
        labelResourceId: 'tool_label_eraser',
        layerTypes: ['terrain', 'text']
    };

    constructor(map: MapManager) {
        super(map);
    }

    public useOnCell(cell: CellContext) {
        cell.clear();
    }
}