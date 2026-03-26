class LocalizationHelper {
    public static readonly storageKey = 'locale';
    public static readonly languages: ApplicationLanguage[] = [{
        locale: "en",
        name: "English"
    }, {
        locale: "it",
        name: "Italiano"
    }];

    public static isValid(locale: string) {
        return this.languages.find(l => l.locale === locale) !== undefined
    }

    public static async loadResource(locale: string) {
        const response = await fetch(`resources/${locale}.json`);
        const json = await response.json();

        return json as LocalizationResource
    }
}