import { DrawingLayer } from "../Maps/Layers/DrawingLayer";
import { MapAccessor } from "../Maps/MapAccessor";
import { Drawer } from "../Engine/Rendering/Drawer";
import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";

export class DrawingUI implements DrawingLayer {
    private readonly _drawer: Drawer;

    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory
    ) {
        const map = this.mapAccessor.map,
            mapData = map.data,
            id = mapData.id + '-ui-layer',
            drawer = this.drawerFactory.create(id, mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell);

        this._drawer = drawer;
    }

    public get drawer(): Drawer {
        return this._drawer;
    }

    public get html() {
        return this._drawer.html;
    }

    public update() {
    }

    public zoom() {
    }
}