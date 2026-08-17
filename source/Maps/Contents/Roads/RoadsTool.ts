import { MapObject } from "../../../Model/MapObject";
import { Point } from "../../../Model/Point";
import { LinkedCellTool } from "../../../UI/Tools/LinkedCellTool";
import { VectorMath } from "../../../Utilities/VectorMath";
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

    protected updateObject(cell: CellContext, object: MapObject, position: Point) {
        const points = [...object.points];

        points[1] = VectorMath.round(position, 2);
        cell.update(object.id, points);
    }
}