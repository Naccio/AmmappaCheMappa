import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { MapObject } from "../../Model/MapObject";

export class TreeGraphics implements Graphics {
    private readonly lineWidth = .02;

    public constructor(private tree: MapObject) { }

    public render(drawer: Drawer) {
        const points = this.tree.points,
            position = points[0],
            crownCenter = points[1],
            trunkTop = points[2],
            radiusX = Math.abs(points[3].x - crownCenter.x),
            radiusY = Math.abs(trunkTop.y - crownCenter.y),
            lineStyle: LineStyle = {
                lineCap: 'round',
                lineJoin: 'round',
                lineWidth: this.lineWidth
            };

        drawer.line([position, trunkTop], lineStyle);
        drawer.ellipse(crownCenter, radiusX, radiusY, 0, {
            line: lineStyle
        });
    }
}