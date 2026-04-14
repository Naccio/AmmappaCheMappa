import { MapObject } from "../../Model/MapObject";
import { CellDrawer } from "../../Maps/Cells/CellDrawer";

export interface ObjectRenderer {
    render(object: MapObject, drawer: CellDrawer): void;
}