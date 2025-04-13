/// <reference path="../Model/GridObject.ts" />
/// <reference path="CellDrawer.ts" />
/// <reference path="ObjectRenderer.ts" />

abstract class GenericObjectRenderer<T extends GridObject> implements ObjectRenderer {

    protected abstract is(object: GridObject) : object is T;

    protected abstract draw(object: T, drawer: CellDrawer) : void;

    public render(object: GridObject, drawer: CellDrawer): void {
        if (this.is(object)) {
            this.draw(object, drawer);
        }
    }
}