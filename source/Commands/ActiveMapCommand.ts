/// <reference path="../Events/ApplicationEvent.ts" />
/// <reference path="../Events/InternalEvent.ts" />
/// <reference path="../MapManager.ts" />
/// <reference path="../MapsManager.ts" />
/// <reference path="Command.ts" />

abstract class ActiveMapCommand implements Command {
    private readonly changeEvent = new InternalEvent<boolean>();
    private readonly _label: string;

    protected _disabled: boolean = true;

    constructor(mapsManager: MapsManager, label: string) {
        this._label = label;

        mapsManager.onActivate(map => this.activeMapHandler(map));
    }

    public get disabled() {
        return this._disabled;
    }

    public get label() {
        return this._label;
    }

    abstract execute(): void;

    public onChange(handler: EventHandler<boolean>) {
        this.changeEvent.subscribe(handler);
    };

    private activeMapHandler(map?: MapManager) {
        const disabled = map === undefined;

        this._disabled = disabled;
        this.changeEvent.trigger(disabled);
    }
}