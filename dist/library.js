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
  var reqMdw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { reqMdw: null, reqMdwParams: null };
  var errMdw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { errMdw: null, errMdwParams: null };

  var wrapped = {};
  Object.keys(wrappers).forEach(function (key) {
    if (reqMdw.reqMdw) {
      wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    wrapped = (0, _extends4.default)((0, _defineProperty3.default)({}, key, wrappers[key].routes), wrapped);
  });
  return wrapped;
};

exports.default = combineWrappers;