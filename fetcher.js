"use strict";

/* A simple HTTP request library with small footprint */
const fetch = require("node-fetch");

/* Class representing a wrapper around the fetch library */
class Fetcher {
  /**
   * Initializes the wrapper class
   */
  constructor() {
    this.fetch = fetch;
  }
  /**
   * Performs a GET HTTP method on the given URL and returns the html data
   * @param  {string}  url The web endpoint whose html data we want to retrieve
   * @return {Promise}     The promise containing the html data
   */
  async get(url) {
    /**
     * Setting up the options object for node-fetch
     *
     * The reason for setting the specific headers is to make the endpoint
     * think that the request is coming from a browser
     *
     * The headers and their values are simply taken Mozilla developer console
     *
     * @type {Object}
     */
    let options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    };

    try {
      /* Perform the operation and return the html data as string */
      let response = await this.fetch(url, options);
      return response.text();
    } catch (error) {
      error.type = "fetcher"; // Setting type in case we want to track the source of the error later on
      throw error;
    }
  }
}

module.exports = Fetcher;
