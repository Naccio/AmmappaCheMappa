import { LayersManager } from "../../Layers/LayersManager";
import { Localizer } from "../../Localization/Localizer";
import { MapAccessor } from "../../MapAccessor";
import { Point } from "../../Model/Point";
import { FormsHelper } from "../../UI/Forms/FormsHelper";
import { ModalLauncher } from "../../UI/ModalLauncher";
import { Tool } from "../../UI/Tools/Tool";
import { VectorMath } from "../../VectorMath";
import { GridText } from "./GridText";
import { TextHelper } from "./TextHelper";

export class TextTool implements Tool {
    public readonly configuration = {
        id: 'text',
        labelResourceId: 'tool_label_text',
        layerTypes: ['text']
    };

    constructor(private mapAccessor: MapAccessor, private layers: LayersManager, private modal: ModalLauncher, private localizer: Localizer) {
    }

    public start(point: Point) {
        const cell = this.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        const textInput = FormsHelper.createTextInput(this.localizer['input_label_text']),
            sizeInput = FormsHelper.createNumberInput(this.localizer['input_label_size'], 5, 100),
            title = this.localizer['form_title_new_text'];

        textInput.required = true;

        sizeInput.value = '10';
        textInput.required = true;

        this.modal.launchForm(title, [textInput.html, sizeInput.html], () => {
            const fontSize = parseInt(sizeInput.value!) / 100,
                layer = TextHelper.layer,
                normalizedPosition = this.mapAccessor.normalizedPosition(cell, point),
                position = VectorMath.round(normalizedPosition, 2),
                text: GridText = {
                    type: TextHelper.objectType,
                    layer,
                    position,
                    value: textInput.value!,
                    fontSize
                };

            this.layers.setObjects(cell, [text]);
        });
    }

    public move() {
    }

    public stop() {
    }
}