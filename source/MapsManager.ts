/// <reference path="Store.ts" />
/// <reference path="Model/Dictionary.ts" />

class MapsManager {
    private readonly addEvent = new InternalEvent<MapManager>();
    private readonly updateEvent = new InternalEvent<MapData>();
    private readonly removeEvent = new InternalEvent<string>();
    private readonly activateEvent = new InternalEvent<MapManager | undefined>();

    private maps: Dictionary<MapManager> = {};

    private _activeMap?: MapManager;

    constructor(
        private store: Store,
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

                this.store.deleteMap(id);
                this.removeEvent.trigger(id);

                for (let key in this.maps) {
                    this.activate(key);
                    break;
                }

                if (this._activeMap?.id === id) {
                    this._activeMap = undefined;
                    this.store.activeMap = undefined;
                    this.activateEvent.trigger(undefined);
                }
            });
    }

    public activate(id: string) {
        const map = this.maps[id];

        this._activeMap = map;

        this.store.activeMap = id;
        this.activateEvent.trigger(map);
    }

    public update(id: string, action: (map: MapData) => void) {
        const mapManager = this.maps[id],
            map = mapManager.mapAccessor.map;

        action(map.data);
        this.store.saveMap(map);
        this.updateEvent.trigger(map.data);
    }

    public onActivate(handler: EventHandler<MapManager | undefined>) {
        this.activateEvent.subscribe(handler);
    }

    public onAdd(handler: EventHandler<MapManager>) {
        this.addEvent.subscribe(handler);
    }

    public onUpdate(handler: EventHandler<MapData>) {
        this.updateEvent.subscribe(handler);
    }

    public onRemove(handler: EventHandler<string>) {
        this.removeEvent.subscribe(handler);
    }

    public setup() {
        const maps = this.store.maps,
            activeMap = maps.find(m => m.data.id == this.store.activeMap);

        this.maps = {};
        maps.forEach(m => this.add(m));

        if (activeMap) {
            this.activate(activeMap.data.id);
        }
    }
}