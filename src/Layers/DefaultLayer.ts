/// <reference path="../Rendering/CellRenderer.ts" />

class DefaultLayer implements DrawingLayer, LayerRenderer {

    constructor(private id: string, private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public render(drawer: Drawer) {
        const map = this.mapAccessor.map,
            tmpDrawer = this.canvasProvider.create(this.id + '-tmp', map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);

        this.draw(tmpDrawer);
        drawer.image(tmpDrawer);
    }

    public setup(container: HTMLElement) {
        const map = this.mapAccessor.map,
            drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);

        container.append(drawer.canvas);

        this.draw(drawer);
    }

    public update(cell: CellIndex) {
        const drawer = this.canvasProvider.get(this.id);

        this.renderer.render(cell, drawer, this.id);
    }

    public zoom() {
        const drawer = this.canvasProvider.get(this.id);

        drawer?.scale(1 / this.mapAccessor.map.zoom);
    }

    private draw(drawer: Drawer) {
        const map = this.mapAccessor.map;

        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, drawer, this.id);
            }
        }
    }
}