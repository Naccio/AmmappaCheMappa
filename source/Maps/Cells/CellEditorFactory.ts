import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";
import { CellContext } from "./CellContext";
import { CellEditor } from "./CellEditor";
import { CellRenderer } from "./CellRenderer";

export class CellEditorFactory {
    public constructor(
        private readonly drawerFactory: DrawerFactory,
        private readonly contents: ContentsConfiguration,
        private readonly renderer: CellRenderer
    ) {
    }

    public create(cell: CellContext) {
        return new CellEditor(cell, this.drawerFactory, this.contents, this.renderer);
    }
}