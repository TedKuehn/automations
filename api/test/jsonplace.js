const api = 'https://jsonplaceholder.typicode.com';
const relativeUrl = '/todos/1';
const fetch = require('node-fetch');
const assert = require('assert');
const ApiTest = require('./apitest');

describe('API example', () => {
  before(async () => {
    this.apiTest = new ApiTest();
  });

  it('Does a get', async () => {
    const response = await fetch(`${api}${relativeUrl}`);
    const json = await response.json();
    expectedResponse = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };

    this.apiTest.plog('GET: actual vs expected');
    const bool = await this.apiTest.jsonCompare(json, expectedResponse);
    assert(bool, 'exact json match');
  });

  it('Does a post, modifies with put, then delete it', async () => {
    body = {title: 'God of Thunder', body: 'Thor', userId: 1};

    const response = await fetch(`${api}/posts`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-type': 'application/json; charset=UTF-8'},
    });
    const json = await response.json();
    expectedResponse = {
      title: 'God of Thunder',
      body: 'Thor',
      userId: 1,
      id: 101,
    };
    this.apiTest.plog('POST: actual vs expected');
    const bool = await this.apiTest.jsonCompare(json, expectedResponse);
    assert(bool, 'exact json match');

    this.apiTest.plog('extracted id: '+json['id']);
    const newId = json['id'];
    const newBody = json['body'];

    /* note: normally the id or a guid could be re-used.
     at https://jsonplaceholder.typicode.com, post 101
     fails if a put is simulated. */
    bodyPut = {
      title: 'Was that like sparkles?',
      body: newBody,
      userId: 1,
      id: 100,
    };

    const responsePut = await fetch(`${api}/posts/100`, {
      method: 'Put',
      body: JSON.stringify(bodyPut),
      headers: {'Content-type': 'application/json; charset=UTF-8'},
    });
    const jsonPut = await responsePut.json();
    this.apiTest.plog('PUT: actual vs expected');
    const boolPut = await this.apiTest.jsonCompare(jsonPut, bodyPut);
    assert(boolPut, 'exact json match');

    const responseDel = await fetch(`${api}/posts/${newId}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
    });
    const jsonDel = await responseDel.json();
    expectedResponseDel = {};
    this.apiTest.plog('DELETE: actual vs expected');
    const boolDel = await this.apiTest.jsonCompare(
        jsonDel, expectedResponseDel,
    );
    assert(boolDel, 'exact json match');
  });
});
