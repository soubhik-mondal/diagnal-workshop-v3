"use strict";

const cheerio = require("cheerio");

const htmlGetter = require("./html-getter");

function scrapMetaData(url, html) {
  try {
    let $ = cheerio.load(html);
    let output = {
      title: $("title").text(),
      type: "website",
      image: null,
      url: url,
      description: "",
      raw: [],
      ogMetaData: [],
    };
    $("meta")
      .toArray()
      .map((e) => $(e).attr())
      .forEach((e) => {
        let rawData = {};
        Object.keys(e).forEach((each) => {
          rawData[each] = e[each];
        });
        output.raw.push(rawData);
        if (e.property && e.property.startsWith("og")) {
          output.ogMetaData.push(rawData);
        }
        if (e.name && e.name === "description") {
          output.description = e.content;
        }
      });
    return output;
  } catch (error) {
    error.type = "cheerio";
    throw error;
  }
}

function parseMetaData(metaData) {
  metaData.ogMetaData.forEach((each) => {
    switch (each.property) {
      case "og:title":
        metaData.title = each.content;
        break;
      case "og:type":
        metaData.type = each.content;
        break;
      case "og:url":
        metaData.url = each.content;
        break;
      case "og:description":
        metaData.description = each.content;
        break;
      case "og:determiner":
        metaData.determiner = each.content;
        break;
      case "og:locale":
        metaData.locale = each.content;
        break;
      case "og:locale:alternate":
        if (metaData["locale:alternate"]) {
          metaData["locale:alternate"].push(each.content);
        } else {
          metaData["locale:alternate"] = [each.content];
        }
        break;
      case "og:site_name":
        metaData.site_name = each.content;
        break;
      case "og:image":
        if (metaData.images) {
          metaData.images.push({
            url: each.content,
          });
        } else {
          metaData.images = [
            {
              url: each.content,
            },
          ];
        }
        break;
      case "og:image:secure_url":
        if (metaData.images) {
          let lastImage = metaData.images.length - 1;
          metaData.images[lastImage].secure_url = each.content;
        }
        break;
      case "og:image:type":
        if (metaData.images) {
          let lastImage = metaData.images.length - 1;
          metaData.images[lastImage].type = each.content;
        }
        break;
      case "og:image:width":
        if (metaData.images) {
          let lastImage = metaData.images.length - 1;
          metaData.images[lastImage].width = each.content;
        }
        break;
      case "og:image:height":
        if (metaData.images) {
          let lastImage = metaData.images.length - 1;
          metaData.images[lastImage].height = each.content;
        }
        break;
      case "og:image:alt":
        if (metaData.images) {
          let lastImage = metaData.images.length - 1;
          metaData.images[lastImage].alt = each.content;
        }
        break;
      case "og:video":
        if (metaData.videos) {
          metaData.videos.push({
            url: each.content,
          });
        } else {
          metaData.videos = [
            {
              url: each.content,
            },
          ];
        }
        break;
      case "og:video:secure_url":
        if (metaData.videos) {
          let lastVideo = metaData.videos.length - 1;
          metaData.videos[lastVideo].secure_url = each.content;
        }
        break;
      case "og:video:type":
        if (metaData.videos) {
          let lastVideo = metaData.videos.length - 1;
          metaData.videos[lastVideo].type = each.content;
        }
        break;
      case "og:video:width":
        if (metaData.videos) {
          let lastVideo = metaData.videos.length - 1;
          metaData.videos[lastVideo].width = each.content;
        }
        break;
      case "og:video:height":
        if (metaData.videos) {
          let lastVideo = metaData.videos.length - 1;
          metaData.videos[lastVideo].height = each.content;
        }
        break;
      case "og:video:alt":
        if (metaData.videos) {
          let lastVideo = metaData.videos.length - 1;
          metaData.videos[lastVideo].alt = each.content;
        }
        break;
      case "og:audio":
        if (metaData.audios) {
          metaData.audios.push({
            url: each.content,
          });
        } else {
          metaData.audios = [
            {
              url: each.content,
            },
          ];
        }
        break;
      case "og:audio:secure_url":
        if (metaData.audios) {
          let lastAudio = metaData.audios.length - 1;
          metaData.audios[lastAudio].secure_url = each.content;
        }
        break;
      case "og:audio:type":
        if (metaData.audios) {
          let lastAudio = metaData.audios.length - 1;
          metaData.audios[lastAudio].type = each.content;
        }
        break;
      case "og:audio:width":
        if (metaData.audios) {
          let lastAudio = metaData.audios.length - 1;
          metaData.audios[lastAudio].width = each.content;
        }
        break;
      case "og:audio:height":
        if (metaData.audios) {
          let lastAudio = metaData.audios.length - 1;
          metaData.audios[lastAudio].height = each.content;
        }
        break;
      case "og:audio:alt":
        if (metaData.audios) {
          let lastAudio = metaData.audios.length - 1;
          metaData.audios[lastAudio].alt = each.content;
        }
        break;
    }
  });
  delete metaData.raw;
  delete metaData.ogMetaData;
  return metaData;
}

module.exports.scrap = function (url) {
  return htmlGetter(url)
    .then((html) => scrapMetaData(url, html))
    .then((metaData) => parseMetaData(metaData));
};
