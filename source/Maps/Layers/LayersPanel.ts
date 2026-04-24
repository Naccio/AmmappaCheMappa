import { Localizer } from "../../Engine/Localization/Localizer";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { UIFactory } from "../../UI/UIFactory";
import { LayerAccessor } from "./LayerAccessor";
import { LayersManager } from "./LayersManager";

export class LayersPanel implements UIElement {
    private readonly select: RadioSelect<LayerAccessor>;

    public constructor(
        private layersManager: LayersManager,
        private uiFactory: UIFactory,
        private localizer: Localizer
    ) {
        const select = new RadioSelect(
            layersManager.activeLayerObservable,
            layersManager.layers,
            (layer, label) => {
                const data = layer.value,
                    id = data.id,
                    //HACK: Magic string layer_type_
                    type = this.localizer[`layer_type_${data.type}`],
                    labelText = document.createElement('span'),
                    typeLabel = document.createElement('small'),
                    deleteButton = this.uiFactory.createCloseButton(_ => this.layersManager.delete(id));

                typeLabel.innerText = `(${type})`;

                layer.subscribe(l => {
                    const name = l.name ?? l.id;

                    label.title = name;
                    labelText.innerText = name;
                });

                label.append(labelText);
                label.append(typeLabel);
                label.append(deleteButton);
            },
            (layer, wrapper) => {
                const data = layer.value,
                    id = data.id,
                    mapId = this.layersManager.mapId,
                    check = document.createElement('input');

                check.type = 'checkbox';
                check.name = mapId + '-visible-layers';
                check.value = id;
                check.id = id + '-visible';
                check.checked = !data.hidden;

                check.onchange = () => this.layersManager.update(id, l => l.hidden = !check.checked);

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