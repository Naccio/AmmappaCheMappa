/// <reference path="../Model/CellIndex.ts" />
/// <reference path="CellDrawer.ts" />

class CellDrawerFactory {
    constructor(private mapAccessor: MapAccessor) {
    }

    public create(cell: CellIndex, drawer: Drawer) {
        return new CellDrawer(cell, this.mapAccessor, drawer);
    }
}