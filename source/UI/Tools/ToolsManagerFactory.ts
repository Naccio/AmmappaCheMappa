import { MountainFactory } from "../../Contents/Mountains/MountainFactory";
import { MountainsTool } from "../../Contents/Mountains/MountainsTool";
import { PlacesTool } from "../../Contents/Places/PlacesTool";
import { RiversTool } from "../../Contents/Rivers/RiversTool";
import { RoadsTool } from "../../Contents/Roads/RoadsTool";
import { TextTool } from "../../Contents/Text/TextTool";
import { TreesTool } from "../../Contents/Trees/TreesTool";
import { LayersManager } from "../../Maps/Layers/LayersManager";
import { Localizer } from "../../Engine/Localization/Localizer";
import { MapAccessor } from "../../Maps/MapAccessor";
import { DrawingUI } from "../DrawingUI";
import { ModalLauncher } from "../ModalLauncher";
import { Eraser } from "./Eraser";
import { ToolsManager } from "./ToolsManager";

export class ToolsManagerFactory {
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