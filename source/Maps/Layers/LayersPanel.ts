import { Localizer } from "../../Engine/Localization/Localizer";
import { MapLayer } from "../../Model/MapLayer";
import { UIElement } from "../../UI/UIElement";
import { UIFactory } from "../../UI/UIFactory";
import { LayerAccessor } from "./LayerAccessor";
import { LayersManager } from "./LayersManager";

export class LayersPanel implements UIElement {
    private readonly container: HTMLDivElement;
    private readonly layers: Map<string, HTMLElement>;

    public constructor(
        private layersManager: LayersManager,
        private uiFactory: UIFactory,
        private localizer: Localizer
    ) {
        const container = document.createElement('div');

        container.className = 'layers';

        layersManager.onCreate(l => this.buildLayer(l));
        layersManager.onDelete(l => this.removeLayer(l.id));
        layersManager.onSelect(l => this.selectLayer(l));

        this.container = container;
        this.layers = new Map<string, HTMLElement>();
    }

    public get html() {
        return this.container;
    }

    private buildLayer(layer: LayerAccessor) {
        const data = layer.value,
            id = data.id,
            mapId = this.layersManager.mapId,
            //HACK: Magic string layer_type_
            type = this.localizer[`layer_type_${data.type}`],
            wrapper = document.createElement('div'),
            check = document.createElement('input'),
            radio = document.createElement('input'),
            label = document.createElement('label'),
            labelText = document.createElement('span'),
            typeLabel = document.createElement('small'),
            deleteButton = this.uiFactory.createCloseButton(_ => this.layersManager.delete(id));

        check.type = 'checkbox';
        check.name = mapId + '-visible-layers';
        check.value = id;
        check.id = id + '-visible';
        check.checked = !data.hidden;

        check.onchange = () => this.layersManager.update(id, l => l.hidden = !check.checked);

        radio.type = 'radio';
        radio.name = mapId + '-active-layer';
        radio.value = id;
        radio.id = this.getRadioId(id);
        radio.className = 'label-radio';

        radio.onchange = () => this.layersManager.select(id);

        typeLabel.innerText = `(${type})`;

        label.htmlFor = radio.id;
        label.append(labelText);
        label.append(typeLabel);
        label.append(deleteButton);

        wrapper.append(check);
        wrapper.append(radio);
        wrapper.append(label);

        layer.subscribe(l => {
            const name = this.getName(l);

            label.title = name;
            labelText.innerText = name;
        });

        this.container.append(wrapper);
        this.layers.set(id, wrapper);
    }

    private getName(layer: MapLayer) {
        return layer.name ?? layer.id;
    }

    private getRadioId(id: string) {
        return id + '-active';
    }

    private removeLayer(id: string) {
        const layer = this.layers.get(id);

        if (layer == undefined) {
            return;
        }

        layer.remove();
        this.layers.delete(id);
    }

    private selectLayer(layer: LayerAccessor) {
        const id = this.getRadioId(layer.id);
        document.getElementById(id)?.click();
    }
}