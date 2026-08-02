import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { CellGraphics } from "./CellGraphics";
import { CellContext } from "./CellContext";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";

export class CellRenderer {
    constructor(
        private drawerFactory: DrawerFactory,
        private contents: ContentsConfiguration) {
    }

    public render(cell: CellContext, layer?: string, scale?: number) {
        scale ??= 1;

        let objects = cell.objects.value;

        if (layer !== undefined) {
            objects = objects.filter(o => o.layer === layer);
        }

        const size = cell.pixels * scale,
            drawer = this.drawerFactory.create(size, size, size),
            graphics = new CellGraphics(objects, this.contents);

        graphics.render(drawer);

        return drawer;
    }
}