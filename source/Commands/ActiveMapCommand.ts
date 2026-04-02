/// <reference path="../MapManager.ts" />
/// <reference path="../MapsManager.ts" />
/// <reference path="ConditionalCommand.ts" />

abstract class ActiveMapCommand extends ConditionalCommand {

    private _activeMap?: MapManager;

    constructor(mapsManager: MapsManager, label: string) {
        super(label);

        mapsManager.onActivate(map => this.activeMapHandler(map));
    }

    protected get activeMap() {
        return this._activeMap;
    }

    abstract execute(): void;

    private activeMapHandler(map?: MapManager) {
        const disabled = map === undefined;

        this._activeMap = map;
        this.disabled = disabled;
    }
}