/// <reference path="../MapManager.ts" />
/// <reference path="../Layers/LayersPanel.ts" />
/// <reference path="../Localization/Localizer.ts" />
/// <reference path="DrawingArea.ts" />
/// <reference path="Tools/ToolActivator.ts" />
/// <reference path="Tools/Toolbar.ts" />
/// <reference path="Tools/ToolsManagerFactory.ts" />

class MapUIFactory {

    constructor(
        private canvasProvider: CanvasProvider,
        private toolsFactory: ToolsManagerFactory,
        private localizer: Localizer,
        private store: Store
    ) { }

    create(map: MapManager) {
        const mapAccessor = map.mapAccessor,
            layersManager = map.layers;

        const uiLayer = new DrawingUI(mapAccessor, this.canvasProvider);
        const tools = this.toolsFactory.create(mapAccessor, layersManager, uiLayer);
        const toolbar = new Toolbar(tools.tools, this.localizer, mapAccessor, layersManager);
        const toolActivator = new ToolActivator(toolbar);
        const drawingArea = new DrawingArea(layersManager, uiLayer, toolActivator, this.store);
        const layersPanel = new LayersPanel(layersManager, this.localizer);

        return new MapUI(map, toolbar, drawingArea, layersPanel);
    }
}