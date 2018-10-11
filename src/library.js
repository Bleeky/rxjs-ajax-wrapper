function CombineWrappers(
  wrappers,
  reqMdw = { reqMdw: null, reqMdwParams: null },
  errMdw = { errMdw: null, errMdwParams: null },
) {
  this.resources = {};
  this.wrappers = wrappers;
  this.requestMiddlewares = { middlewares: [], params: undefined };
  this.errorMiddlewares = { middlewares: [], params: undefined };
  Object.keys(this.wrappers).forEach((key) => {
    if (reqMdw.reqMdw) {
      this.requestMiddlewares = {
        middlewares: [...this.requestMiddlewares.middlewares, ...reqMdw.reqMdw],
        params: { ...this.requestMiddlewares.params, ...reqMdw.reqMdwParams },
      };
      this.wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      this.errorMiddlewares = {
        middlewares: [...this.errMiddlewares.middlewares, ...errMdw.errMdw],
        params: { ...this.errMiddlewares.params, ...errMdw.errMdwParams },
      };
      this.wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    this.resources = { [key]: this.wrappers[key].routes, ...this.resources };
  });

  this.addWrappers = (newWrappers) => {
    this.wrappers = [...this.wrappers, ...newWrappers];
    if (this.requestMiddlewares.middlewares && this.requestMiddlewares.middlewares.length > 0) {
      Object.keys(this.wrappers).forEach((key) => {
        this.wrappers[key].addRequestMiddlewares(
          this.requestMiddlewares.middlewares,
          this.requestMiddlewares.params,
        );
      });
    }
    if (this.errorMiddlewares.middlewares && this.errorMiddlewares.middlewares.length > 0) {
      Object.keys(this.wrappers).forEach((key) => {
        this.wrappers[key].addErrorMiddlewares(
          this.errorMiddlewares.middlewares,
          this.errorMiddlewares.params,
        );
      });
    }
  };

  this.addRequestMiddlewares = (middlewares, middlewareParams) => {
    this.requestMiddlewares = {
      middlewares: [...this.requestMiddlewares.middlewares, ...middlewares],
      params: { ...this.requestMiddlewares.params, ...middlewareParams },
    };
    Object.keys(this.wrappers).forEach((key) => {
      this.wrappers[key].addRequestMiddlewares(
        this.requestMiddlewares.middlewares,
        this.requestMiddlewares.params,
      );
    });
  };

  this.addErrorMiddlewares = (middlewares, middlewareParams) => {
    this.requestMiddlewares = {
      middlewares: [...this.requestMiddlewares.middlewares, ...middlewares],
      params: { ...this.requestMiddlewares.params, ...middlewareParams },
    };
    Object.keys(this.wrappers).forEach((key) => {
      this.wrappers[key].addErrorMiddlewares(
        this.errorMiddlewares.middlewares,
        this.errorMiddlewares.params,
      );
    });
  };
}

export default CombineWrappers;
