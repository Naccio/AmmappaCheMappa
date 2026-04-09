import { CellIndex } from "./CellIndex";
import { MapObject } from "./MapObject";

export interface GridCell {
    index: CellIndex;
    objects: MapObject[];
}
