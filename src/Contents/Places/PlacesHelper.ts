/// <reference path="Place.ts" />

class PlacesHelper {
    public static readonly layer = 'terrain';
    public static readonly objectType = 'place';

    public static getPlaces(cell: GridCell) : Place[] {
        return cell.objects.filter(o => this.isPlace(o));
    }

    public static isPlace(object: MapObject) : object is Place {
        return object.type === this.objectType;
    }
}