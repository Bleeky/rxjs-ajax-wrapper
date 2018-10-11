"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CombineWrappers(wrappers) {
  var _this = this;

  var reqMdw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { reqMdw: null, reqMdwParams: null };
  var errMdw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { errMdw: null, errMdwParams: null };

  this.resources = {};
  this.wrappers = wrappers;
  this.requestMiddlewares = { middlewares: [], params: undefined };
  this.errorMiddlewares = { middlewares: [], params: undefined };
  Object.keys(this.wrappers).forEach(function (key) {
    if (reqMdw.reqMdw) {
      _this.requestMiddlewares = {
        middlewares: [].concat((0, _toConsumableArray3.default)(_this.requestMiddlewares.middlewares), (0, _toConsumableArray3.default)(reqMdw.reqMdw)),
        params: (0, _extends4.default)({}, _this.requestMiddlewares.params, reqMdw.reqMdwParams)
      };
      _this.wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      _this.errorMiddlewares = {
        middlewares: [].concat((0, _toConsumableArray3.default)(_this.errMiddlewares.middlewares), (0, _toConsumableArray3.default)(errMdw.errMdw)),
        params: (0, _extends4.default)({}, _this.errMiddlewares.params, errMdw.errMdwParams)
      };
      _this.wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    _this.resources = (0, _extends4.default)((0, _defineProperty3.default)({}, key, _this.wrappers[key].routes), _this.resources);
  });

  this.addWrappers = function (newWrappers) {
    _this.wrappers = [].concat((0, _toConsumableArray3.default)(_this.wrappers), (0, _toConsumableArray3.default)(newWrappers));
    if (_this.requestMiddlewares.middlewares && _this.requestMiddlewares.middlewares.length > 0) {
      Object.keys(_this.wrappers).forEach(function (key) {
        _this.wrappers[key].addRequestMiddlewares(_this.requestMiddlewares.middlewares, _this.requestMiddlewares.params);
      });
    }
    if (_this.errorMiddlewares.middlewares && _this.errorMiddlewares.middlewares.length > 0) {
      Object.keys(_this.wrappers).forEach(function (key) {
        _this.wrappers[key].addErrorMiddlewares(_this.errorMiddlewares.middlewares, _this.errorMiddlewares.params);
      });
    }
  };

  this.addRequestMiddlewares = function (middlewares, middlewareParams) {
    _this.requestMiddlewares = {
      middlewares: [].concat((0, _toConsumableArray3.default)(_this.requestMiddlewares.middlewares), (0, _toConsumableArray3.default)(middlewares)),
      params: (0, _extends4.default)({}, _this.requestMiddlewares.params, middlewareParams)
    };
    Object.keys(_this.wrappers).forEach(function (key) {
      _this.wrappers[key].addRequestMiddlewares(_this.requestMiddlewares.middlewares, _this.requestMiddlewares.params);
    });
  };

  this.addErrorMiddlewares = function (middlewares, middlewareParams) {
    _this.requestMiddlewares = {
      middlewares: [].concat((0, _toConsumableArray3.default)(_this.requestMiddlewares.middlewares), (0, _toConsumableArray3.default)(middlewares)),
      params: (0, _extends4.default)({}, _this.requestMiddlewares.params, middlewareParams)
    };
    Object.keys(_this.wrappers).forEach(function (key) {
      _this.wrappers[key].addErrorMiddlewares(_this.errorMiddlewares.middlewares, _this.errorMiddlewares.params);
    });
  };
}

exports.default = CombineWrappers;