/// <reference path="../Layers/LayersManager.ts" />
/// <reference path="../Model/EditorMap.ts" />
/// <reference path="../Model/Point.ts" />
/// <reference path="DrawingUI.ts" />
/// <reference path="MapDrawer.ts" />
/// <reference path="UIElement.ts" />

class DrawingArea implements UIElement {
    private readonly doubleClickThreshold = 250;
    private readonly wrapper: HTMLElement;

    private isShifting: boolean = false;
    private isDrawing: boolean = false;
    private lastShift: Point = VectorMath.zero;
    private lastWheelClick = 0;

    constructor(
        private tool: ToolActivator,
        private drawer: MapDrawer
    ) {
        const wrapper = document.createElement('div');

        wrapper.className = 'drawing-area';
        wrapper.append(drawer.html);

        wrapper.addEventListener('mousedown', this.mouseDownHandler);
        wrapper.addEventListener('mouseleave', this.mouseLeaveHandler);
        wrapper.addEventListener('mousemove', this.mouseMoveHandler);
        wrapper.addEventListener('wheel', this.wheelHandler);

        document.addEventListener('mouseup', this.mouseUpHandler);

        window.addEventListener('blur', this.blurHandler);
        window.addEventListener('resize', this.resizeHandler);

        this.wrapper = wrapper;
    }

    public get html() {
        return this.wrapper;
    }

    public setup() {
        this.drawer.resize(0);
    }


    // PRIVATE

    private getMapPoint(viewPortPoint: Point) {
        const boundingRectangle = this.wrapper.getBoundingClientRect(),
            point = VectorMath.subtract(viewPortPoint, boundingRectangle);

        return this.drawer.getMapPoint(point);
    }

    private startDraw(coordinates: Vector) {
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

    private resizeHandler = () => {
        this.setup();
    }

    private wheelHandler = (e: WheelEvent) => {
        const direction = Math.sign(e.deltaY);

        this.zoom(direction);
    }
}