/// <reference path="../UI/ModalLauncher.ts" />
/// <reference path="SimpleCommand.ts" />

class New extends SimpleCommand {

    constructor(private mapFactory: MapFactory, private mapsManager: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(localizer['command_label_new']);
    }

    public execute() {
        const titleWrapper = document.createElement('div'),
            titleInput = document.createElement('input'),
            titleLabel = document.createElement('label'),
            columnsInput = document.createElement('input'),
            columnsLabel = document.createElement('label'),
            rowsInput = document.createElement('input'),
            rowsLabel = document.createElement('label'),
            title = this.localizer['form_title_new_map'];

        titleInput.id = 'title';
        titleInput.type = 'text';

        titleLabel.htmlFor = titleInput.id;
        titleLabel.innerText = this.localizer['input_label_title'];

        titleWrapper.append(titleLabel, titleInput);

        columnsInput.id = 'columns';
        columnsInput.type = 'number';
        columnsInput.min = '5';
        columnsInput.max = '100';
        columnsInput.value = '20';
        columnsInput.required = true;

        columnsLabel.htmlFor = columnsInput.id;
        columnsLabel.innerText = this.localizer['input_label_columns'];

        rowsInput.id = 'rows';
        rowsInput.type = 'number';
        rowsInput.min = '5';
        rowsInput.max = '100';
        rowsInput.value = '20';
        columnsInput.required = true;

        rowsLabel.htmlFor = rowsInput.id;
        rowsLabel.innerText = this.localizer['input_label_rows'];

        this.modal.launchForm(title, [titleWrapper, columnsLabel, columnsInput, rowsLabel, rowsInput], () => {
            const title = titleInput.value === '' ? undefined : titleInput.value,
                columns = parseInt(columnsInput.value),
                rows = parseInt(rowsInput.value),
                map = this.mapFactory.create(title, columns, rows);

            this.mapsManager.add(map);
        });
    }
}