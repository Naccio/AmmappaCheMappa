import { Graphics } from "../../Engine/Rendering/Graphics";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { MapObject } from "../../Model/MapObject";

export class MountainGraphics implements Graphics {
    private readonly lineWidth = .04;

    public constructor(private mountain: MapObject) { }

    public render(drawer: Drawer) {
        drawer.line(this.mountain.points, {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: this.lineWidth
        });
    }
}