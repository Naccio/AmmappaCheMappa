import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { Mountain } from "./Mountain";

export class MountainsRenderer extends GenericObjectRenderer<Mountain> {
    private readonly lineWidth = 4;

    protected get type() { return 'mountain'; }

    protected draw(mountain: Mountain, drawer: CellDrawer) {
        const halfWidth = mountain.width / 2,
            height = mountain.height,
            position = mountain.position,
            p1 = {
                x: position.x - halfWidth,
                y: position.y
            },
            p2 = {
                x: position.x,
                y: position.y - height,
            },
            p3 = {
                x: position.x + halfWidth,
                y: position.y
            };

        drawer.line([p1, p2, p3], {
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: this.lineWidth
        });
    }
}