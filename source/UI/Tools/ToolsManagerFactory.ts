/// <reference path="Eraser.ts" />
/// <reference path="ToolsManager.ts" />
/// <reference path="../DrawingUI.ts" />
/// <reference path="../../Contents/Mountains/MountainsTool.ts" />
/// <reference path="../../Contents/Places/PlacesTool.ts" />
/// <reference path="../../Contents/Rivers/RiversTool.ts" />
/// <reference path="../../Contents/Roads/RoadsTool.ts" />
/// <reference path="../../Contents/Text/TextTool.ts" />
/// <reference path="../../Contents/Trees/TreesTool.ts" />
/// <reference path="../../Layers/LayersManager.ts" />
/// <reference path="../../MapAccessor.ts" />

class ToolsManagerFactory {
    constructor(
        private modalLauncher: ModalLauncher,
        private mountainFactory: MountainFactory,
        private localizer: Localizer
    ) { }

    public create(mapAccessor: MapAccessor, layersManager: LayersManager, uiLayer: DrawingUI) {
        const eraser = new Eraser(mapAccessor, layersManager);
        const mountainsTool = new MountainsTool(mapAccessor, this.mountainFactory, layersManager);
        const placesTool = new PlacesTool(mapAccessor, layersManager);
        const riversTool = new RiversTool(mapAccessor, layersManager);
        const roadsTool = new RoadsTool(uiLayer, mapAccessor, layersManager);
        const textTool = new TextTool(mapAccessor, layersManager, this.modalLauncher, this.localizer);
        const treesTool = new TreesTool(mapAccessor, layersManager);
        const tools = [
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            textTool,
            treesTool,
            eraser
        ];

        return new ToolsManager(tools);
    }
}