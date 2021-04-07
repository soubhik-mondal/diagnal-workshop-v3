"use strict";

/* The simplified DynamoDB Document Client */
const DynamoDB = require("aws-sdk").DynamoDB.DocumentClient;

/* Class representing a very simple DynamoDB-backed caching system */
class Cache {
  /**
   * Initialize the cache
   * @param  {string} tableName The name of the DynamoDB table
   * @param  {string} region    The region where the table is present
   */
  constructor(tableName, region) {
    /**
     * The name of the DynamoDB table
     * @type {string}
     */
    this.tableName = tableName;

    /**
     * The region where the table is present
     * @type {string}
     */
    this.region = region;

    /**
     * The DynamoDB client
     * @type {DynamoDB}
     */
    this.db = new DynamoDB({
      region: region,
    });
  }

  /**
   * Gets the metadata for a given URL from the cache
   * @param  {string}  url The key whose value needs to be retrieved from the cache
   * @return {Promise}     The promise containing the metadata
   */
  get(url) {
    /**
     * Setting up the DynamoDB GET query
     * @type {Object}
     */
    let params = {
      TableName: this.tableName,
      Key: {
        url: url,
      },
    };

    // Wrapping the callback with a Promise
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

  /**
   * Sets the metadata for a given URL into the cache
   * @param  {string}  url  The key whose value needs to be set into the cache
   * @param  {string}  data The value which needs to be set into the cache
   * @return {Promise}      The promise
   */
  set(url, data) {
    /**
     * Setting up the DynamoDB SET query
     * @type {Object}
     */
    let params = {
      TableName: this.tableName,
      Item: {
        url: url,
        metaData: data,
      },
    };

    // Wrapping the callback with a Promise
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
