import { ContentConfiguration } from "./ContentConfiguration";
import { ContentConfigurationBuilder } from "./ContentConfigurationBuilder";

export class ContentsConfigurationBuilder {
    private readonly contents: ContentConfiguration[] = [];

    public add<T>(type: string, factory: (builder: ContentConfigurationBuilder<T>) => void) {
        const builder = new ContentConfigurationBuilder<T>(type);

        factory(builder);

        this.contents.push(builder.build());

        return this;
    }

    public build() {
        return this.contents;
    }
}