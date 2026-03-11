/// <reference path="MapAccessor.ts" />
/// <reference path="Model/EditorMap.ts" />
/// <reference path="UI/DrawingArea.ts" />

class MapLoader {
    constructor(private mapAccessor: MapAccessor, private drawingArea: DrawingArea) {
    }

    public load(map: EditorMap) {
        this.mapAccessor.map = map;
        this.drawingArea.setup(map);
    }
}