/// <reference path="../MapAccessor.ts" />
/// <reference path="../Model/CellIndex.ts" />
/// <reference path="../Rendering/Drawer.ts" />
/// <reference path="../Rendering/LayerRenderer.ts" />
/// <reference path="DrawingLayer.ts" />

class GridLayer implements DrawingLayer, LayerRenderer {
    private wrapper: HTMLElement;

    constructor(
        private id: string,
        private mapAccessor: MapAccessor,
        private canvasProvider: CanvasProvider
    ) {
        const wrapper = document.createElement('div');

        wrapper.id = this.id;

        this.wrapper = wrapper;
    }

    public get html() {
        return this.wrapper;
    }

    public render(drawer?: Drawer) {
        drawer ??= this.setupCanvas();
        this.renderAtScale(drawer, this.mapAccessor.map.data.pixelsPerCell);
    }

    public update() {
    }

    public zoom() {
        this.setupCanvas();
    }

    private renderAtScale(drawer: Drawer, spacing: number) {
        const map = this.mapAccessor.map.data,
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
        const map = this.mapAccessor.map,
            spacing = map.data.pixelsPerCell / map.zoom,
            drawer = this.canvasProvider.create(this.id + '-canvas', map.data.columns * spacing, map.data.rows * spacing);

        this.renderAtScale(drawer, spacing);

        this.wrapper.innerHTML = '';
        this.wrapper.append(drawer.canvas);

        return drawer;
    }
}