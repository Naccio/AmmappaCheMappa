/// <reference path="./CellTool.ts" />

class Eraser extends CellTool {
    public readonly id = 'eraser';
    public readonly labelResourceId: string;

    constructor(mapAccessor: MapAccessor, private renderer: CellRenderer) {
        super(mapAccessor);

        this.labelResourceId = 'tool_label_eraser';
    }

    public useOnCell(cell: CellIndex) {
        this.mapAccessor.setObjects(cell, []);
        this.renderer.render(cell, 'terrain');
    }
}