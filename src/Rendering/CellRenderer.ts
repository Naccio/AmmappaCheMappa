/// <reference path="CellDrawerFactory.ts" />
/// <reference path="ObjectRenderer.ts" />

class CellRenderer {
    constructor(private drawerFactory: CellDrawerFactory, private renderers: ObjectRenderer[]) {
    }

    public render(cell: CellIndex, drawer: Drawer, layer: string) {
        const cellDrawer = this.drawerFactory.create(cell, drawer),
            objects = cellDrawer.cell.objects.filter(o => o.layer === layer);

        cellDrawer.clear();

        for (let object of objects) {
            this.renderObject(object, cellDrawer);
        }
    }

    private renderObject(object: MapObject, drawer: CellDrawer) {
        for (let strategy of this.renderers) {
            strategy.render(object, drawer);
        }
    }
}