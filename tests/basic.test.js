const test = require('node:test');
const assert = require('assert');
const path = require('path');
const { GridFSPromise } = require('../src/GridFSPromise.js');

test('connection getter and setter work', () => {
  const grid = new GridFSPromise('db');
  assert.strictEqual(grid.connection, null);
  const fake = {};
  grid.CONNECTION = fake;
  assert.strictEqual(grid.connection, fake);
});

test('closeConnection resolves when no connection is set', async () => {
  const grid = new GridFSPromise('db');
  const result = await grid.closeConnection();
  assert.strictEqual(result, true);
});

test('closeConnection calls close on provided connection', async () => {
  let closed = false;
  const fakeClient = {
    close() {
      closed = true;
      return Promise.resolve();
    },
  };
  const grid = new GridFSPromise('db');
  grid.CONNECTION = fakeClient;
  const result = await grid.closeConnection();
  assert.strictEqual(result, true);
  assert.ok(closed);
});

test('getFileStream rejects when no connection string is provided', async () => {
  const grid = new GridFSPromise('db');
  await assert.rejects(() => grid.getFileStream('000000000000000000000000'), /No Connection String given/);
});
