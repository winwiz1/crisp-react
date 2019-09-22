const fs = require("fs");

// Verify SPA configuration options
function verifySpaParameters(parameters, index) {
  const params = parameters || {};

  function invalidParameter(paramName, missing) {
    throw new Error(
      `SPA#${index} configuration parameter '${paramName}' is ${missing ?
        "missing or has incorrect type" : "invalid"}`
    );
  }

  const ret = {
    name,
    entryPoint,
    redirect
  } = params;

  if (typeof ret.name !== "string") {
    invalidParameter("name", true);
  }

  if (!/^\w+$/.test(ret.name)) {
    invalidParameter("name", false);
  }

  if (typeof ret.entryPoint !== "string") {
    invalidParameter("entryPoint", true);
  }

  if (!fs.existsSync(ret.entryPoint)) {
    invalidParameter("entryPoint", false);
  }

  if (typeof ret.redirect !== "boolean") {
    invalidParameter("redirect", true);
  }

  return ret;
}

module.exports = verifySpaParameters;
