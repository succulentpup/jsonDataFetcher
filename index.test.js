const { fetchData } = require('./index');

const leaveGap = ({ lines, testCase, testCaseNo }) => {
  for (let i = 0; i< lines; i++) {
    console.log('');
  }
  console.log(`TestCase No: ${testCaseNo}`);
  console.log(`Running: ${testCase}`);
}

console.log('testing in process...');

(async () => {
// test case 1: sunny day scenario, all inputs are valid and outputs are expected to be valid json objects
  leaveGap({
    lines: 5,
    testCaseNo: 1,
    testCase: 'sunny day scenario, all inputs are valid and outputs are expected to be valid json objects' ,
  });
  let listOfUrls = [
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json',
  ];
  let fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length > 0) {
    console.log('testCase1 is passed')
  } else {
    console.log('testCase1 is failed');
  }

// test case 2: empty input
  leaveGap({
    lines: 5,
    testCaseNo: 2,
    testCase: 'empty input',
  });
  listOfUrls = [];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 0) {
    console.log('testCase2 is passed')
  } else {
    console.log('testCase2 is failed');
  }

// test case 3: all urls are invalid
  leaveGap({
    lines: 5,
    testCaseNo: 3,
    testCase: 'all urls are invalid',
  });
  listOfUrls = [
    'http//abc',
    'htt//abc.com',
  ];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 0) {
    console.log('testCase3 is passed')
  } else {
    console.log('testCase3 is failed');
  }

// test case 4: a few of the urls are invalid
  leaveGap({
    lines: 5,
    testCaseNo: 4,
    testCase: 'a few of the urls are invalid',
  });
  listOfUrls = [
    'http//abc',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json',
    'htt//abc.com',
  ];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 3) { // 3 valid urls are provided
    console.log('testCase4 is passed')
  } else {
    console.log('testCase4 is failed');
  }

// test case 5: all urls are valid but urls doesn't exist hence all urls return 4xx, it tests the timeout scenario as well
  leaveGap({
    lines: 5,
    testCaseNo: 5,
    testCase: 'all urls are valid but urls doesn\'t exist hence all urls return 4xx, it tests the timeout scenario as well',
  });
  listOfUrls = [
    'http://abc.abc',
    'https://abc.tdp',
  ];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 0) { // 3 valid urls are provided
    console.log('testCase5 is passed')
  } else {
    console.log('testCase5 is failed');
  }

// test case 6: one invalid url, remaining all are urls are valid but a few of the urls doesn't exist hence those urls return 4xx while rest of the urls return 200
  leaveGap({
    lines: 5,
    testCaseNo: 6,
    testCase: 'one invalid url, remaining all are urls are valid but a few of the urls doesn\'t exist hence those urls return 4xx while rest of the urls return 200',
  });
  listOfUrls = [
    'http://abc.abc',
    'htt://abc.abc',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json',
    'https://abc.tdp',
  ];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 2) { // 3 valid urls are provided
    console.log('testCase6 is passed')
  } else {
    console.log('testCase6 is failed');
  }

  // uncomment the following test case, it works. NOTE: comment printFetchData call in index.js to avoid screen flooding
// test case 7: all are valid urls but the input size is 5000, we've configured MAX_BATCH_REQ_SIZE = 500, configured through env variable
//   leaveGap({
//     lines: 5,
//     testCaseNo: 7,
//     testCase: 'all are valid urls but the input size is 5000, we have configured MAX_BATCH_REQ_SIZE = 500, configured through env variable',
//   });
//   listOfUrls = [];
//   for (let i = 0; i < 1001; i++) {
//     listOfUrls.push(
//       'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
//     );
//   }
//   fetchedData = await fetchData(listOfUrls);
//
//   if (fetchedData.length === 1001) { // 3 valid urls are provided
//     console.log('testCase7 is passed')
//   } else {
//     console.log('testCase7 is failed');
//   }

  // test case 8: one valid URL but doesn't return json, one valid URL and returns json, one invalid URL, one valid URL but doesn't exist
  leaveGap({
    lines: 5,
    testCaseNo: 8,
    testCase: 'one valid URL but doesn\'t return json, one valid URL and returns json, one invalid URL, one valid URL but doesn\'t exist',
  });
  listOfUrls = [
    'https://google.co.uk',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json',
    'htt:dfkjlas',
    'http://ab.abc',
  ];
  fetchedData = await fetchData(listOfUrls);

  if (fetchedData.length === 2) {
    const invalidResultCount = fetchedData.filter((data) => {
      const key = Object.keys(data)[0];
      return (typeof data[key] === 'string' && data[key].includes('Invalid result. Result is not in json format'));
    }).length;
    if (invalidResultCount === 1) {
      console.log('testCase8 is passed')
    } else {
      console.log('testCase8 is failed');
    }
  } else {
    console.log('testCase8 is failed');
  }
})();
