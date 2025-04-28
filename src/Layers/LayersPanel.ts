class LayersPanel implements UIElement {
    public constructor(private layers: LayersManager, private localizer: Localizer) {
        layers.onNewLayer(() => this.build());
    }

    build(): void {
        document.getElementById('layers')?.remove();

        const container = document.createElement('div');

        container.id = 'layers';

        for (let layer of this.layers.layers) {
            const data = layer.data,
                id = data.id,
                //HACK: Magic string layer_type_
                type = this.localizer[`layer_type_${data.type}`],
                wrapper = document.createElement('div'),
                check = document.createElement('input'),
                radio = document.createElement('input'),
                label = document.createElement('label'),
                typeLabel = document.createElement('small');

            check.type = 'checkbox';
            check.name = 'visible-layers';
            check.value = id;
            check.id = id + '-visible';

            radio.type = 'radio';
            radio.name = 'active-layer';
            radio.value = id;
            radio.id = this.getRadioId(id);
            radio.className = 'label-radio';

            typeLabel.innerText = ` (${type})`;

            label.htmlFor = radio.id;
            label.innerText = data.name;
            label.title = data.name;
            label.append(typeLabel);

            wrapper.append(check);
            wrapper.append(radio);
            wrapper.append(label);
            container.append(wrapper);

            if (this.layers.activeLayer?.data.id === id) {
                radio.checked = true;
            }
        }

        document.body.append(container);
    }

    private getRadioId(id: string) {
        return id + '-active';
    }

    private selectLayer(id: string) {
        id = this.getRadioId(id);
        document.getElementById(id)?.click();
    }
}