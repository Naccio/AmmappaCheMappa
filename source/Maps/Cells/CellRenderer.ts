import { CellIndex } from "../../Model/CellIndex";
import { MapAccessor } from "../MapAccessor";
import { GridHelper } from "../../Utilities/GridHelper";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { CellGraphics } from "./CellGraphics";

export class CellRenderer {
    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory,
        private contents: ContentConfiguration[]) {
    }

    public render(cell: CellIndex, layer: string) {
        const map = this.mapAccessor.map.data,
            size = map.pixelsPerCell,
            cellName = GridHelper.cellIndexToName(cell),
            drawer = this.drawerFactory.create(map.id + '-' + cellName, size, size, size),
            objects = map.objects.filter(o => o.layer === layer && o.cell == cellName),
            graphics = new CellGraphics(objects, this.contents);

        graphics.render(drawer);

        return drawer;
    }
}