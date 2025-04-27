/// <reference path="../MapAccessor.ts"/>
/// <reference path="../UI/CanvasProvider.ts"/>
/// <reference path="DrawingLayer.ts"/>

class UILayer implements DrawingLayer {
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
            drawer = this.canvasProvider.create(this.id, map.columns * map.pixelsPerCell, map.rows * map.pixelsPerCell, 1 / map.zoom);

        container.append(drawer.canvas);
        this._drawer = drawer;
    }

    public zoom() {
        this._drawer?.scale(1 / this.mapAccessor.map.zoom);
    }
}