"use strict";

const cache = require("./cache");

const scrapper = require("./scrapper");

function parseRequest(event) {
  let body, message;
  if (!event.headers) {
    message = 'Headers missing';
  } else if (!event.headers["content-type"]) {
    message = 'Header "content-type" missing';
  } else if (event.headers["content-type"] !== "application/json") {
    message = 'Header "content-type" must be "application/json"';
  } else if (!event.body) {
    message = "Body missing";
  } else {
    try {
      body = JSON.parse(event.body);
      if (!body.url) {
        message = "Missing URL";
      } else if (body.url && !body.url.length) {
        message = "Invalid URL";
      }
    } catch (e) {
      console.error(e);
      message = "Invalid JSON";
    }
  }
  if (message) {
    let error = new Error(message);
    error.type = "parseRequest";
    throw error;
  }
  return body.url;
}

module.exports.getMetaData = async function (event) {
  try {
    let url = parseRequest(event);
    let metaData = await cache.get(url);
    if (!metaData) {
      metaData = await scrapper.scrap(url);
      await cache.set(url, metaData);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(metaData, null, 2),
    };
  } catch (error) {
    switch (error.type) {
      case "parseRequest":
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
