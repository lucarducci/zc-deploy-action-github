// Libs

const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const execute = async function (opt) {
  console.log(opt);

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
  const eb = new AWS.ElasticBeanstalk({ region: "us-east-1" });

  // Get envs
  const envResponse = await eb.describeEnvironments().promise();

  for (let env of envResponse.Environments) {
    if (env.ApplicationName == opt.appName) {
      console.log("Checking environment ", env.EnvironmentName);
      // Get tags
      let tags = await eb.listTagsForResource({ ResourceArn: env.EnvironmentArn }).promise();

      // Check tags
      let green = false;
      let envType = opt.envTarget ? false : true;
      for (let tag of tags.ResourceTags) {
        if (tag.Key == opt.tagKeyColor && tag.Value == "green") {
          console.log("Is green");
          green = true;
        }
        if (tag.Key == opt.tagKeyEvn && tag.Value == opt.envTarget) {
          console.log("Is env " + opt.envTarget);
          envType = true;
        }
      }

      // Execute
      if (green && envType) {
        console.log("Execute ", env);
        core.setOutput("source-env-name", env.EnvironmentName);
        const destEnvName = env.EnvironmentName + "_" + opt.envTarget + "_" + new Date().getTime();
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
          "No env found with tags: " + tagKeyColor + " = 'green'" + (envTarget ? " and " + tagKeyEvn + " = " + envTarget : "")
        );
      }
    }
  }
};

exports.execute = execute;
