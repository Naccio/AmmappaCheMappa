import { MapObject } from "../../Model/MapObject";
import { CellDrawer } from "../../Maps/Cells/CellDrawer";
import { GenericObjectRenderer } from "../../Engine/Rendering/GenericObjectRenderer";
import { GridText } from "./GridText";
import { TextHelper } from "./TextHelper";

export class TextRenderer extends GenericObjectRenderer<GridText> {
    private readonly lineWidth = 2;

    protected is(object: MapObject): object is GridText {
        return object.type === TextHelper.objectType;
    }

    protected draw(text: GridText, drawer: CellDrawer) {
        drawer.text(text.position, text.value, text.fontSize);
    }
}