"use strict";
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
        while (_) try {
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
var assert = require("assert");
var assert_1 = require("assert");
require("mocha");
var mongodb_1 = require("mongodb");
var GridFSPromise_1 = require("../src/GridFSPromise");
describe("GetFile", function () {
    // it("should get FilePath", () => {
    //     const gridFSPromise = new GridFSPromise("my-gridfs-test",
    //         "mongodb://test:test1234@ds119129.mlab.com:19129/my-gridfs-test",
    //                          {
    //                                         autoReconnect: true,
    //                                         useNewUrlParser: true
    //                                     },
    //                         "attachments", `${__dirname}/../cache`);
    //
    //     return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
    //         assert.equal(result , `${__dirname}/../cache/203857-76.pdf`);
    //     }).catch((error) => {
    //        fail(error);
    //     });
    //
    // });
    it("should get FilePath without path", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname);
        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then(function (result) {
            assert.equal(result, __dirname + "/../cache/203857-76.pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should get FilePath with extra /", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname + "/../cache/");
        return gridFSPromise.getFile("5b43ce3a58ebb3086dbf9334").then(function (result) {
            assert.strictEqual(result, __dirname + "/../cache/203857-76.pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should return invalid Path", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname + "/test");
        return gridFSPromise.getFile("5b43ce3a58ebb3086dbf9334").then(function (result) {
            assert.fail("Should not be here");
        }).catch(function (error) {
            assert.strictEqual(error, new Error("Path not found"));
        });
    });
});
describe("GetObject", function () {
    it("should get FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname);
        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then(function (result) {
            assert.strictEqual(result.filename, "203857-76.pdf");
            assert.strictEqual(result.contentType, "application/pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should not get FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("tikki", "mongodb://localhost:27017", { useNewUrlParser: true }, "attachments", __dirname);
        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then(function (result) {
            assert.strictEqual(result.filename, "203857-76.pdf");
            assert.strictEqual(result.contentType, "application/pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
});
describe("UploadObject", function () {
    it("should upload FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname);
        return gridFSPromise.uploadFile(__dirname + "/5MB.zip", "test.zip", "application/zip", {}).then(function (result) {
            assert.strictEqual(result.filename, "test.zip");
            assert.strictEqual(result.contentType, "application/zip");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should upload Base64 Image", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", "mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, "attachments", __dirname);
        return gridFSPromise.uploadFileString('R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==', "test.gif", "image/gif", {}).then(function (result) {
            assert.strictEqual(result.filename, "test.gif");
            assert.strictEqual(result.contentType, "image/gif");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
});
describe("ConnectionTest", function () {
    it("should get a Connection", function () { return __awaiter(void 0, void 0, void 0, function () {
        var connection, gridFSPromise, myConnection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongodb_1.MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true })];
                case 1:
                    connection = _a.sent();
                    gridFSPromise = new GridFSPromise_1.GridFSPromise("testdb", null, null, "attachments", ".", false);
                    gridFSPromise.CONNECTION = connection;
                    myConnection = gridFSPromise.connection;
                    return [2 /*return*/, gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        assert.strictEqual(result.filename, "test.zip");
                                        assert.strictEqual(result.contentType, "application/zip");
                                        return [4 /*yield*/, gridFSPromise.closeConnection()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (error) {
                            assert_1.fail(error);
                        })];
            }
        });
    }); });
});
//# sourceMappingURL=GridFsPromiseTest.js.map