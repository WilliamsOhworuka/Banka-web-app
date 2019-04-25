/* eslint-disable import/no-extraneous-dependencies */

import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);

describe('Testing user signup', () => {
  it('should return an error if password and confirm password are not equal', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'kuyt',
        email: 'test@test.com',
        password: 'passwordfh',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('password does not match');
        done();
      });
  });

  it('should return an error if email exists for sign up', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'masters',
        email: 'john@yahoo.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Email already exists');
        done();
      });
  });

  it('should return an error if email is not valid for sign up', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'masters',
        email: 'hfhfhfhfh',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('email is not valid');
        done();
      });
  });

  it('should return an error if password is shorter than 6 letters', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'masters',
        email: 'will@gh.com',
        password: 'pass',
        confirmPassword: 'pass',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('password should be at least 6 letters long');
        done();
      });
  });

  it('should return object with user details on successful signup', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kiddy',
        lastName: 'masters',
        email: 'will@gh.com',
        password: 'pacific',
        confirmPassword: 'pacific',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body.data).to.be.a('object');
        expect(response.body).to.have.property('status');
        expect(response.body.data).to.have.property('token');
        expect(response.body.data).to.have.property('id');
        expect(response.body.data.firstName).to.be.a('string');
        expect(response.body.data.lastName).to.be.a('string');
        expect(response.body.data.email).to.be.a('string');
        done();
      });
  });
});
