const { execSync } = require("child_process");
const { rmSync, cpSync } = require("fs");

execSync("cd ../api && yarn sync:schema");

rmSync("./src/auto-generated/", { recursive: true });

cpSync("../schema/auto-generated/", "./src/auto-generated/", {
  recursive: true,
});

execSync("yarn static:fix");
