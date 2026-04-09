import { MapAccessor } from "../MapAccessor";
import { CellIndex } from "../Model/CellIndex";
import { CellDrawer } from "./CellDrawer";
import { Drawer } from "./Drawer";

export class CellDrawerFactory {
    constructor(private mapAccessor: MapAccessor) {
    }

    public create(cell: CellIndex, drawer: Drawer) {
        return new CellDrawer(cell, this.mapAccessor, drawer);
    }
}