const { execSync } = require("child_process");
execSync("cd ../api && yarn sync:schema");
execSync("cp -r ../schema/auto-generated/ ./src/auto-generated/");
execSync("yarn static:fix");
