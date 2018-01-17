import {Promise} from "es6-promise";
import {GridFSBucketReadStream, MongoClientOptions} from "mongodb";
import {IGridFSObject} from "./GridFSPromise";

declare module "GridFSPromise" {

    export class GridFsPromise {

        constructor(mongoUrl: string,
                    databaseName: string,
                    mongoOptions: MongoClientOptions,
                    basePath?: string,
                    bucketName?: string);

        public getFileStream(id: string): Promise<GridFSBucketReadStream>;
        public getFile(id: string, fileName: string, filePath?: string): Promise<string>;

        public getObject(id: string): Promise<IGridFSObject>;

        public uploadFile(uploadFilePath: string,
                          targetFileName: string,
                          type: string,
                          meta: object): Promise<IGridFSObject>;

    }

}
