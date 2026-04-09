import { LayersManager } from "../../Layers/LayersManager";
import { MapAccessor } from "../../MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { CellTool } from "./CellTool";

export class Eraser extends CellTool {
    public readonly configuration = {
        id: 'eraser',
        labelResourceId: 'tool_label_eraser',
        layerTypes: ['terrain', 'text']
    };

    constructor(mapAccessor: MapAccessor, private layers: LayersManager) {
        super(mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        this.layers.setObjects(cell, []);
    }
}