class MongoClient {
  static connect() {
    return Promise.reject(new Error('MongoClient stub'));
  }
  db() {
    return {};
  }
}
class GridFSBucket {}
class GridFSBucketReadStream {}
module.exports = { MongoClient, GridFSBucket, GridFSBucketReadStream };
