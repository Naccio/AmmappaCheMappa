/// <reference path="../../Model/GridCell.ts" />
/// <reference path="Mountain.ts" />

class MountainsHelper {
    public static readonly objectType = 'mountain';

    public static isMountain(object: MapObject): object is Mountain {
        return object.type === this.objectType;
    }
}