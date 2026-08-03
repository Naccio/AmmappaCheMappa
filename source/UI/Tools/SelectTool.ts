import { GridHelper } from "../../Utilities/GridHelper";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";
import { CellEditorFactory } from "../../Maps/Cells/CellEditorFactory";
import { ToolContext } from "./ToolContext";

export class SelectTool implements Tool {

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    public constructor(
        private readonly modal: ModalLauncher,
        private readonly editorFactory: CellEditorFactory
    ) { }

    public start(context: ToolContext) {
        const cell = context.cell;

        if (cell === undefined) {
            return;
        }

        const cellName = GridHelper.cellIndexToName(cell.index),
            editor = this.editorFactory.create(cell);

        this.modal.launch(cellName, [editor.html]);
    }

    public move() {
    }

    public stop() {
    }
}