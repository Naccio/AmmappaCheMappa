import { LayerFactory } from "./Layers/LayerFactory";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";
import { MapManager } from "./MapManager";
import { EditorMap } from "../Model/EditorMap";
import { Store } from "../Engine/Store";
import { CellManager } from "./Cells/CellManager";

export class MapManagerFactory {
    constructor(
        private store: Store
    ) { }

    public create(map: EditorMap) {
        const mapAccessor = new MapAccessor(map, this.store);
        const cells: CellManager[] = [];
        for (let column = 0; column < map.data.columns; column++) {
            for (let row = 0; row < map.data.columns; row++) {
                cells.push(new CellManager({ row, column }, mapAccessor));
            }
        }
        const layerFactory = new LayerFactory();
        const layersManager = new LayersManager(layerFactory, mapAccessor);

        return new MapManager(mapAccessor, layersManager, cells);
    }
}