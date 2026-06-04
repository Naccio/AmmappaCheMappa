import { MapManager } from "../../Maps/MapManager";
import { Point } from "../../Model/Point";
import { Tool } from "../../UI/Tools/Tool";
import { VectorMath } from "../../Utilities/VectorMath";

export class PlacesTool implements Tool {
    public readonly configuration = {
        id: 'places',
        labelResourceId: 'tool_label_places',
        layerTypes: ['terrain']
    };

    constructor(private readonly map: MapManager) {
    }

    public start(point: Point) {
        const cell = this.map.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const position = this.map.mapAccessor.normalizedPosition(cell, point),
            radius = VectorMath.add(position, { x: .2, y: 0 }),
            place = this.map.createObject('place', cell, [position, radius]);

        this.map.clear(cell);
        this.map.addObjects([place]);
    }

    public move() {
    }

    public stop() {
    }
}