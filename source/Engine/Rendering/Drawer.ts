import { Point } from "../../Model/Point";
import { LineStyle } from "./LineStyle";
import { ShapeStyle } from "./ShapeStyle";

export interface Drawer {
    get height(): number;
    get width(): number;
    bezier(from: Point, to: Point, control1: Point, control2: Point, style: LineStyle): void;
    clear(): void;
    clear(point: Point, width: number, height: number): void;
    circle(point: Point, radius: number, style: ShapeStyle): void;
    ellipse(point: Point, radiusX: number, radiusY: number, rotation: number, style: ShapeStyle): void;
    image(drawer: Drawer, point: Point): void;
    line(points: Point[], style: LineStyle): void;
    text(point: Point, text: string, fontSize: number): void;
}