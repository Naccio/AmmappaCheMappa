import { ApplicationLanguage } from "../../Engine/Localization/ApplicationLanguage";
import { ApplicationState } from "../../Model/ApplicationState";
import { ButtonMenuEntry } from "./ButtonMenuEntry";

export class LanguageMenuEntry extends ButtonMenuEntry {
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