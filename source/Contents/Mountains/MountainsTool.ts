import { LayersManager } from "../../Maps/Layers/LayersManager";
import { MapAccessor } from "../../Maps/MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { CellTool } from "../../UI/Tools/CellTool";
import { GridHelper } from "../../Utilities/GridHelper";
import { MathHelper } from "../../Utilities/MathHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { Mountain } from "./Mountain";

export class MountainsTool extends CellTool {
    public readonly configuration = {
        id: 'mountains',
        labelResourceId: 'tool_label_mountains',
        layerTypes: ['terrain']
    };

    constructor(mapAccessor: MapAccessor, private layers: LayersManager) {
        super(mapAccessor);
    }

    public useOnCell(cell: CellIndex) {
        const mountains: Mountain[] = [];

        for (let quadrant = 0; quadrant < 4; quadrant++) {
            const mountain = this.create(quadrant);

            mountains.push(mountain);
        }

        this.layers.setObjects('mountain', cell, mountains);
    }

    private create(quadrant?: number): Mountain {
        const M = MathHelper,
            scale = quadrant === undefined ? 1 : .5,
            width = M.round(M.random(.8, .9) * scale, 2),
            height = M.round(M.random(.5, .8) * scale, 2),
            x = M.random(.4, .6) * scale,
            y = M.random(.8, 1) * scale,
            position = VectorMath
                .startOperation(GridHelper.quadrantShift[quadrant ?? 0])
                .multiply(scale)
                .add({ x, y })
                .round(2);

        return {
            position,
            width,
            height
        }
    }
}