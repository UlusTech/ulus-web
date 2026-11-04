export const languages = {
    tr: "Türkçe",
    en: "English",
};

export const defaultLang = "tr";

export const ui = {
    tr: {
        "nav.home": "Anasayfa",
        "nav.about": "Hakkımızda", // Might become `Hakkında` or `Açıklama`.
    },
    en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.twitter": "Twitter",
    },
} as const;

export const routes = {
    tr: {
        services: "servisler",
    },
    en: {
        services: "services",
    },
};
