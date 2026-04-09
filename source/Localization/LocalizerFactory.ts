import { ApplicationState } from "../Model/ApplicationState";
import { LocalizationHelper } from "./LocalizationHelper";
import { LocalizationResource } from "./LocalizationResource";
import { Localizer } from "./Localizer";

export class LocalizerFactory {

    constructor(private state: ApplicationState) {
    }

    public async create() {
        const locale = this.getUserLocale();
        document.documentElement.lang = locale;
        const resource = await this.loadResource(locale);

        return new Localizer(resource);
    }

    private getUserLocale() {
        let locale = this.state.locale;

        if (locale === undefined) {
            // For now I am using just the language part of the
            // locale for simplicity
            locale = new Intl.Locale(navigator.language).language;
        }

        if (!this.isValid(locale)) {
            locale = LocalizationHelper.languages[0].locale;
        }

        if (this.state.locale !== locale) {
            this.state.locale = locale;
        }

        return locale!;
    }

    private isValid(locale: string) {
        return LocalizationHelper.languages.find(l => l.locale === locale) !== undefined
    }

    private async loadResource(locale: string) {
        const response = await fetch(`resources/${locale}.json`);
        const json = await response.json();

        return json as LocalizationResource
    }
}