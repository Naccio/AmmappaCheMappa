class DefaultLayer implements DrawingLayer, LayerRenderer {
    private readonly id = 'terrain';

    private drawer?: Drawer;

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider, private renderer: CellRenderer) {
    }

    public render(drawer: Drawer) {
        if (this.drawer === undefined) {
            return;
        }

        this.draw();
        drawer.image(this.drawer);
    }

    public setup(container: HTMLElement) {
        const map = this.mapAccessor.map,
            drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);

        container.append(drawer.canvas);
        this.drawer = drawer;

        this.draw();
    }

    public zoom() {
        this.drawer?.scale(1 / this.mapAccessor.map.zoom);
    }

    private draw() {
        const map = this.mapAccessor.map;

        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderer.render({ column, row }, this.id);
            }
        }
    }
}