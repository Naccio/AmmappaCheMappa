class GridLayer implements DrawingLayer, LayerRenderer {
    private wrapper?: HTMLElement;

    constructor(private id: string, private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
    }

    public render(drawer: Drawer) {
        this.renderAtScale(drawer, this.mapAccessor.map.pixelsPerCell);
    }

    public setup(container: HTMLElement) {
        const wrapper = document.createElement('div');

        wrapper.id = this.id;

        this.wrapper = wrapper;

        container.append(wrapper);
        this.setupCanvas();
    }

    public update(cell: CellIndex) {

    }

    public zoom() {
        this.setupCanvas();
    }

    private renderAtScale(drawer: Drawer, spacing: number) {
        const map = this.mapAccessor.map,
            style: LineStyle = {
                color: '#999',
                lineWidth: 2
            };

        for (let i = 0; i < map.columns + 1; i++) {
            const x = i * spacing,
                y1 = 0,
                y2 = drawer.height;

            drawer.line([{ x, y: y1 }, { x, y: y2 }], style);
        }
        for (let i = 0; i < map.rows + 1; i++) {
            const y = i * spacing,
                x1 = 0,
                x2 = drawer.width;

            drawer.line([{ x: x1, y }, { x: x2, y }], style);
        }
    }

    public setupCanvas() {
        const container = this.wrapper?.parentElement;

        if (!this.wrapper || !container) {
            return;
        }

        const drawer = this.canvasProvider.create(this.id + 'canvas', container.clientWidth, container.clientHeight),
            map = this.mapAccessor.map,
            spacing = map.pixelsPerCell / map.zoom;

        this.renderAtScale(drawer, spacing);

        this.wrapper.innerHTML = '';
        this.wrapper.append(drawer.canvas);
    }
}

class GridLayerFactory implements LayerAbstractFactory {

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
    }

    public type = 'grid';

    createRenderer(id: string): LayerRenderer {
        return new GridLayer(id, this.mapAccessor, this.canvasProvider);
    }

    createDrawing(id: string): DrawingLayer {
        return new GridLayer(id, this.mapAccessor, this.canvasProvider);
    }
}