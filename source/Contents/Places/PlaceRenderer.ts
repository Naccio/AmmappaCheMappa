import { MapObject } from "../../Model/MapObject";
import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { Place } from "./Place";
import { PlacesHelper } from "./PlacesHelper";

export class PlaceRenderer extends GenericObjectRenderer<Place> {

    protected draw(place: Place, drawer: CellDrawer) {
        const iconSize = .25,
            radius = iconSize / 2,
            center = place.position;

        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }

    protected is(object: MapObject): object is Place {
        return PlacesHelper.isPlace(object);
    }

}