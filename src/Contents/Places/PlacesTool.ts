/// <reference path='../../MapAccessor.ts'/>
/// <reference path='../../Rendering/CellRenderer.ts'/>
/// <reference path='../../UI/Tools/Tool.ts'/>
/// <reference path='PlacesHelper.ts'/>

class PlacesTool implements Tool {
    public readonly id = 'places';
    public readonly labelResourceId = 'tool_label_places';

    constructor(private mapAccessor: MapAccessor, private renderer: CellRenderer) {
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

        this.mapAccessor.setObjects(cell, [place]);

        this.renderer.render(cell, layer);
    }
    
    public move() {
    }

    public stop() {
    }
}