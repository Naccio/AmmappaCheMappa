import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { ObjectGraphicsFactory } from "../../Engine/Rendering/ObjectGraphicsFactory";
import { Utilities } from "../../Utilities/Utilities";
import { MapAccessor } from "../MapAccessor";
import { GridHelper } from "../../Utilities/GridHelper";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";

export class CellRenderer {
    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory,
        private graphicFactories: ObjectGraphicsFactory[]) {
    }

    public render(cell: CellIndex, drawer: Drawer, layer: string) {
        const map = this.mapAccessor.map.data,
            scale = map.pixelsPerCell,
            cellName = GridHelper.cellIndexToName(cell),
            cellDrawer = this.drawerFactory.create(Utilities.generateId('cell'), scale, scale, scale),
            objects = map.objects.filter(o => o.layer === layer && o.cell == cellName),
            origin = {
                x: cell.column * scale,
                y: cell.row * scale
            };

        for (let object of objects) {
            this.renderObject(object, cellDrawer);
        }

        drawer.clear(origin, scale, scale);
        drawer.image(cellDrawer, origin);
    }

    private renderObject(object: MapObject, drawer: Drawer) {
        const factory = this.graphicFactories.find(f => f.type === object.type);

        if (factory) {
            const graphics = factory.create(object);

            graphics.render(drawer);
        }
    }
}