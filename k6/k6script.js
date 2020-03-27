import http from 'k6/http';
import { check, sleep } from 'k6';
const api = 'https://jsonplaceholder.typicode.com';
const maxDuration = 1000;

function k6log (testDesc, res) {
  console.log(`${testDesc} duration: ${res.timings.duration}`);
  sleep(3);
}

export default function() {
  let res = http.get(`${api}/todos/1`);
  check(res, {
    'get status was 200': r => r.status == 200,
    'get transaction time OK': r => r.timings.duration < maxDuration,
    'get correct body': r => r.body.includes('delectus aut autem'),
  });
  k6log('GET', res);


  var payload = JSON.stringify({
    title: 'Iron Man', 
    body: 'Stark 12s+', 
    userId: 1,
  });

  var params = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
  };

  let resPost = http.post(`${api}/posts`, payload, params);
  check(resPost, {
    'post status was 200': r => r.status == 201,
    'post correct body': r => r.body.includes('Stark'),
  });
  k6log('POST', resPost);
  
  var payloadPut = JSON.stringify({
    title: resPost.body.substring(14,22), 
    body: 'arc reactor.', 
    userId: 1
  });

  let resPut = http.put(`${api}/posts/100`, payloadPut, params);
  check(resPut, {
    'put status was 200': r => r.status == 200,
    'put transaction time OK': r => r.timings.duration < maxDuration,
    'title from post': r => r.body.includes('Iron Man'),
    'updated info': r => r.body.includes('reactor'),
  });
  k6log('PUT', resPut);

  let resDel = http.del(`${api}/posts/101`, params);
  check(resDel, {
    'del status was 200': r => r.status == 200,
    'del transaction time OK': r => r.timings.duration < maxDuration,
    'empty brackets': r => r.body.includes('{}'),
  });
  k6log('DELETE', resDel);
  console.log('iteration complete')
}