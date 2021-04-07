"use strict";

const DynamoDB = require("aws-sdk").DynamoDB.DocumentClient;

class Cache {
  constructor(tableName, region) {
    this.tableName = tableName;
    this.region = region;
    this.db = new DynamoDB({
      region: region,
    });
  }
  get(url) {
    let params = {
      TableName: this.tableName,
      Key: {
        url: url,
      },
    };
    return new Promise((resolve, reject) => {
      this.db.get(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          if (data.Item) {
            resolve(data.Item.metaData);
          } else {
            resolve(data.Item);
          }
        }
      });
    });
  }
  set(url, data) {
    let params = {
      TableName: this.tableName,
      Item: {
        url: url,
        metaData: data,
      },
    };
    return new Promise((resolve, reject) => {
      this.db.put(params, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Cache;
