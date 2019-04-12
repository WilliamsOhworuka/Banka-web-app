import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';
import Account from '../services/account.service';
import Util from '../services/util.service';

chai.use(chaihttp);

describe('Testing user bank account creation', () => {
  it('should return an error if account type is not set', (done) => {
    chai.request(app)
      .post('/api/v1/accounts/')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Set account type');
        done();
      });
  });

  it('should return an error if user has not signed up', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
      })
      .end((error, response) => {
        expect(response).to.have.status(403);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Sign up to create bank account');
        done();
      });
  });

  it('should return an updated account array', (done) => {
    const req = {
      body: {
        type: 'current',
      },
      headers: {
        authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTU1MDY3MTU0fQ.yUIAcbwlMwmMhbGUD7mXfm29_hcVlMP8LGTIF-GTlHk',
      },
    };

    const res = {
      status() {},
      json() {},
    };

    Account.create(req, res, () => {});
    expect('kid@yahoo.com').to.equal(Util.ownerInfo(req).email);
    done();
  });
});
