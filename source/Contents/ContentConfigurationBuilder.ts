import { DefaultGraphics } from "../Engine/Rendering/DefaultGraphics";
import { GenericObjectGraphicsFactory } from "../Engine/Rendering/GenericObjectGraphicsFactory";
import { Graphics } from "../Engine/Rendering/Graphics";
import { ContentConfiguration } from "./ContentConfiguration";

export class ContentConfigurationBuilder<T> {

    private graphicsFactory: (content: T) => Graphics;

    public constructor(private readonly type: string) {
        this.graphicsFactory = _ => DefaultGraphics.instance;
    }

    public build(): ContentConfiguration {
        return {
            type: this.type,
            graphics: new GenericObjectGraphicsFactory<T>(this.type, this.graphicsFactory)
        };
    }

    public setGraphics(factory: (content: T) => Graphics) {
        this.graphicsFactory = factory;
    }
}