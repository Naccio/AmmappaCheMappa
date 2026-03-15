/// <reference path="Layers/GridLayerFactory.ts" />
/// <reference path="Layers/TerrainLayerFactory.ts" />
/// <reference path="Layers/TextLayerFactory.ts" />
/// <reference path="UI/Tools/ToolsManagerFactory.ts" />

class MapManagerFactory {
    constructor(
        private store: Store,
        private canvasProvider: CanvasProvider,
        private renderingStrategies: ObjectRenderer[]
    ) {

    }
    public create(map: EditorMap) {
        const mapAccessor = new MapAccessor(map, this.store);
        const grid = new GridLayerFactory(mapAccessor, this.canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor);
        const cellRenderer = new CellRenderer(drawerFactory, this.renderingStrategies);
        const terrainLayer = new TerrainLayerFactory(mapAccessor, this.canvasProvider, cellRenderer);
        const textLayer = new TextLayerFactory(mapAccessor, this.canvasProvider, cellRenderer);
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