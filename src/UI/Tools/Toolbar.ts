/// <reference path="../UIElement.ts" />

class Toolbar implements UIElement {
    private _activeTool?: Tool;

    constructor(private tools: Tool[], private localizer: Localizer) {
    }

    public get activeTool() {
        return this._activeTool;
    }

    public build() {
        const container = document.createElement('div');

        container.id = 'toolbar';

        for (let tool of this.tools) {
            const id = 'tool-' + tool.id,
                radio = document.createElement('input'),
                label = document.createElement('label');

            radio.type = 'radio';
            radio.name = 'active-tool';
            radio.value = id;
            radio.id = id;
            radio.className = 'label-radio';

            label.htmlFor = id;
            label.innerText = tool.id[0].toLocaleUpperCase();
            label.title = this.localizer[tool.labelResourceId];

            radio.addEventListener('change', () => this._activeTool = tool);

            container.append(radio);
            container.append(label);
        }

        document.body.append(container);

        this._activeTool = this.tools[0];
        this.selectTool(this.tools[0].id);
    }

    public selectTool(id: string) {
        document.getElementById(id)?.click();
    }
}