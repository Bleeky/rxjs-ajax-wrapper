'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _rxjs = require('rxjs');

var _ajax = require('rxjs/observable/dom/ajax');

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

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
    value: function buildUrl(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var finalUrl = url;
      Object.keys(params).forEach(function (param) {
        finalUrl = finalUrl.replace(':' + param, params[param]);
      });
      if (query.constructor === Object && Object.keys(query).length > 0) {
        finalUrl = finalUrl.concat('?', Object.keys(query).filter(function (key) {
          return query[key];
        }).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
        }).join('&'));
      } else if (query.constructor === String) {
        finalUrl = finalUrl.concat('?', query);
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
          middlewaresArgs = (0, _deepmerge2.default)(middlewaresArgs, middleware.handler());
        }
      });
      var mergedReqSettings = (0, _deepmerge2.default)(middlewaresArgs, req);
      mergedReqSettings = (0, _deepmerge2.default)({
        url: this.buildUrl(def.url, req.params, req.query),
        method: def.method,
        responseType: def.responseType ? def.responseType : 'json',
        headers: { 'Content-Type': def.contentType ? def.contentType : 'application/json' }
      }, mergedReqSettings);
      if (req.body) {
        mergedReqSettings.body = req.body;
      }
      return mergedReqSettings;
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
          var reqSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { params: {}, body: null, query: {} };

          var req = (0, _ajax.ajax)(_this3.defBuilder(_this3.apiDefs[key], reqSettings));
          return req.catch(function (err) {
            var errorMdwObservables = _this3.errorMiddlewares.map(function (middleware) {
              if (!_this3.apiDefs[key].ignoreMiddlewares || !_this3.apiDefs[key].ignoreMiddlewares.find(function (ignore) {
                return ignore === middleware.name;
              })) {
                return middleware.handler(err);
              }
              return _rxjs.Observable.empty();
            });
            console.error(err);
            return _rxjs.Observable.concat([].concat((0, _toConsumableArray3.default)(errorMdwObservables), [err]));
            // this.errorMiddlewares.forEach((middleware) => {
            //   if (
            //     !this.apiDefs[key].ignoreMiddlewares ||
            //     !this.apiDefs[key].ignoreMiddlewares.find(ignore => ignore === middleware.name)
            //   ) {
            //     middleware.handler(err);
            //   }
            // });
          });
        }));
      });
      this.routes = routes;
    }
  }]);
  return RxjsWrapper;
}();

exports.default = RxjsWrapper;