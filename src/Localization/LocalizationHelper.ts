class LocalizationHelper {
    public static readonly storageKey = 'locale';
    public static readonly languages : ApplicationLanguage[] = [{
        locale: "en",
        name: "English"
     }, {
        locale: "it",
        name: "Italiano"
    }];

    public static getUserLocale() {
        let locale = localStorage.getItem(this.storageKey);
        
        if (locale === null) {
            // For now I am using just the language part of the
            // locale for simplicity
            locale = new Intl.Locale(navigator.language).language;
        }

        return this.isValid(locale) ? locale : this.languages[0].locale;
    }

    public static isValid(locale: string) {
        return this.languages.find(l => l.locale === locale) !== undefined
    }

    public static async loadResource(locale: string) {
        const response = await fetch(`resources/${locale}.json`);
        const json = await response.json();

        return json as LocalizationResource
    }

    public static storeUserLocale(locale: string) {
        if (this.isValid(locale)) {
            localStorage.setItem(this.storageKey, locale);
        }
    }
}