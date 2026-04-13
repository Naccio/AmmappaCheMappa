import { LayerAccessor } from "../../Layers/LayerAccessor";
import { LayersManager } from "../../Layers/LayersManager";
import { Localizer } from "../../Engine/Localization/Localizer";
import { MapAccessor } from "../../Engine/MapAccessor";
import { UIElement } from "../UIElement";
import { Tool } from "./Tool";

export class Toolbar implements UIElement {
    private readonly container: HTMLDivElement;

    private _activeTool?: Tool;

    constructor(
        private tools: Tool[],
        localizer: Localizer,
        private mapAccessor: MapAccessor,
        private layers: LayersManager
    ) {
        const container = document.createElement('div');

        container.className = 'toolbar';

        for (let tool of tools) {
            const configuration = tool.configuration,
                id = configuration.id,
                radioId = this.getRadioId(id),
                radio = document.createElement('input'),
                label = document.createElement('label');

            radio.type = 'radio';
            radio.name = mapAccessor.id + '-active-tool';
            radio.value = id;
            radio.id = radioId;
            radio.className = 'label-radio';

            label.htmlFor = radioId;
            label.innerText = id[0].toLocaleUpperCase();
            label.title = localizer[configuration.labelResourceId];

            radio.addEventListener('change', () => this._activeTool = tool);

            container.append(radio);
            container.append(label);
        }

        this.container = container;

        layers.onSelect(this.layerSelectHandle);
    }

    public get activeTool() {
        return this._activeTool;
    }

    public get html() {
        return this.container;
    }

    private getRadio(id: string): HTMLInputElement {
        id = this.getRadioId(id);
        //HACK: Should check if it actually is an input
        return document.getElementById(id) as HTMLInputElement;
    }

    private getRadioId(id: string) {
        return `${this.mapAccessor.id}-${id}-tool`;
    }

    private selectFirstTool() {
        for (let tool of this.tools) {
            if (this.isCompatibleWith(tool, this.layers.activeLayer)) {
                this.selectTool(tool.configuration.id);
                this._activeTool = tool;
                return;
            }
        }
        this._activeTool = undefined;
    }

    private selectTool(id: string) {
        id = this.getRadioId(id);
        document.getElementById(id)?.click();
    }

    private isCompatibleWith(tool?: Tool, layer?: LayerAccessor) {
        if (!tool || !layer) {
            return false;
        }

        const layerTypes = tool.configuration.layerTypes;

        return layerTypes.length === 0 || layerTypes.includes(layer.value.type);
    }

    private layerSelectHandle = (layer: LayerAccessor) => {
        for (let tool of this.tools) {
            const radio = this.getRadio(tool.configuration.id);

            radio.disabled = !this.isCompatibleWith(tool, layer);
        }
        if (!this.isCompatibleWith(this.activeTool, layer)) {
            this.selectFirstTool();
        }
    }
}