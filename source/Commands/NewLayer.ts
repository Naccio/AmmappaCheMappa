/// <reference path="../MapsManager.ts" />
/// <reference path="../UI/ModalLauncher.ts" />
/// <reference path="ActiveMapCommand.ts" />

class NewLayer extends ActiveMapCommand {

    constructor(maps: MapsManager, private modal: ModalLauncher, private localizer: Localizer) {
        super(maps, localizer['command_label_new_layer']);
    }

    public execute() {
        const map = this.activeMap;

        if (map === undefined) {
            return;
        }

        const nameWrapper = document.createElement('div'),
            nameInput = document.createElement('input'),
            nameLabel = document.createElement('label'),
            typeSelect = document.createElement('select'),
            typeLabel = document.createElement('label'),
            terrainTypeOption = document.createElement('option'),
            gridTypeOption = document.createElement('option'),
            textTypeOption = document.createElement('option'),
            title = this.localizer['form_title_new_layer'];

        nameInput.id = 'name';
        nameInput.type = 'text';

        nameLabel.htmlFor = nameInput.id;
        nameLabel.innerText = this.localizer['input_label_name'];

        nameWrapper.append(nameLabel, nameInput);

        typeSelect.id = 'type';
        typeSelect.required = true;

        terrainTypeOption.value = 'terrain';
        terrainTypeOption.innerText = this.localizer['layer_type_terrain'];

        gridTypeOption.value = 'grid';
        gridTypeOption.innerText = this.localizer['layer_type_grid'];

        textTypeOption.value = 'text';
        textTypeOption.innerText = this.localizer['layer_type_text'];

        typeSelect.append(terrainTypeOption, gridTypeOption, textTypeOption);
        typeSelect.value = 'terrain';

        typeLabel.htmlFor = typeSelect.id;
        typeLabel.innerText = this.localizer['input_label_type'];

        this.modal.launchForm(title, [nameWrapper, typeLabel, typeSelect], () => {
            const name = nameInput.value === '' ? undefined : nameInput.value,
                type = typeSelect.value,
                layer = LayersHelper.create(type, name);

            map.layers.add(layer);
        });
    }
}