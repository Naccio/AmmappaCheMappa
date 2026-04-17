import { Drawer } from "../../Engine/Rendering/Drawer";
import { Graphics } from "../../Engine/Rendering/Graphics";
import { GridText } from "./GridText";

export class TextGraphics implements Graphics {

    protected get type() { return 'text'; }

    public constructor(private text: GridText) { }

    public render(drawer: Drawer) {
        const text = this.text;

        drawer.text(text.position, text.value, text.fontSize);
    }
}