/// <reference path="../../Model/MapObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface Road extends MapObject {
    from: Point,
    to: Point
}