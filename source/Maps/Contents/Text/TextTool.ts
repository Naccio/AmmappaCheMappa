import { Localizer } from "../../../Engine/Localization/Localizer";
import { Point } from "../../../Model/Point";
import { FormsHelper } from "../../../UI/Forms/FormsHelper";
import { ModalLauncher } from "../../../UI/ModalLauncher";
import { Tool } from "../../../UI/Tools/Tool";
import { VectorMath } from "../../../Utilities/VectorMath";
import { MapManager } from "../../MapManager";
import { GridText } from "./GridText";


export class TextTool implements Tool {
    public readonly configuration = {
        id: 'text',
        labelResourceId: 'tool_label_text',
        layerTypes: ['text']
    };

    constructor(private map: MapManager, private modal: ModalLauncher, private localizer: Localizer) {
    }

    public start(point: Point) {
        const cellIndex = this.map.mapAccessor.getIndex(point);

        if (cellIndex === undefined) {
            return;
        }

        const textInput = FormsHelper.createTextInput(this.localizer['input_label_text']),
            sizeInput = FormsHelper.createNumberInput(this.localizer['input_label_size'], 5, 100),
            title = this.localizer['form_title_new_text'];

        textInput.required = true;

        sizeInput.value = '10';
        textInput.required = true;

        this.modal.launchForm(title, [textInput.html, sizeInput.html], () => {
            const cell = this.map.getCell(cellIndex),
                fontSize = parseInt(sizeInput.value!) / 100,
                normalizedPosition = this.map.mapAccessor.normalizedPosition(cellIndex, point),
                position = VectorMath.round(normalizedPosition, 2),
                data: GridText = {
                    value: textInput.value!,
                    fontSize
                },
                text = cell.createObject('text', [position], data);

            cell.addObjects([text]);
        });
    }

    public move() {
    }

    public stop() {
    }
}