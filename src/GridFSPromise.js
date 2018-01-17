"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var es6_promise_1 = require("es6-promise");
var fs = require("fs");
var mongodb_1 = require("mongodb");
var GridFSPromise = /** @class */ (function () {
    /**
     * Constructor
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
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    GridFSPromise.prototype.getFileStream = function (id) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connectDB().then(function (client) {
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
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Save the File from the GridFs to the filesystem and get the Path back
     * @param {string} id
     * @param {string} fileName
     * @param filePath
     * @return {Promise<string>}
     */
    GridFSPromise.prototype.getFile = function (id, fileName, filePath) {
        var _this = this;
        if (filePath === void 0) { filePath = __dirname; }
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connectDB().then(function (client) {
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
     * Get a single Object
     * @param {string} id
     * @return {Promise<IGridFSObject>}
     */
    GridFSPromise.prototype.getObject = function (id) {
        var _this = this;
        return new es6_promise_1.Promise((function (resolve, reject) {
            _this.connectDB().then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                bucket.find({ _id: new bson_1.ObjectID(id) }).toArray().then(function (result) {
                    if (result.length > 0) {
                        resolve(result[0]);
                    }
                    else {
                        reject();
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        }));
    };
    /**
     * Upload a file directly from a fs Path
     * @param {string} uploadFilePath
     * @param {string} targetFileName
     * @param {string} type
     * @param {object} meta
     * @return {Promise<IGridFSObject>}
     */
    GridFSPromise.prototype.uploadFile = function (uploadFilePath, targetFileName, type, meta) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (!fs.existsSync(uploadFilePath)) {
                reject(new Error("File not found"));
            }
            _this.connectDB().then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                fs.createReadStream(uploadFilePath)
                    .pipe(bucket.openUploadStream(targetFileName, {
                    contentType: type,
                    metadata: meta,
                }))
                    .on("error", function (err) {
                    if (fs.existsSync(uploadFilePath)) {
                        fs.unlinkSync(uploadFilePath);
                    }
                    reject(err);
                }).on("finish", function (item) {
                    if (fs.existsSync(uploadFilePath)) {
                        fs.unlinkSync(uploadFilePath);
                    }
                    resolve(item);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     *
     * @return {PromiseLike<MongoClient> | Promise<MongoClient> | Thenable<MongoClient>}
     */
    GridFSPromise.prototype.connectDB = function () {
        return mongodb_1.MongoClient.connect(this.connectionUrl, this.mongoClientOptions);
    };
    return GridFSPromise;
}());
exports.GridFSPromise = GridFSPromise;
//# sourceMappingURL=GridFSPromise.js.map