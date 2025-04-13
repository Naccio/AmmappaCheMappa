/// <reference path="../Model/Point.ts" />
/// <reference path="ShapeStyle.ts" />

class CanvasDrawer {

    private readonly context: CanvasRenderingContext2D;

    public constructor(public canvas: HTMLCanvasElement) {
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

    public bezier(from: Point, to: Point, control1: Point, control2: Point, style: LineStyle) {
        const ignoreBorders = style.ignoreBorders ?? false,
            padding = ignoreBorders ? undefined : style.lineWidth ?? 1;

            this.context.save();
            this.context.beginPath();
            this.context.moveTo(from.x, from.y);
            this.context.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, to.x, to.y);
    
            this.setLineStyle(style);
            this.context.stroke();
            this.context.restore();
    }

    public clear() : void;
    public clear(point: Point, width: number, height: number) : void;
    public clear(point?: Point, width?: number, height?: number) {
        const x = point?.x ?? 0,
            y = point?.y ?? 0;

        width ??= this.canvas.width;
        height ??= this.canvas.height;

        this.context.clearRect(x, y, width, height);
    }

    public circle(point: Point, radius: number, style: ShapeStyle) {
        const fillStyle = style.fillStyle ?? '#fff';

        this.context.save();
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.setLineStyle(style.line);
            this.context.stroke();
        }
        this.context.restore();
    }

    public ellipse(point: Point, radiusX: number, radiusY: number, rotation: number, style: ShapeStyle) {
        const fillStyle = style.fillStyle ?? '#fff';

        this.context.save();
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.ellipse(point.x, point.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
        this.context.fill();
        if (style.line !== undefined) {
            this.setLineStyle(style.line);
            this.context.stroke();
        }
        this.context.restore();
    }

    public image(drawer: CanvasDrawer) {
        this.context.drawImage(drawer.canvas, 0, 0);
    }

    public line(points: Point[], style: LineStyle) {
        const mapPoints = [...points],
            start = mapPoints.shift()!;

        this.context.save();
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        mapPoints.forEach(p => this.context.lineTo(p.x, p.y));

        this.setLineStyle(style);
        this.context.stroke();
        this.context.restore();
    }

    public scale(scale: number) {
        const canvas = this.canvas;

        canvas.style.width = canvas.width * scale + 'px';
        canvas.style.height = canvas.height * scale + 'px';
    }

    public text(point: Point, text: string, fontSize: number) {
        this.context.save();
        this.context.font = fontSize + 'px serif';
        const measurement = this.context.measureText(text),
            width = measurement.width,
            x = point.x - width / 2,
            y = point.y;

        this.context.fillText(text, x, y);

        this.context.restore();
    }


    // PRIVATE

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
    
}