/// <reference path="../../Rendering/GenericObjectRenderer.ts" />
/// <reference path="PlacesHelper.ts" />

class PlaceRenderer extends GenericObjectRenderer<Place> {

    protected draw(place: Place, drawer: CellDrawer) {
        const iconSize = .25,
            radius = iconSize / 2,
            center = place.position;

        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }

    protected is(object: GridObject) : object is Place {
        return PlacesHelper.isPlace(object);
    }

}