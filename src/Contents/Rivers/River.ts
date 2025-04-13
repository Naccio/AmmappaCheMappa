/// <reference path="../../Model/GridObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface River extends GridObject {
    from: Point,
    to: Point,
    bend1: Point,
    bend2: Point
}