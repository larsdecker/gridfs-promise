import {ObjectID} from "bson";
import {Promise} from "es6-promise";
import * as fs from "fs";
import {GridFSBucket, GridFSBucketReadStream, MongoClient, MongoClientOptions} from "mongodb";

export interface IGridFSObject {
    _id: ObjectID;
    fileName: string;
    contentType: string;
    meta: object;
    fileSize: number;
}

export class GridFSPromise {

    private databaseName: string;
    private connectionUrl: string;
    private basePath: string;
    private mongoClientOptions: MongoClientOptions;

    private bucketName: string;

    /**
     *
     * @param {string} mongoUrl
     * @param {string} databaseName
     * @param {MongoClientOptions} mongoOptions
     * @param {string} basePath
     * @param {string} bucketName
     */
    constructor(mongoUrl: string,
                databaseName: string,
                mongoOptions: MongoClientOptions,
                basePath?: string,
                bucketName?: string) {

        this.databaseName = databaseName;
        this.connectionUrl = mongoUrl;
        this.mongoClientOptions = mongoOptions;

        this.basePath = basePath || __dirname;

        this.bucketName =  bucketName || "fs";

    }

    /**
     * Save the File from the GridFs to the filesystem and get the Path back
     * @param {string} id
     * @param {string} fileName
     * @param filePath
     * @return {Promise<string>}
     */
    public getFile(id: string, fileName: string, filePath: string = "/tmpArchive/archive/"): Promise<string> {

        return new Promise((resolve, reject) => {

            const gridSave = MongoClient.connect(this.connectionUrl);
            gridSave.then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.openDownloadStream(new ObjectID(id))
                    .once("error", (error) => {
                        reject(error);
                    }).once("finish", () => {
                        resolve(this.basePath.concat(`${filePath}${fileName}`));
                    })
                    .pipe(fs.createWriteStream(this.basePath.concat(`${filePath}${fileName}`)));

            }).catch((err) => {
                reject(err);
            });

        });

    }

    /**
     * Returns a stream of a file from the GridFS.
     * @param {string} id
     * @return {Promise<GridFSBucketReadStream>}
     */
    public getFileStream(id: string): Promise<GridFSBucketReadStream> {

        return new Promise<GridFSBucketReadStream>((resolve, reject) => {
            const gridSave = MongoClient.connect(this.connectionUrl, this.mongoClientOptions);
            return gridSave.then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.find({_id: new ObjectID(id)}).toArray().then((result) => {
                    if (result.length > 0) {
                        resolve(bucket.openDownloadStream(new ObjectID(id)));
                    } else {
                        reject();
                    }
                });
            });
        });
    }

    /**
     * Get a single Object
     * @param {string} id
     * @return {Promise<IGridFSObject>}
     */
    public getObject(id: string) {

        return new Promise(((resolve, reject) => {
            const gridSave = MongoClient.connect(this.connectionUrl, this.mongoClientOptions);
            gridSave.then((client) => {
                const connection = client.db(this.databaseName);
                const bucket = new GridFSBucket(connection, {bucketName: this.bucketName});

                bucket.find({_id: new ObjectID(id)}).toArray().then((result) => {
                    if (result.length > 0) {
                        resolve(result);
                    } else {
                        reject();
                    }
                });

            });
        }));

    }

}
