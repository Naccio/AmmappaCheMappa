import { DefaultLayerFactory } from "./Layers/DefaultLayerFactory";
import { GridLayerFactory } from "./Layers/GridLayerFactory";
import { LayerFactory } from "./Layers/LayerFactory";
import { LayersManager } from "./Layers/LayersManager";
import { MapAccessor } from "./MapAccessor";
import { MapManager } from "./MapManager";
import { EditorMap } from "./Model/EditorMap";
import { CellDrawerFactory } from "./Rendering/CellDrawerFactory";
import { CellRenderer } from "./Rendering/CellRenderer";
import { ObjectRenderer } from "./Rendering/ObjectRenderer";
import { Store } from "./Store";
import { CanvasProvider } from "./UI/CanvasProvider";

export class MapManagerFactory {
    constructor(
        private store: Store,
        private canvasProvider: CanvasProvider,
        private renderingStrategies: ObjectRenderer[]
    ) { }

    public create(map: EditorMap) {
        const mapAccessor = new MapAccessor(map, this.store);
        const grid = new GridLayerFactory(mapAccessor, this.canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor);
        const cellRenderer = new CellRenderer(drawerFactory, this.renderingStrategies);
        const terrainLayer = new DefaultLayerFactory('terrain', mapAccessor, this.canvasProvider, cellRenderer);
        const textLayer = new DefaultLayerFactory('text', mapAccessor, this.canvasProvider, cellRenderer);
        const layers = [
            terrainLayer,
            textLayer,
            grid
        ];
        const layerFactory = new LayerFactory(layers);
        const layersManager = new LayersManager(layerFactory, mapAccessor);

        return new MapManager(mapAccessor, layersManager);
    }
}