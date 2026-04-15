import { Point } from "../../Model/Point";

export interface River {
    from: Point,
    to: Point,
    bend1: Point,
    bend2: Point
}