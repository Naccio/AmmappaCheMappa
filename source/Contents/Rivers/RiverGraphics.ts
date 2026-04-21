import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { River } from "./River";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { Drawer } from "../../Engine/Rendering/Drawer";

export class RiverGraphics implements Graphics {
    private readonly lineWidth = .06;

    public constructor(private river: River) { }

    public render(drawer: Drawer) {
        const river = this.river,
            from = river.from,
            to = river.to,
            style: LineStyle = {
                lineWidth: this.lineWidth,
                ignoreBorders: true
            };
        // directionFrom = VectorMath.direction(from, river.bend1),
        // directionTo = VectorMath.direction(river.bend2, river.to);

        drawer.bezier(from, to, river.bend1, river.bend2, style);
        // drawer.circle(river.bend1, .05, { fillStyle: '#F00' });
        // drawer.circle(river.bend2, .05, { fillStyle: '#00F' });
        // drawer.line([from, VectorMath.add(from, directionFrom)], { color: '#F0F', lineWidth: 2, ignoreBorders: true });
        // drawer.line([river.bend2, VectorMath.add(river.bend2, directionTo)], { color: '#0F0', lineWidth: 2, ignoreBorders: true });
    }
}