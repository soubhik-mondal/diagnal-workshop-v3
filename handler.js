"use strict";

const Cache = require("./cache");
const myCache = new Cache(process.env.DYNAMODB_TABLE_NAME, process.env.REGION);

const Scrapper = require("./scrapper");
const myScrapper = new Scrapper();

const Fetcher = require("./fetcher");
const myFetcher = new Fetcher();

const RequestParser = require("./request-parser");
const myRequestParser = new RequestParser();

module.exports.getMetaData = async function (event) {
  try {
    let url = myRequestParser.parse(event);
    let processedMetaData = await myCache.get(url);
    if (!processedMetaData) {
      let html = await myFetcher.get(url);
      let unprocessedMetaData = await myScrapper.scrape(url, html);
      processedMetaData = await myScrapper.parse(unprocessedMetaData);
      await myCache.set(url, processedMetaData);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(processedMetaData, null, 2),
    };
  } catch (error) {
    switch (error.type) {
      case "request-parser":
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
        break;
      default:
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
};
