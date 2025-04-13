/// <reference path="./MapDrawer.ts" />
/// <reference path="./UIElement.ts" />
/// <reference path="../Model/Point.ts" />

class DrawingArea implements UIElement {
    private readonly id = 'drawing-area';
    private readonly doubleClickThreshold = 250;

    private _drawer?: MapDrawer;
    private _wrapper?: HTMLElement;

    private isShifting: boolean = false;
    private isDrawing: boolean = false;
    private lastShift: Point = VectorMath.zero;
    private lastWheelClick = 0;

    constructor(private layers: Layer[], private tool: ToolActivator) {
    }

    public build() {
        const wrapper = document.createElement('div');

        wrapper.id = this.id;

        window.addEventListener('blur', this.blurHandler);
        wrapper.addEventListener('mousedown', this.mouseDownHandler);
        wrapper.addEventListener('mouseleave', this.mouseLeaveHandler);
        wrapper.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        wrapper.addEventListener('wheel', this.wheelHandler);
        
        document.body.append(wrapper);

        this._wrapper = wrapper;
    }

    public setup(map: GridMap) {
        const container = document.createElement('div');

        container.style.position = 'absolute';

        this.wrapper.innerHTML = '';
        this.wrapper.append(container);

        this._drawer = new MapDrawer(map, container);

        this.drawer.resize(0);
        this.layers.forEach(l => l.setup(container));
        this.drawer.center();
    }


    // PRIVATE

    private get drawer() {
        if (this._drawer === undefined) {
            throw new Error('UI not built');
        }

        return this._drawer;
    }

    private get wrapper() {
        if (this._wrapper === undefined) {
            throw new Error('UI not built');
        }

        return this._wrapper;
    }

    private getMapPoint(point: Point) {
        return this.drawer.getMapPoint(point);
    }

    private startDraw(coordinates: Vector) {;
        this.isDrawing = true;
        this.tool.start(coordinates);
    }

    private startShift(coordinates: Vector) {
        this.isShifting = true;
        this.lastShift = coordinates;
    }

    private stop(coordinates?: Vector) {
        if (this.isDrawing) {
            this.tool.stop(coordinates);
            this.isDrawing = false;
        }
        this.isShifting = false;
    }

    private updateShift(coordinates: Vector) {
        const shift = VectorMath.subtract(coordinates, this.lastShift);

        this.lastShift = coordinates;
        this.drawer.shift(shift);
    }

    public zoom(direction: number) {
        this.drawer.resize(direction);
        this.layers.forEach(l => l.zoom());
    }


    // HANDLERS

    private blurHandler = () => {
        this.stop(undefined);
    }

    private mouseDownHandler = (e: MouseEvent) => {
        const coordinates = {
            x: e.clientX,
            y: e.clientY
        };

        if (Utilities.hasFlag(e.buttons, 4)) {

            // dblclick event is not fired with auxiliary buttons and
            // auxclixk event is still a bit finicky, so I do it
            // manually, the old fashioned way.
            //TODO: move trigger to mouseup
            const now = Date.now();
            if (now - this.lastWheelClick < this.doubleClickThreshold) {
                this.drawer.center();
            }
            this.lastWheelClick = now;

            this.startShift(coordinates);
        } else if (Utilities.hasFlag(e.buttons, 1)) {
            const mapCoordinates = this.getMapPoint(coordinates);
            this.startDraw(mapCoordinates);
        }
    }

    private mouseLeaveHandler = () => {
        this.tool.move(undefined);
    }

    private mouseMoveHandler = (e: MouseEvent) => {
        const coordinates = {
            x: e.clientX,
            y: e.clientY
        };

        if (this.isShifting) {
            this.updateShift(coordinates);
        } else if (this.isDrawing) {
            const mapCoordinates = this.getMapPoint(coordinates);
            this.tool.move(mapCoordinates);
        }
    }

    private mouseUpHandler = (e: MouseEvent) => {
        const coordinates = this.getMapPoint({
            x: e.clientX,
            y: e.clientY
        });

        this.stop(coordinates);
    }

    private wheelHandler = (e: WheelEvent) => {
        const direction = Math.sign(e.deltaY);

        this.zoom(direction);
    }
}