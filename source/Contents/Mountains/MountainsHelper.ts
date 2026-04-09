import { MapObject } from "../../Model/MapObject";
import { Mountain } from "./Mountain";

export class MountainsHelper {
    public static readonly objectType = 'mountain';

    public static isMountain(object: MapObject): object is Mountain {
        return object.type === this.objectType;
    }
}