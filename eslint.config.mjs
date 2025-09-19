import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // rules: {
    //   "@typescript-eslint/explicit-function-return-type": "error",
    //   "@typescript-eslint/explicit-module-boundary-types": "error",
    //   "@typescript-eslint/typedef": [
    //     "error",
    //     {
    //       arrayDestructuring: true,
    //       arrowParameter: true,
    //       memberVariableDeclaration: true,
    //       objectDestructuring: true,
    //       parameter: true,
    //       propertyDeclaration: true,
    //       variableDeclaration: true,
    //       variableDeclarationIgnoreFunction: false,
    //     },
    //   ],
    // },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
