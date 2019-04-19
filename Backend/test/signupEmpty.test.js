/* eslint-disable import/no-extraneous-dependencies */

import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);

describe('Testing user signup for empty required fields', () => {
  it('should return an error if last name is not set', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Last name is required');
        done();
      });
  });

  it('should return an error if first name is not set', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'kid',
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
        done();
      });
  });

  it('should return an error if email is not set', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'halla',
        lastName: 'kid',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('email is required');
        done();
      });
  });

  it('should return an object with user data and token on successful signup', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'halla',
        lastName: 'kid',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.a('object');
        expect(response.body.data.firstName).to.be.a('string');
        expect(response.body.data.lastName).to.be.a('string');
        expect(response.body.data.id).to.be.a('number');
        expect(response.body.data.email).to.be.a('string');
        done();
      });
  });
});
