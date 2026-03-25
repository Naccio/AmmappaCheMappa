/// <reference path="Model/Dictionary.ts" />

class MapsManager {
    private readonly addEvent = new InternalEvent<MapManager>();
    private readonly removeEvent = new InternalEvent<string>();
    private readonly activateEvent = new InternalEvent<MapManager | undefined>();

    private readonly maps: Dictionary<MapManager> = {};

    private _activeMap?: MapManager;

    constructor(
        private factory: MapManagerFactory,
        private modal: ModalLauncher,
        private localizer: Localizer
    ) { }

    public get activeMap() {
        return this._activeMap;
    }

    public add(map: EditorMap) {
        const manager = this.factory.create(map),
            id = map.data.id;

        this.maps[id] = manager;

        this.addEvent.trigger(manager);
        this.activate(id);
    }

    public remove(id: string) {
        //TODO: Should this class be responsible for launching the modal?
        this.modal.launchConfirm(
            this.localizer['confirm_close_map_title'],
            this.localizer['confirm_close_map_message'],
            () => {
                delete this.maps[id];

                this.removeEvent.trigger(id);

                for (let key in this.maps) {
                    this.activate(key);
                    break;
                }

                if (this._activeMap?.id === id) {
                    this._activeMap = undefined;
                    this.activateEvent.trigger(undefined);
                }
            });
    }

    public activate(id: string) {
        const map = this.maps[id];

        this._activeMap = map;

        this.activateEvent.trigger(map);
    }

    public onActivate(handler: EventHandler<MapManager | undefined>) {
        this.activateEvent.subscribe(handler);
    }

    public onAdd(handler: EventHandler<MapManager>) {
        this.addEvent.subscribe(handler);
    }

    public onRemove(handler: EventHandler<string>) {
        this.removeEvent.subscribe(handler);
    }
}