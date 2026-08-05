import { DrawingLayer } from "../Maps/Layers/DrawingLayer";
import { Drawer } from "../Engine/Rendering/Drawer";
import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";
import { EditorMap } from "../Model/EditorMap";

export class DrawingUI implements DrawingLayer {
    private readonly _drawer: Drawer;

    constructor(
        map: EditorMap,
        drawerFactory: DrawerFactory
    ) {
        const mapData = map.data,
            drawer = drawerFactory.create(mapData.columns * mapData.pixelsPerCell, mapData.rows * mapData.pixelsPerCell);

        this._drawer = drawer;
    }

    public get html() {
        return this._drawer.html;
    }

    public update() {
    }

    public zoom() {
    }
}