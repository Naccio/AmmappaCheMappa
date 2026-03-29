/// <reference path="ButtonMenuEntry.ts" />
/// <reference path="../../Localization/ApplicationLanguage.ts" />
/// <reference path="../../Model/ApplicationState.ts" />

class LanguageMenuEntry extends ButtonMenuEntry {
    public constructor(state: ApplicationState, private language: ApplicationLanguage) {
        super(language.name, () => {
            state.locale = language.locale;
            window.location.reload();
        });
    }

    public build() {
        const button = super.build();

        button.lang = this.language.locale;

        return button;
    }
}