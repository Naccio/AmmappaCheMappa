import { Localizer } from "../Engine/Localization/Localizer";
import { MapManager } from "../Engine/MapManager";
import { MapsManager } from "../Engine/MapsManager";
import { ActiveMapCommand } from "./ActiveMapCommand";

export class DeleteLayer extends ActiveMapCommand {

    private readonly registeredTo = new Set<string>();

    constructor(maps: MapsManager, localizer: Localizer) {
        super(maps, localizer['command_label_delete_layer']);

        maps.onActivate(map => this.activateMapHandler(map));
        maps.onRemove(id => this.removeMapHandler(id));
    }

    public execute() {
        const layers = this.activeMap?.layers;

        if (layers?.activeLayer === undefined || layers.layers.length === 1) {
            return;
        }

        layers.delete(layers.activeLayer.id);
    }

    private activeLayerHandler() {
        if (this.activeMap?.layers.layers.length === 1) {
            this.disabled = true;
        }
    }

    private removeMapHandler(id: string) {
        this.registeredTo.delete(id);
    }

    private activateMapHandler(map?: MapManager) {
        if (map === undefined) {
            return;
        }

        this.activeLayerHandler();

        if (this.registeredTo.has(map.id)) {
            return;
        }

        map.layers.onSelect(_ => this.activeLayerHandler());
        this.registeredTo.add(map.id);
    }
}