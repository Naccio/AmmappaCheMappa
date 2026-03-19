class LayersPanel implements UIElement {
    private container?: HTMLDivElement;

    public constructor(private layers: LayersManager, private localizer: Localizer) {
    }

    build() {
        this.container = document.createElement('div');

        this.container.className = 'layers';

        this.layers.onCreate(l => this.buildLayer(l));
        this.layers.onDelete(l => this.removeLayer(l.id));
        this.layers.onSelect(l => this.selectLayer(l));

        return this.container;
    }

    private buildLayer(layer: LayerAccessor) {
        const data = layer.data,
            id = data.id,
            mapId = this.layers.mapId,
            //HACK: Magic string layer_type_
            type = this.localizer[`layer_type_${data.type}`],
            wrapper = document.createElement('div'),
            check = document.createElement('input'),
            radio = document.createElement('input'),
            label = document.createElement('label'),
            typeLabel = document.createElement('small');

        check.type = 'checkbox';
        check.name = mapId + '-visible-layers';
        check.value = id;
        check.id = id + '-visible';
        check.checked = !data.hidden;

        check.onchange = () => this.layers.update(id, l => l.hidden = !check.checked);

        radio.type = 'radio';
        radio.name = mapId + '-active-layer';
        radio.value = id;
        radio.id = this.getRadioId(id);
        radio.className = 'label-radio';

        radio.onchange = () => this.layers.select(id);

        typeLabel.innerText = `(${type})`;

        label.htmlFor = radio.id;
        label.innerText = data.name;
        label.title = data.name;
        label.append(typeLabel);

        wrapper.id = this.getWrapperId(id);

        wrapper.append(check);
        wrapper.append(radio);
        wrapper.append(label);
        this.container?.append(wrapper);
    }

    private getRadioId(id: string) {
        return id + '-active';
    }

    private getWrapperId(id: string) {
        return id + '-panel-controls';
    }

    private removeLayer(id: string) {
        id = this.getWrapperId(id);
        document.getElementById(id)?.remove();
    }

    private selectLayer(layer: LayerAccessor) {
        const id = this.getRadioId(layer.data.id);
        document.getElementById(id)?.click();
    }
}