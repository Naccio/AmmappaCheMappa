import { Point } from "../../Model/Point";
import { VectorMath } from "../../Utilities/VectorMath";
import { Drawer } from "./Drawer";
import { LineStyle } from "./LineStyle";
import { ShapeStyle } from "./ShapeStyle";

export class CanvasDrawer implements Drawer {

    private readonly context: CanvasRenderingContext2D;

    //HACK: Leaky abstraction
    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly scale: number
    ) {
        const context = canvas.getContext('2d');

        if (context === null) {
            throw new Error('Cannot get canvas 2D context.');
        }

        this.context = context;
    }

    public get height() {
        return this.canvas.height;
    }

    public get width() {
        return this.canvas.width;
    }

    public get html() {
        return this.canvas;
    }

    public bezier(from: Point, to: Point, control1: Point, control2: Point, style: LineStyle) {
        from = this.getActualPoint(from);
        to = this.getActualPoint(to);
        control1 = this.getActualPoint(control1);
        control2 = this.getActualPoint(control2);

        this.context.save();
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, to.x, to.y);

        this.setLineStyle(style);
        this.context.stroke();
        this.context.restore();
    }

    public clear(): void;
    public clear(point: Point, width: number, height: number): void;
    public clear(point?: Point, width?: number, height?: number) {
        point = this.getActualPoint(point ?? VectorMath.zero);

        if (width) {
            width = this.getActualValue(width);
        } else {
            width = this.canvas.width;
        }

        if (height) {
            height = this.getActualValue(height);
        } else {
            height = this.canvas.height;
        }

        this.context.clearRect(point.x, point.y, width, height);
    }

    public circle(point: Point, radius: number, style: ShapeStyle) {
        point = this.getActualPoint(point);
        radius = this.getActualValue(radius);

        this.setShapeStyle(style);

        this.context.save();
        this.context.beginPath();
        this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.context.stroke();
        }
        this.context.restore();
    }

    public ellipse(point: Point, radiusX: number, radiusY: number, rotation: number, style: ShapeStyle) {
        point = this.getActualPoint(point);
        radiusX = this.getActualValue(radiusX);
        radiusY = this.getActualValue(radiusY);

        this.setShapeStyle(style);

        this.context.save();
        this.context.beginPath();
        this.context.ellipse(point.x, point.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.context.stroke();
        }
        this.context.restore();
    }

    public image(drawer: CanvasDrawer, point: Point) {
        point = this.getActualPoint(point);

        this.context.drawImage(drawer.canvas, point.x, point.y);
    }

    public line(points: Point[], style: LineStyle) {
        const mapPoints = points.map(p => this.getActualPoint(p)),
            start = mapPoints.shift()!;

        this.context.save();
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        mapPoints.forEach(p => this.context.lineTo(p.x, p.y));

        this.setLineStyle(style);
        this.context.stroke();
        this.context.restore();
    }

    public rectangle(point: Point, width: number, height: number, style: ShapeStyle) {
        point = this.getActualPoint(point);
        width = this.getActualValue(width);
        height = this.getActualValue(height);

        this.setShapeStyle(style);

        this.context.fillRect(point.x, point.y, width, height);
    }

    public text(point: Point, text: string, fontSize: number) {
        point = this.getActualPoint(point);

        this.context.save();
        this.context.font = fontSize + 'px serif';
        const measurement = this.context.measureText(text),
            width = measurement.width,
            x = point.x - width / 2,
            y = point.y;

        this.context.fillText(text, x, y);

        this.context.restore();
    }

    public toBlob(callback: BlobCallback) {
        return this.canvas.toBlob(callback);
    }


    // PRIVATE

    private getActualPoint(point: Point) {
        return VectorMath.multiply(point, this.scale);
    }

    private getActualValue(value: number) {
        return value * this.scale;
    }

    private setLineStyle(style?: LineStyle) {
        const lineCap = style?.lineCap ?? 'square',
            lineJoin = style?.lineJoin ?? 'round',
            lineWidth = style?.lineWidth ?? 1,
            color = style?.color ?? '#000';

        this.context.lineCap = lineCap;
        this.context.lineJoin = lineJoin;
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = color;
    }

    private setShapeStyle(style?: ShapeStyle) {
        const fillStyle = style?.fillStyle ?? '#fff';

        this.context.fillStyle = fillStyle;
        this.setLineStyle(style?.line);
    }
}