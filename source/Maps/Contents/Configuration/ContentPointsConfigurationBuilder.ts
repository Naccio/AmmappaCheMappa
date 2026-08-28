import { ContentPointType } from "../ContentPointType";
import { ContentPointConfiguration } from "./ContentPointConfiguration";
import { ContentPointConfigurationBuilder } from "./ContentPointConfigurationBuilder";
import { ContentPointsConfiguration } from "./ContentPointsConfiguration";

type PointConfiguration = (p: ContentPointConfigurationBuilder) => void;

export class ContentPointsConfigurationBuilder {
    private readonly points: ContentPointConfiguration[] = [];

    public addPosition() {
        const builder = new ContentPointConfigurationBuilder(ContentPointType.position);

        builder.applyToOthers();

        this.points.push(builder.build());

        return this;
    }

    public addPrimary(action?: PointConfiguration) {
        return this.addPoint(ContentPointType.primary, action);
    }

    public addHelper(action?: PointConfiguration) {
        return this.addPoint(ContentPointType.helper, action);
    }

    public build() {
        return new ContentPointsConfiguration(this.points);
    }

    public addPoint(type: ContentPointType, action?: PointConfiguration) {
        const builder = new ContentPointConfigurationBuilder(type);

        if (action !== undefined) {
            action(builder);
        }

        this.points.push(builder.build());

        return this;
    }
}