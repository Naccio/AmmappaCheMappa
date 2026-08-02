import { MapManager } from "../../Maps/MapManager";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";
import { CellEditorFactory } from "../../Maps/Cells/CellEditorFactory";

export class SelectTool implements Tool {

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    public constructor(
        private readonly mapManager: MapManager,
        private readonly modal: ModalLauncher,
        private readonly editorFactory: CellEditorFactory
    ) { }

    public start(point: Point) {
        const cell = this.mapManager.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const cellName = GridHelper.cellIndexToName(cell),
            cellManager = this.mapManager.getCell(cell),
            editor = this.editorFactory.create(cellManager);

        this.modal.launch(cellName, [editor.html]);
    }

    public move() {
    }

    public stop() {
    }
}