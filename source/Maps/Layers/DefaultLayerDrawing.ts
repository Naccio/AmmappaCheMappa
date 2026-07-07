import { CellRenderer } from "../Cells/CellRenderer";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawingLayer } from "./DrawingLayer";
import { CellContext } from "../Cells/CellContext";
import { GridHelper } from "../../Utilities/GridHelper";

export class DefaultLayerDrawing implements DrawingLayer {

    constructor(
        private id: string,
        cells: readonly CellContext[],
        private drawer: Drawer,
        private renderer: CellRenderer
    ) {
        cells.forEach(c => c.objects.subscribe(_ => this.renderCell(c)));
    }

    public get html() {
        return this.drawer.html;
    }

    public zoom() {
    }

    private renderCell(cell: CellContext) {
        const scale = cell.pixels,
            origin = GridHelper.cellIndexToPosition(cell.index, scale),
            cellImage = this.renderer.render(cell, this.id);

        this.drawer.clear(origin, scale, scale);
        this.drawer.image(cellImage, origin);
    }
}