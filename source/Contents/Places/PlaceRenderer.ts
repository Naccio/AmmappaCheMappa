import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { Place } from "./Place";

export class PlaceRenderer extends GenericObjectRenderer<Place> {
    
    protected get type() { return 'place'; }

    protected draw(place: Place, drawer: CellDrawer) {
        const iconSize = .25,
            radius = iconSize / 2,
            center = place.position;

        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }
}