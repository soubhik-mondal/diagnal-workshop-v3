"use strict";

/* Class representing a request parser specific to this scenario */
class RequestParser {
  /**
   * Parses the request object, detects errors, and returns the URL endpoint
   * @param  {object} event The request object
   * @return {string}       The URL to scrape
   */
  parse(event) {
    // Using try-block to catch unhandled errors
    try {
      // Handling "content-type" header is not present
      if (!event.headers.hasOwnProperty("content-type")) {
        let error = new Error('Header "content-type" missing');
        error.type = "request-parser";
        throw error;
      }
      // Handling "content-type" header is not "application/json"
      if (event.headers["content-type"] !== "application/json") {
        let error = new Error(
          'Header "content-type" must be "application/json"'
        );
        error.type = "request-parser";
        throw error;
      }
      // Handling missing request body
      if (!event.hasOwnProperty("body")) {
        let error = new Error("Body missing");
        error.type = "request-parser";
        throw error;
      }
      /**
       * Parse the JSON object and get the URL
       * @type {string}
       */
      let url = JSON.parse(event.body).url;
      // Handling the URL is not a string
      if (typeof url !== "string") {
        let error = new Error("Invalid URL");
        error.type = "request-parser";
        throw error;
      }
      // Handling the URL is empty
      if (!url.length) {
        let error = new Error("Invalid URL");
        error.type = "request-parser";
        throw error;
      }
      // Return URL
      return url;
    } catch (error) {
      // If error is not custom, then generate a new error, and throw it
      // This prevents any unexpected stacktrace or data to be sent as response to client
      if (error.type !== "request-parser") {
        // console.error(error); // Uncomment if you want to log the error to CloudWatch
        error = new Error("Invalid Request");
        error.type = "request-parser";
      }
      throw error;
    }
  }
}

module.exports = RequestParser;
