/// <reference path="../Rendering/CellRenderer.ts" />

class DefaultLayer implements DrawingLayer, LayerRenderer {

    constructor(private id: string, private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public render(drawer: Drawer) {
        const map = this.mapAccessor.map.data,
            tmpDrawer = this.createDrawer(this.id + '-tmp');

        this.draw(tmpDrawer);
        drawer.image(tmpDrawer);
    }

    public setup(container: HTMLElement) {
        const map = this.mapAccessor.map.data,
            drawer = this.createDrawer(this.id);

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

    private createDrawer(id: string) {
        const map = this.mapAccessor.map,
            mapData = map.data;

        return this.canvasProvider.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);
    }

    private draw(drawer: Drawer) {
        const map = this.mapAccessor.map.data;

        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, drawer, this.id);
            }
        }
    }
}