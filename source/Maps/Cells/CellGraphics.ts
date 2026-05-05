import { ContentConfiguration } from "../../Contents/ContentConfiguration";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { MapObject } from "../../Model/MapObject";
import { CellContext } from "./CellContext";

export class CellGraphics implements Graphics {

    public constructor(
        private readonly context: CellContext,
        private readonly contents: ContentConfiguration[]
    ) {}
    
    public render(drawer: Drawer) {
        for (let object of this.context.objects) {
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