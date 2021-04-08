# diagnal-workshop-v3

This codebase is a simple demonstration of a OpenGraph metadata scraping tool.

## Features
1. Written in NodeJS.
2. Uses the Serverless Framework.
3. Uses DynamoDB as a cache.
4. Code footprint is fairly low (~520kB) without minification.
5. Uses `cheerio` for parsing HTML.
6. Unit test cases for all core functionality is written using `mocha` and `sinon`.
7. Code coverage is 100% (except for `handler.js`) using `nyc`.
8. Code is modularized using ES6 classes.
9. Code is heavily commented using `jsdoc` style comments.
10. Code is prettified using `prettier`.
11. Contains this readme file, and will add a release note with git tag later on.

## Understanding the code

Here's the gist of the algorithm in handler.js -
1. Check if request is valid.
2. If request is valid, search URL in Cache.
3. If Cache Hit happens, return metadata from Cache to client..
4. If Cache Miss happens, download the HTML page by calling Fetcher.
5. Process the HTML page using Scraper.
6. Save the metadata to Cache.
7. Return the metadata to client.
8. If error at any point, return appropriate error message to client.

## Running test cases
1. Expected Node version = v12.
2. Execute `npm install` to install all dependencies.
3. Execute `npm run test` to execute the test cases.
4. Execute `npm run coverage` to generate coverage reports (reporters are `text`, `text-summary` and `lcov`).

## Deploying to AWS
1. Expected Node version = v12.
2. Expected AWS "default" credentials to be set at ~/.aws/credentials.
3. Expected AWS "default" config to be set at ~/.aws/config (with region as "us-east-1).
4. Execute `npm install` to install all dependencies.
5. Execute `./node_modules/.bin/sls deploy`.

## Where to improve
1. This code is dependent on `node-fetch` to fetch the HTML page. It may be possible to replace this with custom code which depends on `http` or `https` libraries, however this will introduce overheard and boilerplate code.
2. If code footprint (~520kB) is too high, we may be able to utilize [Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to put the node_modules into a different layer.
3. We can add TTL configuration in DynamoDB in order to invalidate older data from time to time.
4. There is a feature to forward the raw meta tags in the response to client (similar to the [Facebook Debug Tool](https://developers.facebook.com/tools/debug)), however this is commented out for now. The code is in scraper.js.
5. We can add `console.error(error);` in the `catch` blocks to log the errors in CloudWatch, however this is commented out for now in order to improve speed/performance.
6. We can use `minify` or `uglify` to reduce the code base further, however this will make bug hunting much harder without source maps.

## Note
Although the given example suggests the output format as:
```
{
  "title": "Apple iPhone 6, 16gb, Space Gray, Unlocked",
  "description": "Built on 64-bit desktop-class architecture, the new A8 chip delivers more power.",
  "images": [
    "http://amazon.com/sample_image1.jpg","http: //amazon.com/sample_image2.jpg"
  ]
}
```
My code will return the following format:
```
{
  "title": "Apple iPhone 6, 16gb, Space Gray, Unlocked",
  "description": "Built on 64-bit desktop-class architecture, the new A8 chip delivers more power.",
  "images": [
    {
      "url": "http://amazon.com/sample_image1.jpg","http: //amazon.com/sample_image2.jpg"
    }
  ]
}
```
This was done because OpenGraph tags such as `og:image`, `og:video`, and `og:audio` can contain sub properties as given in the [OpenGraph protocol](https://ogp.me/).
