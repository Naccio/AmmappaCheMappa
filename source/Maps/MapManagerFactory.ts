import { DefaultLayerFactory } from "./Layers/DefaultLayerFactory";
import { GridLayerFactory } from "./Layers/GridLayerFactory";
import { LayerFactory } from "./Layers/LayerFactory";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";
import { MapManager } from "./MapManager";
import { EditorMap } from "../Model/EditorMap";
import { CellRenderer } from "./Cells/CellRenderer";
import { Store } from "../Engine/Store";
import { DrawerFactory } from "../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../Contents/ContentConfiguration";
import { CellManager } from "./Cells/CellManager";

export class MapManagerFactory {
    constructor(
        private store: Store,
        private drawerFactory: DrawerFactory,
        private contents: ContentConfiguration[]
    ) { }

    public create(map: EditorMap) {
        const mapAccessor = new MapAccessor(map, this.store);
        const grid = new GridLayerFactory(mapAccessor, this.drawerFactory);
        const cells: CellManager[] = [];
        for (let column = 0; column < map.data.columns; column++) {
            for (let row = 0; row < map.data.columns; row++) {
                cells.push(new CellManager({ row, column }, mapAccessor));
            }
        }
        const cellRenderer = new CellRenderer(mapAccessor, this.drawerFactory, this.contents);
        const terrainLayer = new DefaultLayerFactory('terrain', mapAccessor, this.drawerFactory, cellRenderer);
        const textLayer = new DefaultLayerFactory('text', mapAccessor, this.drawerFactory, cellRenderer);
        const layers = [
            terrainLayer,
            textLayer,
            grid
        ];
        const layerFactory = new LayerFactory(layers);
        const layersManager = new LayersManager(layerFactory, mapAccessor);

        return new MapManager(mapAccessor, layersManager, cells);
    }
}