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
  const eb = new AWS.ElasticBeanstalk({ region: opt.region });

  // Get envs
  const envResponse = await eb.describeEnvironments().promise();
  let envFound;

  for (let env of envResponse.Environments) {
    let green = false;
    let envType = opt.envTarget ? false : true;
    if (env.ApplicationName == opt.appName) {
      console.log("Checking environment ", env.EnvironmentName);
      try {
        // Get tags
        let tags = await eb.listTagsForResource({ ResourceArn: env.EnvironmentArn }).promise();

        // Check tags
        for (let tag of tags.ResourceTags) {
          if (tag.Key == opt.tagKeyColor && tag.Value == "green") {
            console.log("Is green");
            green = true;
          }
          if (tag.Key == opt.tagKeyEnv && tag.Value == opt.envTarget) {
            console.log("Is env " + opt.envTarget);
            envType = true;
          }
        }
      } catch (e) {}
    }

    // Execute
    if (green && envType) {
      envFound = env;
    }
  }

  if (envFound) {
    console.log("Execute ", envFound);
    core.setOutput("source-env-name", envFound.EnvironmentName);
    const destEnvName = envFound.EnvironmentName + "-" + opt.envTarget + "-" + new Date().getTime();
    console.log("Dest env: " + destEnvName);
    core.setOutput("dest-env-name", destEnvName);
    // Clone env

    // Update new environment
    // Test healthCheck
    // Swap URLs
    // Update tags
    // Delete old environment
  } else {
    console.log(
      "No env found with tags: " +
        opt.tagKeyColor +
        " = 'green'" +
        (opt.envTarget ? " and " + opt.tagKeyEnv + " = " + opt.envTarget : "")
    );
  }
};

exports.execute = execute;
