class Save implements Command {
    public label;

    constructor(private mainArea: MainArea, localizer: Localizer) {
        this.label = localizer['command_label_save'];
    }

    public execute() {
        const map = this.mainArea.mapManager?.mapAccessor.map;

        if (map === undefined) {
            return;
        }

        const json = JSON.stringify(map),
            content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);

        Utilities.download('map.json', content);
    }
}