import * as assert from "assert";
import {fail} from "assert";
import { expect } from "chai";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";
import {GridFSPromise} from "../src/GridFSPromise";
describe("GetFile", () => {

    it("should get FilePath", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
                            "tikki", {},
                            "attachments", `${__dirname}/../cache`);

        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
            assert.equal(result , `${__dirname}/../cache/203857-76.pdf`);
        }).catch((error) => {
           fail(error);
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

    it("should get FilePath with extra /", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
            "tikki",
            {},
            "attachments",
            `${__dirname}/../cache/`);

        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
            assert.equal(result , `${__dirname}/../cache/203857-76.pdf`);
        }).catch((error) => {
            fail(error);
        });

    });

    it("should return invalid Path", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
            "tikki", {},
            "attachments",
            __dirname + "/test");

        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
            assert.fail("Should not be here");
        }).catch((error) => {
            assert.deepEqual(error, new Error("Path not found"));
        });

    });

});

describe("GetObject", () => {

    it("should get FileObject", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
            "tikki", {},
            "attachments", __dirname);

        return gridFSPromise.getObject("5a2653f4b908cd7b40e385d3").then((result) => {
            assert.equal(result.filename , "203857-76.pdf");
            assert.equal(result.contentType , "application/pdf");
        }).catch((error) => {
            fail(error);
        });

    });

    it("should not get FileObject", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
            "tikki", {},
            "attachments", __dirname);

        return gridFSPromise.getObject("5a2653f4b908cd7b40e385dY").then((result) => {
            assert.equal(result.filename , "203857-76.pdf");
            assert.equal(result.contentType , "application/pdf");
        }).catch((error) => {
            fail(error);
        });

    });

});

describe("UploadObject", () => {

    it("should upload FileObject", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017",
            "tikki", {},
            "attachments", __dirname);

        return gridFSPromise.uploadFile(`${__dirname}/5MB.zip`, "test.zip", "application/zip", {}).then((result) => {
            assert.equal(result.filename , "test.zip");
            assert.equal(result.contentType , "application/zip");
        }).catch((error) => {
            fail(error);
        });

    });

});
