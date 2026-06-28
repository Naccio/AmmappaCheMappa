import { GridHelper } from "../../Utilities/GridHelper";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { CellGraphics } from "./CellGraphics";
import { CellManager } from "./CellManager";

export class CellRenderer {
    constructor(
        private drawerFactory: DrawerFactory,
        private contents: ContentConfiguration[]) {
    }

    public render(cell: CellManager, layer: string) {
        const size = cell.pixels,
            cellName = GridHelper.cellIndexToName(cell.index),
            drawer = this.drawerFactory.create('cell-renderer-' + cellName, size, size, size),
            objects = cell.objects.value.filter(o => o.layer === layer),
            graphics = new CellGraphics(objects, this.contents);

        graphics.render(drawer);

        return drawer;
    }
}