import { ApplicationState } from "./Model/ApplicationState";
import { EditorMap } from "./Model/EditorMap";

//TODO: Consider switching to IndexedDB
export class Store implements ApplicationState {
    private _state?: ApplicationState;

    private get state() {
        if (!this._state) {
            this._state = this.loadState();
        }

        return this._state;
    }

    public get activeMap() {
        return this.state.activeMap;
    }

    public set activeMap(id: string | undefined) {
        this.state.activeMap = id;
        this.storeState();
    }

    public get locale() {
        return this.state.locale;
    }

    public set locale(language: string | undefined) {
        this.state.locale = language;
        this.storeState();
    }

    public get maps() {
        return this.state.maps;
    }

    public deleteMap(id: string) {
        const map = this.state.maps.find(m => m.data.id === id);

        if (map) {
            this.state.maps.splice(this.state.maps.indexOf(map), 1);
        }

        this.storeState();
    }

    public saveMap(map: EditorMap) {
        if (this.state.maps.indexOf(map) === -1) {
            this.state.maps.push(map);
        }

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