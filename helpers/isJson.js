/**
 *
 * @desc Expects a string
 *        returns [undefined] if that string is not parsable by JSON.
 *        returns [null, object] if that string is parsable by JSON.
 * @param str
 * @return {[null, any]|[undefined]}
 */
const safeJsonParse = (str) => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
};

module.exports = { safeJsonParse  };
