/* eslint-disable import/no-extraneous-dependencies */

import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);

describe('Testing user signup for empty required fields', () => {
  it('should return an error if last name is not set for sign up', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(403);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Enter last name');
        done();
      });
  });

  it('should return an error if first name is not set for sign up', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'kid',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(403);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Enter first name');
        done();
      });
  });

  it('should return an error if email is not set for sign up', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'halla',
        lastName: 'kid',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(403);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Enter email');
        done();
      });
  });
});
