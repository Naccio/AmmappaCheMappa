import { ContentPoint } from "../Contents/ContentPoint";
import { ContentPointType } from "../Contents/ContentPointType";
import { InternalObservable } from "../../Engine/Events/InternalObservable";
import { Drawer } from "../../Engine/Rendering/Drawer";
import { DrawerFactory } from "../../Engine/Rendering/DrawerFactory";
import { MapObject } from "../../Model/MapObject";
import { PointerButtons, PointerStatus, PointerTarget } from "../../UI/PointerTarget";
import { RadioSelect } from "../../UI/RadioSelect";
import { UIElement } from "../../UI/UIElement";
import { VectorMath } from "../../Utilities/VectorMath";
import { CellGraphics } from "./CellGraphics";
import { CellContext } from "./CellContext";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";

export class CellEditor implements UIElement {
    private readonly radius = .03;
    private readonly scale = 3;

    private readonly drawer: Drawer;
    private readonly graphics: CellGraphics;
    private readonly pointer: PointerTarget;
    private readonly container: HTMLDivElement;

    private readonly selectedObject: InternalObservable<MapObject | undefined>;

    public readonly configuration = {
        id: 'select',
        labelResourceId: 'tool_label_select',
        layerTypes: []
    };

    private points: ContentPoint[] = [];
    private activePoint?: number;

    public constructor(
        private readonly cell: CellContext,
        drawerFactory: DrawerFactory,
        private readonly contents: ContentsConfiguration
    ) {
        const scale = this.scale * cell.pixels,
            objects = cell.objects.value,
            container = document.createElement('div'),
            drawer = drawerFactory.create(scale, scale, scale);

        this.selectedObject = new InternalObservable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, objects, (item, label) => {
            label.innerText = item.type;
        });

        this.pointer = new PointerTarget();

        this.drawer = drawer;
        this.graphics = new CellGraphics(objects, contents);

        container.style.display = 'flex';
        container.style.alignItems = 'start';

        this.pointer.html.append(this.drawer.html);
        container.append(this.pointer.html, list.html);

        this.container = container;

        this.pointer.status.subscribe(s => this.mouseMoveHandler(s));

        this.selectedObject.subscribe(_ => {
            this.getPoints();
            this.draw();
        });
    }

    public get html() {
        return this.container;
    }

    private draw() {
        const points = this.points,
            drawer = this.drawer;

        drawer.clear();
        this.graphics.render(this.drawer);

        points.forEach(p => {
            switch (p.type) {
                case ContentPointType.position:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'red' });
                    break;

                case ContentPointType.primary:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'blue' });
                    break;

                case ContentPointType.helper:
                    this.drawer.circle(p.point, this.radius, { fillStyle: 'green' });
                    break;

                default:
                    throw new Error(`Invalid point type: '${p.type}'.`);
            }
        });
    }

    private getPoints() {
        const selected = this.selectedObject.value;

        if (selected === undefined) {
            this.points = [];
        } else {
            const content = this.contents.get(selected.type);

            this.points = content.points.get(selected);
        }
    }

    private mouseMoveHandler(s: PointerStatus | undefined) {
        const object = this.selectedObject.value;

        if (object === undefined || s === undefined || s.button !== PointerButtons.primary) {
            if (this.activePoint !== undefined && object !== undefined) {
                this.cell.update(object.id, this.points.map(p => p.point));
            }
            this.activePoint = undefined;
            return;
        }

        const scale = this.scale * this.cell.pixels,
            pointer = VectorMath.divide(s.position, scale);

        if (this.activePoint !== undefined) {
            const point = this.points[this.activePoint],
                change = pointer.subtract(point.point),
                constraints = point.constraints ?? [];

            let apply = true;

            for (let i = 0; i < constraints.length; i++) {
                const constraint = constraints[i];

                apply = constraint.apply(object, this.activePoint, change);

                if (!apply) {
                    break;
                }
            }

            if (apply) {
                point.point.x += change.x;
                point.point.y += change.y;
            }
            this.draw();
        } else {
            const index = this.points.findIndex(p =>
                p.point.x - this.radius < pointer.x &&
                p.point.x + this.radius > pointer.x &&
                p.point.y - this.radius < pointer.y &&
                p.point.y + this.radius > pointer.y
            );

            this.activePoint = index === -1 ? undefined : index;
        }
    }
}