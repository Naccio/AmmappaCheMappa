import { ContentConfiguration } from "./ContentConfiguration";

export class ContentsConfiguration {
    public constructor(private readonly contents: readonly ContentConfiguration[]) {
    }

    public get(type: string) {
        const content = this.contents.find(c => c.type === type);

        if (content === undefined) {
            throw new Error(`Content '${type}' was not configured.`);
        }

        return content;
    }
}