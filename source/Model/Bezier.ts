import { Point } from "./Point";

export interface Bezier {
    from: Point,
    to: Point,
    control1: Point,
    control2: Point
}