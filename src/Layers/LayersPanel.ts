class LayersPanel implements UIElement {
    private container: HTMLDivElement;

    public constructor(private layers: LayersManager, private localizer: Localizer) {
        this.container = document.createElement('div');

        this.container.id = 'layers';

        layers.onCreate(l => this.buildLayer(l));
        layers.onSelect(l => this.selectLayer(l));
    }

    build(): void {
        document.getElementById('layers')?.remove();
        document.body.append(this.container);
    }

    private buildLayer(layer: LayerAccessor) {
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
        check.checked = !data.hidden;

        check.onchange = () => this.layers.update(id, l => l.hidden = !check.checked);

        radio.type = 'radio';
        radio.name = 'active-layer';
        radio.value = id;
        radio.id = this.getRadioId(id);
        radio.className = 'label-radio';

        radio.onchange = () => this.layers.select(id);

        typeLabel.innerText = `(${type})`;

        label.htmlFor = radio.id;
        label.innerText = data.name;
        label.title = data.name;
        label.append(typeLabel);

        wrapper.append(check);
        wrapper.append(radio);
        wrapper.append(label);
        this.container.append(wrapper);
    }

    private getRadioId(id: string) {
        return id + '-active';
    }

    private selectLayer(layer: LayerAccessor) {
        const id = this.getRadioId(layer.data.id);
        document.getElementById(id)?.click();
    }
}