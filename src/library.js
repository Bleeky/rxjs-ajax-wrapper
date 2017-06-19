const combineWrappers = (wrappers) => {
  let wrapped = {};
  Object.keys(wrappers).forEach((key) => {
    wrapped = { [key]: wrappers[key], ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
