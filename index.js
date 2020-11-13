// Libs
const core = require("@actions/core");
const github = require("@actions/github");
const action = require("./action.js");

try {
  let opt = {
    appName: core.getInput("app-name"),
    tagKeyColor: core.getInput("tag-key-color"),
    tagKeyEvn: core.getInput("tag-key-evn"),
    envTarget: core.getInput("env-target"),
    accessKeyId: core.getInput("aws-access-key-id"),
    secretAccessKey: core.getInput("aws-secret-access-key"),
    region: core.getInput("region"),
  };
  action.execute(opt);
} catch (error) {
  core.setFailed(error.message);
}

