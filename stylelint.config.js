/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    // BEM naming: allow block__element and block--modifier.
    "selector-class-pattern": null,
    // Design tokens are grouped together; formatting is Prettier's job, so
    // don't force a blank line before each.
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null,
    "rule-empty-line-before": null,
    "comment-empty-line-before": null,
    // Allow non-standard visual properties like -webkit-font-smoothing.
    "property-no-vendor-prefix": null,
    // hover/active rule order is intentional; don't enforce descending specificity.
    "no-descending-specificity": null,
    // Whether to quote font names is the author's call; don't enforce.
    "font-family-name-quotes": null,
    // @property is standard (Chrome 85+); older stylelint may not know it.
    "at-rule-no-unknown": [true, { ignoreAtRules: ["property"] }],
  },
};
