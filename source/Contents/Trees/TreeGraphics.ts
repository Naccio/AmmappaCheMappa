import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { Tree } from "./Tree";

export class TreeGraphics implements Graphics {
    private readonly lineWidth = 2;

    public constructor(private tree: Tree) { }

    public render(drawer: Drawer) {
        const tree = this.tree,
            position = tree.position,
            radiusX = tree.crownWidth / 2,
            radiusY = tree.crownHeight / 2,
            trunkTop = {
                x: position.x,
                y: position.y - tree.trunkHeight
            },
            crownCenter = {
                x: position.x,
                y: trunkTop.y - tree.crownHeight / 2
            },
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