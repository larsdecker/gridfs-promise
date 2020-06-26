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
    set CONNECTION(value: MongoClient);
    get connection(): MongoClient | null;
    private databaseName;
    private readonly connectionUrl;
    private readonly mongoClientOptions;
    private basePath;
    private bucketName;
    private closeConnectionAutomatically;
    private _CONNECTION;
    maxTimeMS: number;
    /**
     * Constructor
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} bucketName
     * @param {string} basePath
     * @param {boolean} closeConnectionAutomatically
     */
    constructor(databaseName: string, mongoUrl?: string | null, mongoOptions?: MongoClientOptions | null, bucketName?: string, basePath?: string, closeConnectionAutomatically?: boolean);
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
     * Upload a file directly from a fs Path
     * @param {string} uploadData
     * @param {string} targetFileName
     * @param {string} type
     * @param {object} meta
     * @return {Promise<IGridFSObject>}
     */
    uploadFileString(uploadData: string, targetFileName: string, type: string, meta: object): Promise<IGridFSObject>;
    /**
     * Delete an File from the GridFS
     * @param {string} id
     * @return {Promise<boolean>}
     */
    delete(id: string): Promise<boolean>;
    /**
     * Close the Connection, if the connection is not needed anymore
     */
    closeConnection(): Promise<boolean>;
    /**
     * Connect to the Database and return a promise Object
     */
    private connectDB;
}
