import { LayersManager } from "../../Layers/LayersManager";
import { MapAccessor } from "../../Engine/MapAccessor";
import { Point } from "../../Model/Point";
import { Tool } from "../../UI/Tools/Tool";
import { VectorMath } from "../../Utilities/VectorMath";
import { Place } from "./Place";
import { PlacesHelper } from "./PlacesHelper";

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

        const layer = PlacesHelper.layer,
            normalizedPosition = this.mapAccessor.normalizedPosition(cell, point),
            position = VectorMath.round(normalizedPosition, 2),
            place: Place = {
                type: PlacesHelper.objectType,
                layer,
                position
            };

        this.layers.setObjects(cell, [place]);
    }

    public move() {
    }

    public stop() {
    }
}