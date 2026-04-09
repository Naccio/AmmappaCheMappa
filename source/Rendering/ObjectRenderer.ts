import { MapObject } from "../Model/MapObject";
import { CellDrawer } from "./CellDrawer";

export interface ObjectRenderer {
    render(object: MapObject, drawer: CellDrawer): void;
}