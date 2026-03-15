/// <reference path="../MapManager.ts" />
/// <reference path="../Layers/LayersPanel.ts" />
/// <reference path="DrawingArea.ts" />
/// <reference path="Tools/ToolActivator.ts" />
/// <reference path="Tools/Toolbar.ts" />
/// <reference path="UIElement.ts" />

class MainArea implements UIElement {
    private readonly container: HTMLElement;

    public mapManager?: MapManager;

    constructor(
        private canvasProvider: CanvasProvider,
        private toolsFactory: ToolsManagerFactory,
        private localizer: Localizer,
        private store: Store
    ) {
        const container = document.createElement('div');

        container.id = 'main-area';

        this.container = container;
    }

    public addMap(map: MapManager) {
        const mapAccessor = map.mapAccessor,
            layersManager = map.layers;

        const uiLayer = new DrawingUI(mapAccessor, this.canvasProvider);
        const tools = this.toolsFactory.create(mapAccessor, layersManager, uiLayer);
        const toolbar = new Toolbar(tools.tools, this.localizer, layersManager);
        const toolActivator = new ToolActivator(toolbar);
        const drawingArea = new DrawingArea(layersManager, uiLayer, toolActivator, this.store);
        const layersPanel = new LayersPanel(layersManager, this.localizer);

        this.container.innerHTML = '';
        this.container.append(toolbar.build());
        this.container.append(drawingArea.build());
        this.container.append(layersPanel.build());

        drawingArea.setup(map.mapAccessor.map);

        this.mapManager = map;
    }

    public build() {
        return this.container;
    }
}