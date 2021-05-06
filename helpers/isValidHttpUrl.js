const  isValidHttpUrl = (url) => {
  let tempUrl;
  try {
    tempUrl = new URL(url);
  } catch (error) {
    console.log(`${url} is invalid url`);
    return false;
  }
  return tempUrl.protocol === 'http:' || tempUrl.protocol === 'https:';
};

module.exports = { isValidHttpUrl };
