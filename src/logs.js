const colors = require("colors")

function success(msg) {
    console.log("[" + colors.green("SUCCESS") + "]" + " " + msg)
}

module.exports.success = success