"use strict";

const sinon = require("sinon");
sinon.assert.fail = require("assert").fail;

const Cache = require("./../cache");

context("Cache", function () {
  describe("#constructor()", function () {
    let myCache;
    beforeEach("setup", function () {
      myCache = new Cache("testTableName", "testRegion");
    });
    it("should set this.tableName correctly", function () {
      sinon.assert.match(myCache.tableName, "testTableName");
    });
    it("should set this.region correctly", function () {
      sinon.assert.match(myCache.region, "testRegion");
    });
    it("should set this.db correctly", function () {
      sinon.assert.match(typeof myCache.db, "object");
      sinon.assert.match(myCache.db.constructor.name, "DocumentClient");
    });
    it("should set this.db's region correctly", function () {
      sinon.assert.match(myCache.db.options.region, "testRegion");
    });
  });
  describe("#get()", function () {
    let sandbox, myCache;
    before("setup", function () {
      sandbox = sinon.createSandbox();
      myCache = new Cache("testTableName", "testRegion");
    });
    afterEach("teardown", function () {
      sandbox.restore();
    });
    it("should set the params correctly", function () {
      myCache.db = {
        get: sandbox.spy(),
        put: sandbox.spy(),
      };
      myCache.get("testURL");
      sinon.assert.match(myCache.db.get.calledOnce, true);
      sinon.assert.match(myCache.db.get.firstCall.args.length, 2);
      sinon.assert.match(typeof myCache.db.get.firstCall.args[0], "object");
      sinon.assert.match(myCache.db.get.firstCall.args[0], {
        TableName: "testTableName",
        Key: {
          url: "testURL",
        },
      });
    });
    it("should handle error correctly", function () {
      myCache.db = {
        get: sandbox.stub(),
        put: sandbox.stub(),
      };
      myCache.db.get.callsArgWith(1, new Error("testError"));
      return myCache
        .get("testURL")
        .then(() => sinon.assert.fail("SHOULD RETURN ERROR"))
        .catch((error) => {
          sinon.assert.match(error.constructor.name, "Error");
          sinon.assert.match(error.type, "cache.get");
          require("assert").equal(error.message, "testError");
        });
    });
    it("should handle cache hit correctly", function () {
      myCache.db = {
        get: sandbox.stub(),
        put: sandbox.stub(),
      };
      myCache.db.get.callsArgWith(1, null, {
        Item: {
          metaData: "someData",
        },
      });
      return myCache.get("testURL").then((data) => {
        sinon.assert.match(data, "someData");
      });
    });
    it("should handle cache miss correctly", function () {
      myCache.db = {
        get: sandbox.stub(),
        put: sandbox.stub(),
      };
      myCache.db.get.callsArgWith(1, null, {
        Item: null,
      });
      return myCache.get("testURL").then((data) => {
        sinon.assert.match(data, null);
      });
    });
  });
  describe("#set()", function () {
    let sandbox, myCache;
    before("setup", function () {
      sandbox = sinon.createSandbox();
      myCache = new Cache("testTableName", "testRegion");
    });
    afterEach("teardown", function () {
      sandbox.restore();
    });
    it("should set the params correctly", function () {
      myCache.db = {
        get: sandbox.spy(),
        put: sandbox.spy(),
      };
      myCache.set("testURL", "someData");
      sinon.assert.match(myCache.db.put.calledOnce, true);
      sinon.assert.match(myCache.db.put.firstCall.args.length, 2);
      sinon.assert.match(typeof myCache.db.put.firstCall.args[0], "object");
      sinon.assert.match(myCache.db.put.firstCall.args[0], {
        TableName: "testTableName",
        Item: {
          url: "testURL",
          metaData: "someData",
        },
      });
    });
    it("should handle error correctly", function () {
      myCache.db = {
        get: sandbox.stub(),
        put: sandbox.stub(),
      };
      myCache.db.put.callsArgWith(1, new Error("testError"));
      return myCache
        .set("testURL", "someData")
        .then(() => sinon.assert.fail("SHOULD RETURN ERROR"))
        .catch((error) => {
          sinon.assert.match(error.constructor.name, "Error");
          sinon.assert.match(error.type, "cache.set");
          require("assert").equal(error.message, "testError");
        });
    });
    it("should handle cache set correctly", function () {
      myCache.db = {
        get: sandbox.stub(),
        put: sandbox.stub(),
      };
      myCache.db.put.callsArgWith(1, null, "success");
      return myCache.set("testURL", "someData").then((data) => {
        sinon.assert.match(data, undefined);
      });
    });
  });
});
