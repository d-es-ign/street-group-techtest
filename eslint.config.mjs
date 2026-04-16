// @ts-check
import eslint from "@eslint/js";
import expo from "eslint-config-expo/flat.js";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const expoConfig = (Array.isArray(expo) ? expo : [expo]).map((config) => {
  if (!config.plugins?.["react-hooks"]) {
    return config;
  }

  const { "react-hooks": _reactHooks, ...plugins } = config.plugins;

  return {
    ...config,
    plugins,
  };
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  ...expoConfig,
  reactHooks.configs.flat["recommended-latest"],
  {
    ignores: [".expo/**", "coverage/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "sort-imports": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);
