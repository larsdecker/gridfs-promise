"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var assert_1 = require("assert");
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
require("mocha");
var GridFSPromise_1 = require("../src/GridFSPromise");
describe("GetFile", function () {
    it("should get FilePath", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname + "/../cache");
        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then(function (result) {
            assert.equal(result, __dirname + "/../cache/203857-76.pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    // it("should get FilePath without path", () => {
    //     const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
    //         "tikki", {},
    //         "attachments");
    //
    //     return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
    //         assert.equal(result, `${__dirname}/../cache/203857-76.pdf`);
    //     }).catch((error) => {
    //         fail(error);
    //     });
    //
    // });
    it("should get FilePath with extra /", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname + "/../cache/");
        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then(function (result) {
            assert.equal(result, __dirname + "/../cache/203857-76.pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should return invalid Path", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname + "/test");
        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then(function (result) {
            assert.fail("Should not be here");
        }).catch(function (error) {
            assert.deepEqual(error, new Error("Path not found"));
        });
    });
});
describe("GetObject", function () {
    it("should get FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname);
        return gridFSPromise.getObject("5a2653f4b908cd7b40e385d3").then(function (result) {
            assert.equal(result.filename, "203857-76.pdf");
            assert.equal(result.contentType, "application/pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
    it("should not get FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname);
        return gridFSPromise.getObject("5a2653f4b908cd7b40e385dY").then(function (result) {
            assert.equal(result.filename, "203857-76.pdf");
            assert.equal(result.contentType, "application/pdf");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
});
describe("UploadObject", function () {
    it("should upload FileObject", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "tikki", {}, "attachments", __dirname);
        return gridFSPromise.uploadFile(__dirname + "/5MB.zip", "test.zip", "application/zip", {}).then(function (result) {
            assert.equal(result.filename, "test.zip");
            assert.equal(result.contentType, "application/zip");
        }).catch(function (error) {
            assert_1.fail(error);
        });
    });
});
//# sourceMappingURL=GridFsPromiseTest.js.map