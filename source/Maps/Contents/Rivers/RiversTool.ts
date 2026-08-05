import { Point } from "../../../Model/Point";
import { LinkedCellTool } from "../../../UI/Tools/LinkedCellTool";
import { MathHelper } from "../../../Utilities/MathHelper";
import { VectorMath } from "../../../Utilities/VectorMath";
import { CellContext } from "../../Cells/CellContext";


export class RiversTool extends LinkedCellTool {
    public readonly configuration = {
        id: 'rivers',
        labelResourceId: 'tool_label_rivers',
        layerTypes: ['terrain']
    };

    protected createObject(cell: CellContext, from: Point, to: Point) {
        const previous = this.previousObject;

        let bend1 = {
            x: MathHelper.random(.2, .8),
            y: MathHelper.random(.2, .8)
        };

        if (previous !== undefined) {
            bend1 = VectorMath.startOperation(previous.points[3])
                .direction(previous.points[1])
                .multiply(MathHelper.random(.2, .5))
                .add(from);
        }

        bend1 = VectorMath.round(bend1, 2);
        const bend2 = {
            x: MathHelper.round(MathHelper.random(.2, .8), 2),
            y: MathHelper.round(MathHelper.random(.2, .8), 2)
        },
            river = cell.createObject('river', [from, to, bend1, bend2]);

        cell.clear();
        cell.addObjects([river]);

        return river;
    }
}