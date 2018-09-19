import {ObjectID} from "bson";
import * as fs from "fs";
import {GridFSBucket, GridFSBucketReadStream, MongoClient, MongoClientOptions} from "mongodb";

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

export class GridFSPromise {

    private databaseName: string;

    private readonly connectionUrl: string|undefined;
    private readonly mongoClientOptions: MongoClientOptions|undefined;

    private basePath: string;
    private bucketName: string;

    private _CONNECTION: MongoClient | null = null;

    /**
     * Constructor
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} bucketName
     * @param {string} basePath
     */
    constructor(databaseName: string,
                mongoUrl?: string|null,
                mongoOptions?: MongoClientOptions|null,
                bucketName?: string,
                basePath?: string) {
        this.databaseName = databaseName;

        if (mongoUrl) {
            this.connectionUrl = mongoUrl;
        }

        if (mongoOptions) {
            this.mongoClientOptions = mongoOptions;
        }

        this.bucketName = bucketName || "fs";

        this.basePath = basePath || `${__dirname}/../cache`;

    }

    set CONNECTION(value: MongoClient) {
        this._CONNECTION = value;
    }

    get connection(): MongoClient | null {
        return this._CONNECTION;
    }

    /**
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    public getFileStream(id: string): Promise<GridFSBucketReadStream> {

        return new Promise<GridFSBucketReadStream>((resolve, reject) => {
            this.connectDB().then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.find({_id: new ObjectID(id)}).toArray().then(async (result) => {

                    // await client.close();

                    if (result.length > 0) {
                        resolve(bucket.openDownloadStream(new ObjectID(id)));
                    } else {
                        reject();
                    }
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Save the File from the GridFs to the filesystem and get the Path back
     * @param {string} id
     * @param {string} fileName
     * @param {string} filePath
     * @return {Promise<string>}
     */
    public getFile(id: string, fileName?: string, filePath?: string): Promise<string> {

        return new Promise((resolve, reject) => {

            this.connectDB().then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                return bucket.find({_id: new ObjectID(id)}).toArray().then( async (result) => {

                    if (!result || result.length === 0) {
                        throw new Error("Object not found");
                    }

                    if (!fileName) {
                        fileName = result[0].filename;
                    }

                    if (!filePath) {
                        filePath = "";
                    }

                    if (this.basePath.charAt(this.basePath.length - 1) !== "/") {
                        filePath += "/";
                    }

                    if (!fs.existsSync(`${this.basePath}${filePath}`)) {
                        throw new Error("Path not found");
                    }

                    bucket.openDownloadStream(new ObjectID(id))
                        .once("error", async (error) => {
                            // await client.close();
                            reject(error);
                        }).once("end", async () =>  {
                            // await client.close();
                            resolve(`${this.basePath}${filePath}${fileName}`);
                        })
                        .pipe(fs.createWriteStream(`${this.basePath}${filePath}${fileName}`));
                });

            }).catch((err) => {
                reject(err);
            });

        });

    }

    /**
     * Get a single Object
     * @param {string} id
     * @return {Promise<IGridFSObject>}
     */
    public getObject(id: string): Promise<IGridFSObject> {

        return new Promise(((resolve, reject) => {
            this.connectDB().then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.find({_id: new ObjectID(id)}).toArray().then(async (result: IGridFSObject[]) => {
                    // await client.close();

                    if (result.length > 0) {
                        resolve(result[0]);
                    } else {
                        reject(new Error("No Object found"));
                    }
                });

            }).catch((err) => {
                reject(err);
            });
        }));

    }

    /**
     * Upload a file directly from a fs Path
     * @param {string} uploadFilePath
     * @param {string} targetFileName
     * @param {string} type
     * @param {object} meta
     * @param {boolean} deleteFile
     * @return {Promise<IGridFSObject>}
     */
    public uploadFile(uploadFilePath: string,
                      targetFileName: string,
                      type: string,
                      meta: object,
                      deleteFile: boolean = true): Promise<IGridFSObject> {

        return new Promise((resolve, reject) => {

            if (!fs.existsSync(uploadFilePath)) {
                reject(new Error("File not found"));
            }

            this.connectDB().then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                fs.createReadStream(uploadFilePath)
                    .pipe(bucket.openUploadStream(targetFileName, {
                        contentType: type,
                        metadata: meta,
                    }))
                    .on("error", async (err) => {

                        // await client.close();

                        if (fs.existsSync(uploadFilePath) && deleteFile === true) {
                            fs.unlinkSync(uploadFilePath);
                        }

                        reject(err);

                    }).on("finish",  async (item: IGridFSObject) => {

                        // await client.close();

                        if (fs.existsSync(uploadFilePath) && deleteFile === true) {
                            fs.unlinkSync(uploadFilePath);
                        }

                        resolve(item);
                });

            }).catch( (err) => {
                reject(err);
            });

        });
    }

    /**
     * Delete an File from the GridFS
     * @param {string} id
     * @return {Promise<boolean>}
     */
    public delete(id: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.connectDB().then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.delete(new ObjectID(id), ( async  (err) => {
                    // await client.close();
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                }));

            }).catch((err) => {
                reject(err);
            });
        });

    }

    /**
     * Connect to the Database and return a promise Object
     */
    private async connectDB(): Promise<MongoClient> {

        if (this._CONNECTION) {
            return this._CONNECTION;
        }

        if (!this.connectionUrl) {
            throw new Error("No Connection String given. Can´t connect to MongoDB.");
        }

        return this._CONNECTION = await MongoClient.connect(this.connectionUrl, this.mongoClientOptions);
    }

}
