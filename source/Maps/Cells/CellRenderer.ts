import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { ObjectGraphicsFactory } from "../../Engine/Rendering/ObjectGraphicsFactory";
import { MapAccessor } from "../MapAccessor";
import { GridHelper } from "../../Utilities/GridHelper";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";

export class CellRenderer {
    constructor(
        private mapAccessor: MapAccessor,
        private drawerFactory: DrawerFactory,
        private graphicFactories: ObjectGraphicsFactory[]) {
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
        const factory = this.graphicFactories.find(f => f.type === object.type);

        if (factory) {
            const graphics = factory.create(object);

            graphics.render(drawer);
        }
    }
}