'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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
    var store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return null;
    };
    (0, _classCallCheck3.default)(this, RxjsWrapper);

    this.store = store;
    this.apiDefs = apiDefs;
    this.routes = [];

    this.buildUrl = this.buildUrl.bind(this);
    this.defBuilder = this.defBuilder.bind(this);
  }

  (0, _createClass3.default)(RxjsWrapper, [{
    key: 'buildUrl',
    value: function buildUrl(url, urlParams, queryParams) {
      // eslint-disable-line
      var finalUrl = url;
      console.log(urlParams);
      Object.keys(urlParams).forEach(function (param) {
        console.log(param, urlParams[param]);
        finalUrl = finalUrl.replace(':' + param, urlParams[param]);
        console.log(finalUrl);
      });
      if (queryParams.constructor === Object && Object.keys(queryParams).length > 0) {
        finalUrl = finalUrl.concat('?', Object.keys(queryParams).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
        }));
      } else if (queryParams.constructor === String) {
        finalUrl = finalUrl.concat('?', queryParams);
      }
      return finalUrl;
    }
  }, {
    key: 'defBuilder',
    value: function defBuilder(def, urlParams, body, queryParams) {
      return {
        url: this.buildUrl(def.url, urlParams, queryParams),
        method: def.method,
        headers: def.headers ? def.headers(this.store) : null,
        responseType: def.responseType ? def.responseType : 'json',
        body: body
      };
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      var routes = {};
      Object.keys(this.apiDefs).forEach(function (key) {
        routes = (0, _extends4.default)({}, routes, (0, _defineProperty3.default)({}, '' + key, function undefined() {
          var urlParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          return (0, _ajax.ajax)(_this.defBuilder(_this.apiDefs[key], urlParams, body, queryParams));
        }));
      });
      this.routes = routes;
    }
  }]);
  return RxjsWrapper;
}();

exports.default = RxjsWrapper;