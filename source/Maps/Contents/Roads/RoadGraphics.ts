import { Drawer } from "../../../Engine/Rendering/Drawer";
import { Graphics } from "../../../Engine/Rendering/Graphics";
import { MapObject } from "../../../Model/MapObject";


export class RoadGraphics implements Graphics {
    public constructor(private road: MapObject) { }

    public render(drawer: Drawer) {
        const points = this.road.points,
            from = points[0],
            to = points[1];

        drawer.line([from, to], {
            lineWidth: .05,
            color: 'black'
        });
        drawer.line([from, to], {
            lineWidth: .02,
            color: 'white'
        });
    }
}