const got = require('got');
const chunk = require('lodash.chunk');

const { safeJsonParse } = require('./helpers/isJson');
const { isValidHttpUrl } = require('./helpers/isValidHttpUrl');

const { MAX_BATCH_REQ_SIZE = 50 } = process.env;
console.log('MAX_BATCH_REQ_SIZE', MAX_BATCH_REQ_SIZE);

/**
 *
 * @desc Prints the fetched data on console
 * @param fetchedData
 */
const printFetchedData = (fetchedData) =>
  fetchedData.forEach((dataObj) => {
    const url = Object.keys(dataObj)[0];
    let data = dataObj[url];
    console.log(`$url: ${url}: ${JSON.stringify(data, null, 1)} `);
  });

/**
 *
 * @desc  Expects a list of Urls and returns a promise that consists an array of json objects.
 *        This json objects are the fetched data from the given list of valid Urls
 * @param listOfUrls eg: ['https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
                           'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',]
 * @return {Promise<*[]>} eg: [ https://domain.com/abc.json: {key1: value1, ...},
 *                              https://domain1.com/xyz.json: {keyN: valueN,...}]
 *
 */
const fetchData = async (listOfUrls) => {
  console.log({ listOfUrls }, 'listOfUrls'); // debug log
  const validListOfHttpUrls = listOfUrls.filter(isValidHttpUrl);
  console.log({ validListOfHttpUrls }, 'validListOfHttpUrls'); // debug log
  const fetchedData = [];
  const chunkedHttpRequests = chunk(validListOfHttpUrls, MAX_BATCH_REQ_SIZE);
  for (const urlChunk of chunkedHttpRequests) {
    console.log({ urlChunk }, 'urlChunk');
    const firedRequests = urlChunk.map(
      (url) => got(url).catch((error) => {
        // console.log({ error }, 'error'); // debug log
        return error;
      }));

    // avoid flood of http requests
    await Promise.all(firedRequests)
      .then((resultList) =>
        resultList.forEach(({ url, body }) => {
          const [err, jsonRes] = safeJsonParse(body);
          const InvalidResult = 'Invalid result. Result is not in json format';
          if (url) fetchedData.push({ [url]: err ? InvalidResult : jsonRes });
        }))
      .catch((error) => {
        console.log('Received Error while fetching data');
        console.log({ error }, 'error');
      });
  }
  // this is to manually test the fetched data
  printFetchedData(fetchedData);
  return fetchedData;
};

module.exports = { fetchData };


