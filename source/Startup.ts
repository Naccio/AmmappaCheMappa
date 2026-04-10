import { Application } from "./Application";
import { About } from "./Commands/About";
import { CloseMap } from "./Commands/CloseMap";
import { DeleteLayer } from "./Commands/DeleteLayer";
import { EditLayer } from "./Commands/EditLayer";
import { EditMap } from "./Commands/EditMap";
import { ExportMap } from "./Commands/ExportMap";
import { NewLayer } from "./Commands/NewLayer";
import { NewMap } from "./Commands/NewMap";
import { OpenMap } from "./Commands/OpenMap";
import { SaveMap } from "./Commands/SaveMap";
import { MountainFactory } from "./Contents/Mountains/MountainFactory";
import { MountainsRenderer } from "./Contents/Mountains/MountainsRenderer";
import { PlaceRenderer } from "./Contents/Places/PlaceRenderer";
import { RiverRenderer } from "./Contents/Rivers/RiverRenderer";
import { RoadRenderer } from "./Contents/Roads/RoadRenderer";
import { TextRenderer } from "./Contents/Text/TextRenderer";
import { TreeRenderer } from "./Contents/Trees/TreeRenderer";
import { LocalizationHelper } from "./Localization/LocalizationHelper";
import { LocalizerFactory } from "./Localization/LocalizerFactory";
import { MapFactory } from "./MapFactory";
import { MapManagerFactory } from "./MapManagerFactory";
import { MapsManager } from "./MapsManager";
import { MapRenderer } from "./Rendering/MapRenderer";
import { Store } from "./Store";
import { CanvasProvider } from "./UI/CanvasProvider";
import { MainArea } from "./UI/MainArea";
import { MapUIFactory } from "./UI/MapUIFactory";
import { LanguageMenuEntry } from "./UI/Menu/LanguageMenuEntry";
import { ModalLauncher } from "./UI/ModalLauncher";
import { ToolsManagerFactory } from "./UI/Tools/ToolsManagerFactory";
import { UIFactory } from "./UI/UIFactory";
import { Welcome } from "./UI/Welcome";

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