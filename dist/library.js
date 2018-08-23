"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CombineWrappers(wrappers) {
  var _this = this;

  var reqMdw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { reqMdw: null, reqMdwParams: null };
  var errMdw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { errMdw: null, errMdwParams: null };

  this.resources = {};
  this.wrappers = wrappers;
  Object.keys(this.wrappers).forEach(function (key) {
    if (reqMdw.reqMdw) {
      _this.wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      _this.wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    _this.resources = (0, _extends4.default)((0, _defineProperty3.default)({}, key, _this.wrappers[key].routes), _this.resources);
  });

  this.addRequestMiddlewares = function (middlewares, middlewareParams) {
    Object.keys(_this.wrappers).forEach(function (key) {
      _this.wrappers[key].addRequestMiddlewares(middlewares, middlewareParams);
    });
  };

  this.addErrorMiddlewares = function (middlewares, middlewareParams) {
    Object.keys(_this.wrappers).forEach(function (key) {
      _this.wrappers[key].addErrorMiddlewares(middlewares, middlewareParams);
    });
  };
}

exports.default = CombineWrappers;