import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "public/**"],
  },
  {
    // ponytail: eslint-config-next 16 ships two new React Compiler-era rules
    // as hard errors. Downgraded to warn rather than rewritten under this
    // "add eslint" task — both flag existing, working code rather than bugs:
    //   - immutability: three.js requires mutating curve/texture properties
    //     in place (Lanyard.tsx); that's the library's documented API.
    //   - set-state-in-effect: flags idiomatic hydration-safe reads and
    //     loading-gate effects used throughout. Real fixes (lazy state init,
    //     useSyncExternalStore) belong to the phase that touches each file,
    //     not a blind rewrite here.
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
