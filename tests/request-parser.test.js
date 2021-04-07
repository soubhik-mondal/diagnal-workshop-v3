"use strict";

const sinon = require("sinon");
sinon.assert.fail = require("assert").fail;

const RequestParser = require("./../request-parser");

context("RequestParser", function () {
  describe("#parse()", function () {
    let myRequestParser;
    before("setup", function () {
      myRequestParser = new RequestParser();
    });
    it("should handle missing content-type header", function () {
      try {
        myRequestParser.parse({ headers: {} });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, 'Header "content-type" missing');
      }
    });
    it("should handle incorrect content-type header", function () {
      try {
        myRequestParser.parse({ headers: { "content-type": "text/html" } });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(
          error.message,
          'Header "content-type" must be "application/json"'
        );
      }
    });
    it("should handle missing body", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Body missing");
      }
    });
    it("should handle bad JSON", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: "{",
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid Request");
      }
    });
    it("should handle missing URL", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: '{"notUrl":"notUrl"}',
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid URL");
      }
    });
    it("should handle non-string URL (number)", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: '{"url":1234}',
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid URL");
      }
    });
    it("should handle non-string URL (boolean)", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: '{"url":true}',
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid URL");
      }
    });
    it("should handle empty URL", function () {
      try {
        myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: '{"url":""}',
        });
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid URL");
      }
    });
    it("should handle other errors", function () {
      try {
        myRequestParser.parse();
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "request-parser");
        sinon.assert.match(error.message, "Invalid Request");
      }
    });
    it("should return URL", function () {
      try {
        let url = myRequestParser.parse({
          headers: { "content-type": "application/json" },
          body: '{"url":"testURL"}',
        });
        sinon.assert.match(url, "testURL");
      } catch (error) {
        sinon.assert.fail(error);
      }
    });
  });
});
