import { Tool } from "../../../UI/Tools/Tool";
import { ToolContext } from "../../../UI/Tools/ToolContext";
import { VectorMath } from "../../../Utilities/VectorMath";


export class PlacesTool implements Tool {
    public readonly configuration = {
        id: 'places',
        labelResourceId: 'tool_label_places',
        layerTypes: ['terrain']
    };

    public start(context: ToolContext) {
        const cell = context.cell,
            position = context.cellPosition;

        if (cell === undefined) {
            return;
        }

        const radius = VectorMath.add(position, { x: .2, y: 0 }),
            place = cell.createObject('place', [position, radius]);

        cell.clear();
        cell.addObjects([place]);
    }

    public move() {
    }

    public stop() {
    }
}