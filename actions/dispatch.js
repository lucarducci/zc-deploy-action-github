// Libs
const findEnv = require("./action-find.js");
const wait = require("./action-wait.js");

const execute = async function (opt) {
  if (opt.action == "findEnv") {
    findEnv.execute(opt);
  } else if (opt.action == "wait") {
    wait.execute(opt);
  } else {
    console.error("Action not valid");
  }
};

exports.execute = execute;
