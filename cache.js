'use strict';

const DynamoDB = require('aws-sdk').DynamoDB.DocumentClient;

const db = new DynamoDB({
  region: process.env.REGION
});

module.exports.get = function(key) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      id: key
    }
  };
  return new Promise((resolve, reject) => {
    db.get(params, (error, data) => {
      if (error) return reject(error);
      else return resolve(data.Item);
    });
  });
};

module.exports.set = function(key, data) {
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: key
    }
  };
  return new Promise((resolve, reject) => {
    db.put(params, (error) => {
      if (error) return reject(error);
      else return resolve();
    });
  });
};