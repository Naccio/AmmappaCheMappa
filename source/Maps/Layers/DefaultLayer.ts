import { CellRenderer } from "../Cells/CellRenderer";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { LayerRenderer } from "./LayerRenderer";
import { DrawingLayer } from "./DrawingLayer";
import { VectorMath } from "../../Utilities/VectorMath";
import { CellManager } from "../Cells/CellManager";

export class DefaultLayer implements DrawingLayer, LayerRenderer {

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

    public render(drawer?: Drawer) {
        this.cells.forEach(c => this.renderCell(c));
        drawer?.image(this.drawer, VectorMath.zero);
    }

    public zoom() {
    }

    private renderCell(cell: CellManager) {
        const scale = cell.pixels,
            origin = {
                x: cell.index.column * scale,
                y: cell.index.row * scale
            },
            cellImage = this.renderer.render(cell, this.id);

        console.log(cell.index);

        this.drawer.clear(origin, scale, scale);
        this.drawer.image(cellImage, origin);
    }
}