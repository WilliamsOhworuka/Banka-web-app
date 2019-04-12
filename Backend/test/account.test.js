import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import app from '../src/app';
import Account from '../services/account.service';
import Util from '../services/util.service';
import { accounts } from '../models/storage.model';

chai.use(chaihttp);
chai.use(deepEqualInAnyOrder);

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
        expect(response.body.error).to.equal('Access denied');
        done();
      });
  });

  it('should return an updated account array', () => {
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
    expect('kidih@yahoo.com').to.equal(Util.ownerInfo(req).email);
  });

  it('should return account object with matching account number', () => {
    expect(Account.getAccount(30772002)).to.deep.equalInAnyOrder({
      id: 2,
      accountNumber: 30772002,
      createdOn: new Date('December 17, 1995 03:24:00'),
      owner: 2,
      type: 'current',
      status: 'active',
      balance: 300.00,
    });
  });

  it('should change status of bank account', () => {
    const res = {
      status() {
        return {
          json() {},
        };
      },
    };
    const acct = accounts[0];
    const { accountNumber } = { ...acct };
    const req = {
      params: {
        accountNumber,
      },
    };
    Account.changeAccountStatus(req, res);
    expect(acct.status).to.equal('dormant');
  });
});
