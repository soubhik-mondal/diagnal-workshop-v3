"use strict";

class RequestParser {
  parse(event) {
    try {
      if (!event.headers.hasOwnProperty("content-type")) {
        let error = new Error('Header "content-type" missing');
        error.type = "request-parser";
        throw error;
      }
      if (event.headers["content-type"] !== "application/json") {
        let error = new Error('Header "content-type" must be "application/json"');
        error.type = "request-parser";
        throw error;
      }
      if (!event.hasOwnProperty("body")) {
        let error = new Error('Body missing');
        error.type = "request-parser";
        throw error;
      }
      let url = JSON.parse(event.body).url;
      if (typeof url !== "string") {
        let error = new Error('Invalid URL');
        error.type = "request-parser";
        throw error;
      }
      if (!url.length) {
        let error = new Error('Invalid URL');
        error.type = "request-parser";
        throw error;
      }
      return url;
    } catch (error) {
      if (error.type !== "request-parser") {
        error = new Error("Invalid Request");
        error.type = "request-parser";
      }
      throw error;
    }
  }
}

module.exports = RequestParser;
