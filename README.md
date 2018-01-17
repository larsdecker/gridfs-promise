# gridfs-promise

This is a simple wrapper for the new MongoDB GridFSBucket-API (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/streaming/).
The old GridStore-API is now deprecated (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/gridstore/).

## How to install

That is simple

`npm install gridfs-stream`

## Usage

```
const mongoOptions: MongoClientOptions = {
  autoReconnect: true,
};

let gridFS = new GridFSPromise("mongodb://localhost:27017/test", "test", mongoOptions, __dirname, "attachments");
gridFS.getObject("59e085f272882d728e2fa4c2").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});

```


## Methods

### getObject

By this method you will simple get the meta-object from the MongoDB as a Promise-Object.
If nothing found at the Database, then it will reject and the catch-block will be executed.

```
gridFS.getObject("59e085f272882d728e2fa4c2").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});
```

### getFile

You will get the file simple written to the filesystem directly from the Database.
If nothing found at the Database, then it will reject and the catch-block will be executed.

```
gridFS.getFile("59e085f272882d728e2fa4c2", "test.gif").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});
```

### getFileStream

You will get a GridFSBucketReadStream as Promise.
If nothing found at the Database, then it will reject and the catch-block will be executed.

This method is very useful, to stream the content directly to the user.

For example with express:
```
return gridFs.getFileStream(req.params.id).then((item) => {
                item
                .once("error", () => {
                    return res.status(400).end();
                }).pipe(res);
        }).catch(() => res.status(500));
```
