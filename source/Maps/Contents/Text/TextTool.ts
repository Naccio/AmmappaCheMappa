import { Localizer } from "../../../Engine/Localization/Localizer";
import { FormsHelper } from "../../../UI/Forms/FormsHelper";
import { ModalLauncher } from "../../../UI/ModalLauncher";
import { Tool } from "../../../UI/Tools/Tool";
import { ToolContext } from "../../../UI/Tools/ToolContext";
import { GridText } from "./GridText";


export class TextTool implements Tool {
    public readonly configuration = {
        id: 'text',
        labelResourceId: 'tool_label_text',
        layerTypes: ['text']
    };

    constructor(
        private readonly modal: ModalLauncher,
        private readonly localizer: Localizer
    ) {
    }

    public start(context: ToolContext) {
        const cell = context.cell;

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
                data: GridText = {
                    value: textInput.value!,
                    fontSize
                },
                text = cell.createObject('text', [context.cellPosition], data);

            cell.addObjects([text]);
        });
    }

    public move() {
    }

    public stop() {
    }
}