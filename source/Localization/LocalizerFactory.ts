/// <reference path="../Model/ApplicationState.ts" />
/// <reference path="LocalizationHelper.ts" />
/// <reference path="Localizer.ts" />

class LocalizerFactory {

    constructor(private state: ApplicationState) {
    }

    public async create() {
        const locale = this.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await LocalizationHelper.loadResource(locale);

        return new Localizer(resource);
    }

    private getUserLocale() {
        let locale = this.state.locale;

        if (locale === undefined) {
            // For now I am using just the language part of the
            // locale for simplicity
            locale = new Intl.Locale(navigator.language).language;
        }

        if (!LocalizationHelper.isValid(locale)) {
            locale = LocalizationHelper.languages[0].locale;
        }

        if (this.state.locale !== locale) {
            this.state.locale = locale;
        }

        return locale!;
    }
}