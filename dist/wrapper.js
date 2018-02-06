'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _ajax = require('rxjs/observable/dom/ajax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RxjsWrapper = function () {
  function RxjsWrapper(apiDefs) {
    (0, _classCallCheck3.default)(this, RxjsWrapper);

    this.apiDefs = apiDefs;
    this.routes = [];
    this.requestMiddlewares = [];
    this.errorMiddlewares = [];

    this.buildUrl = this.buildUrl.bind(this);
    this.defBuilder = this.defBuilder.bind(this);
    this.init = this.init.bind(this);

    this.init();
  }

  (0, _createClass3.default)(RxjsWrapper, [{
    key: 'buildUrl',
    value: function buildUrl(url, urlParams, queryParams) {
      // eslint-disable-line
      var finalUrl = url;
      Object.keys(urlParams).forEach(function (param) {
        finalUrl = finalUrl.replace(':' + param, urlParams[param]);
      });
      if (queryParams.constructor === Object && Object.keys(queryParams).length > 0) {
        finalUrl = finalUrl.concat('?', Object.keys(queryParams).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
        }).join('&'));
      } else if (queryParams.constructor === String) {
        finalUrl = finalUrl.concat('?', queryParams);
      }
      return finalUrl;
    }
  }, {
    key: 'defBuilder',
    value: function defBuilder(def, req) {
      var middlewaresArgs = {};
      this.requestMiddlewares.forEach(function (middleware) {
        if (!def.ignoreMiddlewares || !def.ignoreMiddlewares.find(function (ignore) {
          return ignore === middleware.name;
        })) {
          middlewaresArgs = (0, _extends4.default)({}, middlewaresArgs, middleware.handler());
        }
      });
      return (0, _extends4.default)({}, def, {
        url: this.buildUrl(def.url, req.urlParams, req.queryParams),
        responseType: def.responseType ? def.responseType : 'json',
        body: req.body
      }, middlewaresArgs);
    }
  }, {
    key: 'addRequestMiddlewares',
    value: function addRequestMiddlewares(middlewares) {
      var _this = this;

      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      middlewares.forEach(function (middleware) {
        _this.requestMiddlewares = [].concat((0, _toConsumableArray3.default)(_this.requestMiddlewares), [{ name: middleware.name, handler: function handler() {
            return middleware.handler.apply(middleware, params);
          } }]);
      });
    }
  }, {
    key: 'addErrorMiddlewares',
    value: function addErrorMiddlewares(middlewares) {
      var _this2 = this;

      for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      middlewares.forEach(function (middleware) {
        _this2.errorMiddlewares = [].concat((0, _toConsumableArray3.default)(_this2.errorMiddlewares), [{ name: middleware.name, handler: function handler(request) {
            return middleware.handler.apply(middleware, [request].concat(params));
          } }]);
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this3 = this;

      var routes = {};
      Object.keys(this.apiDefs).forEach(function (key) {
        routes = (0, _extends4.default)({}, routes, (0, _defineProperty3.default)({}, '' + key, function undefined() {
          var reqSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { urlParams: {}, body: null, queryParams: {} };

          var req = (0, _ajax.ajax)(_this3.defBuilder(_this3.apiDefs[key], reqSettings));
          req.subscribe(null, function (err) {
            _this3.errorMiddlewares.forEach(function (middleware) {
              if (!_this3.apiDefs[key].ignoreMiddlewares || !_this3.apiDefs[key].ignoreMiddlewares.find(function (ignore) {
                return ignore === middleware.name;
              })) {
                middleware.handler(err);
              }
            });
          });
          return req;
        }));
      });
      this.routes = routes;
    }
  }]);
  return RxjsWrapper;
}();

exports.default = RxjsWrapper;