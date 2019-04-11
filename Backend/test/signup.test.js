/* eslint-disable import/no-extraneous-dependencies */

import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';
import User from '../controllers/signup.controller';
import users from '../models/storage.model';

chai.use(chaihttp);

describe('Testing user signup', () => {
  it('should return an error if fullname exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'kudi',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Name already exists');
        done();
      });
  });

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

  it('should return an error if email exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'kid',
        lastName: 'masters',
        email: 'mike@yahoo.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('email already exists');
        done();
      });
  });

  it('should return an error if email is not valid', (done) => {
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

  it('should return an updated user array', (done) => {
    const req = {
      body: {
        firstName: 'kid',
        lastName: 'masters',
        email: 'will@gh.com',
        password: 'pass',
        confirmPassword: 'pass',
        type: 'client',
      },
    };

    User.create(req, null, () => {});
    expect(req.body.email).to.equal(users.find(item => item.id === 4).email);
    done();
  });
});
