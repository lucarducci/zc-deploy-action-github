const action = require("./actions/dispatch.js");

// Test findEnv
let opt = {
  action: "findEnv",
  appName: "zc-deploy-test",
  tagKeyColor: "color",
  tagKeyEnv: "env",
  envTarget: "stage",
  region: "us-east-1",
};

// Test wait
let opt2 = {
  action: "wait",
  envName: "zc-deploy-test-env-stage-1605298760861",
  region: "us-east-1",
};

action.execute(opt2);
