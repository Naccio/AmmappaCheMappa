/// <reference path='Commands/About.ts'/>
/// <reference path='Commands/Close.ts'/>
/// <reference path='Commands/DeleteLayer.ts'/>
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
/// <reference path='Localization/LocalizationHelper.ts'/>
/// <reference path='Localization/LocalizerFactory.ts'/>
/// <reference path='Store.ts'/>
/// <reference path='UI/ApplicationUI.ts'/>
/// <reference path='UI/CanvasProvider.ts'/>
/// <reference path='UI/MainArea.ts'/>
/// <reference path='UI/MapUIFactory.ts'/>
/// <reference path='UI/Menu/LanguageMenuEntry.ts'/>

document.addEventListener('DOMContentLoaded', async () => {
    const builder = Application.createBuilder();

    const store = new Store();
    const localizerFactory = new LocalizerFactory(store);
    const localizer = await localizerFactory.create();
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
    const mapsManager = new MapsManager(store, mapManagerFactory, modalLauncher, localizer);
    const toolsManagerFactory = new ToolsManagerFactory(modalLauncher, mountainFactory, localizer);
    const mapUIFactory = new MapUIFactory(canvasProvider, toolsManagerFactory, localizer, store, uiFactory);
    const mapRenderer = new MapRenderer();

    const newCommand = new New(mapFactory, mapsManager, modalLauncher, localizer);
    const openCommand = new Open(mapsManager, localizer);
    const saveCommand = new Save(mapsManager, localizer);
    const exportCommand = new Export(mapRenderer, mapsManager, localizer);
    const closeCommand = new Close(mapsManager, localizer);

    const deleteLayerCommand = new DeleteLayer(mapsManager, localizer);

    const aboutCommand = new About(modalLauncher, localizer);

    builder
        .addMenu(localizer['menu_label_file'], m => {
            m.addCommand(newCommand);
            m.addCommand(openCommand);
            m.addCommand(saveCommand);
            m.addCommand(exportCommand);
            m.addCommand(closeCommand);
        })
        .addMenu(localizer['menu_label_layer'], m => {
            m.addCommand(deleteLayerCommand);
        })
        .addMenu(localizer['menu_label_help'], m => {
            m.addCommand(aboutCommand);
        })
        .addMenu(localizer['menu_label_language'], m => {
            for (let language of LocalizationHelper.languages) {
                m.addCustomEntry(new LanguageMenuEntry(store, language));
            }
            m.alignRight();
        });

    const welcome = new Welcome(openCommand, newCommand, localizer);
    const mainArea = new MainArea(mapsManager, mapUIFactory, uiFactory, welcome);

    builder.addUI(mainArea);

    builder.onStartup(() => mapsManager.setup());

    const app = builder.build();

    app.run();
});