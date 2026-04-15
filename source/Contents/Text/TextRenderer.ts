import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { GridText } from "./GridText";

export class TextRenderer extends GenericObjectRenderer<GridText> {

    protected get type() { return 'text'; }

    protected draw(text: GridText, drawer: CellDrawer) {
        drawer.text(text.position, text.value, text.fontSize);
    }
}