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
            { },
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
            { },
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
            {},
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
            "testdb", "mongodb://localhost:27017", {},
            "attachments", __dirname);

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then((result) => {
            if (result) {
                assert.strictEqual(result.filename, "203857-76.pdf");
                assert.strictEqual(result.contentType, "application/pdf");
            }

        }).catch((error) => {
            fail(error);
        });

    });

    it("should not get FileObject", () => {
        const gridFSPromise = new GridFSPromise(
            "tikki",
            "mongodb://localhost:27017",
            {},
            "attachments", __dirname);

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then((result) => {
            if (result) {
                assert.strictEqual(result.filename, "203857-76.pdf");
                assert.strictEqual(result.contentType, "application/pdf");
            }
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
            {},
            "attachments", __dirname);

        return gridFSPromise.uploadFile(`${__dirname}/5MB.zip`, "test.zip", "application/zip", {}).then((result) => {
            assert.strictEqual(result.filename, "test.zip");
            assert.strictEqual(result.contentType, "application/zip");
        }).catch((error) => {
            fail(error);
        });

    });

    it("should upload Base64 Image", () => {
        const gridFSPromise = new GridFSPromise(
            "testdb",
            "mongodb://localhost:27017",
            {},
            "attachments", __dirname);

        return gridFSPromise.uploadFileString('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', "test.gif", "image/gif", {}).then((result) => {
            assert.strictEqual(result.filename, "test.gif");
            assert.strictEqual(result.contentType, "image/gif");
        }).catch((error) => {
            fail(error);
        });

    });

});

describe("ConnectionTest", () => {

    it("should get a Connection", async () => {

        const connection = await MongoClient.connect(
            "mongodb://localhost:27017",
            {},
        );

        const gridFSPromise = new GridFSPromise(
            "testdb",
            null,
            null,
            "attachments", ".", false);
        gridFSPromise.CONNECTION = connection;

        const myConnection = gridFSPromise.connection;

        return gridFSPromise.getObject("5b43ce3a58ebb3086dbf9334").then(async (result) => {

            if (result) {
                assert.strictEqual(result.filename, "test.zip");
                assert.strictEqual(result.contentType, "application/zip");
            }

            await gridFSPromise.closeConnection();

        }).catch((error) => {
            fail(error);
        });

    });

});
