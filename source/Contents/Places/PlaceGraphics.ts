import { Place } from "./Place";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { Drawer } from "../../Engine/Rendering/Drawer";

export class PlaceGraphics implements Graphics {

    public constructor(private place: Place) { }

    public render(drawer: Drawer) {
        const radius = this.place.radius,
            center = this.place.position;

        drawer.circle(center, radius, {
            fillStyle: '#000'
        });
    }
}