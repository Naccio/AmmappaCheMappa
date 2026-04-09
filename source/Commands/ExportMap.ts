import { Localizer } from "../Localization/Localizer";
import { MapsManager } from "../MapsManager";
import { MapRenderer } from "../Rendering/MapRenderer";
import { Utilities } from "../Utilities";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class ExportMap extends ActiveMapCommand {

    constructor(private renderer: MapRenderer, private maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_export_map']);
    }

    public execute() {
        const map = this.maps.activeMap;

        if (map) {
            const renderedMap = this.renderer.render(map);

            Utilities.download('map.png', renderedMap.toDataURL());
        }
    }
}