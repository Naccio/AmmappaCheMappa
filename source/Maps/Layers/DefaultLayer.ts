import { MapAccessor } from "../MapAccessor";
import { CellIndex } from "../../Model/CellIndex";
import { CellRenderer } from "../Cells/CellRenderer";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { LayerRenderer } from "./LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";
import { VectorMath } from "../../Utilities/VectorMath";

export class DefaultLayer implements DrawingLayer, LayerRenderer {

    constructor(
        private id: string,
        private mapAccessor: MapAccessor,
        private drawer: Drawer,
        private renderer: CellRenderer
    ) {
    }

    public get html() {
        return this.drawer.html;
    }

    public render(drawer?: Drawer) {
        this.draw(this.drawer);
        drawer?.image(this.drawer, VectorMath.zero);
    }

    public update(cell: CellIndex) {
        this.renderer.render(cell, this.drawer, this.id);
    }

    public zoom() {
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