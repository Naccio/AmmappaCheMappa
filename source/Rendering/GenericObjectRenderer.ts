import { MapObject } from "../Model/MapObject";
import { CellDrawer } from "./CellDrawer";
import { ObjectRenderer } from "./ObjectRenderer";

export abstract class GenericObjectRenderer<T extends MapObject> implements ObjectRenderer {

    protected abstract is(object: MapObject): object is T;

    protected abstract draw(object: T, drawer: CellDrawer): void;

    public render(object: MapObject, drawer: CellDrawer): void {
        if (this.is(object)) {
            this.draw(object, drawer);
        }
    }
}