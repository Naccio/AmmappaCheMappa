/// <reference path="LocalizationResource.ts" />

class Localizer {
    readonly [key: string] : string;

    public constructor(resource: LocalizationResource) {
        // Cannot assign using readonly index, see
        // https://github.com/microsoft/TypeScript/issues/6781
        Object.assign(this, resource);
    }
}