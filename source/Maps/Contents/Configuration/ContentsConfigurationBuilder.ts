import { ContentConfiguration } from "./ContentConfiguration";
import { ContentConfigurationBuilder } from "./ContentConfigurationBuilder";
import { ContentsConfiguration } from "./ContentsConfiguration";

export class ContentsConfigurationBuilder {
    private readonly contents: ContentConfiguration[] = [];

    public add(type: string, action: (b: ContentConfigurationBuilder) => void) {
        if (this.contents.some(c => c.type === type)) {
            throw new Error(`Content type '${type}' was already configured.`);
        }

        const builder = new ContentConfigurationBuilder(type);

        action(builder);

        this.contents.push(builder.build());

        return this;
    }

    public build() {
        return new ContentsConfiguration(this.contents);
    }
}