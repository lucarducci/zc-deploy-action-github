// Libs
const core = require("@actions/core");
const github = require("@actions/github");

// Init
var AWS = require("aws-sdk");
AWS.config.loadFromPath("./AWSManagerConfig.json");

// Properties
const appName = "zc-deploy-test";
const tagKeyColor = "color";
const tagKeyEvn = "env";
const envTarget = "stage";

const execute = async function () {
  const eb = new AWS.ElasticBeanstalk({ region: "us-east-1" });

  const envResponse = await eb.describeEnvironments().promise();

  for (let env of envResponse.Environments) {
    if (env.ApplicationName == appName) {
      console.log("Checking environment ", env.EnvironmentName);
      // Check tags
      let tags = await eb.listTagsForResource({ ResourceArn: env.EnvironmentArn }).promise();
      let green = false;
      let envType = envTarget ? false : true;
      for (let tag of tags.ResourceTags) {
        if (tag.Key == tagKeyColor && tag.Value == "green") {
          console.log("Is green");
          green = true;
        }
        if (tag.Key == tagKeyEvn && tag.Value == envTarget) {
          console.log("Is env " + envTarget);
          envType = true;
        }
      }

      // Execute
      if (green && envType) {
        console.log("Execute ", env);
        core.setOutput("sourceEnvName", env.EnvironmentName);
        const destEnvName = env.EnvironmentName + "_" + envTarget + "_" + new Date().getTime();
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
  execute();
  // `who-to-greet` input defined in action metadata file
  //   const nameToGreet = core.getInput("who-to-greet");
  //   console.log(`New test ${nameToGreet}!`);
  //   const time = new Date().toTimeString();
  //   core.setOutput("time", time);
  //   // Get the JSON webhook payload for the event that triggered the workflow
  //   const payload = JSON.stringify(github.context.payload, undefined, 2);
  //   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
