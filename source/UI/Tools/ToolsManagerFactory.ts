import { Localizer } from "../../Engine/Localization/Localizer";
import { DrawingUI } from "../DrawingUI";
import { ModalLauncher } from "../ModalLauncher";
import { Eraser } from "./Eraser";
import { ToolsManager } from "./ToolsManager";
import { SelectTool } from "./SelectTool";
import { MapManager } from "../../Maps/MapManager";
import { MountainsTool } from "../../Maps/Contents/Mountains/MountainsTool";
import { PlacesTool } from "../../Maps/Contents/Places/PlacesTool";
import { RiversTool } from "../../Maps/Contents/Rivers/RiversTool";
import { RoadsTool } from "../../Maps/Contents/Roads/RoadsTool";
import { TextTool } from "../../Maps/Contents/Text/TextTool";
import { TreesTool } from "../../Maps/Contents/Trees/TreesTool";
import { CellEditorFactory } from "../../Maps/Cells/CellEditorFactory";

export class ToolsManagerFactory {
    constructor(
        private modalLauncher: ModalLauncher,
        private localizer: Localizer,
        private editorFactory: CellEditorFactory
    ) { }

    public create(mapManager: MapManager, uiLayer: DrawingUI) {
        const eraser = new Eraser(mapManager);
        const mountainsTool = new MountainsTool(mapManager);
        const placesTool = new PlacesTool();
        const riversTool = new RiversTool();
        const roadsTool = new RoadsTool(uiLayer, mapManager.mapAccessor);
        const selectTool = new SelectTool(this.modalLauncher, this.editorFactory);
        const textTool = new TextTool(this.modalLauncher, this.localizer);
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