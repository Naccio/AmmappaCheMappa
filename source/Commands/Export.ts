/// <reference path="../MapsManager.ts" />
/// <reference path="../Rendering/MapRenderer.ts" />
/// <reference path="ActiveMapCommand.ts" />

class Export extends ActiveMapCommand {

    constructor(private renderer: MapRenderer, maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_export']);
    }

    public execute() {
        const map = this.renderer.render();

        Utilities.download('map.png', map.toDataURL());
    }
}