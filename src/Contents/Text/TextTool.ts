/// <reference path='../../Localization/Localizer.ts'/>
/// <reference path='../../MapAccessor.ts'/>
/// <reference path='../../UI/ModalLauncher.ts'/>
/// <reference path='../../UI/Tools/Tool.ts'/>
/// <reference path='../../VectorMath.ts'/>
/// <reference path='GridText.ts'/>
/// <reference path='TextHelper.ts'/>

class TextTool implements Tool {
    public readonly id = 'text';
    public readonly labelResourceId = 'tool_label_text';

    constructor(private mapAccessor: MapAccessor, private layers: LayersManager, private modal: ModalLauncher, private localizer: Localizer) {
    }

    public start(point: Point) {
        const cell = this.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }


        const textInput = document.createElement('input'),
            textLabel = document.createElement('label'),
            sizeInput = document.createElement('input'),
            sizeLabel = document.createElement('label'),
            title = this.localizer['form_title_new_text'];

        textInput.id = 'text';
        textInput.type = 'text';
        textInput.required = true;

        textLabel.htmlFor = textInput.id;
        textLabel.innerText = this.localizer['input_label_text'];

        sizeInput.id = 'size';
        sizeInput.type = 'number';
        sizeInput.min = '5';
        sizeInput.max = '100';
        sizeInput.value = '10';
        textInput.required = true;

        sizeLabel.htmlFor = sizeInput.id;
        sizeLabel.innerText = this.localizer['input_label_size'];

        this.modal.launchForm(title, [textLabel, textInput, sizeLabel, sizeInput], () => {
            const fontSize = parseInt(sizeInput.value) / 100,
                layer = TextHelper.layer,
                normalizedPosition = this.mapAccessor.normalizedPosition(cell, point),
                position = VectorMath.round(normalizedPosition, 2),
                text: GridText = {
                    type: TextHelper.objectType,
                    layer,
                    position,
                    value: textInput.value,
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