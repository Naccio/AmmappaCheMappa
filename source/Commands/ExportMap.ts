import { Localizer } from "../Engine/Localization/Localizer";
import { MapsManager } from "../Maps/MapsManager";
import { MapRenderer } from "../Maps/MapRenderer";
import { Utilities } from "../Utilities/Utilities";
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