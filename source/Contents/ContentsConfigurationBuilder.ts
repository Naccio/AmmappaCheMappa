import { ContentConfiguration } from "./ContentConfiguration";
import { ContentConfigurationBuilder } from "./ContentConfigurationBuilder";

export class ContentsConfigurationBuilder {
    private readonly contents: ContentConfiguration[] = [];

    public add(configuration: ContentConfiguration) {
        this.contents.push(configuration);

        return this;
    }

    public configure<T>(type: string, factory: (builder: ContentConfigurationBuilder<T>) => void) {
        const builder = new ContentConfigurationBuilder<T>(type);

        factory(builder);

        return this.add(builder.build());
    }

    public build() {
        return this.contents;
    }
}