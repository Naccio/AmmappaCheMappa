import { Application } from "./Engine/Application";
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
import { MountainGraphics } from "./Contents/Mountains/MountainGraphics";
import { PlaceGraphics } from "./Contents/Places/PlaceGraphics";
import { RiverGraphics } from "./Contents/Rivers/RiverGraphics";
import { RoadGraphics } from "./Contents/Roads/RoadGraphics";
import { TextGraphics } from "./Contents/Text/TextGraphics";
import { TreeGraphics } from "./Contents/Trees/TreeGraphics";
import { LocalizationHelper } from "./Engine/Localization/LocalizationHelper";
import { LocalizerFactory } from "./Engine/Localization/LocalizerFactory";
import { MapFactory } from "./Maps/MapFactory";
import { MapManagerFactory } from "./Maps/MapManagerFactory";
import { MapsManager } from "./Maps/MapsManager";
import { MapRenderer } from "./Maps/MapRenderer";
import { Store } from "./Engine/Store";
import { CanvasDrawerFactory } from "./Engine/Rendering/CanvasDrawerFactory";
import { MainArea } from "./UI/MainArea";
import { MapUIFactory } from "./UI/MapUIFactory";
import { LanguageMenuEntry } from "./UI/Menu/LanguageMenuEntry";
import { ModalLauncher } from "./UI/ModalLauncher";
import { ToolsManagerFactory } from "./UI/Tools/ToolsManagerFactory";
import { UIFactory } from "./UI/UIFactory";
import { Welcome } from "./UI/Welcome";
import { GenericObjectGraphicsFactory } from "./Engine/Rendering/GenericObjectGraphicsFactory";
import { Mountain } from "./Contents/Mountains/Mountain";
import { Place } from "./Contents/Places/Place";
import { River } from "./Contents/Rivers/River";
import { Road } from "./Contents/Roads/Road";
import { GridText } from "./Contents/Text/GridText";
import { Tree } from "./Contents/Trees/Tree";

document.addEventListener('DOMContentLoaded', async () => {
    const builder = Application.createBuilder();

    const store = new Store();
    const localizerFactory = new LocalizerFactory(store);
    const localizer = await localizerFactory.create();
    const mapFactory = new MapFactory(localizer);
    const drawerFactory = new CanvasDrawerFactory();
    const mountainFactory = new MountainFactory();
    const mountainsRenderer = new GenericObjectGraphicsFactory<Mountain>('mountain', m => new MountainGraphics(m));
    const placeRenderer = new GenericObjectGraphicsFactory<Place>('place', p => new PlaceGraphics(p));
    const riverRenderer = new GenericObjectGraphicsFactory<River>('river', r => new RiverGraphics(r));
    const roadRenderer = new GenericObjectGraphicsFactory<Road>('road', r => new RoadGraphics(r));
    const textRenderer = new GenericObjectGraphicsFactory<GridText>('text', t => new TextGraphics(t));
    const treeRenderer = new GenericObjectGraphicsFactory<Tree>('tree', t => new TreeGraphics(t));
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
    const mapManagerFactory = new MapManagerFactory(store, drawerFactory, renderingStrategies);
    const mapsManager = new MapsManager(store, mapManagerFactory, modalLauncher, localizer);
    const toolsManagerFactory = new ToolsManagerFactory(modalLauncher, mountainFactory, localizer);
    const mapUIFactory = new MapUIFactory(drawerFactory, toolsManagerFactory, localizer, store, uiFactory);
    const mapRenderer = new MapRenderer(drawerFactory);

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