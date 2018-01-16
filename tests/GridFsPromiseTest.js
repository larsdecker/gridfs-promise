"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
require("mocha");
var GridFSPromise_1 = require("../src/GridFSPromise");
describe("Hello function", function () {
    it("should return hello world", function () {
        var gridFSPromise = new GridFSPromise_1.GridFSPromise("mongodb://localhost:27017", "gridfs", {}, __dirname, "test");
    });
});
//# sourceMappingURL=GridFsPromiseTest.js.map