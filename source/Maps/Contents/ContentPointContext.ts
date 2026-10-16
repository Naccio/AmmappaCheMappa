import { ContentPoint } from "./ContentPoint";

export interface ContentPointOverlap {
    cellNeighborIndex: number;
    objectIndex: number;
    overlappingPointIndex: number;
}

export class ContentPointContext {
    public constructor(
        public point: ContentPoint,
        public overlaps: ContentPointOverlap[]
    ) { }

    public get isConnection() {
        return this.overlaps.length > 0;
    }
}