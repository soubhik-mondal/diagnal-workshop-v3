"use strict";

const fetch = require("node-fetch");

module.exports = function (url) {
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
  return fetch(url, options)
    .catch((error) => {
      error.type = "html-getter";
      return Promise.reject(error);
    })
    .then((response) => response.text());
};
