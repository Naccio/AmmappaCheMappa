import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { CellGraphics } from "./CellGraphics";
import { CellContext } from "./CellContext";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";

export class CellRenderer {
    constructor(
        private drawerFactory: DrawerFactory,
        private contents: ContentsConfiguration) {
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