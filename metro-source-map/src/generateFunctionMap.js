/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 *
 */
"use strict";

var _traverse = _interopRequireDefault(require("@babel/traverse"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

const B64Builder = require("./B64Builder");

const fsPath = require("path");

const t = require("@babel/types");

/**
 * Generate a map of source positions to function names. The names are meant to
 * describe the stack frame in an error trace and may contain more contextual
 * information than just the actual name of the function.
 *
 * The output is encoded for use in a source map. For details about the format,
 * see MappingEncoder below.
 */
function generateFunctionMap(ast, context) {
  const encoder = new MappingEncoder();
  forEachMapping(ast, context, mapping => encoder.push(mapping));
  return encoder.getResult();
}
/**
 * Same as generateFunctionMap, but returns the raw array of mappings instead
 * of encoding it for use in a source map.
 *
 * Lines are 1-based and columns are 0-based.
 */

function generateFunctionMappingsArray(ast, context) {
  const mappings = [];
  forEachMapping(ast, context, mapping => {
    mappings.push(mapping);
  });
  return mappings;
}
/**
 * Traverses a Babel AST and calls the supplied callback with function name
 * mappings, one at a time.
 */

function forEachMapping(ast, context, pushMapping) {
  const nameStack = [];
  let tailPos = {
    line: 1,
    column: 0
  };
  let tailName = null;

  function advanceToPos(pos) {
    if (tailPos && positionGreater(pos, tailPos)) {
      const name = nameStack[0].name; // We always have at least Program

      if (name !== tailName) {
        pushMapping({
          name,
          start: {
            line: tailPos.line,
            column: tailPos.column
          }
        });
        tailName = name;
      }
    }

    tailPos = pos;
  }

  function pushFrame(name, loc) {
    advanceToPos(loc.start);
    nameStack.unshift({
      name,
      loc
    });
  }

  function popFrame() {
    const top = nameStack[0];

    if (top) {
      const loc = top.loc;
      advanceToPos(loc.end);
      nameStack.shift();
    }
  }

  if (!context) {
    context = {};
  }

  const basename = context.filename
    ? fsPath.basename(context.filename).replace(/\..+$/, "")
    : null;
  (0, _traverse.default)(ast, {
    "Function|Program": {
      enter(path) {
        let name = getNameForPath(path);

        if (basename) {
          name = removeNamePrefix(name, basename);
        }

        pushFrame(name, path.node.loc);
      },

      exit(path) {
        popFrame();
      }
    }
  });
}

const ANONYMOUS_NAME = "<anonymous>";
const CALLEES_TO_SKIP = ["Object.freeze"];
/**
 * Derive a contextual name for the given AST node (Function, Program, Class or
 * ObjectExpression).
 */

function getNameForPath(path) {
  const node = path.node,
    parent = path.parent,
    parentPath = path.parentPath;

  if (t.isProgram(node)) {
    return "<global>";
  }

  let id = path.id; // has an `id` so we don't need to infer one

  if (node.id) {
    return node.id.name;
  }

  let propertyPath;
  let kind = "";

  if (t.isObjectMethod(node) || t.isClassMethod(node)) {
    id = node.key;

    if (node.kind !== "method" && node.kind !== "constructor") {
      kind = node.kind;
    }

    propertyPath = path;
  } else if (t.isObjectProperty(parent) || t.isClassProperty(parent)) {
    // { foo() {} };
    id = parent.key;
    propertyPath = parentPath;
  } else if (t.isVariableDeclarator(parent)) {
    // let foo = function () {};
    id = parent.id;
  } else if (t.isAssignmentExpression(parent)) {
    // foo = function () {};
    id = parent.left;
  } else if (t.isJSXExpressionContainer(parent)) {
    if (t.isJSXElement(parentPath.parentPath.node)) {
      // <foo>{function () {}}</foo>
      const openingElement = parentPath.parentPath.node.openingElement;
      id = t.JSXMemberExpression(
        t.JSXMemberExpression(openingElement.name, t.JSXIdentifier("props")),
        t.JSXIdentifier("children")
      );
    } else if (t.isJSXAttribute(parentPath.parentPath.node)) {
      // <foo bar={function () {}} />
      const openingElement = parentPath.parentPath.parentPath.node;
      const prop = parentPath.parentPath.node;
      id = t.JSXMemberExpression(
        t.JSXMemberExpression(openingElement.name, t.JSXIdentifier("props")),
        prop.name
      );
    }
  }

  let name = getNameFromId(id);

  if (name == null) {
    if (t.isCallExpression(parent) || t.isNewExpression(parent)) {
      // foo(function () {})
      const argIndex = parent.arguments.indexOf(node);

      if (argIndex !== -1) {
        const calleeName = getNameFromId(parent.callee); // var f = Object.freeze(function () {})

        if (CALLEES_TO_SKIP.indexOf(calleeName) !== -1) {
          return getNameForPath(parentPath);
        }

        if (calleeName) {
          return `${calleeName}$argument_${argIndex}`;
        }
      }
    }

    return ANONYMOUS_NAME;
  }

  if (kind) {
    name = kind + "__" + name;
  }

  if (propertyPath) {
    if (t.isClassBody(propertyPath.parent)) {
      const className = getNameForPath(propertyPath.parentPath.parentPath);

      if (className !== ANONYMOUS_NAME) {
        const separator = propertyPath.node.static ? "." : "#";
        name = className + separator + name;
      }
    } else if (t.isObjectExpression(propertyPath.parent)) {
      const objectName = getNameForPath(propertyPath.parentPath);

      if (objectName !== ANONYMOUS_NAME) {
        name = objectName + "." + name;
      }
    }
  }

  return name;
}

function isAnyMemberExpression(node) {
  return t.isMemberExpression(node) || t.isJSXMemberExpression(node);
}

function isAnyIdentifier(node) {
  return t.isIdentifier(node) || t.isJSXIdentifier(node);
}

function getNameFromId(id) {
  const parts = getNamePartsFromId(id);

  if (!parts.length) {
    return null;
  }

  if (parts.length > 5) {
    return (
      parts[0] +
      "." +
      parts[1] +
      "..." +
      parts[parts.length - 2] +
      "." +
      parts[parts.length - 1]
    );
  }

  return parts.join(".");
}

function getNamePartsFromId(id) {
  if (!id) {
    return [];
  }

  if (t.isCallExpression(id) || t.isNewExpression(id)) {
    return getNamePartsFromId(id.callee);
  }

  if (t.isTypeCastExpression(id)) {
    return getNamePartsFromId(id.expression);
  }

  let name;

  if (isAnyIdentifier(id)) {
    name = id.name;
  } else if (t.isNullLiteral(id)) {
    name = "null";
  } else if (t.isRegExpLiteral(id)) {
    name = `_${id.pattern}_${id.flags}`;
  } else if (t.isTemplateLiteral(id)) {
    name = id.quasis.map(quasi => quasi.value.raw).join("");
  } else if (t.isLiteral(id) && id.value != null) {
    name = id.value + "";
  }

  if (name != null) {
    return [t.toBindingIdentifierName(name)];
  }

  if (t.isImport(id)) {
    name = "import";
  }

  if (name != null) {
    return [name];
  }

  if (isAnyMemberExpression(id)) {
    if (
      isAnyIdentifier(id.object) &&
      id.object.name === "Symbol" &&
      (isAnyIdentifier(id.property) || t.isLiteral(id.property))
    ) {
      const propertyName = getNameFromId(id.property);

      if (propertyName) {
        name = "@@" + propertyName;
      }
    } else {
      const propertyName = getNamePartsFromId(id.property);

      if (propertyName.length) {
        const objectName = getNamePartsFromId(id.object);

        if (objectName.length) {
          return _toConsumableArray(objectName).concat(
            _toConsumableArray(propertyName)
          );
        } else {
          return propertyName;
        }
      }
    }
  }

  return name ? [name] : [];
}

const DELIMITER_START_RE = /^[^A-Za-z0-9_$@]+/;
/**
 * Strip the given prefix from `name`, if it occurs there, plus any delimiter
 * characters that follow (of which at least one is required). If an empty
 * string would be returned, return the original name instead.
 */

function removeNamePrefix(name, namePrefix) {
  if (!namePrefix.length || !name.startsWith(namePrefix)) {
    return name;
  }

  const shortenedName = name.substr(namePrefix.length);

  const _ref = shortenedName.match(DELIMITER_START_RE) || [],
    _ref2 = _slicedToArray(_ref, 1),
    delimiterMatch = _ref2[0];

  if (delimiterMatch) {
    return shortenedName.substr(delimiterMatch.length) || name;
  }

  return name;
}
/**
 * Encodes function name mappings as deltas in a Base64 VLQ format inspired by
 * the standard source map format.
 *
 * Mappings on different lines are separated with a single `;` (even if there
 * are multiple intervening lines).
 * Mappings on the same line are separated with `,`.
 *
 * The first mapping of a line has the fields:
 *  [column delta, name delta, line delta]
 *
 * where the column delta is relative to the beginning of the line, the name
 * delta is relative to the previously occurring name, and the line delta is
 * relative to the previously occurring line.
 *
 * The 2...nth other mappings of a line have the fields:
 *  [column delta, name delta]
 *
 * where both fields are relative to their previous running values. The line
 * delta is omitted since it is always 0 by definition.
 *
 * Lines and columns are both 0-based in the serialised format. In memory,
 * lines are 1-based while columns are 0-based.
 */

class MappingEncoder {
  constructor() {
    this._namesMap = new Map();
    this._names = [];
    this._line = new RelativeValue(1);
    this._column = new RelativeValue(0);
    this._nameIndex = new RelativeValue(0);
    this._mappings = new B64Builder();
  }

  getResult() {
    return {
      names: this._names,
      mappings: this._mappings.toString()
    };
  }

  push(_ref3) {
    let name = _ref3.name,
      start = _ref3.start;

    let nameIndex = this._namesMap.get(name);

    if (typeof nameIndex !== "number") {
      nameIndex = this._names.length;
      this._names[nameIndex] = name;

      this._namesMap.set(name, nameIndex);
    }

    const lineDelta = this._line.next(start.line);

    const firstOfLine = this._mappings.pos === 0 || lineDelta > 0;

    if (lineDelta > 0) {
      // The next entry will have the line offset, so emit just one semicolon.
      this._mappings.markLines(1);

      this._column.reset(0);
    }

    this._mappings.startSegment(this._column.next(start.column));

    this._mappings.append(this._nameIndex.next(nameIndex));

    if (firstOfLine) {
      this._mappings.append(lineDelta);
    }
  }
}

class RelativeValue {
  constructor() {
    let value =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    this.reset(value);
  }

  next(absoluteValue) {
    const delta = absoluteValue - this._value;
    this._value = absoluteValue;
    return delta;
  }

  reset() {
    let value =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    this._value = value;
  }
}

function positionGreater(x, y) {
  return x.line > y.line || (x.line === y.line && x.column > y.column);
}

module.exports = {
  generateFunctionMap,
  generateFunctionMappingsArray
};
