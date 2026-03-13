/// <reference path="Layers/LayersHelper.ts" />
/// <reference path="Model/EditorMap.ts" />

class MapFactory {
    public constructor(private localizer: Localizer) {
    }

    public create(width: number, height: number): EditorMap {
        const layers = [
            LayersHelper.create('text', this.localizer['layer_type_text']),
            LayersHelper.create('grid', this.localizer['layer_type_grid']),
            LayersHelper.create('terrain', this.localizer['layer_type_terrain'])
        ];

        return {
            zoom: 2,
            position: { x: .5, y: .5 },
            activeLayer: layers[0].id,
            data: {
                id: Utilities.generateId('map'),
                columns: width,
                rows: height,
                pixelsPerCell: 100,
                objects: {},
                layers
            }
        };
    }
}