import { MapObject } from "../Model/MapObject";
import { ContentPoint } from "./ContentPoint";
import { ContentPointConfiguration } from "./ContentPointConfiguration";

export class ContentPointsConfiguration {
    public constructor(private readonly points: readonly ContentPointConfiguration[]) {
    }

    public get(object: MapObject): ContentPoint[] {
        const points: ContentPoint[] = [];

        for (let i = 0; i < this.points.length; i++) {
            const configuration = this.points[i];

            points.push({
                ...configuration,
                point: object.points[i]
            });
        }

        return points;
    }
}