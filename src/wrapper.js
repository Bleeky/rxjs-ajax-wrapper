import { ajax } from 'rxjs/observable/dom/ajax';

class RxjsWrapper {
  constructor(apiDefs) {
    this.apiDefs = apiDefs;
    this.routes = [];
    this.requestMiddleware = () => ({});
    this.errorMiddleware = request => request;

    this.buildUrl = ::this.buildUrl;
    this.defBuilder = ::this.defBuilder;
    this.init = ::this.init;

    this.init();
  }

  buildUrl(url, urlParams, queryParams) { // eslint-disable-line
    let finalUrl = url;
    Object.keys(urlParams).forEach((param) => {
      finalUrl = finalUrl.replace(`:${param}`, urlParams[param]);
    });
    if (queryParams.constructor === Object && Object.keys(queryParams).length > 0) {
      finalUrl = finalUrl.concat('?', Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`));
    } else if (queryParams.constructor === String) {
      finalUrl = finalUrl.concat('?', queryParams);
    }
    return finalUrl;
  }

  defBuilder(def, urlParams, body, queryParams) {
    return {
      url: this.buildUrl(def.url, urlParams, queryParams),
      method: def.method,
      headers: def.headers,
      responseType: def.responseType ? def.responseType : 'json',
      body,
      ...this.requestMiddleware(),
    };
  }

  addRequestMiddleware(middleware, ...params) {
    this.requestMiddleware = () => middleware(...params);
  }

  init() {
    let routes = {};
    Object.keys(this.apiDefs).forEach((key) => {
      routes = { ...routes, [`${key}`]: (urlParams = {}, body = null, queryParams = {}) => ajax(this.defBuilder(this.apiDefs[key], urlParams, body, queryParams)) };
    });
    this.routes = routes;
  }
}

export default RxjsWrapper;
