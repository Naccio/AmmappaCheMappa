import { MountainsTool } from "../../Contents/Mountains/MountainsTool";
import { PlacesTool } from "../../Contents/Places/PlacesTool";
import { RiversTool } from "../../Contents/Rivers/RiversTool";
import { RoadsTool } from "../../Contents/Roads/RoadsTool";
import { TextTool } from "../../Contents/Text/TextTool";
import { TreesTool } from "../../Contents/Trees/TreesTool";
import { Localizer } from "../../Engine/Localization/Localizer";
import { DrawingUI } from "../DrawingUI";
import { ModalLauncher } from "../ModalLauncher";
import { Eraser } from "./Eraser";
import { ToolsManager } from "./ToolsManager";
import { SelectTool } from "./SelectTool";
import { MapManager } from "../../Maps/MapManager";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";

export class ToolsManagerFactory {
    constructor(
        private modalLauncher: ModalLauncher,
        private drawerFactory: DrawerFactory,
        private localizer: Localizer,
        private contents: ContentConfiguration[],
    ) { }

    public create(mapManager: MapManager, uiLayer: DrawingUI) {
        const mapAccessor = mapManager.mapAccessor,
            layersManager = mapManager.layers;

        const eraser = new Eraser(mapAccessor, layersManager);
        const mountainsTool = new MountainsTool(mapManager);
        const placesTool = new PlacesTool(mapManager);
        const riversTool = new RiversTool(mapManager);
        const roadsTool = new RoadsTool(uiLayer, mapManager);
        const selectTool = new SelectTool(mapManager, this.drawerFactory, this.modalLauncher, this.contents);
        const textTool = new TextTool(mapManager, this.modalLauncher, this.localizer);
        const treesTool = new TreesTool(mapAccessor, layersManager);
        const tools = [
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            selectTool,
            textTool,
            treesTool,
            eraser
        ];

        return new ToolsManager(tools);
    }
}