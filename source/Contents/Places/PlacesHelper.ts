import { MapObject } from "../../Model/MapObject";
import { Place } from "./Place";

export class PlacesHelper {
    public static readonly layer = 'terrain';
    public static readonly objectType = 'place';

    public static isPlace(object: MapObject): object is Place {
        return object.type === this.objectType;
    }
}