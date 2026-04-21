import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { VectorMath } from "../../Utilities/VectorMath";
import { Road } from "./Road";

export class RoadGraphics implements Graphics {
    private readonly lineWidth = .02;

    public constructor(private road: Road) { }

    public render(drawer: Drawer) {
        const road = this.road,
            from = road.from,
            to = road.to,
            direction = VectorMath.direction(from, to),
            shift1 = direction.multiply(.025).rotate(Math.PI / 2),
            from1 = shift1.add(from),
            to1 = shift1.add(to),
            shift2 = shift1.invert(),
            from2 = shift2.add(from),
            to2 = shift2.add(to),
            style: LineStyle = {
                lineWidth: this.lineWidth,
                ignoreBorders: true
            };

        drawer.line([from1, to1], style);
        drawer.line([from2, to2], style);
    }
}