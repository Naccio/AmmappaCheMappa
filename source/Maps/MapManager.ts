import { CellIndex } from "../Model/CellIndex";
import { GridHelper } from "../Utilities/GridHelper";
import { CellManager } from "./Cells/CellManager";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";

export class MapManager {
    constructor(
        public readonly mapAccessor: MapAccessor,
        public readonly layers: LayersManager,
        private readonly cells: CellManager[]
    ) {
    }

    public get id() {
        return this.mapAccessor.id;
    }

    public getCell(index: CellIndex) {
        const cell = this.cells.find(c => GridHelper.cellIsEqual(c.index, index));

        if (cell === undefined) {
            throw new Error(`Could not find cell [${index.column},${index.row}].`);
        }

        return cell;
    }
}