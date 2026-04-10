import { Localizer } from "../Localization/Localizer";
import { MapsManager } from "../MapsManager";
import { FormsHelper } from "../UI/Forms/FormsHelper";
import { ModalLauncher } from "../UI/ModalLauncher";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class EditMap extends ActiveMapCommand {

    constructor(private mapsManager: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(mapsManager, localizer['command_label_edit_map']);
    }

    public execute() {
        const mapManager = this.activeMap;

        if (mapManager === undefined) {
            return;
        }

        const map = mapManager.mapAccessor.map.data,
            titleInput = FormsHelper.createTextInput(this.localizer['input_label_title']),
            columnsInput = FormsHelper.createNumberInput(this.localizer['input_label_columns'], 5, 500),
            rowsInput = FormsHelper.createNumberInput(this.localizer['input_label_rows'], 5, 500),
            title = this.localizer['form_title_edit_map'];

        titleInput.value = map.title

        columnsInput.value = map.columns.toString();
        columnsInput.disabled = true;

        rowsInput.value = map.rows.toString();
        rowsInput.disabled = true;

        this.modal.launchForm(title, [titleInput.html, columnsInput.html, rowsInput.html], () => {
            const title = titleInput.value;

            this.mapsManager.update(map.id, m => m.title = title);
        });
    }
}