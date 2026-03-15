/// <reference path="MapManagerFactory.ts" />
/// <reference path="Model/EditorMap.ts" />
/// <reference path="UI/MainArea.ts" />

class MapLoader {
    constructor(private mapManagerFactory: MapManagerFactory, private mainArea: MainArea) {
    }

    public load(map: EditorMap) {
        const mapManager = this.mapManagerFactory.create(map);
        this.mainArea.addMap(mapManager);
    }
}