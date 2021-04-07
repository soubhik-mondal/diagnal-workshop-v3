"use strict";

/* Setting up my cache */
const Cache = require("./cache");
const myCache = new Cache(process.env.DYNAMODB_TABLE_NAME, process.env.REGION);

/* Setting up my HTML scraper */
const Scraper = require("./scraper");
const myScraper = new Scraper();

/* Setting up my HTML fetcher */
const Fetcher = require("./fetcher");
const myFetcher = new Fetcher();

/* Setting up my request parser */
const RequestParser = require("./request-parser");
const myRequestParser = new RequestParser();

/**
 * The Lambda handler function for handling request and returing og meta data
 * @param {object} event The request object
 */
module.exports.getMetaData = async function (event) {
  let processedMetaData;
  try {
    /**
     * Parse the request and retrieve the URL
     * @type {string}
     */
    let url = myRequestParser.parse(event);

    /**
     * Retrieve the meta data from cache, if it is present
     * @type {object}
     */
    processedMetaData = await myCache.get(url);

    /**
     * In case of cache miss
     */
    if (!processedMetaData) {
      /**
       * Fetch the HTML page
       * @type {string}
       */
      let html = await myFetcher.get(url);
      /**
       * Scrap the HTML and retrieve the meta data
       * @type {object}
       */
      let unprocessedMetaData = await myScraper.scrape(url, html);
      /**
       * Process the meta data and retrieve the og meta data
       * @type {object}
       */
      processedMetaData = await myScraper.parse(unprocessedMetaData);
      /**
       * Save the meta data into cache for future
       */
      await myCache.set(url, processedMetaData);
    }
  } catch (error) {
    switch (error.type) {
      case "request-parser":
        /**
         * If error origin is from request-parser, then
         * set status code = 400 (Bad request)
         */
        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              message: `${error.name}: ${error.message}`,
            },
            null,
            2
          ),
        };
      case "cache.set":
        /**
         * Ignore cache set error (don't fail the request)
         */
        break;
      default:
        /**
         * Set status code = 500 for all other errors
         */
        return {
          statusCode: 500,
          body: JSON.stringify(
            {
              message: `${error.name}: ${error.message}`,
            },
            null,
            2
          ),
        };
    }
  }
  /**
   * Return the meta data to client
   */
  return {
    statusCode: 200,
    body: JSON.stringify(processedMetaData, null, 2),
  };
};
