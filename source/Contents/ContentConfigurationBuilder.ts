import { DefaultGraphics } from "../Engine/Rendering/DefaultGraphics";
import { GenericObjectGraphicsFactory } from "../Engine/Rendering/GenericObjectGraphicsFactory";
import { Graphics } from "../Engine/Rendering/Graphics";
import { ContentConfiguration } from "./ContentConfiguration";
import { ContentPoint } from "./ContentPoint";

export class ContentConfigurationBuilder<T> {

    private graphicsFactory: (content: T) => Graphics;
    private pointsFactory: (content: T) => ContentPoint[];

    public constructor(private readonly type: string) {
        this.graphicsFactory = _ => DefaultGraphics.instance;
        this.pointsFactory = _ => [];
    }

    public build(): ContentConfiguration {
        return {
            type: this.type,
            graphics: new GenericObjectGraphicsFactory<T>(this.graphicsFactory),
            points: (o) => this.pointsFactory(o.data)
        };
    }

    public setGraphics(factory: (content: T) => Graphics) {
        this.graphicsFactory = factory;

        return this;
    }

    public setPoints(factory: (content: T) => ContentPoint[]) {
        this.pointsFactory = factory;

        return this;
    }
}