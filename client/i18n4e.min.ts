/*!
 * I18n4e
 * (c) 2024 Pedro Luis Dias
 * Released under the MIT License.
 * https://github.com/luiisp/i18n4e
 */
import { i18n4e, routesNames } from "./config";
import { syncWithServer } from "./utils";

const i18n4e: i18n4e = {
    userLang: navigator.language,
    getLangs: async () => {
        try {
            const res = await fetch(routesNames.getLangs);
            if (res.status === 404) return console.error("i18n4e (404 not found) – You need to enable enableClient=true on your server");
            const data = await res.json();
            return data;
        } catch (err) {
            return console.error("i18n4e -> unexpected error", err);
        }
    },
    setLang: async (lang: string) => {
        return await syncWithServer("setLang", { lang });
    },
    unsetLang: async () => {
        return await syncWithServer("unsetLang", {});
    }
};

export default i18n4e;

