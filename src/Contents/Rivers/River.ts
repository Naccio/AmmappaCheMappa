/// <reference path="../../Model/MapObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface River extends MapObject {
    from: Point,
    to: Point,
    bend1: Point,
    bend2: Point
}