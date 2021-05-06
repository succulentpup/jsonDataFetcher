const safeJsonParse = (str) => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
};

module.exports = { safeJsonParse  };
