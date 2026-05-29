import { MapObject } from "../../Model/MapObject";
import { ObjectGraphicsFactory } from "./ObjectGraphicsFactory";
import { Graphics } from "./Graphics";

export class GenericObjectGraphicsFactory<T> implements ObjectGraphicsFactory {

    public constructor(
        private readonly factory: (object: T) => Graphics) {
    }

    public create(object: MapObject) {
        return this.factory(object.data);
    }
}