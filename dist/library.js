"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineWrappers = function combineWrappers(wrappers) {
  var wrapped = {};
  Object.keys(wrappers).forEach(function (key) {
    wrapped = (0, _extends4.default)((0, _defineProperty3.default)({}, key, wrappers[key].routes), wrapped);
  });
  return wrapped;
};

exports.default = combineWrappers;