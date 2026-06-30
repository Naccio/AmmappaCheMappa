import { LayerAccessor } from "../../Maps/Layers/LayerAccessor";
import { LayersManager } from "../../Maps/Layers/LayersManager";
import { Localizer } from "../../Engine/Localization/Localizer";
import { UIElement } from "../UIElement";
import { Tool } from "./Tool";
import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { RadioSelect } from "../RadioSelect";

export class Toolbar implements UIElement {
    private readonly container: HTMLDivElement;

    private _activeTool: InternalObservable<Tool | undefined>;

    constructor(
        tools: Tool[],
        localizer: Localizer,
        layers: LayersManager
    ) {
        const activeTool = new InternalObservable<Tool | undefined>(undefined),
            container = document.createElement('div'),
            select = new RadioSelect(activeTool, tools, (tool, label) => {
                const configuration = tool.configuration;

                label.innerText = configuration.id[0].toLocaleUpperCase();
                label.title = localizer[configuration.labelResourceId];
            });

        container.className = 'toolbar';

        container.append(select.html);

        this.container = container;
        this._activeTool = activeTool;

        layers.activeLayerObservable.subscribe(l =>
            select.disable(t => !this.isCompatibleWith(t, l)));
    }

    public get activeTool() {
        return this._activeTool.value;
    }

    public get html() {
        return this.container;
    }

    private isCompatibleWith(tool?: Tool, layer?: LayerAccessor) {
        if (!tool || !layer) {
            return false;
        }

        const layerTypes = tool.configuration.layerTypes;

        return layerTypes.length === 0 || layerTypes.includes(layer.type);
    }
}