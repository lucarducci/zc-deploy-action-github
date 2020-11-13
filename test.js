const index = require("./index.js");

let opt = {
  appName: "zc-deploy-test",
  tagKeyColor: "color",
  tagKeyEvn: "env",
  envTarget: "stage",
};
index.execute(opt);
