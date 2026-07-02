import { CellRenderer } from "../Cells/CellRenderer";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { LayerRenderer } from "./LayerRenderer";
import { CellManager } from "../Cells/CellManager";
import { GridHelper } from "../../Utilities/GridHelper";

export class DefaultLayerRenderer implements LayerRenderer {

    constructor(
        private id: string,
        private cells: readonly CellManager[],
        private renderer: CellRenderer
    ) {
    }

    public render(drawer: Drawer) {
        this.cells.forEach(c => this.renderCell(drawer, c));
    }

    private renderCell(drawer: Drawer, cell: CellManager) {
        const position = GridHelper.cellIndexToPosition(cell.index, cell.pixels),
            cellImage = this.renderer.render(cell, this.id);

        drawer.image(cellImage, position);
    }
}