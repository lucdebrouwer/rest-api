module.exports = function checkProperties(obj, req, res) {
  // for (var key in obj) {
  //   console.log("[CP KEY]", obj[key]);
  //   if (obj[key] !== null && obj[key] != "") return true;
  // }
  //return false;
  console.log("CP VALS: ", Object.values(obj));
  const result = Object.values(obj).every(prop => {
    if (prop === null || prop === "") {
      return true;
    } else {
      return false;
    }
  });
  console.log("CP RETURN", result);
  return result;
};
//const isEmpty = Object.values(object).every(x => (x === null || x === ''));
