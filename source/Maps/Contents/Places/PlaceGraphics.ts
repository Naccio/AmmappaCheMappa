import { Drawer } from "../../../Engine/Rendering/Drawer";
import { Graphics } from "../../../Engine/Rendering/Graphics";
import { MapObject } from "../../../Model/MapObject";
import { VectorMath } from "../../../Utilities/VectorMath";


export class PlaceGraphics implements Graphics {

    public constructor(private place: MapObject) { }

    public render(drawer: Drawer) {
        const points = this.place.points,
            center = points[0],
            radius = VectorMath.distance(center, points[1]);

        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }
}