/**
 * @desc Expects url and check whether its a valid url or not
 *        return true if it's a valid url
 *        return false if it's not a valid url
 * @param url
 * @return {boolean}
 */
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
