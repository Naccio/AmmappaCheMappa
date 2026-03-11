/// <reference path="../Layers/DrawingLayer.ts"/>
/// <reference path="../MapAccessor.ts"/>
/// <reference path="CanvasProvider.ts"/>

class DrawingUI implements DrawingLayer {
    private readonly id = 'ui';

    private _drawer?: Drawer;

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
    }

    public get drawer(): Drawer {
        if (this._drawer === undefined) {
            throw new Error('UI not initialized.');
        }

        return this._drawer;
    }

    public setup(container: HTMLElement) {
        const map = this.mapAccessor.map,
            mapData = map.data,
            drawer = this.canvasProvider.create(this.id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);

        container.append(drawer.canvas);
        this._drawer = drawer;
    }

    public update(cell: CellIndex) {

    }

    public zoom() {
        this._drawer?.scale(1 / this.mapAccessor.map.zoom);
    }
}