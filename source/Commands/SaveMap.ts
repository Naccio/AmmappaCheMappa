import { Localizer } from "../Localization/Localizer";
import { MapsManager } from "../MapsManager";
import { Utilities } from "../Utilities";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class SaveMap extends ActiveMapCommand {

    constructor(private maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_save_map']);
    }

    public execute() {
        const map = this.maps.activeMap?.mapAccessor.map;

        if (map === undefined) {
            return;
        }

        const json = JSON.stringify(map),
            content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);

        Utilities.download('map.json', content);
    }
}