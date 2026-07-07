import { Localizer } from "../../Engine/Localization/Localizer";
import { DrawingUI } from "../DrawingUI";
import { ModalLauncher } from "../ModalLauncher";
import { Eraser } from "./Eraser";
import { ToolsManager } from "./ToolsManager";
import { SelectTool } from "./SelectTool";
import { MapManager } from "../../Maps/MapManager";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentsConfiguration } from "../../Maps/Contents/Configuration/ContentsConfiguration";
import { MountainsTool } from "../../Maps/Contents/Mountains/MountainsTool";
import { PlacesTool } from "../../Maps/Contents/Places/PlacesTool";
import { RiversTool } from "../../Maps/Contents/Rivers/RiversTool";
import { RoadsTool } from "../../Maps/Contents/Roads/RoadsTool";
import { TextTool } from "../../Maps/Contents/Text/TextTool";
import { TreesTool } from "../../Maps/Contents/Trees/TreesTool";

export class ToolsManagerFactory {
    constructor(
        private modalLauncher: ModalLauncher,
        private drawerFactory: DrawerFactory,
        private localizer: Localizer,
        private contents: ContentsConfiguration,
    ) { }

    public create(mapManager: MapManager, uiLayer: DrawingUI) {
        const eraser = new Eraser(mapManager);
        const mountainsTool = new MountainsTool(mapManager);
        const placesTool = new PlacesTool(mapManager);
        const riversTool = new RiversTool(mapManager);
        const roadsTool = new RoadsTool(uiLayer, mapManager);
        const selectTool = new SelectTool(mapManager, this.drawerFactory, this.modalLauncher, this.contents);
        const textTool = new TextTool(mapManager, this.modalLauncher, this.localizer);
        const treesTool = new TreesTool(mapManager);
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