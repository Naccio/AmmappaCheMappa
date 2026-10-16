import { MapObject } from "../../../Model/MapObject";
import { ContentConfiguration } from "./ContentConfiguration";

export class ContentsConfiguration {
    public constructor(private readonly contents: readonly ContentConfiguration[]) {
    }

    public get(type: string) {
        const content = this.contents.find(c => c.type === type);

        if (content === undefined) {
            throw new Error(`Content '${type}' was not configured.`);
        }

        return content;
    }

    public getPoints(object: MapObject) {
        const content = this.get(object.type);

        return content.points.get(object);
    }
}