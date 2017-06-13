'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// api.js

var apiDefs = {
  getAllRes: {
    url: 'localhost:8080/res',
    method: 'GET',
    responseType: 'json',
    headers: function headers(store) {
      return {
        Authorization: 'Bearer ' + store.getState().auth.token
      };
    }
  },
  getSingleRes: {
    url: 'localhost:8080/res/:id',
    method: 'GET',
    headers: function headers(store) {
      return {
        Authorization: 'Bearer ' + store.getState().auth.token
      };
    }
  },
  postRes: {
    url: 'localhost:8080/res',
    method: 'POST',
    headers: function headers(store) {
      return {
        Authorization: 'Bearer ' + store.getState().auth.token
      };
    }
  }
};

var api = rxjsWrapper.init(api, store);
// api.getSingleRes({id: 2, otherId: 3}, JSON.stringify(truc), {category: 'lol', order_by: 'desc', square: [1, 2, 3]});


//////


var rxjsWrapper = function () {
  function rxjsWrapper(apiDefs, store) {
    (0, _classCallCheck3.default)(this, rxjsWrapper);

    this.store = store;
    this.apiDefs = apiDefs;
  }

  (0, _createClass3.default)(rxjsWrapper, [{
    key: 'buildUrl',
    value: function buildUrl(url, urlParams, queryParams) {
      var finalUrl = url;
      Object.keys(urlParams).forEach(function (param) {
        finalUrl = finalUrl.replace(':' + param, urlParams[param]);
      });
      if (queryParams.constructor === Object) {
        finalUrl = finalUrl.concat('?', Object.keys(queryParams).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
        }));
      } else {
        finalUrl = finalUrl.concat('?', queryParams);
      }
    }
  }, {
    key: 'defBuilder',
    value: function defBuilder(def, urlParams, body, queryParams) {
      return {
        url: this.buildUrl(def.url, urlParams, queryParams),
        method: def.method,
        headers: def.headers(this.store),
        responseType: def.responseType,
        body: body
      };
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      Object.keys(this.apiDefs).map(function (key) {
        (0, _defineProperty3.default)({}, key, function (urlParams, body, queryParams) {
          return ajax(_this.defBuilder(_this.apiDefs[key], urlParams, body, queryParams));
        });
      });
    }
  }]);
  return rxjsWrapper;
}();