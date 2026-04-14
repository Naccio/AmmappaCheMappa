import { LayersManager } from "../../Maps/Layers/LayersManager";
import { MapAccessor } from "../../Maps/MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { CellTool } from "../../UI/Tools/CellTool";
import { Mountain } from "./Mountain";
import { MountainFactory } from "./MountainFactory";

export class MountainsTool extends CellTool {
    public readonly configuration = {
        id: 'mountains',
        labelResourceId: 'tool_label_mountains',
        layerTypes: ['terrain']
    };

    constructor(mapAccessor: MapAccessor, private mountainFactory: MountainFactory, private layers: LayersManager) {
        super(mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const mountains: Mountain[] = [];

        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const mountain = this.mountainFactory.create(quadrant);

            mountains.push(mountain);
        }

        this.layers.setObjects(cell, mountains);
    }
}