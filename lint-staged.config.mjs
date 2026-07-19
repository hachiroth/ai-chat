/** @type {import('lint-staged').Configuration} */
export default {
  "**/*.{js,mjs,jsx,tsx,ts,mts,tsx,vue}": () => "npm run lint",
  "*": () => "npm run format",
};
