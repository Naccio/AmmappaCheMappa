/// <reference path='Commands/About.ts'/>
/// <reference path='Commands/Export.ts'/>
/// <reference path='Commands/Open.ts'/>
/// <reference path='Commands/New.ts'/>
/// <reference path='Commands/Save.ts'/>
/// <reference path='Contents/Mountains/MountainsRenderer.ts'/>
/// <reference path='Contents/Places/PlaceRenderer.ts'/>
/// <reference path='Contents/Rivers/RiverRenderer.ts'/>
/// <reference path='Contents/Roads/RoadRenderer.ts'/>
/// <reference path='Contents/Text/TextRenderer.ts'/>
/// <reference path='Contents/Trees/TreeRenderer.ts'/>
/// <reference path='Localization/Localizer.ts'/>
/// <reference path='Store.ts'/>
/// <reference path='UI/ApplicationUI.ts'/>
/// <reference path='UI/CanvasProvider.ts'/>
/// <reference path='UI/MainArea.ts'/>
/// <reference path='UI/MapUIFactory.ts'/>
/// <reference path='UI/Menu/CommandMenuEntry.ts'/>
/// <reference path='UI/Menu/LanguageMenu.ts'/>
/// <reference path='UI/Menu/Menu.ts'/>
/// <reference path='UI/Menu/SubmenuMenuEntry.ts'/>

class Application {
    private constructor(private ui: ApplicationUI, private mapFactory: MapFactory, private mapsManager: MapsManager, private store: Store) {
    }

    public static async build() {
        const locale = LocalizationHelper.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await LocalizationHelper.loadResource(locale);
        const store = new Store();
        const localizer = new Localizer(resource);
        const mapFactory = new MapFactory(localizer);
        const canvasProvider = new CanvasProvider();
        const mountainFactory = new MountainFactory();
        const mountainsRenderer = new MountainsRenderer();
        const placeRenderer = new PlaceRenderer();
        const riverRenderer = new RiverRenderer();
        const roadRenderer = new RoadRenderer();
        const textRenderer = new TextRenderer();
        const treeRenderer = new TreeRenderer();
        const renderingStrategies = [
            mountainsRenderer,
            placeRenderer,
            riverRenderer,
            roadRenderer,
            textRenderer,
            treeRenderer
        ];
        const uiFactory = new UIFactory();
        const modalLauncher = new ModalLauncher(uiFactory, localizer);
        const mapManagerFactory = new MapManagerFactory(store, canvasProvider, renderingStrategies);
        const mapsManager = new MapsManager(mapManagerFactory);
        const toolsManagerFactory = new ToolsManagerFactory(modalLauncher, mountainFactory, localizer);
        const mapUIFactory = new MapUIFactory(canvasProvider, toolsManagerFactory, localizer, store);
        const mainArea = new MainArea(mapsManager, mapUIFactory, uiFactory);
        const mapRenderer = new MapRenderer(mapsManager);
        const newCommand = new New(mapFactory, mapsManager, modalLauncher, localizer);
        const newCommandMenuEntry = new CommandMenuEntry(newCommand);
        const openCommand = new Open(mapsManager, localizer);
        const openCommandMenuEntry = new CommandMenuEntry(openCommand);
        const saveCommand = new Save(mapsManager, localizer);
        const saveCommandMenuEntry = new CommandMenuEntry(saveCommand);
        const exportCommand = new Export(mapRenderer, mapsManager, localizer);
        const exportCommandMenuEntry = new CommandMenuEntry(exportCommand);
        const fileMenu = new SubmenuMenuEntry('File', [
            newCommandMenuEntry,
            openCommandMenuEntry,
            saveCommandMenuEntry,
            exportCommandMenuEntry
        ]);
        const aboutCommand = new About(modalLauncher, localizer);
        const aboutCommandMenuEntry = new CommandMenuEntry(aboutCommand);
        const helpMenu = new SubmenuMenuEntry(localizer['menu_label_help'], [
            aboutCommandMenuEntry
        ]);
        const languageMenu = new LanguageMenu(localizer);
        const mainMenu = new SubmenuMenuEntry('Menu', [
            fileMenu,
            helpMenu,
            languageMenu
        ], { alwaysVisible: true });
        const menu = new Menu(mainMenu);
        const ui = new ApplicationUI([
            menu,
            mainArea
        ]);

        return new Application(ui, mapFactory, mapsManager, store);
    }

    public run() {
        const map = this.store.getMap()
            ?? this.mapFactory.create(20, 20);

        this.ui.build();
        this.mapsManager.add(map);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = await Application.build();

    app.run();
});