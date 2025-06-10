class Save implements Command {
    public label;

    constructor(private mapAccessor: MapAccessor, localizer: Localizer) {
        this.label = localizer['command_label_save'];
    }

    public execute() {
        const json = JSON.stringify(this.mapAccessor.map),
            content = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);

        Utilities.download('map.json', content);
    }
}