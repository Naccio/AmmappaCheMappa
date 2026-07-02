import { CellRenderer } from "../Cells/CellRenderer";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawingLayer } from "./DrawingLayer";
import { CellManager } from "../Cells/CellManager";
import { GridHelper } from "../../Utilities/GridHelper";

export class DefaultLayerDrawing implements DrawingLayer {

    constructor(
        private id: string,
        private cells: readonly CellManager[],
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

    private renderCell(cell: CellManager) {
        const scale = cell.pixels,
            origin = GridHelper.cellIndexToPosition(cell.index, scale),
            cellImage = this.renderer.render(cell, this.id);

        this.drawer.clear(origin, scale, scale);
        this.drawer.image(cellImage, origin);
    }
}