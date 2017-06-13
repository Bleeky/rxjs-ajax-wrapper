import { ajax } from 'rxjs/observable/dom/ajax';

class RxjsWrapper {
  constructor(apiDefs, store = () => null) {
    this.store = store;
    this.apiDefs = apiDefs;
    this.routes = [];

    this.buildUrl = ::this.buildUrl;
    this.defBuilder = ::this.defBuilder;
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
      headers: def.headers ? def.headers(this.store) : null,
      responseType: def.responseType,
      body,
    };
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
