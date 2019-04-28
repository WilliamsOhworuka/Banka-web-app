import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);
let clientToken;
let clientToken2;

describe('testing get all transactions route', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'john@yahoo.com',
        password: 'brock',
      })
      .end((error, res) => {
        clientToken = res.body.data.token;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'johnna@yahoo.com',
        password: 'brock',
      })
      .end((error, res) => {
        clientToken = res.body.data.token;
        done();
      });
  });


  it('should return an error if user is not owner for transactions', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/30772001/transactions')
      .set('authorization', `bearer ${clientToken}`)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('unauthorized user');
        done();
      });
  });

  it('should return an error if transaction does not exist', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/2')
      .set('authorization', `bearer ${clientToken}`)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('No such transaction');
        done();
      });
  });

  it('should return an error if user is not owner of transaction', (done) => {
    chai.request(app)
      .get('/api/v1/transactions/1')
      .set('authorization', `bearer ${clientToken2}`)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });
});
