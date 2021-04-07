"use strict";

const DynamoDB = require("aws-sdk").DynamoDB.DocumentClient;

const db = new DynamoDB({
  region: process.env.REGION,
});

module.exports.get = function (url) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      url: url,
    },
  };
  return new Promise((resolve, reject) => {
    db.get(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.Item.metaData);
      }
    });
  });
};

module.exports.set = function (url, data) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      url: url,
      metaData: data,
    },
  };
  return new Promise((resolve, reject) => {
    db.put(params, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
