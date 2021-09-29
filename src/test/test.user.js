const {expect} = require('chai');

const supertest = require('supertest');
const api = supertest('http://localhost:3000/api');

let APItoken;
let ID;

before((done) => {
  api.post('/users/login') // 登入測試
    .set('Accept', 'application/json')
    .send({
      email: '1234@gmail.com.tw',
      password: '123456'
    })
    .expect(200)
    .end((err, res) => {
      APItoken = res.body.token; // 登入成功取得 JWT
      ID = res.body.id;
      done();
    });
});

describe('User', () => {
  it('User should be get', (done) => {
    api.get('/users/whoami')
      .set('Authorization', `Bearer ${APItoken}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.id).to.equal(ID)
        done();
      });
  });
});

describe('Article', () => {
  it('Article should be get', (done) => {
    api.get('/articles')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body[0]).to.have.property('author_id');
        expect(res.body[0].author_id).to.have.be.a('number');
        expect(res.body[0]).to.have.property('title');
        expect(res.body[0].title).to.have.be.a('string');
        expect(res.body[0]).to.have.property('update_time');
        expect(res.body[0]).to.have.property('content');
        done();
      });
  });
})