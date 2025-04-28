/// <reference path='../../MapAccessor.ts'/>
/// <reference path='../../UI/Tools/Tool.ts'/>
/// <reference path='PlacesHelper.ts'/>

class PlacesTool implements Tool {
    public readonly id = 'places';
    public readonly labelResourceId = 'tool_label_places';

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