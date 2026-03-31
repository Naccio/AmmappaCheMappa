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
        private store: Store,
        private ui: UIFactory
    ) { }

    create(mapManager: MapManager) {
        const mapAccessor = mapManager.mapAccessor,
            layersManager = mapManager.layers;

        const uiLayer = new DrawingUI(mapAccessor, this.canvasProvider);
        const tools = this.toolsFactory.create(mapAccessor, layersManager, uiLayer);
        const toolbar = new Toolbar(tools.tools, this.localizer, mapAccessor, layersManager);
        const toolActivator = new ToolActivator(toolbar);
        const drawer = new MapDrawer(mapManager, this.store, uiLayer);
        const drawingArea = new DrawingArea(toolActivator, drawer);
        const layersPanel = new LayersPanel(layersManager, this.ui, this.localizer);

        return new MapUI(mapManager, toolbar, drawingArea, layersPanel);
    }
}