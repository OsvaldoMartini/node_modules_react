"use strict";

exports.__esModule = true;
exports.validateModulesOption = exports.validateLooseOption = exports.getTargets = exports.electronVersionToChromeVersion = exports.getCurrentNodeVersion = exports.isPluginRequired = exports.validIncludesAndExcludes = exports.MODULE_TRANSFORMATIONS = undefined;
exports.validatePluginsOption = validatePluginsOption;
exports.checkDuplicateIncludeExcludes = checkDuplicateIncludeExcludes;
exports.default = buildPreset;

var _plugins = require("../data/plugins.json");

var _plugins2 = _interopRequireDefault(_plugins);

var _pluginFeatures = require("../data/plugin-features");

var _pluginFeatures2 = _interopRequireDefault(_pluginFeatures);

var _builtIns = require("../data/built-ins.json");

var _builtIns2 = _interopRequireDefault(_builtIns);

var _browserslist = require("browserslist");

var _browserslist2 = _interopRequireDefault(_browserslist);

var _transformPolyfillRequirePlugin = require("./transform-polyfill-require-plugin");

var _transformPolyfillRequirePlugin2 = _interopRequireDefault(_transformPolyfillRequirePlugin);

var _electronToChromium = require("../data/electron-to-chromium");

var _electronToChromium2 = _interopRequireDefault(_electronToChromium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODULE_TRANSFORMATIONS = exports.MODULE_TRANSFORMATIONS = {
  "amd": "transform-es2015-modules-amd",
  "commonjs": "transform-es2015-modules-commonjs",
  "systemjs": "transform-es2015-modules-systemjs",
  "umd": "transform-es2015-modules-umd"
};

var defaultInclude = ["web.timers", "web.immediate", "web.dom.iterable"];

var validIncludesAndExcludes = exports.validIncludesAndExcludes = [].concat(Object.keys(_pluginFeatures2.default), Object.keys(MODULE_TRANSFORMATIONS).map(function (m) {
  return MODULE_TRANSFORMATIONS[m];
}), Object.keys(_builtIns2.default), defaultInclude);

/**
 * Determine if a transformation is required
 * @param  {Object}  supportedEnvironments  An Object containing environment keys and the lowest
 *                                          supported version as a value
 * @param  {Object}  plugin                 An Object containing environment keys and the lowest
 *                                          version the feature was implmented in as a value
 * @return {Boolean}  Whether or not the transformation is required
 */
var isPluginRequired = exports.isPluginRequired = function isPluginRequired(supportedEnvironments, plugin) {
  if (supportedEnvironments.browsers) {
    supportedEnvironments = getTargets(supportedEnvironments);
  }

  var targetEnvironments = Object.keys(supportedEnvironments);

  if (targetEnvironments.length === 0) {
    return true;
  }

  var isRequiredForEnvironments = targetEnvironments.filter(function (environment) {
    // Feature is not implemented in that environment
    if (!plugin[environment]) {
      return true;
    }

    var lowestImplementedVersion = plugin[environment];
    var lowestTargetedVersion = supportedEnvironments[environment];

    if (lowestTargetedVersion < lowestImplementedVersion) {
      return true;
    }

    return false;
  });

  return isRequiredForEnvironments.length > 0 ? true : false;
};

var isBrowsersQueryValid = function isBrowsersQueryValid(browsers) {
  return typeof browsers === "string" || Array.isArray(browsers);
};

var browserNameMap = {
  chrome: "chrome",
  edge: "edge",
  firefox: "firefox",
  ie: "ie",
  ios_saf: "ios",
  safari: "safari"
};

var getLowestVersions = function getLowestVersions(browsers) {
  return browsers.reduce(function (all, browser) {
    var _browser$split = browser.split(" "),
        browserName = _browser$split[0],
        browserVersion = _browser$split[1];

    if (browserName in browserNameMap) {
      all[browserNameMap[browserName]] = parseInt(browserVersion);
    }
    return all;
  }, {});
};

var mergeBrowsers = function mergeBrowsers(fromQuery, fromTarget) {
  return Object.keys(fromTarget).reduce(function (queryObj, targKey) {
    if (targKey !== "browsers") {
      queryObj[targKey] = fromTarget[targKey];
    }
    return queryObj;
  }, fromQuery);
};

var getCurrentNodeVersion = exports.getCurrentNodeVersion = function getCurrentNodeVersion() {
  return parseFloat(process.versions.node);
};

var electronVersionToChromeVersion = exports.electronVersionToChromeVersion = function electronVersionToChromeVersion(semverVer) {
  semverVer = String(semverVer);

  if (semverVer === "1") {
    semverVer = "1.0";
  }

  var m = semverVer.match(/^(\d+\.\d+)/);
  if (!m) {
    throw new Error("Electron version must be a semver version");
  }

  var result = _electronToChromium2.default[m[1]];
  if (!result) {
    throw new Error("Electron version " + m[1] + " is either too old or too new");
  }

  return result;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var getTargets = exports.getTargets = function getTargets() {
  var targets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var targetOps = _extends({}, targets);

  if (targetOps.node === true || targetOps.node === "current") {
    targetOps.node = getCurrentNodeVersion();
  }

  // Rewrite Electron versions to their Chrome equivalents
  if (targetOps.electron) {
    targetOps.chrome = electronVersionToChromeVersion(targetOps.electron);
    delete targetOps.electron;
  }

  var browserOpts = targetOps.browsers;
  if (isBrowsersQueryValid(browserOpts)) {
    var queryBrowsers = getLowestVersions((0, _browserslist2.default)(browserOpts));
    return mergeBrowsers(queryBrowsers, targetOps);
  }
  return targetOps;
};

// TODO: Allow specifying plugins as either shortened or full name
// babel-plugin-transform-es2015-classes
// transform-es2015-classes
var validateLooseOption = exports.validateLooseOption = function validateLooseOption() {
  var looseOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (typeof looseOpt !== "boolean") {
    throw new Error("Preset env: 'loose' option must be a boolean.");
  }

  return looseOpt;
};

var validateModulesOption = exports.validateModulesOption = function validateModulesOption() {
  var modulesOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "commonjs";

  if (modulesOpt !== false && Object.keys(MODULE_TRANSFORMATIONS).indexOf(modulesOpt) === -1) {
    throw new Error("The 'modules' option must be 'false' to indicate no modules\n" + "or a module type which be be one of: 'commonjs' (default), 'amd', 'umd', 'systemjs'");
  }

  return modulesOpt;
};

function validatePluginsOption() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var type = arguments[1];

  if (!Array.isArray(opts)) {
    throw new Error("The '" + type + "' option must be an Array<string> of plugins/built-ins");
  }

  var unknownOpts = [];
  opts.forEach(function (opt) {
    if (validIncludesAndExcludes.indexOf(opt) === -1) {
      unknownOpts.push(opt);
    }
  });

  if (unknownOpts.length > 0) {
    throw new Error("Invalid plugins/built-ins '" + unknownOpts + "' passed to '" + type + "' option.\n      Check data/[plugin-features|built-in-features].js in babel-preset-env");
  }

  return {
    all: opts,
    plugins: opts.filter(function (opt) {
      return !opt.match(/^(es\d+|web)\./);
    }),
    builtIns: opts.filter(function (opt) {
      return opt.match(/^(es\d+|web)\./);
    })
  };
}

var validateIncludeOption = function validateIncludeOption(opts) {
  return validatePluginsOption(opts, "include");
};
var validateExcludeOption = function validateExcludeOption(opts) {
  return validatePluginsOption(opts, "exclude");
};

function checkDuplicateIncludeExcludes(include, exclude) {
  var duplicates = [];
  include.forEach(function (opt) {
    if (exclude.indexOf(opt) >= 0) {
      duplicates.push(opt);
    }
  });

  if (duplicates.length > 0) {
    throw new Error("Duplicate plugins/built-ins: '" + duplicates + "' found\n      in both the \"include\" and \"exclude\" options.");
  }
}

var hasBeenLogged = false;
var hasBeenWarned = false;

var logPlugin = function logPlugin(plugin, targets, list) {
  var envList = list[plugin] || {};
  var filteredList = Object.keys(targets).reduce(function (a, b) {
    a[b] = envList[b];
    return a;
  }, {});
  var logStr = "\n " + plugin + " " + JSON.stringify(filteredList);
  console.log(logStr);
};

function buildPreset(context) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var loose = validateLooseOption(opts.loose);
  var moduleType = validateModulesOption(opts.modules);
  // TODO: remove whitelist in favor of include in next major
  if (opts.whitelist && !hasBeenWarned) {
    hasBeenWarned = true;
    console.warn("The \"whitelist\" option has been deprecated\n    in favor of \"include\" to match the newly added \"exclude\" option (instead of \"blacklist\").");
  }
  var include = validateIncludeOption(opts.whitelist || opts.include);
  var exclude = validateExcludeOption(opts.exclude);
  checkDuplicateIncludeExcludes(include.all, exclude.all);
  var targets = getTargets(opts.targets);
  var debug = opts.debug;
  var useBuiltIns = opts.useBuiltIns;

  var transformations = Object.keys(_plugins2.default).filter(function (pluginName) {
    return isPluginRequired(targets, _plugins2.default[pluginName]);
  });

  var polyfills = void 0;
  if (useBuiltIns) {
    polyfills = Object.keys(_builtIns2.default).filter(function (builtInName) {
      return isPluginRequired(targets, _builtIns2.default[builtInName]);
    }).concat(defaultInclude).filter(function (plugin) {
      return exclude.builtIns.indexOf(plugin) === -1;
    }).concat(include.builtIns);
  }

  if (debug && !hasBeenLogged) {
    hasBeenLogged = true;
    console.log("babel-preset-env: `DEBUG` option");
    console.log("");
    console.log("Using targets: " + JSON.stringify(opts.targets, null, 2));
    console.log("");
    console.log("modules transform: " + moduleType);
    console.log("");
    console.log("Using plugins:");
    transformations.forEach(function (transform) {
      logPlugin(transform, opts.targets, _plugins2.default);
    });
    console.log("\nUsing polyfills:");
    if (useBuiltIns && polyfills.length) {
      polyfills.forEach(function (polyfill) {
        logPlugin(polyfill, opts.targets, _builtIns2.default);
      });
    }
  }

  var allTransformations = transformations.filter(function (plugin) {
    return exclude.plugins.indexOf(plugin) === -1;
  }).concat(include.plugins);

  var regenerator = allTransformations.indexOf("transform-regenerator") >= 0;
  var modulePlugin = moduleType !== false && MODULE_TRANSFORMATIONS[moduleType];
  var plugins = [];

  modulePlugin && plugins.push([require("babel-plugin-" + modulePlugin), { loose: loose }]);

  plugins.push.apply(plugins, allTransformations.map(function (pluginName) {
    return [require("babel-plugin-" + pluginName), { loose: loose }];
  }));

  useBuiltIns && plugins.push([_transformPolyfillRequirePlugin2.default, { polyfills: polyfills, regenerator: regenerator }]);

  return {
    plugins: plugins
  };
}