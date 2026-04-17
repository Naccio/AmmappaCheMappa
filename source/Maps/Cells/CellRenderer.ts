import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { CellDrawer } from "./CellDrawer";
import { CellDrawerFactory } from "./CellDrawerFactory";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { ObjectGraphicsFactory } from "../../Engine/Rendering/ObjectGraphicsFactory";

export class CellRenderer {
    constructor(
        private drawerFactory: CellDrawerFactory,
        private graphicFactories: ObjectGraphicsFactory[]) {
    }

    public render(cell: CellIndex, drawer: Drawer, layer: string) {
        const cellDrawer = this.drawerFactory.create(cell, drawer),
            objects = cellDrawer.cell.objects.filter(o => o.layer === layer);

        cellDrawer.clear();

        for (let object of objects) {
            this.renderObject(object, cellDrawer);
        }
    }

    private renderObject(object: MapObject, drawer: CellDrawer) {
        const factory = this.graphicFactories.find(f => f.type === object.type);

        if (factory) {
            const graphics = factory.create(object);

            graphics.render(drawer);
        }
    }
}