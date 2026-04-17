import { Mountain } from "./Mountain";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { Drawer } from "../../Engine/Rendering/Drawer";

export class MountainGraphics implements Graphics {
    private readonly lineWidth = 4;

    public constructor(private mountain: Mountain) { }

    public render(drawer: Drawer) {
        const mountain = this.mountain,
            halfWidth = mountain.width / 2,
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