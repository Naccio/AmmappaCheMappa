import { DrawingLayer } from "../Maps/Layers/DrawingLayer";
import { MapAccessor } from "../Maps/MapAccessor";
import { CanvasDrawer } from "../Engine/Rendering/CanvasDrawer";
import { Drawer } from "../Engine/Rendering/Drawer";
import { CanvasProvider } from "./CanvasProvider";

export class DrawingUI implements DrawingLayer {
    private readonly _drawer: CanvasDrawer;

    constructor(private mapAccessor: MapAccessor, private canvasProvider: CanvasProvider) {
        const map = this.mapAccessor.map,
            mapData = map.data,
            id = mapData.id + '-ui-layer',
            drawer = this.canvasProvider.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell, 1 / map.zoom);

        this._drawer = drawer;
    }

    public get drawer(): Drawer {
        return this._drawer;
    }

    public get html() {
        return this._drawer.canvas;
    }

    public update() {
    }

    public zoom() {
        this._drawer.scale(1 / this.mapAccessor.map.zoom);
    }
}