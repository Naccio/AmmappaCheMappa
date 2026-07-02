import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { CellGraphics } from "./CellGraphics";
import { CellContext } from "./CellContext";

export class CellRenderer {
    constructor(
        private drawerFactory: DrawerFactory,
        private contents: ContentConfiguration[]) {
    }

    public render(cell: CellContext, layer: string) {
        const size = cell.pixels,
            drawer = this.drawerFactory.create(size, size, size),
            objects = cell.objects.value.filter(o => o.layer === layer),
            graphics = new CellGraphics(objects, this.contents);

        graphics.render(drawer);

        return drawer;
    }
}