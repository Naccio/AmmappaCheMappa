/// <reference path="../UIElement.ts" />

class Toolbar implements UIElement {
    private _activeTool?: Tool;

    constructor(private tools: Tool[], private localizer: Localizer, private layers: LayersManager) {
        layers.onSelect(this.layerSelectHandle);
    }

    public get activeTool() {
        return this._activeTool;
    }

    public build() {
        const container = document.createElement('div');

        container.id = 'toolbar';

        for (let tool of this.tools) {
            const configuration = tool.configuration,
                id = configuration.id,
                radioId = this.getRadioId(configuration.id),
                radio = document.createElement('input'),
                label = document.createElement('label');

            radio.type = 'radio';
            radio.name = 'active-tool';
            radio.value = id;
            radio.id = radioId;
            radio.className = 'label-radio';

            label.htmlFor = radioId;
            label.innerText = id[0].toLocaleUpperCase();
            label.title = this.localizer[configuration.labelResourceId];

            radio.addEventListener('change', () => this._activeTool = tool);

            container.append(radio);
            container.append(label);
        }

        document.body.append(container);
    }

    public getRadio(id: string): HTMLInputElement {
        id = this.getRadioId(id);
        //HACK: Should check if it actually is an input
        return document.getElementById(id) as HTMLInputElement;
    }

    private getRadioId(id: string) {
        return 'tool-' + id
    }

    public selectFirstTool() {
        for (let tool of this.tools) {
            if (this.isCompatibleWith(tool, this.layers.activeLayer)) {
                this.selectTool(tool.configuration.id);
                this._activeTool = tool;
                return;
            }
        }
        this._activeTool = undefined;
    }

    public selectTool(id: string) {
        id = this.getRadioId(id);
        document.getElementById(id)?.click();
    }

    private isCompatibleWith(tool?: Tool, layer?: LayerAccessor) {
        if (!tool || !layer) {
            return false;
        }

        const layerTypes = tool.configuration.layerTypes;

        return layerTypes.length === 0 || layerTypes.includes(layer.data.type);
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