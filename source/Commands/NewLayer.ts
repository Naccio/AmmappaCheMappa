import { LayersHelper } from "../Layers/LayersHelper";
import { Localizer } from "../Engine/Localization/Localizer";
import { MapsManager } from "../Engine/MapsManager";
import { FormsHelper } from "../UI/Forms/FormsHelper";
import { ModalLauncher } from "../UI/ModalLauncher";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class NewLayer extends ActiveMapCommand {

    constructor(maps: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(maps, localizer['command_label_new_layer']);
    }

    public execute() {
        const map = this.activeMap;

        if (map === undefined) {
            return;
        }

        const nameInput = FormsHelper.createTextInput(this.localizer['input_label_name']),
            typeSelect = FormsHelper.createSelect(this.localizer['input_label_type'], [
                { value: 'terrain', label: this.localizer['layer_type_terrain'] },
                { value: 'grid', label: this.localizer['layer_type_grid'] },
                { value: 'text', label: this.localizer['layer_type_text'] }
            ]),
            title = this.localizer['form_title_new_layer'];

        typeSelect.required = true;

        this.modal.launchForm(title, [nameInput.html, typeSelect.html], () => {
            const name = nameInput.value,
                type = typeSelect.value!,
                layer = LayersHelper.create(type, name);

            map.layers.add(layer);
        });
    }
}