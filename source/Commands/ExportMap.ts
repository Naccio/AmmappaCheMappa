/// <reference path="../MapsManager.ts" />
/// <reference path="../Rendering/MapRenderer.ts" />
/// <reference path="ActiveMapCommand.ts" />

class ExportMap extends ActiveMapCommand {

    constructor(private renderer: MapRenderer, private maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_export']);
    }

    public execute() {
        const map = this.maps.activeMap;

        if (map) {
            const renderedMap = this.renderer.render(map);

            Utilities.download('map.png', renderedMap.toDataURL());
        }
    }
}