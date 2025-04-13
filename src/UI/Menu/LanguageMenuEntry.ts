/// <reference path="ButtonMenuEntry.ts" />
/// <reference path="../../Localization/ApplicationLanguage.ts" />
/// <reference path="../../Localization/LocalizationHelper.ts" />

class LanguageMenuEntry extends ButtonMenuEntry {
    public constructor(private language: ApplicationLanguage) {
        super(language.name, () => {
            LocalizationHelper.storeUserLocale(language.locale);
            window.location.reload();
        });
    }

    public build() {
        const button = super.build();

        button.lang = this.language.locale;

        return button;
    }
}