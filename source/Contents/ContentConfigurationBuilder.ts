import { DefaultGraphics } from "../Engine/Rendering/DefaultGraphics";
import { GenericObjectGraphicsFactory } from "../Engine/Rendering/GenericObjectGraphicsFactory";
import { Graphics } from "../Engine/Rendering/Graphics";
import { VectorMath } from "../Utilities/VectorMath";
import { ContentConfiguration } from "./ContentConfiguration";
import { ContentPoints } from "./ContentPoints";

export class ContentConfigurationBuilder<T> {

    private graphicsFactory: (content: T) => Graphics;
    private pointsFactory: (content: T) => ContentPoints;

    public constructor(private readonly type: string) {
        this.graphicsFactory = _ => DefaultGraphics.instance;
        this.pointsFactory = _ => {
            return {
                position: VectorMath.zero,
                mainPoints: [],
                helperPoints: []
            };
        }
    }

    public build(): ContentConfiguration {
        return {
            type: this.type,
            graphics: new GenericObjectGraphicsFactory<T>(this.type, this.graphicsFactory),
            points: (o) => this.pointsFactory(o.data)
        };
    }

    public setGraphics(factory: (content: T) => Graphics) {
        this.graphicsFactory = factory;

        return this;
    }

    public setPoints(factory: (content: T) => ContentPoints) {
        this.pointsFactory = factory;

        return this;
    }
}