/// <reference path="../Localization/Localizer.ts" />
/// <reference path="ActiveMapCommand.ts" />

class CloseMap extends ActiveMapCommand {

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