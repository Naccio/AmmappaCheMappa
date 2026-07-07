import { Point } from "../../Model/Point";
import { UIElement } from "../../UI/UIElement";
import { LineStyle } from "./LineStyle";
import { ShapeStyle } from "./ShapeStyle";

export interface Drawer extends UIElement {
    get height(): number;
    get width(): number;
    bezier(from: Point, to: Point, control1: Point, control2: Point, style: LineStyle): void;
    clear(): void;
    clear(point: Point, width: number, height: number): void;
    circle(point: Point, radius: number, style: ShapeStyle): void;
    ellipse(point: Point, radiusX: number, radiusY: number, rotation: number, style: ShapeStyle): void;
    image(drawer: Drawer, point: Point): void;
    line(points: Point[], style: LineStyle): void;
    rectangle(point: Point, width: number, height: number, style: ShapeStyle): void;
    text(point: Point, text: string, fontSize: number): void;
    toBlob(callback: BlobCallback): void;
}