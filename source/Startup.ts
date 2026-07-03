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
import { ContentsConfigurationBuilder } from "./Contents/ContentsConfigurationBuilder";
import { CellRenderer } from "./Maps/Cells/CellRenderer";
import { MapDrawerFactory } from "./Maps/MapDrawerFactory";
import { LayersConfigurationBuilder } from "./Maps/Layers/LayersConfigurationBuilder";
import { DefaultLayerRendererFactory } from "./Maps/Layers/DefaultLayerRendererFactory";
import { DefaultLayerDrawingFactory } from "./Maps/Layers/DefaultLayerDrawingFactory";
import { GridLayerRendererFactory } from "./Maps/Layers/GridLayerRendererFactory";
import { GridLayerDrawingFactory } from "./Maps/Layers/GridLayerDrawingFactory";

document.addEventListener('DOMContentLoaded', async () => {
    const builder = Application.createBuilder();

    const store = new Store();
    const localizerFactory = new LocalizerFactory(store);
    const localizer = await localizerFactory.create();
    const mapFactory = new MapFactory(localizer);
    const drawerFactory = new CanvasDrawerFactory();
    const contents = new ContentsConfigurationBuilder()
        .add('mountain', b => b
            .setGraphics(o => new MountainGraphics(o))
            .configurePoints(b => b
                .addPrimary()
                .addPrimary()
                .addPrimary()
            )
        )
        .add('place', b => b
            .setGraphics(o => new PlaceGraphics(o))
            .configurePoints(b => b
                .addPosition()
                .addHelper(b => b.constrainHorizontally())
            )
        )
        .add('river', b => b
            .setGraphics(o => new RiverGraphics(o))
            .configurePoints(b => b
                .addPrimary()
                .addPrimary()
                .addHelper()
                .addHelper()
            )
        )
        .add('road', b => b
            .setGraphics(o => new RoadGraphics(o))
            .configurePoints(b => b
                .addPrimary()
                .addPrimary()
            )
        )
        .add('text', b => b
            .setGraphics(o => new TextGraphics(o))
            .configurePoints(b => b
                .addPosition()
            )
        )
        .add('tree', b => b
            .setGraphics(o => new TreeGraphics(o))
            .configurePoints(b => b
                .addPosition()
                .addHelper(b => b.constrainVertically().applyToOthers([3]))
                .addHelper(b => b.constrainVertically())
                .addHelper(b => b.constrainHorizontally())
            )
        )
        .build();

    const uiFactory = new UIFactory();
    const mapDrawerFactory = new MapDrawerFactory(drawerFactory);
    const cellRenderer = new CellRenderer(drawerFactory, contents);

    const defaultLayerRenderer = new DefaultLayerRendererFactory(cellRenderer);
    const defaultLayerDrawing = new DefaultLayerDrawingFactory(mapDrawerFactory, cellRenderer);
    const layersBuilder = new LayersConfigurationBuilder(defaultLayerRenderer, defaultLayerDrawing);
    const gridRenderer = new GridLayerRendererFactory(drawerFactory);
    const gridDrawing = new GridLayerDrawingFactory(drawerFactory);
    const layers = layersBuilder
        .add('terrain')
        .add('text')
        .add('grid', b => b
            .setRenderer(gridRenderer)
            .setDrawing(gridDrawing)
        )
        .build();

    const modalLauncher = new ModalLauncher(uiFactory, localizer);
    const mapManagerFactory = new MapManagerFactory(store);
    const mapsManager = new MapsManager(store, mapManagerFactory, modalLauncher, localizer);
    const toolsManagerFactory = new ToolsManagerFactory(modalLauncher, drawerFactory, localizer, contents);
    const mapUIFactory = new MapUIFactory(drawerFactory, toolsManagerFactory, localizer, store, uiFactory, layers);
    const mapRenderer = new MapRenderer(mapDrawerFactory, layers);

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
        .addMenu(localizer['menu_label_file'], m => m
            .addCommand(newMapCommand)
            .addCommand(openMapCommand)
            .addCommand(editMapCommand)
            .addCommand(saveMapCommand)
            .addCommand(exportMapCommand)
            .addCommand(closeMapCommand)
        )
        .addMenu(localizer['menu_label_layer'], m => m
            .addCommand(newLayerCommand)
            .addCommand(editLayerCommand)
            .addCommand(deleteLayerCommand)
        )
        .addMenu(localizer['menu_label_help'], m => m
            .addCommand(aboutCommand)
        )
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