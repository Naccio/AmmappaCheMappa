class Open implements Command {
    public label;

    constructor(private mapLoader: MapLoader, localizer: Localizer) {
        this.label = localizer['command_label_open'];
    }

    public execute() {
        Utilities.loadFile((f) => this.readFile(f));
    }

    private readFile(file: string) {
        const map = Utilities.parseMap(file);

        this.mapLoader.load(map);
    }
}