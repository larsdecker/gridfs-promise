# gridfs-promise
[![Known Vulnerabilities](https://snyk.io/test/github/larsdecker/gridfs-promise/badge.svg?targetFile=package.json)](https://snyk.io/test/github/larsdecker/gridfs-promise?targetFile=package.json)
[![Build Status](https://travis-ci.org/larsdecker/gridfs-promise.svg?branch=master)](https://travis-ci.org/larsdecker/gridfs-promise)

This is a simple wrapper for the new MongoDB GridFSBucket-API (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/streaming/).
The old GridStore-API is now deprecated (http://mongodb.github.io/node-mongodb-native/3.0/tutorials/gridfs/gridstore/).

## How to install

That is simple

`npm install gridfs-promise`

## Usage

```js
const mongoOptions: MongoClientOptions = {
  autoReconnect: true,
  useNewUrlParser: true
};

let gridFS = new GridFSPromise("test", "mongodb://localhost:27017/test", mongoOptions, __dirname, "attachments");
gridFS.getObject("59e085f272882d728e2fa4c2").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});

```


## Methods

### uploadFileString

By this method you can simple upload files by a base64 string 

```js
gridFS.getObject("5b43ce3a58ebb3086dbf9334").then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error);
});
```


### getObject

By this method you will simple get the meta-object from the MongoDB as a Promise-Object.
If nothing found at the Database, then it will reject and the catch-block will be executed.

```js
gridFS.getObject("59e085f272882d728e2fa4c2").then((item) => {
    console.log(item);
}).catch((err) => {
    console.error(err);
});
```

### getFile

You will get the file simple written to the filesystem directly from the Database.
If nothing found at the Database, then it will reject and the catch-block will be executed.

```js
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
```js
return gridFs.getFileStream(req.params.id).then((item) => {
                item
                .once("error", () => {
                    return res.status(400).end();
                }).pipe(res);
        }).catch(() => res.status(500));
```


## Mongoose & Other MongoClient Connections

You can use you already existing MongoDB connection with the library. 

```typescript

const mongoDBConnection = await MongoClient.connect('mongodb://localhost:27017');

const test = new GridFSPromise('test');
test.CONNECTION = mongoDBConnection;


```


## Use GridFS Promise together with NestJS

It is really simple to use GridFS Promise together with NestJs.

Install the dependency via `npm install gridfs-promise --save`.

In the Module where you want to use GridFS create a simple Provider to Load the Lib

```typescript
// sample.module.ts
providers: [{
    provide: GridFSPromise,
    useFactory: async (configService: ConfigService) => {
      return new GridFSPromise(configService.getString('DB_NAME'), configService.getString('DB_URL'));
    },
    inject: [ConfigService],
  }]
```
