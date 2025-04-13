/// <reference path="../../Model/GridObject.ts" />
/// <reference path="../../Model/Point.ts" />

interface Road extends GridObject {
    from: Point,
    to: Point
}