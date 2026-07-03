import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../../Maps/MapManager";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";
import { CellEditor } from "../../Maps/Cells/CellEditor";
import { ContentsConfiguration } from "../../Contents/ContentsConfiguration";

export class SelectTool implements Tool {

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    public constructor(
        private readonly mapManager: MapManager,
        private readonly drawerFactory: DrawerFactory,
        private readonly modal: ModalLauncher,
        private readonly contents: ContentsConfiguration
    ) { }

    public start(point: Point) {
        const cell = this.mapManager.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const cellName = GridHelper.cellIndexToName(cell),
            cellManager = this.mapManager.getCell(cell),
            editor = new CellEditor(cellManager, this.drawerFactory, this.contents);

        this.modal.launch(cellName, [editor.html]);
    }

    public move() {
    }

    public stop() {
    }
}