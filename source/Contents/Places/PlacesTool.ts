import { LayersManager } from "../../Maps/Layers/LayersManager";
import { MapAccessor } from "../../Maps/MapAccessor";
import { Point } from "../../Model/Point";
import { Tool } from "../../UI/Tools/Tool";
import { VectorMath } from "../../Utilities/VectorMath";
import { Place } from "./Place";

export class PlacesTool implements Tool {
    public readonly configuration = {
        id: 'places',
        labelResourceId: 'tool_label_places',
        layerTypes: ['terrain']
    };

    constructor(private mapAccessor: MapAccessor, private layers: LayersManager) {
    }

    public start(point: Point) {
        const cell = this.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const normalizedPosition = this.mapAccessor.normalizedPosition(cell, point),
            position = VectorMath.round(normalizedPosition, 2),
            place: Place = { position };

        this.layers.setObjects('place', cell, [place]);
    }

    public move() {
    }

    public stop() {
    }
}