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
        this.draw();
        drawer?.image(this.drawer, VectorMath.zero);
    }

    public update(cell: CellIndex) {
        this.renderCell(cell);
    }

    public zoom() {
    }

    private draw() {
        const map = this.mapAccessor.map.data;

        for (let column = 0; column < map.columns; column++) {
            for (let row = 0; row < map.rows; row++) {
                this.renderCell({ column, row });
            }
        }
    }

    private renderCell(cell: CellIndex) {
        const scale = this.mapAccessor.map.data.pixelsPerCell,
            origin = {
                x: cell.column * scale,
                y: cell.row * scale
            },
            cellImage = this.renderer.render(cell, this.id);

        this.drawer.clear(origin, scale, scale);
        this.drawer.image(cellImage, origin);
    }
}