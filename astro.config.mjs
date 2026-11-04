// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    i18n: {
        defaultLocale: "tr",
        locales: ["en", "tr"],
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
