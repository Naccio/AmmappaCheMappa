import { Localizer } from "../../Engine/Localization/Localizer";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { UIFactory } from "../../UI/UIFactory";
import { LayerContext } from "./LayerContext";
import { LayersManager } from "./LayersManager";

export class LayersPanel implements UIElement {
    private readonly select: RadioSelect<LayerContext>;

    public constructor(
        private layersManager: LayersManager,
        private uiFactory: UIFactory,
        private localizer: Localizer
    ) {
        const select = new RadioSelect(
            layersManager.activeLayerObservable,
            layersManager.layers,
            (layer, label) => {
                const id = layer.id,
                    //HACK: Magic string layer_type_
                    type = this.localizer[`layer_type_${layer.type}`],
                    labelText = document.createElement('span'),
                    typeLabel = document.createElement('small'),
                    deleteButton = this.uiFactory.createCloseButton(_ => this.layersManager.delete(id));

                typeLabel.innerText = `(${type})`;

                layer.onUpdate(() => {
                    const name = layer.name ?? layer.id;

                    label.title = name;
                    labelText.innerText = name;
                });

                const name = layer.name ?? layer.id;

                label.title = name;
                labelText.innerText = name;

                label.append(labelText);
                label.append(typeLabel);
                label.append(deleteButton);
            },
            (layer, wrapper) => {
                const id = layer.id,
                    mapId = this.layersManager.mapId,
                    check = document.createElement('input');

                check.type = 'checkbox';
                check.name = mapId + '-visible-layers';
                check.value = id;
                check.id = id + '-visible';
                check.checked = !layer.hidden;

                check.onchange = () => layer.hidden = !check.checked;

                wrapper.append(check);
            }
        );

        select.html.className = 'layers';

        layersManager.onCreate(l => select.add(l));
        layersManager.onDelete(l => select.remove(l));

        this.select = select;
    }

    public get html() {
        return this.select.html;
    }
}