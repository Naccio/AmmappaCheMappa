class CellDrawerFactory {
    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
    }

    public create(cell: CellIndex, layer: string) {
        const canvas = this.canvasProvider.get(layer);

        return new CellDrawer(cell, this.mapAccessor, canvas);
    }
}