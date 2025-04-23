class MapFactory {
    public create(width: number, height: number) : GridMap {
        return {
            columns: width,
            rows: height,
            pixelsPerCell: 100,
            zoom: 2,
            objects: {},
            layers: []
        };
    }
}