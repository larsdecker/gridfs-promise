import * as assert from "assert";
import {fail} from "assert";
import "mocha";
import {MongoClient} from "mongodb";
import {GridFSPromise} from "../src/GridFSPromise";

describe("GetFile", () => {

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

    it("should get FilePath without path", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb",
            "mongodb://localhost:27017",
            {useNewUrlParser: true, useUnifiedTopology: true},
            "attachments", __dirname);

        return gridFSPromise.getFile("5a2653f4b908cd7b40e385d3").then((result) => {
            assert.equal(result, `${__dirname}/../cache/203857-76.pdf`);
        }).catch((error) => {
            fail(error);
        });

    });

    it("should get FilePath with extra /", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb",
            "mongodb://localhost:27017",
            {useNewUrlParser: true, useUnifiedTopology: true},
            "attachments",
            `${__dirname}/../cache/`);

        return gridFSPromise.getFile("5b43ce3a58ebb3086dbf9334").then((result) => {
            assert.strictEqual(result, `${__dirname}/../cache/203857-76.pdf`);
        }).catch((error) => {
            fail(error);
        });

    });

    it("should return invalid Path", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb",
            "mongodb://localhost:27017",
            {useNewUrlParser: true, useUnifiedTopology: true},
            "attachments",
            __dirname + "/test");

        return gridFSPromise.getFile("5b43ce3a58ebb3086dbf9334").then((result) => {
            assert.fail("Should not be here");
        }).catch((error) => {
            assert.strictEqual(error, new Error("Path not found"));
        });

    });

});

describe("GetObject", () => {

    it("should get FileObject", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb", "mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true},
            "attachments", __dirname);

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then((result) => {
            assert.strictEqual(result.filename, "203857-76.pdf");
            assert.strictEqual(result.contentType, "application/pdf");
        }).catch((error) => {
            fail(error);
        });

    });

    it("should not get FileObject", () => {
        const gridFSPromise = new GridFSPromise(
            "tikki",
            "mongodb://localhost:27017",
            {useNewUrlParser: true},
            "attachments", __dirname);

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then((result) => {
            assert.strictEqual(result.filename, "203857-76.pdf");
            assert.strictEqual(result.contentType, "application/pdf");
        }).catch((error) => {
            fail(error);
        });

    });

});

describe("UploadObject", () => {

    it("should upload FileObject", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb",
            "mongodb://localhost:27017",
            {useNewUrlParser: true, useUnifiedTopology: true},
            "attachments", __dirname);

        return gridFSPromise.uploadFile(`${__dirname}/5MB.zip`, "test.zip", "application/zip", {}).then((result) => {
            assert.strictEqual(result.filename, "test.zip");
            assert.strictEqual(result.contentType, "application/zip");
        }).catch((error) => {
            fail(error);
        });

    });

});

describe("ConnectionTest", () => {

    it("should get a Connection", async () => {

        const connection = await MongoClient.connect(
            "mongodb://localhost:27017",
            {useNewUrlParser: true, useUnifiedTopology: true},
        );

        const gridFSPromise = new GridFSPromise(
            "testdb",
            null,
            null,
            "attachments", ".", false);
        gridFSPromise.CONNECTION = connection;

        const myConnection = gridFSPromise.connection;

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then(async (result) => {
            assert.strictEqual(result.filename, "test.zip");
            assert.strictEqual(result.contentType, "application/zip");

            await gridFSPromise.closeConnection();

        }).catch((error) => {
            fail(error);
        });

    });

});
