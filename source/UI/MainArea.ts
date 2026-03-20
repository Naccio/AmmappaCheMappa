/// <reference path="../MapManager.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="MapUIFactory.ts" />
/// <reference path="UIElement.ts" />



class MainArea implements UIElement {
    private readonly container: HTMLElement;
    private readonly tabs: HTMLElement;

    private readonly maps: { id: string, map: MapManager, ui: MapUI, tab: HTMLElement }[] = [];

    private _mapManager?: MapManager;

    constructor(private mapUIFactory: MapUIFactory, private uiFactory: UIFactory) {
        const container = document.createElement('div'),
            tabs = document.createElement('ul');

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
        const id = map.id,
            ui = this.mapUIFactory.create(map),
            tab = document.createElement('li'),
            anchor = document.createElement('a'),
            close = this.uiFactory.createCloseButton(e => {
                e.stopPropagation();
                this.removeMap(id);
            });

        tab.className = 'tab';

        anchor.href = '#' + ui.id;
        anchor.innerText = id;
        anchor.onclick = () => this.activate(id);

        tab.append(anchor, close);

        this._mapManager = map;

        this.maps.push({
            id,
            map,
            ui,
            tab
        });
        this.container.append(ui.build());
        this.tabs.append(tab);
        this.activate(id);

        ui.drawingArea.setup(map.mapAccessor.map);
    }

    public build() {
        return this.container;
    }

    public removeMap(id: string) {
        const map = this.getMap(id);

        map.tab.remove();
        map.ui.remove();

        this.maps.splice(this.maps.indexOf(map), 1);

        console.log(this.maps);

        if (this.maps.length > 0) {
            this.activate(this.maps[0].id);
        }
    }

    private activate(id: string) {
        const map = this.getMap(id);

        this.maps.forEach(m => {
            m.ui.hide();
            m.tab.classList.remove('active');
        });
        map.ui.show();
        map.tab.classList.add('active');
    }

    private getMap(id: string) {
        const map = this.maps.find(m => m.id === id);

        if (map === undefined) {
            throw Error(`Could not find map with id '${id}'.`);
        }

        return map;
    }
}