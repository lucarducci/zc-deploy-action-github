// Libs
const core = require("@actions/core");
const github = require("@actions/github");

// Init
var AWS = require("aws-sdk");
AWS.config.loadFromPath("./AWSManagerConfig.json");

const execute = async function (opt) {
  const eb = new AWS.ElasticBeanstalk({ region: "us-east-1" });

  const envResponse = await eb.describeEnvironments().promise();

  for (let env of envResponse.Environments) {
    if (env.ApplicationName == opt.appName) {
      console.log("Checking environment ", env.EnvironmentName);
      // Check tags
      let tags = await eb.listTagsForResource({ ResourceArn: env.EnvironmentArn }).promise();
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
        core.setOutput("sourceEnvName", env.EnvironmentName);
        const destEnvName = env.EnvironmentName + "_" + opt.envTarget + "_" + new Date().getTime();
        console.log("Dest env: " + destEnvName);
        core.setOutput("destEnvName", destEnvName);
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

try {
    let opt = {
      appName: core.getInput("appName"),
      tagKeyColor: core.getInput("tagKeyColor"),
      tagKeyEvn: core.getInput("tagKeyEvn"),
      envTarget: core.getInput("envTarget"),
    };
    execute(opt);
} catch (error) {
  core.setFailed(error.message);
}

exports.execute = execute;