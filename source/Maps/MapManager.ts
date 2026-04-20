import { CellRenderer } from "./Cells/CellRenderer";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";

export class MapManager {
    constructor(
        public readonly mapAccessor: MapAccessor,
        public readonly layers: LayersManager,
        public readonly cells: CellRenderer
    ) {
    }

    public get id() {
        return this.mapAccessor.id;
    }
}