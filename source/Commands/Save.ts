/// <reference path="ActiveMapCommand.ts" />

class Save extends ActiveMapCommand {

    constructor(private maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_save']);
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