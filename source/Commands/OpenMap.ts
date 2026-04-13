import { Localizer } from "../Engine/Localization/Localizer";
import { MapsManager } from "../Engine/MapsManager";
import { Utilities } from "../Utilities/Utilities";
import { SimpleCommand } from "./SimpleCommand";

export class OpenMap extends SimpleCommand {

    constructor(private mapsManager: MapsManager, localizer: Localizer) {
        super(localizer['command_label_open_map']);
    }

    public execute() {
        Utilities.loadFile((f) => this.readFile(f));
    }

    private readFile(file: string) {
        const map = Utilities.parseMap(file);

        this.mapsManager.add(map);
    }
}