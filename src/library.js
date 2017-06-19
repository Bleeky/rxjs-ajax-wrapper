const combineWrappers = (wrappers) => {
  let wrapped = {};
  Object.keys(wrappers).forEach((key) => {
    wrapped = { [key]: wrappers[key].routes, ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
