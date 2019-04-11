import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';


chai.use(chaihttp);

describe('Testing user signin', () => {
  it('should return an error if email is not set', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        password: 'password',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Enter your email');
        done();
      });
  });

  it('should return an error if password is not set', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'mikey@ya.com',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Enter your password');
        done();
      });
  });

  it('should return an error if email or password does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'kid@yahkcko.com',
        password: 'kiddy',
      })
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Invalid email or password');
        done();
      });
  });
});
