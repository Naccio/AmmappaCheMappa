class MapLoader {
    constructor(private mapAccessor: MapAccessor, private drawingArea: DrawingArea) {
    }

    public load(map: MapData) {
        this.mapAccessor.map = map;
        this.drawingArea.setup(map);
    }
}