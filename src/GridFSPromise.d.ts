import { ObjectID } from "bson";
import { GridFSBucketReadStream, MongoClient, MongoClientOptions } from "mongodb";
export interface IGridFSObject {
    _id: ObjectID;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    md5: string;
    filename: string;
    contentType: string;
    metadata: object;
}
export declare class GridFSPromise {
    private databaseName;
    private connectionUrl;
    private basePath;
    private mongoClientOptions;
    private _CONNECTION;
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
     * @param {string} filePath
     * @return {Promise<string>}
     */
    getFile(id: string, fileName?: string, filePath?: string): Promise<string>;
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
     * @param {boolean} deleteFile
     * @return {Promise<IGridFSObject>}
     */
    uploadFile(uploadFilePath: string, targetFileName: string, type: string, meta: object, deleteFile?: boolean): Promise<IGridFSObject>;
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
    readonly connection: MongoClient;
}
