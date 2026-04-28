import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { MapAccessor } from "../MapAccessor";
import { GridHelper } from "../../Utilities/GridHelper";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";

export class CellRenderer {
    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory,
        private contents: ContentConfiguration[]) {
    }

    public render(cell: CellIndex, layer: string, scale?: number) {
        scale ??= 1;

        const map = this.mapAccessor.map.data,
            size = map.pixelsPerCell * scale,
            cellName = GridHelper.cellIndexToName(cell),
            drawer = this.drawerFactory.create(map.id + '-' + cellName, size, size, size),
            objects = map.objects.filter(o => o.layer === layer && o.cell == cellName);

        for (let object of objects) {
            this.renderObject(object, drawer);
        }

        return drawer;
    }

    private renderObject(object: MapObject, drawer: Drawer) {
        const content = this.contents.find(c => c.type === object.type);

        if (content) {
            const graphics = content.graphics.create(object);

            graphics.render(drawer);
        }
    }
}