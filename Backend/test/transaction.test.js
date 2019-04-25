import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);
let clientToken;

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

  it('should return an error if user is not owner for transactions', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/30772001/transactions')
      .set('authorization', `bearer ${clientToken}`)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('unauthorized');
        done();
      });
  });
});
