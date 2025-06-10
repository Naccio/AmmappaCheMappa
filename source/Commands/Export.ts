/// <reference path="../Rendering/MapRenderer.ts" />
/// <reference path="./Command.ts" />

class Export implements Command {
    public readonly label;

    constructor(private renderer: MapRenderer, localizer: Localizer) {
        this.label = localizer['command_label_export'];
    }

    public execute() {
        const map = this.renderer.render();

        Utilities.download('map.png', map.toDataURL());
    }
}