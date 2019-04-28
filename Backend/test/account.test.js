import chai, { expect } from 'chai';
import chaihttp from 'chai-http';
import app from '../src/app';

chai.use(chaihttp);

let clientToken;
let staffToken;
const wrongToken = 'djjffjo20459596.e44njnjsnjfs.oewei04i0';

describe('Testing user bank account creation', () => {
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

  it('should return an error if account type is not set for creation', (done) => {
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

  it('should return an error if user has not signed up for creation', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'savings',
      })
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return object with account and owner details on sucessful creation', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .set('authorization', `bearer ${clientToken}`)
      .send({
        type: 'savings',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.a('object');
        expect(response.body.data.accountNumber).to.be.a('number');
        expect(response.body.data.firstName).to.be.a('string');
        expect(response.body.data.lastName).to.be.a('string');
        expect(response.body.data.email).to.be.a('string');
        expect(response.body.data.type).to.be.a('string');
        expect(response.body.data.openingBalance).to.be.a('number');
        done();
      });
  });
});

describe('Testing bank account status change operation', () => {
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

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'dan@yahoo.com',
        password: 'brock',
      })
      .end((error, res) => {
        staffToken = res.body.data.token;
      });
  });

  it('should return error if user is not signed in for status change', (done) => {
    chai.request(app)
      .patch('/api/v1/account/30772001')
      .send({
        status: 'dormant',
      })
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return error if token is wrong or temperred with for status change', (done) => {
    chai.request(app)
      .patch('/api/v1/account/30772001')
      .set('authorization', `bearer ${wrongToken}`)
      .send({
        status: 'dormant',
      })
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return error message if user is not a staff for status change', (done) => {
    chai.request(app)
    // sending token of a client
      .patch('/api/v1/account/30772001')
      .set('authorization', `bearer ${clientToken}`)
      .send({
        status: 'dormant',
      })
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return an error if account does not exist for status change', (done) => {
    chai.request(app)
    // sending accoount that does not exist
      .patch('/api/v1/account/307720046')
      .set('authorization', `bearer ${staffToken}`)
      .send({
        status: 'dormant',
      })
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Account does not exist');
        done();
      });
  });

  it('should return success response object on sucessful status change', (done) => {
    chai.request(app)
      .patch('/api/v1/account/30772001')
      .set('authorization', `bearer ${staffToken}`)
      .send({
        status: 'dormant',
      })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.a('object');
        expect(response.body.data.accountNumber).to.be.a('number');
        expect(response.body.data.status).to.be.a('string');
        expect(response.body.data.status).to.equal('dormant');
        done();
      });
  });
});

describe('Testing bank account delete operation', () => {
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

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'dan@yahoo.com',
        password: 'brock',
      })
      .end((error, res) => {
        staffToken = res.body.data.token;
      });
  });

  it('should return a error message user is not signed in for delete op', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/30772002')
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return error when token is not valid or has been tempered with for delete op', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/30772002')
      // sending invalid token
      .set('authorization', `bearer ${wrongToken}`)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return error if user is not a staff for delete op', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/30772002')
      // sending client token
      .set('authorization', `bearer ${clientToken}`)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body.error).to.equal('Unauthorized user');
        done();
      });
  });

  it('should return a success message if user is a staff delete op', (done) => {
    chai.request(app)
      .delete('/api/v1/accounts/30772002')
      // sending token of a staff(authorized user)
      .set('authorization', `bearer ${staffToken}`)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body.message).to.equal('Account successfully deleted');
        done();
      });
  });
});

describe('test get all accounts for a specific user route', () => {
  it('should return error for invalid email', (done) => {
    chai.request(app)
      .get('/api/v1/user/dan@yahuoo.com/accounts')
      // sending token of a staff(authorized user)
      .set('authorization', `bearer ${staffToken}`)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.error).to.be.a('string');
        expect(response.body).to.have.property('status');
        expect(response.body.error).to.equal('User does not exist');
        done();
      });
  });
});
