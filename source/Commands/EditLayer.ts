import { Localizer } from "../Engine/Localization/Localizer";
import { MapsManager } from "../Engine/MapsManager";
import { FormsHelper } from "../UI/Forms/FormsHelper";
import { ModalLauncher } from "../UI/ModalLauncher";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class EditLayer extends ActiveMapCommand {

    constructor(maps: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(maps, localizer['command_label_edit_layer']);
    }

    public execute() {
        const layers = this.activeMap?.layers,
            layer = layers?.activeLayer;

        if (layer === undefined) {
            return;
        }

        const data = layer.value,
            type = data.type,
            nameInput = FormsHelper.createTextInput(this.localizer['input_label_name']),
            typeSelect = FormsHelper.createSelect(this.localizer['input_label_type'], [
                { value: type, label: this.localizer['layer_type_' + type] }
            ]),
            title = this.localizer['form_title_edit_layer'];

        nameInput.value = data.name ?? '';
        typeSelect.disabled = true;

        this.modal.launchForm(title, [nameInput.html, typeSelect.html], () => {
            const name = nameInput.value === '' ? undefined : nameInput.value;

            layers?.update(layer.id, l => l.name = name);
        });
    }
}