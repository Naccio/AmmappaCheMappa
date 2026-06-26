import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { MapObject } from "../../Model/MapObject";

export class CellGraphics implements Graphics {

    public constructor(
        private readonly objects: readonly MapObject[],
        private readonly contents: readonly ContentConfiguration[]
    ) { }

    public render(drawer: Drawer) {
        for (let object of this.objects) {
            this.renderObject(object, drawer);
        }

        return drawer;
    }

    private renderObject(object: MapObject, drawer: Drawer) {
        const content = this.contents.find(c => c.type === object.type);

        if (content) {
            const graphics = content.graphics.create(object);

            graphics.render(drawer);
        }
    }
}