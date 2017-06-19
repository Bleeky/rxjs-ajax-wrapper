const combineWrappers = (...wrappers) => {
  let wrapped = {};
  wrappers.forEach((wrapper) => {
    wrapped = { [wrapper]: wrapper.routes, ...wrapped };
  });
  return wrapped;
};

export default combineWrappers;
