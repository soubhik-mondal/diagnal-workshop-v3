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
      myCache.db = {
        get: sandbox.spy(),
        set: sandbox.spy(),
      };
    });
    afterEach("teardown", function () {
      sandbox.restore();
    });
    it("should set the params correctly", function () {
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
      myCache.get("testURL");
      sinon.assert.match(typeof myCache.db.get.firstCall.args[1], "function");
            

    });
    it("should handle cache hit correctly", function () {});
    it("should handle cache miss correctly", function () {});
  });
  describe("#set()", function () {
    let myCache, dbGet;
    before("setup", function () {
      myCache = new Cache("testTableName", "testRegion");
      dbGet = sinon.stub(myCache.db, "get");
    });
    after("teardown", function () {});
    it("should set the params correctly", function () {});
    it("should handle error correctly", function () {});
    it("should handle cache set correctly", function () {});
  });
});
