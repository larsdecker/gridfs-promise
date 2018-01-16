"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var es6_promise_1 = require("es6-promise");
var fs = require("fs");
var mongodb_1 = require("mongodb");
var GridFSPromise = /** @class */ (function () {
    /**
     *
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} basePath
     * @param {string} bucketName
     */
    function GridFSPromise(mongoUrl, databaseName, mongoOptions, basePath, bucketName) {
        this.databaseName = databaseName;
        this.connectionUrl = mongoUrl;
        this.mongoClientOptions = mongoOptions;
        this.basePath = basePath || __dirname;
        this.bucketName = bucketName || "fs";
    }
    /**
     * Save the File from the GridFs to the filesystem and get the Path back
     * @param {string} id
     * @param {string} fileName
     * @param filePath
     * @return {Promise<string>}
     */
    GridFSPromise.prototype.getFile = function (id, fileName, filePath) {
        var _this = this;
        if (filePath === void 0) { filePath = "/tmpArchive/archive/"; }
        return new es6_promise_1.Promise(function (resolve, reject) {
            var gridSave = mongodb_1.MongoClient.connect(_this.connectionUrl);
            gridSave.then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                bucket.openDownloadStream(new bson_1.ObjectID(id))
                    .once("error", function (error) {
                    reject(error);
                }).once("finish", function () {
                    resolve(_this.basePath.concat("" + filePath + fileName));
                })
                    .pipe(fs.createWriteStream(_this.basePath.concat("" + filePath + fileName)));
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    GridFSPromise.prototype.getFileStream = function (id) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            var gridSave = mongodb_1.MongoClient.connect(_this.connectionUrl, _this.mongoClientOptions);
            return gridSave.then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                bucket.find({ _id: new bson_1.ObjectID(id) }).toArray().then(function (result) {
                    if (result.length > 0) {
                        resolve(bucket.openDownloadStream(new bson_1.ObjectID(id)));
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    };
    /**
     * Get a single Object
     * @param {string} id
     * @return {Promise<IGridFSObject>}
     */
    GridFSPromise.prototype.getObject = function (id) {
        var _this = this;
        return new es6_promise_1.Promise((function (resolve, reject) {
            var gridSave = mongodb_1.MongoClient.connect(_this.connectionUrl, _this.mongoClientOptions);
            gridSave.then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                bucket.find({ _id: new bson_1.ObjectID(id) }).toArray().then(function (result) {
                    if (result.length > 0) {
                        resolve(result);
                    }
                    else {
                        reject();
                    }
                });
            });
        }));
    };
    return GridFSPromise;
}());
exports.GridFSPromise = GridFSPromise;
//# sourceMappingURL=GridFSPromise.js.map