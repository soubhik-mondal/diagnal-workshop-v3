"use strict";

const sinon = require("sinon");
sinon.assert.fail = require("assert").fail;

const Fetcher = require("./../fetcher");

context("Fetcher", function () {
  describe("#constructor()", function () {
    let myFetcher;
    before("setup", function () {
      myFetcher = new Fetcher();
    });
    it("should set this.fetch correctly", function () {
      sinon.assert.match(typeof myFetcher.fetch, "function");
    });
  });
  describe("#get()", function () {
    let sandbox, myFetcher;
    before("setup", function () {
      sandbox = sinon.createSandbox();
      myFetcher = new Fetcher();
      myFetcher.fetch = sandbox.spy();
    });
    after("teardown", function () {
      sandbox.restore();
    });
    it("should set the params correctly", function () {
      myFetcher.get("testURL");
      sinon.assert.match(myFetcher.fetch.calledOnce, true);
      sinon.assert.match(myFetcher.fetch.firstCall.args.length, 2);
      sinon.assert.match(typeof myFetcher.fetch.firstCall.args[0], "string");
      sinon.assert.match(myFetcher.fetch.firstCall.args[0], "testURL");
      sinon.assert.match(typeof myFetcher.fetch.firstCall.args[1], "object");
      sinon.assert.match(myFetcher.fetch.firstCall.args[1], {
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
      });
    });
    it("should handle error correctly", async function () {
      myFetcher.fetch = sandbox.stub();
      myFetcher.fetch.throws("testError", "testError");
      try {
        await myFetcher.get("testURL");
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "fetcher");
        require("assert").equal(error.message, "testError");
      }
    });
    it("should handle response correctly", async function () {
      myFetcher.fetch = sandbox.stub();
      myFetcher.fetch.returns({
        text: () => "testText",
      });
      try {
        let response = await myFetcher.get("testURL");
        require("assert").equal(response, "testText");
      } catch (error) {
        sinon.assert.fail(error);
      }
    });
  });
});
