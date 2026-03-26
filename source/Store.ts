/// <reference path="Model/ApplicationState.ts" />
/// <reference path="Model/EditorMap.ts" />

//TODO: Consider switching to IndexedDB
class Store {
    private _state?: ApplicationState;

    private get state() {
        if (!this._state) {
            this._state = this.loadState();
        }

        return this._state;
    }

    public deleteMap(id: string) {
        const map = this.state.maps.find(m => m.data.id === id);

        if (map) {
            this.state.maps.splice(this.state.maps.indexOf(map), 1);
        }

        this.storeState();
    }

    public getActiveMap() {
        const id = this.state.activeMap;

        return id
            ? this.state.maps.find(m => m.data.id === id)
            : undefined;
    }

    public getMaps() {
        return this.state.maps;
    }

    public saveMap(map: EditorMap) {
        if (this.state.maps.indexOf(map) === -1) {
            this.state.maps.push(map);
        }

        this.storeState();
    }

    public setActiveMap(id?: string) {
        this.state.activeMap = id;

        this.storeState();
    }

    private loadState() {
        const storedState = localStorage.getItem('state');

        return storedState
            ? JSON.parse(storedState) as ApplicationState
            : { maps: [] };
    }

    private storeState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }
}