import { ContentConfiguration } from "./ContentConfiguration";

export class ContentsConfigurationBuilder {
    private readonly contents: ContentConfiguration[] = [];

    public add(configuration: ContentConfiguration) {
        this.contents.push(configuration);

        return this;
    }

    public build() {
        return this.contents;
    }
}