import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/components/*",
                "@/features/*/hooks/*",
                "@/features/*/services/*",
                "@/features/*/cache/*",
                "@/features/*/types/*",
                "@/features/*/*/*",
              ],
              message:
                "Import from the feature root (for example, '@/features/search') instead of deep-linking into feature internals.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
