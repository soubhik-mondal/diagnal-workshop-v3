"use strict";

const sinon = require("sinon");
sinon.assert.fail = require("assert").fail;

const Scraper = require("./../scraper");

context("Scraper", function () {
  describe("#scrape()", function () {
    let myScraper;
    before("setup", function () {
      myScraper = new Scraper();
    });
    it("should handle empty HTML", function () {
      try {
        myScraper.scrape("someURL", null);
      } catch (error) {
        sinon.assert.match(error.constructor.name, "Error");
        sinon.assert.match(error.type, "cheerio");
        return;
      }
      sinon.assert.fail("SHOULD RETURN ERROR");
    });
    it("should handle missing title tag", function () {
      let output = myScraper.scrape("someURL", "<head></head>");
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [],
      });
    });
    it("should handle missing meta tag", function () {
      let output = myScraper.scrape(
        "someURL",
        "<head><title>test</title></head>"
      );
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "test",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [],
      });
    });
    it("should handle meta description tag", function () {
      let output = myScraper.scrape(
        "someURL",
        '<head><title>test</title><meta name="description" content="testDescription"/></head>'
      );
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "test",
        type: "website",
        url: "someURL",
        description: "testDescription",
        raw: [{ name: "description", content: "testDescription" }],
        ogMetaData: [],
      });
    });
    it("should handle non-og meta tag", function () {
      let output = myScraper.scrape(
        "someURL",
        '<head><meta name="a" content="b" /></head>'
      );
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [
          {
            name: "a",
            content: "b",
          },
        ],
        ogMetaData: [],
      });
    });
    it("should handle og meta tag", function () {
      let output = myScraper.scrape(
        "someURL",
        '<head><meta property="og:a" content="b" /></head>'
      );
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [
          {
            property: "og:a",
            content: "b",
          },
        ],
        ogMetaData: [
          {
            property: "og:a",
            content: "b",
          },
        ],
      });
    });
  });
  describe("#parse()", function () {
    let myScraper;
    before("setup", function () {
      myScraper = new Scraper();
    });
    it("should handle missing title, description, og:title, and og:description", function () {
      let output = myScraper.parse({
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        type: "website",
        url: "someURL",
      });
    });
    it("should handle missing og:title and og:description", function () {
      let output = myScraper.parse({
        title: "testTitle",
        type: "website",
        url: "someURL",
        description: "testDesc",
        raw: [],
        ogMetaData: [],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "testTitle",
        type: "website",
        url: "someURL",
        description: "testDesc",
      });
    });
    it("should handle all top level og tags", function () {
      let output = myScraper.parse({
        title: "testTitle",
        type: "website",
        url: "someURL",
        description: "testDesc",
        raw: [],
        ogMetaData: [
          {
            property: "og:title",
            content: "ogTitle",
          },
          {
            property: "og:type",
            content: "ogType",
          },
          {
            property: "og:url",
            content: "ogURL",
          },
          {
            property: "og:description",
            content: "ogDescription",
          },
          {
            property: "og:determiner",
            content: "ogDeterminer",
          },
          {
            property: "og:locale",
            content: "ogLocale",
          },
          {
            property: "og:site_name",
            content: "ogSiteName",
          },
        ],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        title: "ogTitle",
        type: "ogType",
        url: "ogURL",
        description: "ogDescription",
        determiner: "ogDeterminer",
        locale: "ogLocale",
        site_name: "ogSiteName",
      });
    });
    it("should handle og:locale:alternate tag", function () {
      let output = myScraper.parse({
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [
          {
            property: "og:locale:alternate",
            content: "a",
          },
          {
            property: "og:locale:alternate",
            content: "b",
          },
        ],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        type: "website",
        url: "someURL",
        "locale:alternate": ["a", "b"],
      });
    });
    it("should handle og:image and related tag, including missing tag", function () {
      let output = myScraper.parse({
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [
          {
            property: "og:image:secure_url",
            content: "b1",
          },
          {
            property: "og:image:type",
            content: "c1",
          },
          {
            property: "og:image:width",
            content: "d1",
          },
          {
            property: "og:image:height",
            content: "e1",
          },
          {
            property: "og:image:alt",
            content: "f1",
          },
          {
            property: "og:image",
            content: "a2",
          },
          {
            property: "og:image:secure_url",
            content: "b2",
          },
          {
            property: "og:image:type",
            content: "c2",
          },
          {
            property: "og:image:width",
            content: "d2",
          },
          {
            property: "og:image:height",
            content: "e2",
          },
          {
            property: "og:image:alt",
            content: "f2",
          },
          {
            property: "og:image",
            content: "a3",
          },
          {
            property: "og:image:secure_url",
            content: "b3",
          },
          {
            property: "og:image:type",
            content: "c3",
          },
          {
            property: "og:image:width",
            content: "d3",
          },
          {
            property: "og:image:height",
            content: "e3",
          },
        ],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        type: "website",
        url: "someURL",
        images: [
          {
            url: "a2",
            secure_url: "b2",
            type: "c2",
            width: "d2",
            height: "e2",
            alt: "f2",
          },
          {
            url: "a3",
            secure_url: "b3",
            type: "c3",
            width: "d3",
            height: "e3",
          },
        ],
      });
    });
    it("should handle og:video and related tag, including missing tag", function () {
      let output = myScraper.parse({
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [
          {
            property: "og:video:secure_url",
            content: "b1",
          },
          {
            property: "og:video:type",
            content: "c1",
          },
          {
            property: "og:video:width",
            content: "d1",
          },
          {
            property: "og:video:height",
            content: "e1",
          },
          {
            property: "og:video:alt",
            content: "f1",
          },
          {
            property: "og:video",
            content: "a2",
          },
          {
            property: "og:video:secure_url",
            content: "b2",
          },
          {
            property: "og:video:type",
            content: "c2",
          },
          {
            property: "og:video:width",
            content: "d2",
          },
          {
            property: "og:video:height",
            content: "e2",
          },
          {
            property: "og:video:alt",
            content: "f2",
          },
          {
            property: "og:video",
            content: "a3",
          },
          {
            property: "og:video:secure_url",
            content: "b3",
          },
          {
            property: "og:video:type",
            content: "c3",
          },
          {
            property: "og:video:width",
            content: "d3",
          },
          {
            property: "og:video:height",
            content: "e3",
          },
        ],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        type: "website",
        url: "someURL",
        videos: [
          {
            url: "a2",
            secure_url: "b2",
            type: "c2",
            width: "d2",
            height: "e2",
            alt: "f2",
          },
          {
            url: "a3",
            secure_url: "b3",
            type: "c3",
            width: "d3",
            height: "e3",
          },
        ],
      });
    });
    it("should handle og:audio and related tag, including missing tag", function () {
      let output = myScraper.parse({
        title: "",
        type: "website",
        url: "someURL",
        description: "",
        raw: [],
        ogMetaData: [
          {
            property: "og:audio:secure_url",
            content: "b1",
          },
          {
            property: "og:audio:type",
            content: "c1",
          },
          {
            property: "og:audio:alt",
            content: "f1",
          },
          {
            property: "og:audio",
            content: "a2",
          },
          {
            property: "og:audio:secure_url",
            content: "b2",
          },
          {
            property: "og:audio:type",
            content: "c2",
          },
          {
            property: "og:audio:alt",
            content: "f2",
          },
          {
            property: "og:audio",
            content: "a3",
          },
          {
            property: "og:audio:secure_url",
            content: "b3",
          },
          {
            property: "og:audio:type",
            content: "c3",
          },
        ],
      });
      sinon.assert.match(typeof output, "object");
      sinon.assert.match(output, {
        type: "website",
        url: "someURL",
        audios: [
          {
            url: "a2",
            secure_url: "b2",
            type: "c2",
            alt: "f2",
          },
          {
            url: "a3",
            secure_url: "b3",
            type: "c3",
          },
        ],
      });
    });
  });
});
