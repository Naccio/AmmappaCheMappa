/// <reference path="../../Model/GridCell.ts" />
/// <reference path="Mountain.ts" />

class  MountainsHelper {
    public static readonly objectType = 'mountain';

    public static getMountains(cell: GridCell) : Mountain[] {
        return cell.objects.filter(o => this.isMountain(o));
    }

    public static isMountain(object: GridObject) : object is Mountain {
        return object.type === this.objectType;
    }
}