module.exports = function checkProperties(obj, req, res) {
  const result = Object.values(obj).every(prop => {
    if (prop === null || prop === "") {
      return true;
    } else {
      return false;
    }
  });
  return result;
};
