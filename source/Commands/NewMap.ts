import { Localizer } from "../Engine/Localization/Localizer";
import { MapFactory } from "../Engine/MapFactory";
import { MapsManager } from "../Engine/MapsManager";
import { FormsHelper } from "../UI/Forms/FormsHelper";
import { ModalLauncher } from "../UI/ModalLauncher";
import { SimpleCommand } from "./SimpleCommand";

export class NewMap extends SimpleCommand {

    constructor(private mapFactory: MapFactory, private mapsManager: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(localizer['command_label_new_map']);
    }

    public execute() {
        const titleInput = FormsHelper.createTextInput(this.localizer['input_label_title']),
            columnsInput = FormsHelper.createNumberInput(this.localizer['input_label_columns'], 5, 500),
            rowsInput = FormsHelper.createNumberInput(this.localizer['input_label_rows'], 5, 500),
            title = this.localizer['form_title_new_map'];

        columnsInput.value = '20';
        columnsInput.required = true;

        rowsInput.value = '20';
        rowsInput.required = true;

        this.modal.launchForm(title, [titleInput.html, columnsInput.html, rowsInput.html], () => {
            const title = titleInput.value,
                columns = parseInt(columnsInput.value!),
                rows = parseInt(rowsInput.value!),
                map = this.mapFactory.create(title, columns, rows);

            this.mapsManager.add(map);
        });
    }
}