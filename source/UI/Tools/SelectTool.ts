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
import { ContentPoints } from "../../Contents/ContentPoints";
import { PointerButtons, PointerStatus, PointerTarget } from "../PointerTarget";

class CellContext {
    public constructor(
        public readonly cell: CellIndex,
        public readonly objects: MapObject[]
    ) { }
}

export class SelectTool implements Tool {
    private readonly radius = .03;
    private readonly scale = 3;
    private readonly ui: Drawer;
    private readonly pointer: PointerTarget;

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    private selectedObject = new Observable<MapObject | undefined>(undefined);
    private drawer?: Drawer;
    private points: ContentPoints = {};
    private activePoint?: Point;

    public constructor(
        private readonly mapManager: MapManager,
        private readonly drawerFactory: DrawerFactory,
        private readonly modal: ModalLauncher,
        private readonly contents: ContentConfiguration[]
    ) {
        const scale = this.scale * mapManager.mapAccessor.map.data.pixelsPerCell;

        this.ui = drawerFactory.create('select-modal-ui', scale, scale, scale);
        this.pointer = new PointerTarget();
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

        this.pointer.html.innerHTML = '';
        this.pointer.html.append(this.drawer.html);
        container.append(this.pointer.html, list.html);

        this.pointer.status.subscribe(s => this.mouseMoveHandler(s, context));

        this.modal.launch(cellName, [container]);
    }

    public move() {
    }

    public stop() {
    }

    private buildList(context: CellContext) {
        this.selectedObject = new Observable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, context.objects, (item, label) => {
            label.innerText = item.type;
        });

        this.selectedObject.subscribe(_ => {
            this.getPoints();
            this.draw(context);
        });

        return list;
    }

    private createDrawer(id: string) {
        const size = this.mapManager.mapAccessor.map.data.pixelsPerCell * this.scale;

        return this.drawerFactory.create(id, size, size);
    }

    private draw(context: CellContext) {
        const points = this.points,
            drawer = this.drawer!;

        drawer.clear();
        this.ui.clear();
        this.mapManager.layers.layers.forEach(l => {
            const cellDrawer = this.mapManager.cells.render(context.cell, l.id, this.scale);

            drawer.image(cellDrawer, VectorMath.zero);
        });

        if (points.position) {
            this.ui.circle(points.position, this.radius, { fillStyle: 'red' });
        }

        if (points.mainPoints) {
            points.mainPoints.forEach(p => this.ui.circle(p, this.radius, { fillStyle: 'blue' }));
        }

        if (points.helperPoints) {
            points.helperPoints.forEach(p => this.ui.circle(p, this.radius, { fillStyle: 'green' }));
        }

        drawer.image(this.ui, VectorMath.zero);
    }

    private getPoints() {
        const selected = this.selectedObject.value,
            content = this.contents.find(c => c.type === selected?.type);

        this.points = selected !== undefined && content !== undefined
            ? content.points(selected)
            : {};
    }

    private mouseMoveHandler(s: PointerStatus | undefined, context: CellContext) {
        if (s === undefined || s.button !== PointerButtons.primary) {
            this.activePoint = undefined;
            return;
        }

        const scale = this.scale * this.mapManager.mapAccessor.map.data.pixelsPerCell,
            pointer = VectorMath.divide(s.position, scale);

        if (this.activePoint) {
            this.activePoint.x = pointer.x;
            this.activePoint.y = pointer.y;
            this.draw(context);
        } else {
            let points: Point[] = [];

            if (this.points.helperPoints) {
                points = [...this.points.helperPoints];
            }

            if (this.points.mainPoints) {
                points = [...points, ...this.points.mainPoints];
            }

            if (this.points.position) {
                points.push(this.points.position);
            }

            this.activePoint = points.find(p =>
                p.x - this.radius < pointer.x &&
                p.x + this.radius > pointer.x &&
                p.y - this.radius < pointer.y &&
                p.y + this.radius > pointer.y
            );
        }
    }
}