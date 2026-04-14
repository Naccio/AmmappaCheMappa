import { LayersPanel } from "../Maps/Layers/LayersPanel";
import { Localizer } from "../Engine/Localization/Localizer";
import { MapManager } from "../Maps/MapManager";
import { Store } from "../Engine/Store";
import { CanvasProvider } from "./CanvasProvider";
import { DrawingArea } from "./DrawingArea";
import { DrawingUI } from "./DrawingUI";
import { MapDrawer } from "./MapDrawer";
import { MapUI } from "./MapUI";
import { ToolActivator } from "./Tools/ToolActivator";
import { Toolbar } from "./Tools/Toolbar";
import { ToolsManagerFactory } from "./Tools/ToolsManagerFactory";
import { UIFactory } from "./UIFactory";

export class MapUIFactory {

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