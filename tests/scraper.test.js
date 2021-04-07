"use strict";

const sinon = require("sinon");
sinon.assert.fail = require("assert").fail;

const Scraper = require("./../scraper");

context("Scraper", function () {
  describe("#scrape()", function () {
    it("should handle empty HTML", function () {});
    it("should handle missing title tag", function () {});
    it("should handle missing meta tag", function () {});
  });
  describe("#parse()", function () {});
});
