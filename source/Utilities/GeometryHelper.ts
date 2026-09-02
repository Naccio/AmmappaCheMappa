import { Bezier } from "../Model/Bezier";
import { Line } from "../Model/Line";
import { Point } from "../Model/Point";
import { VectorMath } from "./VectorMath";

export enum BezierType {
    Plain,
    SingleInflection,
    DoubleInflection,
    Cusp,
    Loop
}

export class GeometryHelper {

    private constructor() { }

    // https://pomax.github.io/bezierinfo/#canonical
    public static getBezierType(bezier: Bezier) {
        const canonical = this.getCanonicalForm(bezier);

        return this.getCanonicalPointType(canonical.to);
    }

    // http://paulbourke.net/geometry/pointlineplane/
    public static getProjection(point: Point, line: Line): Point {
        const p1 = line.from,
            p2 = line.to,
            x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y,
            x3 = point.x,
            y3 = point.y,
            xDelta = x2 - x1,
            yDelta = y2 - y1;

        if (xDelta === 0 && yDelta === 0) {
            return p1;
        }

        const u = ((x3 - x1) * xDelta + (y3 - y1) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

        if (u < 0) {
            return p1;
        } else if (u > 1) {
            return p2;
        } else {
            return {
                x: x1 + u * xDelta,
                y: y1 + u * yDelta
            };
        }
    }

    // http://paulbourke.net/geometry/pointlineplane/
    public static lineIntersection(line1: Line, line2: Line): Point | undefined {
        const p1 = line1.from,
            p2 = line1.to,
            p3 = line2.from,
            p4 = line2.to,
            x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y,
            x3 = p3.x,
            y3 = p3.y,
            x4 = p4.x,
            y4 = p4.y,
            denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // Either segment length is 0
        if (VectorMath.isEqual(p1, p2) || VectorMath.isEqual(p3, p4)) {
            return undefined;
        }

        // Lines are parallel
        if (denominator === 0) {
            return undefined;
        }

        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator,
            ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Segments do not intersect
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return undefined;
        }

        return {
            x: x1 + ua * (x2 - x1),
            y: y1 + ua * (y2 - y1)
        };
    }

    private static getCanonicalForm(bezier: Bezier): Bezier {
        const to = this.getBezierCanonicalPoint(bezier);

        return {
            ...bezier,
            to
        }
    }

    private static getBezierCanonicalPoint(bezier: Bezier): Point {
        const p1 = bezier.from,
            p2 = bezier.control1,
            p3 = bezier.control2,
            p4 = bezier.to,
            xn = -p1.x + p4.x - (-p1.x + p2.x) * (-p1.y + p4.y) / (-p1.y + p2.y),
            xd = -p1.x + p3.x - (-p1.x + p2.x) * (-p1.y + p3.y) / (-p1.y + p2.y),
            np4x = xn / xd,
            yt1 = (-p1.y + p4.y) / (-p1.y + p2.y),
            yt2 = 1 - (-p1.y + p3.y) / (-p1.y + p2.y),
            yp = yt2 * xn / xd,
            np4y = yt1 + yp;

        return {
            x: np4x,
            y: np4y
        };
    }

    private static getCanonicalPointType(point: Point) {
        const x = point.x,
            y = point.y;

        if (y > 1) {
            return BezierType.SingleInflection;
        }

        if (y <= 1 && x <= 1) {
            const c = (-x * x + 2 * x + 3) / 4;

            if (x <= 0) {
                const l1 = (-x * x + 3 * x) / 3,
                    diff = Math.abs(y - l1);

                if (diff < 0.06 || l1 < y && y < c) {
                    return BezierType.Loop;
                }
            }

            if (0 <= x && x <= 1) {
                const l0 = (Math.sqrt(3) * Math.sqrt(4 * x - x * x) - x) / 2,
                    diff = Math.abs(y - l0);

                if (diff < 0.06 || l0 < y && y < c) {
                    return BezierType.Loop;
                }
            }

            const diff = Math.abs(y - c);
            if (diff < 0.06) {
                return BezierType.Cusp;
            }

            if (y > c) {
                return BezierType.DoubleInflection;
            } else if (y < c) {
                return BezierType.Plain;
            }
        }

        return BezierType.Plain;
    }
}