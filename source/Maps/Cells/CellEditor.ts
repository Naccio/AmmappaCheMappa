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
import { CellContext } from "./CellContext";
import { ContentsConfiguration } from "../Contents/Configuration/ContentsConfiguration";
import { CellRenderer } from "./CellRenderer";
import { CellIndex } from "../../Model/CellIndex";
import { GridHelper } from "../../Utilities/GridHelper";
import { ShapeStyle } from "../../Engine/Rendering/ShapeStyle";
import { RangeConstraint } from "../Contents/Configuration/ContentPointConstraint";

export class CellEditor implements UIElement {
    private readonly radius = .03;
    private readonly scale = 2.5;

    private readonly drawer: Drawer;
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
        private readonly contents: ContentsConfiguration,
        private readonly renderer: CellRenderer
    ) {
        const scale = this.scale * cell.pixels,
            size = scale * 3,
            objects = cell.objects.value,
            container = document.createElement('div'),
            drawer = drawerFactory.create(size, size, scale);

        this.selectedObject = new InternalObservable<MapObject | undefined>(undefined);

        const list = new RadioSelect(this.selectedObject, objects, (item, label) => {
            label.innerText = item.type;
        });

        this.pointer = new PointerTarget();
        this.drawer = drawer;

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
        this.drawer.clear();
        this.drawCells();
        this.drawOverlay();
        this.drawPoints();
    }

    private drawPoints() {
        const points = this.points,
            drawer = this.drawer;

        points.forEach(p => {
            const point = this.getRelativePoint(p);

            switch (p.type) {
                case ContentPointType.position:
                    this.drawer.circle(point, this.radius, { fillStyle: 'red' });
                    break;

                case ContentPointType.primary:
                    this.drawer.circle(point, this.radius, { fillStyle: 'blue' });
                    break;

                case ContentPointType.helper:
                    this.drawer.circle(point, this.radius, { fillStyle: 'green' });
                    break;

                default:
                    throw new Error(`Invalid point type: '${p.type}'.`);
            }
        });
    }

    private drawCell(cell?: CellContext) {
        if (cell === undefined) {
            return;
        }

        const shift = this.getCellShift(cell.index),
            image = this.renderer.render(cell, undefined, this.scale);

        this.drawer.image(image, shift);
    }

    private drawCells() {
        const c = this.cell,
            t = c.topNeighbor,
            r = c.rightNeighbor,
            b = c.bottomNeighbor,
            l = c.leftNeighbor,
            tr = t?.rightNeighbor,
            br = b?.rightNeighbor,
            bl = b?.leftNeighbor,
            tl = t?.leftNeighbor;

        [c, t, r, b, l, tr, br, bl, tl].forEach(c => this.drawCell(c));
    }

    private drawOverlay() {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const style: ShapeStyle = {
                    line: {
                        color: GridHelper.defaultGridColor,
                        lineWidth: .01
                    }
                };

                if (x !== 1 || y !== 1) {
                    style.fillStyle = 'rgba(215,215,215,.75)';
                }

                this.drawer.rectangle({ x, y }, 1, 1, style);
            }
        }
    }

    private getCellShift(index: CellIndex) {
        return {
            x: index.column + 1 - this.cell.index.column,
            y: index.row + 1 - this.cell.index.row
        };
    }

    private getConstraints(point: ContentPoint) {
        const constraints = point.constraints ?? [];

        constraints.push(new RangeConstraint(0, 1));

        return constraints;
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

    private getRelativePoint(point: ContentPoint) {
        return VectorMath.add(point.point, this.getCellShift(this.cell.index));
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
                relativePoint = this.getRelativePoint(point),
                change = pointer.subtract(relativePoint),
                constraints = this.getConstraints(point);

            let apply = true;

            for (let i = 0; i < constraints.length; i++) {
                const constraint = constraints[i];

                apply = constraint.apply(object, this.activePoint, change);

                if (!apply) {
                    break;
                }
            }

            if (apply) {
                const newPoint = VectorMath.startOperation(point.point)
                    .add(change)
                    .round(2);

                point.point.x = newPoint.x;
                point.point.y = newPoint.y;
            }
            this.draw();
        } else {
            const index = this.points
                .map(p => this.getRelativePoint(p))
                .findIndex(p =>
                    p.x - this.radius < pointer.x &&
                    p.x + this.radius > pointer.x &&
                    p.y - this.radius < pointer.y &&
                    p.y + this.radius > pointer.y
                );

            this.activePoint = index === -1 ? undefined : index;
        }
    }
}