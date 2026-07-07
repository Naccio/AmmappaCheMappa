import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { MapObject } from "../../Model/MapObject";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";

export class CellGraphics implements Graphics {

    public constructor(
        private readonly objects: readonly MapObject[],
        private readonly contents: ContentsConfiguration
    ) { }

    public render(drawer: Drawer) {
        for (let object of this.objects) {
            this.renderObject(object, drawer);
        }

        return drawer;
    }

    private renderObject(object: MapObject, drawer: Drawer) {
        const content = this.contents.get(object.type),
            graphics = content.graphics.create(object);

        graphics.render(drawer);
    }
}