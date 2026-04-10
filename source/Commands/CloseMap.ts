import { Localizer } from "../Localization/Localizer";
import { MapsManager } from "../MapsManager";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class CloseMap extends ActiveMapCommand {

    constructor(private maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_close_map']);
    }

    public execute() {
        const map = this.maps.activeMap;

        if (map === undefined) {
            return;
        }

        this.maps.remove(map.id);
    }
}