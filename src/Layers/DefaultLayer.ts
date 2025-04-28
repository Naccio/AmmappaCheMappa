/// <reference path="../Rendering/CellRenderer.ts" />

class DefaultLayer implements DrawingLayer, LayerRenderer {
    private drawer?: Drawer;

    constructor(private id: string, private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public render(drawer: Drawer) {
        if (this.drawer === undefined) {
            return;
        }

        this.draw(this.drawer);
        drawer.image(this.drawer);
    }

    public setup(container: HTMLElement) {
        const map = this.mapAccessor.map,
            drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);

        container.append(drawer.canvas);
        this.drawer = drawer;

        this.draw(drawer);
    }

    public update(cell: CellIndex) {
        if (this.drawer === undefined) {
            return;
        }

        this.renderer.render(cell, this.drawer, this.id);
    }

    public zoom() {
        this.drawer?.scale(1 / this.mapAccessor.map.zoom);
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