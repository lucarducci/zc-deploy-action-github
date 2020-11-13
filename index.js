// Libs
const core = require("@actions/core");
const github = require("@actions/github");
const action = require("./actions/dispatch.js");

try {
  let opt = {
    action: core.getInput("action"),
    envName: core.getInput("env-name"),
    appName: core.getInput("app-name"),
    tagKeyColor: core.getInput("tag-key-color"),
    tagKeyEnv: core.getInput("tag-key-env"),
    envTarget: core.getInput("env-target"),
    accessKeyId: core.getInput("aws-access-key-id"),
    secretAccessKey: core.getInput("aws-secret-access-key"),
    region: core.getInput("region"),
  };

  action.execute(opt);
} catch (error) {
  core.setFailed(error.message);
}

