import { CellIndex } from "../Model/CellIndex";
import { CellContext } from "./Cells/CellContext";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";

export class MapManager {
    constructor(
        public readonly mapAccessor: MapAccessor,
        public readonly layers: LayersManager,
        public readonly cells: readonly CellContext[][]
    ) {
        layers.onDelete(_ => cells.flat().forEach(c => c.reload()));
    }

    public get id() {
        return this.mapAccessor.id;
    }

    public getCell(index: CellIndex) {
        const cell = this.cells[index.column][index.row];

        if (cell === undefined) {
            throw new Error(`Could not find cell [${index.column},${index.row}].`);
        }

        return cell;
    }
}