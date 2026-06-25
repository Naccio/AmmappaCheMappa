import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";

export class CellContext {
    public constructor(
        public readonly cell: CellIndex,
        public readonly objects: readonly MapObject[]
    ) { }
}
