function CombineWrappers(wrappers,
  reqMdw = { reqMdw: null, reqMdwParams: null },
  errMdw = { errMdw: null, errMdwParams: null }) {
  this.resources = {};
  this.wrappers = wrappers;
  Object.keys(this.wrappers).forEach((key) => {
    if (reqMdw.reqMdw) {
      this.wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      this.wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    this.resources = { [key]: this.wrappers[key].routes, ...this.resources };
  });

  this.addRequestMiddlewares = (middlewares, middlewareParams) => {
    Object.keys(this.wrappers).forEach((key) => {
      this.wrappers[key].addRequestMiddlewares(middlewares, middlewareParams);
    });
  };

  this.addErrorMiddlewares = (middlewares, middlewareParams) => {
    Object.keys(this.wrappers).forEach((key) => {
      this.wrappers[key].addErrorMiddlewares(middlewares, middlewareParams);
    });
  };
}

export default CombineWrappers;
