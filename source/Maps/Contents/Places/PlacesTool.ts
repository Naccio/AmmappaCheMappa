import { Point } from "../../../Model/Point";
import { Tool } from "../../../UI/Tools/Tool";
import { VectorMath } from "../../../Utilities/VectorMath";
import { MapManager } from "../../MapManager";


export class PlacesTool implements Tool {
    public readonly configuration = {
        id: 'places',
        labelResourceId: 'tool_label_places',
        layerTypes: ['terrain']
    };

    constructor(private readonly map: MapManager) {
    }

    public start(point: Point) {
        const mapAccessor = this.map.mapAccessor,
            cellIndex = mapAccessor.getIndex(point);

        if (cellIndex === undefined) {
            return;
        }

        const position = mapAccessor.normalizedPosition(cellIndex, point),
            cell = this.map.getCell(cellIndex),
            radius = VectorMath.add(position, { x: .2, y: 0 }),
            place = cell.createObject('place', [position, radius]);

        cell.clear();
        cell.addObjects([place]);
    }

    public move() {
    }

    public stop() {
    }
}