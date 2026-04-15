import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { LineStyle } from "../../Engine/Rendering/LineStyle";
import { Tree } from "./Tree";

export class TreeRenderer extends GenericObjectRenderer<Tree> {
    private readonly lineWidth = 2;

    protected get type() { return 'tree'; }

    protected draw(tree: Tree, drawer: CellDrawer) {
        const position = tree.position,
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