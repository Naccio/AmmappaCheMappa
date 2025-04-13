/// <reference path="ObjectRenderer.ts" />

class CellRenderer {
    constructor(private drawerFactory: CellDrawerFactory, private renderers: ObjectRenderer[]) {
    }

    public render(cell: CellIndex, layer: string) {
        const drawer = this.drawerFactory.create(cell, layer),
            objects = drawer.cell.objects.filter(o => o.layer === layer);

        drawer.clear();

        for (let object of objects) {
            this.renderObject(object, drawer);
        }
    }

    private renderObject(object: GridObject, drawer: CellDrawer) {
        for (let strategy of this.renderers) {
            strategy.render(object, drawer);
        }
    }
}