import { InternalEvent } from "../Engine/Events/InternalEvent";
import { InternalObservable } from "../Engine/Events/InternalObservable";
import { Observable } from "../Engine/Events/Observable";
import { Point } from "../Model/Point";
import { VectorMath } from "../Utilities/VectorMath";
import { UIElement } from "./UIElement";

export interface ClickEvent {
    status: PointerStatus
    clicks: number
}

export interface ZoomEvent {
    direction: number
}

export interface PointerStatus {
    position: Point,
    button?: number
}

export class PointerButtons {
    public static readonly primary = 0;
    public static readonly auxiliary = 1;
    public static readonly secondary = 2;
    public static readonly back = 3;
    public static readonly forward = 4;
}

export class PointerTarget implements UIElement {
    private readonly consecutiveClickThreshold = 200;
    private readonly maxConsecutiveClicks = 2;

    private readonly container: HTMLDivElement;
    private readonly _status: InternalObservable<PointerStatus | undefined>;
    private readonly clickEvent: InternalEvent<ClickEvent>;
    private readonly zoomEvent: InternalEvent<ZoomEvent>;

    private activeButton?: number;
    private consecutiveClickTimeout?: number;
    private consecutiveClicks: number = 0;
    private mouseDownPosition?: Point;

    constructor() {
        const container = document.createElement('div');

        container.addEventListener('mousedown', this.mouseDownHandler);
        container.addEventListener('mouseenter', this.mouseEnterHandler);
        container.addEventListener('mousemove', this.mouseMoveHandler);
        container.addEventListener('mouseup', this.mouseUpHandler);
        container.addEventListener('wheel', this.wheelHandler);

        window.addEventListener('blur', this.blurHandler);

        this.container = container;
        this._status = new InternalObservable<PointerStatus | undefined>(undefined);
        this.clickEvent = new InternalEvent<ClickEvent>();
        this.zoomEvent = new InternalEvent<ZoomEvent>();
    }

    public get html() {
        return this.container;
    }

    public get status(): Observable<PointerStatus | undefined> {
        return this._status;
    }

    public onClick(handler: (event: ClickEvent) => void) {
        this.clickEvent.subscribe(handler);
    }

    public onZoom(handler: (event: ZoomEvent) => void) {
        this.zoomEvent.subscribe(handler);
    }


    // PRIVATE

    private stop() {
        clearTimeout(this.consecutiveClickTimeout);
        this.consecutiveClicks = 0;
        this.consecutiveClickTimeout = undefined;
        this.activeButton = undefined;
        this.mouseDownPosition = undefined;
        this._status.value = undefined;
    }


    // HANDLERS

    private blurHandler = () => {
        this.stop();
    }

    private getCoordinates(e: MouseEvent): Point {
        const clientPoint = { x: e.clientX, y: e.clientY },
            boundingRectangle = this.html.getBoundingClientRect();

        return VectorMath.subtract(clientPoint, boundingRectangle);
    }

    private mouseDownHandler = (e: MouseEvent) => {
        // A button is being clicked when one is already active.
        // For now we don't support such scenarios.
        if (this.activeButton) {
            return;
        }

        this.mouseDownPosition = this.getCoordinates(e);
        this.activeButton = e.button;
    }

    private mouseEnterHandler = (e: MouseEvent) => {
        let button = undefined;

        switch (e.buttons) {
            case 1:
                button = PointerButtons.primary;
                break;

            case 2:
                button = PointerButtons.secondary;
                break;

            case 4:
                button = PointerButtons.auxiliary;
                break;

            case 8:
                button = PointerButtons.back;
                break;

            case 16:
                button = PointerButtons.forward;
                break;
        }

        this.activeButton = button;
    }

    private mouseMoveHandler = (e: MouseEvent) => {
        this._status.value = {
            position: this.getCoordinates(e),
            button: this.activeButton
        };
    }

    private mouseUpHandler = (e: MouseEvent) => {
        // The released button is not the one we are tracking
        if (e.button !== this.activeButton) {
            return;
        }

        const coordinates = this.getCoordinates(e);

        if (
            // The pointer did not move between its activation and its release
            VectorMath.isEqual(coordinates, this.mouseDownPosition) &&
            this.consecutiveClicks < this.maxConsecutiveClicks
        ) {
            this.consecutiveClicks += 1;

            const event = {
                status: {
                    position: coordinates,
                    button: this.activeButton,
                },
                clicks: this.consecutiveClicks
            };

            clearTimeout(this.consecutiveClickTimeout);
            this.consecutiveClickTimeout = setTimeout(() => {
                this.clickEvent.trigger(event);
                this.stop();
            }, this.consecutiveClickThreshold);
        }

        this.activeButton = undefined;
        this._status.update(s => {
            if (s) {
                s.button = undefined;
            }
        });
    }

    private wheelHandler = (e: WheelEvent) => {
        const direction = Math.sign(e.deltaY);

        this.zoomEvent.trigger({ direction });
    }
}