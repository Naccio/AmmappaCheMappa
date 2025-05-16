/// <reference path='Commands/About.ts'/>
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
/// <reference path='Layers/GridLayer.ts'/>
/// <reference path='Layers/LayersPanel.ts'/>
/// <reference path='Layers/TextLayerFactory.ts'/>
/// <reference path='Layers/TerrainLayerFactory.ts'/>
/// <reference path='Localization/Localizer.ts'/>
/// <reference path='UI/ApplicationUI.ts'/>
/// <reference path='UI/CanvasProvider.ts'/>
/// <reference path='UI/DrawingArea.ts'/>
/// <reference path='UI/Menu/CommandMenuEntry.ts'/>
/// <reference path='UI/Menu/LanguageMenu.ts'/>
/// <reference path='UI/Menu/Menu.ts'/>
/// <reference path='UI/Menu/SubmenuMenuEntry.ts'/>
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
        const mapFactory = new MapFactory(localizer);
        const mapAccessor = new MapAccessor();
        const canvasProvider = new CanvasProvider();
        const grid = new GridLayerFactory(mapAccessor, canvasProvider);
        const drawerFactory = new CellDrawerFactory(mapAccessor);
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
        const modalLauncher = new ModalLauncher(localizer);
        const terrainLayer = new TerrainLayerFactory(mapAccessor, canvasProvider, cellRenderer);
        const textLayer = new TextLayerFactory(mapAccessor, canvasProvider, cellRenderer);
        const uiLayer = new DrawingUI(mapAccessor, canvasProvider);
        const layers = [
            terrainLayer,
            textLayer,
            grid
        ];
        const layerFactory = new LayerFactory(layers);
        const layersManager = new LayersManager(layerFactory, mapAccessor);
        const eraser = new Eraser(mapAccessor, layersManager);
        const mapRenderer = new MapRenderer(mapAccessor, layersManager);
        const mountainsTool = new MountainsTool(mapAccessor, mountainFactory, layersManager);
        const placesTool = new PlacesTool(mapAccessor, layersManager);
        const riversTool = new RiversTool(mapAccessor, layersManager);
        const roadsTool = new RoadsTool(uiLayer, mapAccessor, layersManager);
        const textTool = new TextTool(mapAccessor, layersManager, modalLauncher, localizer);
        const treesTool = new TreesTool(mapAccessor, layersManager);
        const toolbar = new Toolbar([
            mountainsTool,
            placesTool,
            riversTool,
            roadsTool,
            textTool,
            treesTool,
            eraser
        ], localizer, layersManager);
        const toolActivator = new ToolActivator(toolbar);
        const drawingArea = new DrawingArea(layersManager, uiLayer, toolActivator);
        const layersPanel = new LayersPanel(layersManager, localizer);
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
            toolbar,
            drawingArea,
            layersPanel
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