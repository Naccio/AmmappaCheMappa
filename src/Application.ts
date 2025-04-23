/// <reference path='Commands/Export.ts'/>
/// <reference path='Commands/Open.ts'/>
/// <reference path='Commands/New.ts'/>
/// <reference path='Commands/Save.ts'/>
/// <reference path='Contents/Mountains/MountainsRenderer.ts'/>
/// <reference path='Contents/Mountains/MountainsTool.ts'/>
/// <reference path='Contents/Places/PlaceRenderer.ts'/>
/// <reference path='Contents/Places/PlacesTool.ts'/>
/// <reference path='Contents/Rivers/RiverRenderer.ts'/>
/// <reference path='Contents/Rivers/RiversTool.ts'/>
/// <reference path='Contents/Roads/RoadRenderer.ts'/>
/// <reference path='Contents/Roads/RoadsTool.ts'/>
/// <reference path='Contents/Text/TextRenderer.ts'/>
/// <reference path='Contents/Text/TextTool.ts'/>
/// <reference path='Contents/Trees/TreeRenderer.ts'/>
/// <reference path='Contents/Trees/TreesTool.ts'/>
/// <reference path='Localization/Localizer.ts'/>
/// <reference path='UI/ApplicationUI.ts'/>
/// <reference path='UI/UILayer.ts'/>
/// <reference path='UI/Menu/CommandMenuEntry.ts'/>
/// <reference path='UI/Menu/LanguageMenu.ts'/>
/// <reference path='UI/Menu/Menu.ts'/>
/// <reference path='UI/Menu/SubmenuMenuEntry.ts'/>
/// <reference path='UI/TextLayer.ts'/>
/// <reference path='UI/Tools/Eraser.ts'/>
/// <reference path='UI/Tools/ToolActivator.ts'/>

class Application {
    private constructor(private ui: ApplicationUI, private mapFactory: MapFactory, private mapLoader: MapLoader) {
    }

    public static async build() {
        const locale = LocalizationHelper.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await LocalizationHelper.loadResource(locale);
        const localizer = new Localizer(resource);
        const mapFactory = new MapFactory();
        const mapAccessor = new MapAccessor();
        const canvasProvider = new CanvasProvider();
        const grid = new GridLayer(mapAccessor, canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor, canvasProvider);
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
        const cellRenderer = new CellRenderer(drawerFactory, renderingStrategies);
        const eraser = new Eraser(mapAccessor, cellRenderer);
        const modalLauncher = new ModalLauncher(localizer);
        const terrainLayer = new TerrainLayer(mapAccessor, canvasProvider, cellRenderer);
        const textLayer = new TextLayer(mapAccessor, canvasProvider, cellRenderer);
        const uiLayer = new UILayer(mapAccessor, canvasProvider);
        const layers = [
            terrainLayer,
            textLayer,
            grid,
            uiLayer
        ];
        const mapRenderer = new MapRenderer(mapAccessor, layers);
        const mountainsTool = new MountainsTool(mapAccessor, mountainFactory, cellRenderer);
        const placesTool = new PlacesTool(mapAccessor, cellRenderer);
        const riversTool = new RiversTool(mapAccessor, cellRenderer);
        const roadsTool = new RoadsTool(uiLayer, mapAccessor, cellRenderer);
        const textTool = new TextTool(mapAccessor, cellRenderer, modalLauncher, localizer);
        const treesTool = new TreesTool(mapAccessor, cellRenderer);
        const toolbar = new Toolbar([
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            textTool,
            treesTool,
            eraser
        ], localizer);
        const toolActivator = new ToolActivator(toolbar);
        const drawingArea = new DrawingArea(layers, toolActivator);
        const mapLoader = new MapLoader(mapAccessor, drawingArea);
        const newCommand = new New(mapFactory, mapLoader, modalLauncher, localizer);
        const newCommandMenuEntry = new CommandMenuEntry(newCommand);
        const openCommand = new Open(mapLoader, localizer);
        const openCommandMenuEntry = new CommandMenuEntry(openCommand);
        const saveCommand = new Save(mapAccessor, localizer);
        const saveCommandMenuEntry = new CommandMenuEntry(saveCommand);
        const exportCommand = new Export(mapRenderer, localizer);
        const exportCommandMenuEntry = new CommandMenuEntry(exportCommand);
        const fileMenu = new SubmenuMenuEntry('File', [
            newCommandMenuEntry,
            openCommandMenuEntry,
            saveCommandMenuEntry,
            exportCommandMenuEntry
        ]);
        const languageMenu = new LanguageMenu(localizer);
        const mainMenu = new SubmenuMenuEntry('Menu', [
            fileMenu,
            languageMenu
        ], { alwaysVisible: true });
        const menu = new Menu(mainMenu);
        const ui = new ApplicationUI([
            menu,
            toolbar,
            drawingArea
        ]);
    
        return new Application(ui, mapFactory, mapLoader);
    }

    public run() {
        const data = localStorage.getItem('map');
        let map;

        if (data === null) {
            map = this.mapFactory.create(20, 20);
        } else {
            map = Utilities.parseMap(data);
        }

        this.ui.build();
        this.mapLoader.load(map);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = await Application.build();
    
    app.run();
});