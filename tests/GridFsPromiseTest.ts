import { expect } from "chai";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";
import {GridFSPromise} from "../src/GridFSPromise";
describe("Hello function", () => {
    it("should return hello world", () => {
        const gridFSPromise = new GridFSPromise("mongodb://localhost:27017", "gridfs", {}, __dirname, "test");


    });
});
