import { Drawer } from "../../../Engine/Rendering/Drawer";
import { Graphics } from "../../../Engine/Rendering/Graphics";
import { MapObject } from "../../../Model/MapObject";
import { GridText } from "./GridText";

export class TextGraphics implements Graphics {

    protected get type() { return 'text'; }

    public constructor(private text: MapObject) { }

    public render(drawer: Drawer) {
        const text = this.text,
            data = text.data as GridText;

        drawer.text(text.points[0], data.value, data.fontSize);
    }
}