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
     * @param {string} bucketName
     * @param {string} basePath
     */
    function GridFSPromise(mongoUrl, databaseName, mongoOptions, bucketName, basePath) {
        this.databaseName = databaseName;
        this.connectionUrl = mongoUrl;
        this.mongoClientOptions = mongoOptions;
        this.bucketName = bucketName || "fs";
        this.basePath = basePath || __dirname + "/../cache";
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
     * @param {string} filePath
     * @return {Promise<string>}
     */
    GridFSPromise.prototype.getFile = function (id, fileName, filePath) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connectDB().then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                return bucket.find({ _id: new bson_1.ObjectID(id) }).toArray().then(function (result) {
                    if (!result) {
                        throw new Error("Object not found");
                    }
                    if (!fileName) {
                        fileName = result[0].filename;
                    }
                    if (!filePath) {
                        filePath = "";
                    }
                    if (_this.basePath.charAt(_this.basePath.length - 1) !== "/") {
                        filePath += "/";
                    }
                    if (!fs.existsSync("" + _this.basePath + filePath)) {
                        throw new Error("Path not found");
                    }
                    bucket.openDownloadStream(new bson_1.ObjectID(id))
                        .once("error", function (error) {
                        reject(error);
                    }).once("end", function () {
                        resolve("" + _this.basePath + filePath + fileName);
                    })
                        .pipe(fs.createWriteStream("" + _this.basePath + filePath + fileName));
                });
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
                        reject(new Error("No Object found"));
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
     * @param {boolean} deleteFile
     * @return {Promise<IGridFSObject>}
     */
    GridFSPromise.prototype.uploadFile = function (uploadFilePath, targetFileName, type, meta, deleteFile) {
        var _this = this;
        if (deleteFile === void 0) { deleteFile = true; }
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
                    if (fs.existsSync(uploadFilePath) && deleteFile === true) {
                        fs.unlinkSync(uploadFilePath);
                    }
                    reject(err);
                }).on("finish", function (item) {
                    if (fs.existsSync(uploadFilePath) && deleteFile === true) {
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
     * Delete an File from the GridFS
     * @param {string} id
     * @return {Promise<boolean>}
     */
    GridFSPromise.prototype.delete = function (id) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connectDB().then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, { bucketName: _this.bucketName });
                bucket.delete(new bson_1.ObjectID(id), (function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                }));
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