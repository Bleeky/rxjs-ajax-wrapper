const combineWrappers = (wrappers,
  reqMdw = { reqMdw: null, reqMdwParams: null },
  errMdw = { errMdw: null, errMdwParams: null }) => {
  let wrapped = {};
  Object.keys(wrappers).forEach((key) => {
    if (reqMdw.reqMdw) {
      wrappers[key].addRequestMiddlewares(reqMdw.reqMdw, reqMdw.reqMdwParams);
    }
    if (errMdw.errMdw) {
      wrappers[key].addErrorMiddlewares(errMdw.errMdw, errMdw.errMdwParams);
    }
    wrapped = { [key]: wrappers[key].routes, ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
