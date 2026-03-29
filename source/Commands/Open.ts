/// <reference path="SimpleCommand.ts" />

class Open extends SimpleCommand {

    constructor(private mapsManager: MapsManager, localizer: Localizer) {
        super(localizer['command_label_open']);
    }

    public execute() {
        Utilities.loadFile((f) => this.readFile(f));
    }

    private readFile(file: string) {
        const map = Utilities.parseMap(file);

        this.mapsManager.add(map);
    }
}