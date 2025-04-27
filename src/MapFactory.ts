/// <reference path="Layers/LayersHelper.ts" />

class MapFactory {
    public constructor(private localizer: Localizer) {
    }

    public create(width: number, height: number): GridMap {
        return {
            columns: width,
            rows: height,
            pixelsPerCell: 100,
            zoom: 2,
            objects: {},
            layers: [
                LayersHelper.create('text', this.localizer['layer_type_text']),
                LayersHelper.create('grid', this.localizer['layer_type_grid']),
                LayersHelper.create('terrain', this.localizer['layer_type_terrain'])
            ]
        };
    }
}