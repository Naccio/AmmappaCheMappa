import { Point } from "../../../Model/Point";
import { LinkedCellTool } from "../../../UI/Tools/LinkedCellTool";
import { CellContext } from "../../Cells/CellContext";


export class RoadsTool extends LinkedCellTool {
    public readonly configuration = {
        id: 'roads',
        labelResourceId: 'tool_label_roads',
        layerTypes: ['terrain']
    };

    protected createObject(cell: CellContext, from: Point, to: Point) {
        const road = cell.createObject('road', [from, to]);

        cell.clear();
        cell.addObjects([road]);

        return road;
    }
}