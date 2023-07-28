"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFSPromise = void 0;
var bson_1 = require("bson");
var fs = __importStar(require("fs"));
var mongodb_1 = require("mongodb");
var path = __importStar(require("path"));
var stream_1 = require("stream");
var GridFSPromise = /** @class */ (function () {
    /**
     * Constructor
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} bucketName
     * @param {string} basePath
     * @param {boolean} closeConnectionAutomatically
     */
    function GridFSPromise(databaseName, mongoUrl, mongoOptions, bucketName, basePath, closeConnectionAutomatically) {
        this.closeConnectionAutomatically = false;
        this._CONNECTION = null;
        this.maxTimeMS = 3000;
        this.databaseName = databaseName;
        if (mongoUrl) {
            this.connectionUrl = mongoUrl;
        }
        if (mongoOptions) {
            this.mongoClientOptions = mongoOptions;
        }
        this.bucketName = bucketName || 'fs';
        this.basePath = basePath || "".concat(__dirname, "/../cache");
        if (closeConnectionAutomatically) {
            this.closeConnectionAutomatically = closeConnectionAutomatically;
        }
    }
    Object.defineProperty(GridFSPromise.prototype, "CONNECTION", {
        set: function (value) {
            this._CONNECTION = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridFSPromise.prototype, "connection", {
        get: function () {
            return this._CONNECTION;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    GridFSPromise.prototype.getFileStream = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connectDB()
                .then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, {
                    bucketName: _this.bucketName,
                });
                bucket
                    .find({ _id: new bson_1.ObjectId(id) }, { maxTimeMS: _this.maxTimeMS })
                    .toArray()
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (result.length > 0) {
                                    resolve(bucket.openDownloadStream(new bson_1.ObjectId(id)));
                                }
                                else {
                                    reject();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            })
                .catch(function (err) {
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
        return new Promise(function (resolve, reject) {
            _this.connectDB()
                .then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, {
                    bucketName: _this.bucketName,
                });
                return bucket
                    .find({ _id: new bson_1.ObjectId(id) }, { maxTimeMS: _this.maxTimeMS })
                    .toArray()
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (!result || result.length === 0) {
                            throw new Error('Object not found');
                        }
                        if (!fileName) {
                            fileName = result[0].filename;
                        }
                        else {
                            if (path.extname(fileName) === '') {
                                fileName = fileName.concat(path.extname(result[0].filename));
                            }
                        }
                        if (!filePath) {
                            filePath = '';
                        }
                        if (this.basePath.charAt(this.basePath.length - 1) !== '/') {
                            filePath += '/';
                        }
                        if (!fs.existsSync("".concat(this.basePath).concat(filePath))) {
                            throw new Error('Path not found');
                        }
                        bucket
                            .openDownloadStream(new bson_1.ObjectId(id))
                            .once('error', function (error) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                        return [4 /*yield*/, client.close()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        reject(error);
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .once('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                        return [4 /*yield*/, client.close()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        resolve("".concat(this.basePath).concat(filePath).concat(fileName));
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .pipe(fs.createWriteStream("".concat(this.basePath).concat(filePath).concat(fileName)));
                        return [2 /*return*/];
                    });
                }); });
            })
                .catch(function (err) {
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
        return new Promise(function (resolve, reject) {
            _this.connectDB()
                .then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, {
                    bucketName: _this.bucketName,
                });
                bucket
                    .find({ _id: new bson_1.ObjectId(id) }, { maxTimeMS: _this.maxTimeMS })
                    .toArray()
                    .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (result.length > 0) {
                                    resolve(result[0]);
                                }
                                else {
                                    reject(new Error('No Object found'));
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            })
                .catch(function (err) {
                reject(err);
            });
        });
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
        return new Promise(function (resolve, reject) {
            if (!fs.existsSync(uploadFilePath)) {
                reject(new Error('File not found'));
            }
            _this.connectDB()
                .then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, {
                    bucketName: _this.bucketName,
                });
                fs.createReadStream(uploadFilePath)
                    .pipe(bucket.openUploadStream(targetFileName, {
                    contentType: type,
                    metadata: meta,
                }))
                    .on('error', function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (fs.existsSync(uploadFilePath) && deleteFile) {
                                    fs.unlinkSync(uploadFilePath);
                                }
                                reject(err);
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .on('finish', function (item) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (fs.existsSync(uploadFilePath) && deleteFile) {
                                    fs.unlinkSync(uploadFilePath);
                                }
                                resolve(item);
                                return [2 /*return*/];
                        }
                    });
                }); });
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Upload a file directly from a fs Path
     * @param {string} uploadData
     * @param {string} targetFileName
     * @param {string} type
     * @param {object} meta
     * @return {Promise<IGridFSObject>}
     */
    GridFSPromise.prototype.uploadFileString = function (uploadData, targetFileName, type, meta) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connectDB()
                .then(function (client) {
                var connection = client.db(_this.databaseName);
                var bucket = new mongodb_1.GridFSBucket(connection, {
                    bucketName: _this.bucketName,
                });
                var binary = new Buffer(uploadData, 'base64');
                var readable = stream_1.Readable.from(binary);
                readable
                    .pipe(bucket.openUploadStream(targetFileName, {
                    contentType: type,
                    metadata: meta,
                }))
                    .on('error', function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                reject(err);
                                return [2 /*return*/];
                        }
                    });
                }); })
                    .on('finish', function (item) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.closeConnectionAutomatically) return [3 /*break*/, 2];
                                return [4 /*yield*/, client.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                resolve(item);
                                return [2 /*return*/];
                        }
                    });
                }); });
            })
                .catch(function (err) {
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
        return __awaiter(this, void 0, void 0, function () {
            var client, connection, bucket, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectDB()];
                    case 1:
                        client = _a.sent();
                        connection = client.db(this.databaseName);
                        bucket = new mongodb_1.GridFSBucket(connection, {
                            bucketName: this.bucketName,
                        });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 7]);
                        return [4 /*yield*/, bucket.delete(new bson_1.ObjectId(id))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        err_1 = _a.sent();
                        if (!this.closeConnectionAutomatically) return [3 /*break*/, 6];
                        return [4 /*yield*/, client.close()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, false];
                    case 7:
                        if (!this.closeConnectionAutomatically) return [3 /*break*/, 9];
                        return [4 /*yield*/, client.close()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Close the Connection, if the connection is not needed anymore
     */
    GridFSPromise.prototype.closeConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._CONNECTION) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._CONNECTION.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Connect to the Database and return a promise Object
     */
    GridFSPromise.prototype.connectDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._CONNECTION) {
                            return [2 /*return*/, this._CONNECTION];
                        }
                        if (!this.connectionUrl) {
                            throw new Error('No Connection String given. Can´t connect to MongoDB.');
                        }
                        _a = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.connectionUrl)];
                    case 1: return [2 /*return*/, (_a._CONNECTION = _b.sent())];
                }
            });
        });
    };
    return GridFSPromise;
}());
exports.GridFSPromise = GridFSPromise;
//# sourceMappingURL=GridFSPromise.js.map