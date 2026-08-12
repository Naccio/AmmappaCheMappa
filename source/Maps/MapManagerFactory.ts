import { LayerFactory } from "./Layers/LayerFactory";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";
import { MapManager } from "./MapManager";
import { EditorMap } from "../Model/EditorMap";
import { Store } from "../Engine/Store";
import { CellContext } from "./Cells/CellContext";
import { GridHelper } from "../Utilities/GridHelper";

export class MapManagerFactory {
    constructor(
        private store: Store
    ) { }

    public create(map: EditorMap) {
        const mapAccessor = new MapAccessor(map, this.store);

        const cells: CellContext[][] = [],
            columns = map.data.columns,
            rows = map.data.rows;

        for (let column = 0; column < columns; column++) {
            cells[column] = [];
            for (let row = 0; row < rows; row++) {
                cells[column][row] = new CellContext({ column, row }, mapAccessor);
            }
        }
        for (let column = 0; column < columns; column++) {
            for (let row = 0; row < rows; row++) {
                const neighbors: (CellContext | undefined)[] = [];

                let top, right, bottom, left;

                if (row !== 0) {
                    top = cells[column][row - 1];
                }

                if (column !== columns - 1) {
                    right = cells[column + 1][row];
                }

                if (row !== rows - 1) {
                    bottom = cells[column][row + 1];
                }

                if (column !== 0) {
                    left = cells[column - 1][row];
                }

                neighbors[GridHelper.topSideIndex] = top;
                neighbors[GridHelper.rightSideIndex] = right;
                neighbors[GridHelper.bottomSideIndex] = bottom;
                neighbors[GridHelper.leftSideIndex] = left;

                cells[column][row].neighbors = neighbors;
            }
        }
        const layerFactory = new LayerFactory();
        const layersManager = new LayersManager(layerFactory, mapAccessor);

        return new MapManager(mapAccessor, layersManager, cells);
    }
}