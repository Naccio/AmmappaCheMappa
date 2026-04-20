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

            renderedMap.toBlob(b => {
                const fileName = 'map.png';

                if (b) {
                    const url = URL.createObjectURL(b);
                    Utilities.download(fileName, url);
                    URL.revokeObjectURL(url);
                } else {
                    Utilities.download(fileName, '');
                }
            });
        }
    }
}