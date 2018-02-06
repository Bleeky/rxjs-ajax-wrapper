import { ajax } from 'rxjs/observable/dom/ajax';

class RxjsWrapper {
  constructor(apiDefs) {
    this.apiDefs = apiDefs;
    this.routes = [];
    this.requestMiddlewares = [];
    this.errorMiddlewares = [];

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
      finalUrl = finalUrl.concat('?', Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&'));
    } else if (queryParams.constructor === String) {
      finalUrl = finalUrl.concat('?', queryParams);
    }
    return finalUrl;
  }

  defBuilder(def, req) {
    let middlewaresArgs = {};
    this.requestMiddlewares.forEach((middleware) => {
      if (!def.ignoreMiddlewares ||
        !def.ignoreMiddlewares.find(ignore => ignore === middleware.name)) {
        middlewaresArgs = { ...middlewaresArgs, ...middleware.handler() };
      }
    });
    return {
      ...def,
      url: this.buildUrl(def.url, req.urlParams, req.queryParams),
      responseType: def.responseType ? def.responseType : 'json',
      body: req.body,
      ...middlewaresArgs,
    };
  }

  addRequestMiddlewares(middlewares, ...params) {
    middlewares.forEach((middleware) => {
      this.requestMiddlewares = [...this.requestMiddlewares, { name: middleware.name, handler: () => middleware.handler(...params) }];
    });
  }

  addErrorMiddlewares(middlewares, ...params) {
    middlewares.forEach((middleware) => {
      this.errorMiddlewares = [...this.errorMiddlewares, { name: middleware.name, handler: request => middleware.handler(request, ...params) }];
    });
  }

  init() {
    let routes = {};
    Object.keys(this.apiDefs).forEach((key) => {
      routes = { ...routes,
        [`${key}`]: (reqSettings = { urlParams: {}, body: null, queryParams: {} }) => {
          const req = ajax(this.defBuilder(this.apiDefs[key], reqSettings));
          req.subscribe(null, (err) => {
            this.errorMiddlewares.forEach((middleware) => {
              if (!this.apiDefs[key].ignoreMiddlewares ||
                !this.apiDefs[key].ignoreMiddlewares.find(ignore => ignore === middleware.name)) {
                middleware.handler(err);
              }
            });
          });
          return req;
        },
      };
    });
    this.routes = routes;
  }
}

export default RxjsWrapper;
