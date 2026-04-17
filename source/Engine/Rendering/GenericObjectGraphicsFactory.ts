import { MapObject } from "../../Model/MapObject";
import { ObjectGraphicsFactory } from "./ObjectGraphicsFactory";
import { Graphics } from "./Graphics";

export class GenericObjectGraphicsFactory<T> implements ObjectGraphicsFactory {

    public constructor(
        private readonly _type: string,
        private readonly factory: (object: T) => Graphics) {
    }

    public get type() {
        return this._type;
    }

    public create(object: MapObject) {
        if (object.type !== this.type) {
            throw new Error('Invalid type ' + object.type);
        }

        return this.factory(object.data);
    }
}