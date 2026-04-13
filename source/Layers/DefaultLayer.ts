import { MapAccessor } from "../Engine/MapAccessor";
import { CellIndex } from "../Model/CellIndex";
import { CanvasDrawer } from "../Rendering/CanvasDrawer";
import { CellRenderer } from "../Rendering/CellRenderer";
import { Drawer } from "../Rendering/Drawer";
import { LayerRenderer } from "../Rendering/LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";

export class DefaultLayer implements DrawingLayer, LayerRenderer {

    constructor(
        private id: string,
        private mapAccessor: MapAccessor,
        private drawer: CanvasDrawer,
        private renderer: CellRenderer
    ) {
    }

    public get html() {
        return this.drawer.canvas;
    }

    public render(drawer?: Drawer) {
        this.draw(this.drawer);
        drawer?.image(this.drawer);
    }

    public update(cell: CellIndex) {
        this.renderer.render(cell, this.drawer, this.id);
    }

    public zoom() {
        this.drawer.scale(1 / this.mapAccessor.map.zoom);
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