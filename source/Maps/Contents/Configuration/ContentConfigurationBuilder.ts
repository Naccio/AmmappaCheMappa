import { Graphics } from "../../../Engine/Rendering/Graphics";
import { ObjectGraphicsFactory } from "../../../Engine/Rendering/ObjectGraphicsFactory";
import { SimpleObjectGraphicsFactory } from "../../../Engine/Rendering/SimpleObjectGraphicsFactory";
import { MapObject } from "../../../Model/MapObject";
import { ContentConfiguration } from "./ContentConfiguration";
import { ContentPointsConfiguration } from "./ContentPointsConfiguration";
import { ContentPointsConfigurationBuilder } from "./ContentPointsConfigurationBuilder";


export class ContentConfigurationBuilder {
    private points?: ContentPointsConfiguration;
    private graphics?: ObjectGraphicsFactory;

    public constructor(private readonly type: string) {
    }

    public setGraphics(factory: (o: MapObject) => Graphics) {
        this.graphics = new SimpleObjectGraphicsFactory(factory);
        return this;
    }

    public configurePoints(action: (b: ContentPointsConfigurationBuilder) => void) {
        const builder = new ContentPointsConfigurationBuilder();

        action(builder);

        this.points = builder.build();

        return this;
    }

    public build(): ContentConfiguration {
        if (this.graphics === undefined) {
            throw new Error(`Graphics was not defined for objects of type '${this.type}'.`);
        }

        if (this.points === undefined) {
            throw new Error(`Points were not defined for objects of type '${this.type}'.`);
        }

        return {
            type: this.type,
            graphics: this.graphics,
            points: this.points
        };
    }
}