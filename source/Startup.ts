/// <reference path='Commands/About.ts'/>
/// <reference path='Commands/CloseMap.ts'/>
/// <reference path='Commands/DeleteLayer.ts'/>
/// <reference path='Commands/EditLayer.ts'/>
/// <reference path='Commands/EditMap.ts'/>
/// <reference path='Commands/ExportMap.ts'/>
/// <reference path='Commands/OpenMap.ts'/>
/// <reference path='Commands/NewLayer.ts'/>
/// <reference path='Commands/NewMap.ts'/>
/// <reference path='Commands/SaveMap.ts'/>
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

    const newMapCommand = new NewMap(mapFactory, mapsManager, modalLauncher, localizer);
    const openMapCommand = new OpenMap(mapsManager, localizer);
    const editMapCommand = new EditMap(mapsManager, modalLauncher, localizer);
    const saveMapCommand = new SaveMap(mapsManager, localizer);
    const exportMapCommand = new ExportMap(mapRenderer, mapsManager, localizer);
    const closeMapCommand = new CloseMap(mapsManager, localizer);

    const newLayerCommand = new NewLayer(mapsManager, modalLauncher, localizer);
    const editLayerCommand = new EditLayer(mapsManager, modalLauncher, localizer);
    const deleteLayerCommand = new DeleteLayer(mapsManager, localizer);

    const aboutCommand = new About(modalLauncher, localizer);

    builder
        .addMenu(localizer['menu_label_file'], m => {
            m.addCommand(newMapCommand);
            m.addCommand(openMapCommand);
            m.addCommand(editMapCommand);
            m.addCommand(saveMapCommand);
            m.addCommand(exportMapCommand);
            m.addCommand(closeMapCommand);
        })
        .addMenu(localizer['menu_label_layer'], m => {
            m.addCommand(newLayerCommand);
            m.addCommand(editLayerCommand);
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

    const welcome = new Welcome(openMapCommand, newMapCommand, localizer);
    const mainArea = new MainArea(mapsManager, mapUIFactory, uiFactory, welcome);

    builder.addUI(mainArea);

    builder.onStartup(() => mapsManager.setup());

    const app = builder.build();

    app.run();
});