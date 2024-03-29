// Libs

const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const execute = async function (opt) {
  // Set credentials
  if (!fs.existsSync("./AWSManagerConfig.json")) {
    let config = {
      accessKeyId: opt.accessKeyId,
      secretAccessKey: opt.secretAccessKey,
      region: opt.region,
    };
    fs.writeFileSync("./AWSManagerConfig.json", JSON.stringify(config));
  }

  // Init
  var AWS = require("aws-sdk");
  AWS.config.loadFromPath("./AWSManagerConfig.json");
  const eb = new AWS.ElasticBeanstalk({ region: opt.region.toString() });

  // Wait
  await check(eb, opt.envName);
};

const check = async function (eb, envName) {
  let env = await eb.describeEnvironments({ EnvironmentNames: [envName] }).promise();
  core.setOutput("tested-env", env.Environments[0]);
  core.setOutput("tested-env-url", "https://" + env.Environments[0].CNAME);
  if (env.Environments[0].Status != "Ready") {
    console.log("Environment Status is " + env.Environments[0].Status);
    await sleep(30000);
    await check(eb, envName);
  } else {
    console.log("Environment Status is Ready");
  }
};

const sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.execute = execute;
