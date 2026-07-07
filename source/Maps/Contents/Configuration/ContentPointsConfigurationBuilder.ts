import { ContentPointType } from "../ContentPointType";
import { ContentPointConfiguration } from "./ContentPointConfiguration";
import { ContentPointConfigurationBuilder } from "./ContentPointConfigurationBuilder";
import { ContentPointsConfiguration } from "./ContentPointsConfiguration";

export class ContentPointsConfigurationBuilder {
    private readonly points: ContentPointConfiguration[] = [];

    public addPosition() {
        const builder = new ContentPointConfigurationBuilder(ContentPointType.position);

        builder.applyToOthers();

        this.points.push(builder.build());

        return this;
    }

    public addPrimary() {
        const builder = new ContentPointConfigurationBuilder(ContentPointType.primary);

        this.points.push(builder.build());

        return this;
    }

    public addHelper(action?: (p: ContentPointConfigurationBuilder) => void) {
        const builder = new ContentPointConfigurationBuilder(ContentPointType.helper);

        if (action !== undefined) {
            action(builder);
        }

        this.points.push(builder.build());

        return this;
    }

    public build() {
        return new ContentPointsConfiguration(this.points);
    }
}