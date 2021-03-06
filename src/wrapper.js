import { Observable, Subscriber, Subject } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, merge } from "rxjs/operators";
import deepmerge from "deepmerge";

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

  buildUrl(url, params = {}, query = {}) {
    let finalUrl = url;
    Object.keys(params).forEach(param => {
      finalUrl = finalUrl.replace(`:${param}`, params[param]);
    });
    if (query.constructor === Object && Object.keys(query).length > 0) {
      finalUrl = finalUrl.concat(
        "?",
        Object.keys(query)
          .filter(key => query[key])
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
          )
          .join("&")
      );
    } else if (query.constructor === String) {
      finalUrl = finalUrl.concat("?", query);
    }
    return finalUrl;
  }

  defBuilder(def, req) {
    let middlewaresArgs = {};
    this.requestMiddlewares.forEach(middleware => {
      if (
        !def.ignoreMiddlewares ||
        !def.ignoreMiddlewares.find(ignore => ignore === middleware.name)
      ) {
        middlewaresArgs = deepmerge(middlewaresArgs, middleware.handler());
      }
    });
    let mergedReqSettings = deepmerge(middlewaresArgs, req);
    mergedReqSettings = deepmerge(
      {
        url: this.buildUrl(def.url, req.params, req.query),
        method: def.method,
        responseType: def.responseType ? def.responseType : "json",
        headers: {}
      },
      mergedReqSettings
    );
    if (def.contentType) {
      mergedReqSettings.headers["Content-Type"] = def.contentType;
    } else if (def.autoContentType === undefined) {
      mergedReqSettings.headers["Content-Type"] = "application/json";
    }
    if (req.body) {
      mergedReqSettings.body = req.body;
    }
    if (req.withProgress) {
      const progressSubscriber = new Subject();
      mergedReqSettings.progressSubscriber = Subscriber.create(e => {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        progressSubscriber.next(req.withProgress(percentComplete));
      });
    }
    return mergedReqSettings;
  }

  addRequestMiddlewares(middlewares, ...params) {
    middlewares.forEach(middleware => {
      if (!this.requestMiddlewares.find(mid => mid.name === middleware.name)) {
        this.requestMiddlewares = [
          ...this.requestMiddlewares,
          {
            name: middleware.name,
            handler: () => middleware.handler(...params)
          }
        ];
      }
    });
  }

  addErrorMiddlewares(middlewares, ...params) {
    middlewares.forEach(middleware => {
      this.errorMiddlewares = [
        ...this.errorMiddlewares,
        {
          name: middleware.name,
          handler: (request, extras) => middleware.handler(request, extras, ...params),
        }
      ];
    });
  }

  init() {
    let routes = {};
    Object.keys(this.apiDefs).forEach(key => {
      routes = {
        ...routes,
        [`${key}`]: (reqSettings = { params: {}, body: null, query: {} }, extras) => {
          const req = ajax(this.defBuilder(this.apiDefs[key], reqSettings));
          return req.pipe(
            catchError(err => {
              this.errorMiddlewares.forEach(middleware => {
                if (
                  !this.apiDefs[key].ignoreMiddlewares ||
                  !this.apiDefs[key].ignoreMiddlewares.find(
                    ignore => ignore === middleware.name
                  )
                ) {
                  middleware.handler(err, extras);
                }
              });
              throw err;
            })
          );
        }
      };
    });
    this.routes = routes;
  }
}

export default RxjsWrapper;
