# gridfs-promise

This is a simple wrapper for the new MongoDB GridFSBucket-API (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/streaming/).
The old GridStore-API is now deprecated (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/gridstore/).


## How to install

That is simple

`npm install gridfs-stream`

## Usage

```typescript

const mongoOptions: MongoClientOptions = {
  autoReconnect: true,
};

let gridFS = new GridFSPromise(mongoUrl, mongoDatabase, mongoOptions, __dirname, "attachments");
gridFS.getObject("59e085f272882d728e2fa4c2").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});


```
