import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { MapObject } from "../../Model/MapObject";

export class RiverGraphics implements Graphics {
    private readonly lineWidth = .06;

    public constructor(private river: MapObject) { }

    public render(drawer: Drawer) {
        const points = this.river.points,
            style: LineStyle = {
                lineWidth: this.lineWidth
            };
        // directionFrom = VectorMath.direction(from, river.bend1),
        // directionTo = VectorMath.direction(river.bend2, river.to);

        drawer.bezier(points[0], points[1], points[2], points[3], style);
        // drawer.circle(river.bend1, .05, { fillStyle: '#F00' });
        // drawer.circle(river.bend2, .05, { fillStyle: '#00F' });
        // drawer.line([from, VectorMath.add(from, directionFrom)], { color: '#F0F', lineWidth: 2, ignoreBorders: true });
        // drawer.line([river.bend2, VectorMath.add(river.bend2, directionTo)], { color: '#0F0', lineWidth: 2, ignoreBorders: true });
    }
}