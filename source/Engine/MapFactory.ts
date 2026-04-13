import { LayersHelper } from "../Layers/LayersHelper";
import { Localizer } from "./Localization/Localizer";
import { EditorMap } from "../Model/EditorMap";
import { Utilities } from "../Utilities/Utilities";

export class MapFactory {
    public constructor(private localizer: Localizer) {
    }

    public create(title: string | undefined, width: number, height: number): EditorMap {
        const layers = [
            LayersHelper.create('text', this.localizer['layer_type_text']),
            LayersHelper.create('grid', this.localizer['layer_type_grid']),
            LayersHelper.create('terrain', this.localizer['layer_type_terrain'])
        ];

        return {
            zoom: 2,
            position: { x: .5, y: .5 },
            activeLayer: layers[2].id,
            data: {
                id: Utilities.generateId('map'),
                title,
                columns: width,
                rows: height,
                pixelsPerCell: 100,
                objects: {},
                layers
            }
        };
    }
}