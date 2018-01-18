import { ObjectID } from "bson";
import { Promise } from "es6-promise";
import { GridFSBucketReadStream, MongoClientOptions } from "mongodb";
export interface IGridFSObject {
    _id: ObjectID;
    fileName: string;
    contentType: string;
    meta: object;
    fileSize: number;
}
export declare class GridFSPromise {
    private databaseName;
    private connectionUrl;
    private basePath;
    private mongoClientOptions;
    private bucketName;
    /**
     * Constructor
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} bucketName
     * @param {string} basePath
     */
    constructor(mongoUrl: string, databaseName: string, mongoOptions: MongoClientOptions, bucketName?: string, basePath?: string);
    /**
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    getFileStream(id: string): Promise<GridFSBucketReadStream>;
    /**
     * Save the File from the GridFs to the filesystem and get the Path back
     * @param {string} id
     * @param {string} fileName
     * @param filePath
     * @return {Promise<string>}
     */
    getFile(id: string, fileName: string, filePath?: string): Promise<string>;
    /**
     * Get a single Object
     * @param {string} id
     * @return {Promise<IGridFSObject>}
     */
    getObject(id: string): Promise<IGridFSObject>;
    /**
     * Upload a file directly from a fs Path
     * @param {string} uploadFilePath
     * @param {string} targetFileName
     * @param {string} type
     * @param {object} meta
     * @return {Promise<IGridFSObject>}
     */
    uploadFile(uploadFilePath: string, targetFileName: string, type: string, meta: object): Promise<IGridFSObject>;
    /**
     * Delete an File from the GridFS
     * @param {string} id
     * @return {Promise<boolean>}
     */
    delete(id: string): Promise<boolean>;
    /**
     *
     * @return {PromiseLike<MongoClient> | Promise<MongoClient> | Thenable<MongoClient>}
     */
    private connectDB();
}
