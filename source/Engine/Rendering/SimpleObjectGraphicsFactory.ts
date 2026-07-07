import { MapObject } from "../../Model/MapObject";
import { Graphics } from "./Graphics";
import { ObjectGraphicsFactory } from "./ObjectGraphicsFactory";

export class SimpleObjectGraphicsFactory implements ObjectGraphicsFactory {
    public constructor(private readonly factory: (object: MapObject) => Graphics) { }

    public create(object: MapObject) {
        return this.factory(object);
    }
}