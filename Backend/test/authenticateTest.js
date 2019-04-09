/* eslint-disable import/no-extraneous-dependencies */

import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);

describe('Testing user signup', () => {
  it('should return an error when the first name is not given', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'maro',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('First name is required');
      });
    done();
  });
});
