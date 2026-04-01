const common = `
  --require-module ts-node/register
  --require  setup/world.ts
  --require setup/hooks.ts
  --require step-definitions/**/*.ts
  --format progress                 
  `;

module.exports = {
  default: common
};