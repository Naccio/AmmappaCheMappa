import { Point } from "./Point";

export interface CellConnection {
    readonly point: Point;
    readonly neighborIndex: number;
    readonly neighborPoint: Point;
}