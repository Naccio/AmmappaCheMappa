/// <reference path="Layers/DefaultLayerFactory.ts" />
/// <reference path="Layers/GridLayerFactory.ts" />
/// <reference path="UI/Tools/ToolsManagerFactory.ts" />

class MapManagerFactory {
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