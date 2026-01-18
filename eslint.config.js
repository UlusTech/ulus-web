import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";

export default [
  // Ignore patterns
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },

  // Base config for JS/TS files
  {
    files: ["**/*.js", "**/*.ts", "**/*.mjs"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      // Recommended: Warn on unused variables (not error)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Config for Astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsparser,
        extraFileExtensions: [".astro"],
      },
    },
    plugins: {
      astro: astroPlugin,
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,

      // Recommended: Warn on unused variables (not error)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
