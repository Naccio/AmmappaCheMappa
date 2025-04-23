/// <reference path="../Model/MapObject.ts" />
/// <reference path="CellDrawer.ts" />
/// <reference path="ObjectRenderer.ts" />

abstract class GenericObjectRenderer<T extends MapObject> implements ObjectRenderer {

    protected abstract is(object: MapObject) : object is T;

    protected abstract draw(object: T, drawer: CellDrawer) : void;

    public render(object: MapObject, drawer: CellDrawer): void {
        if (this.is(object)) {
            this.draw(object, drawer);
        }
    }
}