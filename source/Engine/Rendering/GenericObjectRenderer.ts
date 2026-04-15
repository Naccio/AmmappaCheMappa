import { MapObject } from "../../Model/MapObject";
import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { ObjectRenderer } from "./ObjectRenderer";

export abstract class GenericObjectRenderer<T> implements ObjectRenderer {

    protected abstract get type(): string;

    protected abstract draw(object: T, drawer: CellDrawer): void;

    public render(object: MapObject, drawer: CellDrawer): void {
        if (object.type === this.type) {
            this.draw(object.data, drawer);
        }
    }
}