/// <reference path="../MapManager.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="MapUIFactory.ts" />
/// <reference path="UIElement.ts" />



class MainArea implements UIElement {
    private readonly container: HTMLElement;
    private readonly tabs: HTMLElement;

    private readonly maps: { id: string, map: MapManager, ui: MapUI, tab: HTMLElement }[] = [];

    private _mapManager?: MapManager;

    constructor(private uiFactory: MapUIFactory) {
        const container = document.createElement('div'),
            tabs = document.createElement('nav');

        container.id = 'main-area';
        tabs.className = 'tabs';

        container.append(tabs);

        this.container = container;
        this.tabs = tabs;
    }

    public get mapManager() {
        return this._mapManager;
    }

    public addMap(map: MapManager) {
        const ui = this.uiFactory.create(map),
            tab = document.createElement('a');

        tab.href = '#' + ui.id;
        tab.className = 'tab';
        tab.innerText = map.id;
        tab.onclick = () => this.activate(map.id);

        this._mapManager = map;

        this.maps.push({
            id: map.id,
            map,
            ui,
            tab
        });
        this.container.append(ui.build());
        this.tabs.append(tab);
        this.activate(map.id);

        ui.drawingArea.setup(map.mapAccessor.map);
    }

    public build() {
        return this.container;
    }

    private activate(id: string) {
        const map = this.maps.find(m => m.id === id);

        if (map === undefined) {
            throw Error(`Could not find map with id '${id}'.`);
        }

        this.maps.forEach(m => {
            m.ui.hide();
            m.tab.classList.remove('active');
        });
        map.ui.show();
        map.tab.classList.add('active');
    }
}