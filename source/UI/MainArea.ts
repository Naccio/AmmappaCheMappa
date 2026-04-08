/// <reference path="../MapManager.ts" />
/// <reference path="MapUI.ts" />
/// <reference path="MapUIFactory.ts" />
/// <reference path="UIElement.ts" />
/// <reference path="Welcome.ts" />

class MainArea implements UIElement {
    private readonly container: HTMLElement;
    private readonly tabs: HTMLElement;

    private readonly maps: { id: string, map: MapManager, ui: MapUI, tab: HTMLElement }[] = [];

    constructor(
        private mapsManager: MapsManager,
        private mapUIFactory: MapUIFactory,
        private uiFactory: UIFactory,
        private welcome: Welcome
    ) {
        const container = document.createElement('div'),
            tabs = document.createElement('ul');

        container.id = 'main-area';
        tabs.className = 'tabs';

        container.append(tabs);

        this.container = container;
        this.tabs = tabs;

        this.activate(undefined);

        mapsManager.onActivate(map => this.activate(map));
        mapsManager.onAdd(map => this.add(map));
        mapsManager.onUpdate(map => this.update(map));
        mapsManager.onRemove(id => this.remove(id));
    }

    public get html() {
        return this.container;
    }

    private activate(manager?: MapManager) {
        this.maps.forEach(m => {
            m.ui.hide();
            m.tab.classList.remove('active');
        });

        if (manager) {
            const map = this.getMap(manager.id);
            map.ui.show();
            map.tab.classList.add('active');
        } else {
            this.container.append(this.welcome.html);
        }
    }

    private getMap(id: string) {
        const map = this.maps.find(m => m.id === id);

        if (map === undefined) {
            throw Error(`Could not find map with id '${id}'.`);
        }

        return map;
    }

    private getTitle(map: MapData) {
        return map.title ?? map.id;
    }

    private add(map: MapManager) {
        const id = map.id,
            ui = this.mapUIFactory.create(map),
            tab = document.createElement('li'),
            anchor = document.createElement('a'),
            close = this.uiFactory.createCloseButton(e => {
                e.stopPropagation();
                this.mapsManager.remove(id);
            });

        //HACK: Magic string
        document.getElementById('welcome')?.remove();

        tab.className = 'tab';

        anchor.href = '#' + ui.id;
        anchor.innerText = this.getTitle(map.mapAccessor.map.data);
        anchor.onclick = () => this.mapsManager.activate(id);

        tab.append(anchor, close);

        this.maps.push({
            id,
            map,
            ui,
            tab
        });
        this.container.append(ui.html);
        this.tabs.append(tab);

        ui.setup();
    }

    private remove(id: string) {
        const map = this.getMap(id);

        map.tab.remove();
        map.ui.remove();

        this.maps.splice(this.maps.indexOf(map), 1);
    }

    private update(map: MapData) {
        const mapStuff = this.getMap(map.id);

        mapStuff.tab.getElementsByTagName('a')[0].innerText = this.getTitle(map);
    }
}