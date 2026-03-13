/// <reference path="Model/EditorMap.ts" />

class Store {
    public getMap() {
        const data = localStorage.getItem('map');
        let map;

        if (data !== null) {
            map = Utilities.parseMap(data);
        }

        return map;
    }

    public saveMap(map: EditorMap) {
        localStorage.setItem('map', JSON.stringify(map));
    }
}