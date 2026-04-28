import { Observable } from "../../Engine/Events/Observable";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapManager } from "../../Maps/MapManager";
import { CellIndex } from "../../Model/CellIndex";
import { MapObject } from "../../Model/MapObject";
import { Point } from "../../Model/Point";
import { GridHelper } from "../../Utilities/GridHelper";
import { VectorMath } from "../../Utilities/VectorMath";
import { RadioSelect } from "../RadioSelect";
import { ModalLauncher } from "../ModalLauncher";
import { Tool } from "./Tool";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { ContentConfiguration } from "../../Contents/ContentConfiguration";

class CellContext {
    public constructor(
        public readonly cell: CellIndex,
        public readonly objects: MapObject[]
    ) { }
}

export class SelectTool implements Tool {
    private readonly scale = 3;
    private readonly ui: Drawer;

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    private selected = new Observable<MapObject | undefined>(undefined);
    private drawer?: Drawer;

    public constructor(
        private readonly mapManager: MapManager,
        private readonly drawerFactory: DrawerFactory,
        private readonly modal: ModalLauncher,
        private readonly contents: ContentConfiguration[]
    ) {
        const scale = this.scale * mapManager.mapAccessor.map.data.pixelsPerCell;

        this.ui = drawerFactory.create('select-modal-ui', scale, scale, scale);
    }

    public start(point: Point) {
        const cell = this.mapManager.mapAccessor.getIndex(point);

        if (cell === undefined) {
            return;
        }

        this.drawer = this.createDrawer('select-modal');

        const cellName = GridHelper.cellIndexToName(cell),
            context = new CellContext(cell, this.mapManager.mapAccessor.map.data.objects.filter(o => o.cell === cellName)),
            container = document.createElement('div'),
            list = this.buildList(context);

        container.style.display = 'flex';
        container.style.alignItems = 'start';

        container.append(this.drawer.html, list.html);

        this.modal.launch(cellName, [container]);
    }

    public move() {
    }

    public stop() {
    }

    private buildList(context: CellContext) {
        this.selected = new Observable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selected, context.objects, (item, label) => {
            label.innerText = item.type;
        });

        this.selected.subscribe(_ => this.draw(context));

        return list;
    }

    private createDrawer(id: string) {
        const size = this.mapManager.mapAccessor.map.data.pixelsPerCell * this.scale;

        return this.drawerFactory.create(id, size, size);
    }

    private draw(context: CellContext) {
        const selected = this.selected.value,
            content = this.contents.find(c => c.type === selected?.type),
            drawer = this.drawer!;

        drawer.clear();
        this.ui.clear();
        this.mapManager.layers.layers.forEach(l => {
            const cellDrawer = this.mapManager.cells.render(context.cell, l.id, this.scale);

            drawer.image(cellDrawer, VectorMath.zero);
        });

        if (selected !== undefined && content !== undefined) {
            const points = content.points(selected);

            if (points.position) {
                this.ui.circle(points.position, .03, { fillStyle: 'red' });
            }

            if (points.mainPoints) {
                points.mainPoints.forEach(p => this.ui.circle(p, .03, { fillStyle: 'blue' }));
            }

            if (points.helperPoints) {
                points.helperPoints.forEach(p => this.ui.circle(p, .03, { fillStyle: 'green' }));
            }
        }

        drawer.image(this.ui, VectorMath.zero);
    }
}