import { ApplicationLanguage } from "./ApplicationLanguage";

export class LocalizationHelper {
    public static readonly languages: ApplicationLanguage[] = [{
        locale: "en",
        name: "English"
    }, {
        locale: "it",
        name: "Italiano"
    }];
}