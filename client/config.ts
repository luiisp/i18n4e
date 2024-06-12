export const i18n4eMainRouteName = "/i18n4e/client/d/main";
export const routesNames = {
    "getLangs": i18n4eMainRouteName + "/get-langs",
    "setLang": i18n4eMainRouteName + "/set-lang",
    "unsetLang": i18n4eMainRouteName + "/unset-lang",
}
type SyncType = 'setLang' | 'unsetLang';
export const syncWithServerTypes: Record<SyncType, { path: string; method: string; }> = {
    "setLang": { path: routesNames.setLang, method: "POST" },
    "unsetLang": { path: routesNames.unsetLang, method: "GET" },
};

export type i18n4e = {
    userLang: string;
    getLangs: () => Promise<any>;
    setLang: (lang: string) => void;
    unsetLang: () => void;
};

