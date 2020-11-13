const action = require("./action.js");

let opt = {
  appName: "zc-deploy-test",
  tagKeyColor: "color",
  tagKeyEnv: "env",
  envTarget: "stage",
  region: "us-east-1",
};
action.execute(opt);
